"use client";
import { useEffect, useState } from 'react';
import { pb } from '@/lib/pocketbase';
import Post from './Post';
import { RecordModel } from 'pocketbase';
import { Button } from './ui/button';

// Define the shape of our User record
interface UserRecord extends RecordModel {
    email: string;
    name?: string;
}

// Define the shape of our Post record
interface PostRecord extends RecordModel {
    content?: string;
    media?: string;
    created: string;
    author: string;
    expand?: {
        author?: {
            email: string;
            name?: string;
        };
    };
}

const POSTS_PER_PAGE = 25;

const getUserByID = async (id: string): Promise<UserRecord | null> => {
    try {
        const user = await pb.collection('users').getOne<UserRecord>(id);
        return user;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        return null;
    }
};

async function getPosts(page: number = 1) {
    try {
        // Get posts for the current page
        const records = await pb.collection('posts').getList<PostRecord>(page, POSTS_PER_PAGE, {
            sort: '-created',
        });

        // Then, fetch user data for each post
        const postsWithAuthors = await Promise.all(
            records.items.map(async (post) => {
                const author = await getUserByID(post.author);
                if (author) {
                    return {
                        ...post,
                        expand: {
                            author: {
                                email: author.email,
                                name: author.name
                            }
                        }
                    };
                }
                return post;
            })
        );

        return {
            items: postsWithAuthors,
            totalPages: Math.ceil(records.totalItems / POSTS_PER_PAGE),
            hasMore: records.page < records.totalPages
        };
    } catch (error) {
        console.error('Error fetching posts:', error);
        return {
            items: [],
            totalPages: 0,
            hasMore: false
        };
    }
}

export default function PostList() {
    const [posts, setPosts] = useState<PostRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadMorePosts = async () => {
        if (loadingMore) return;

        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const result = await getPosts(nextPage);

            setPosts(prevPosts => [...prevPosts, ...result.items]);
            setCurrentPage(nextPage);
            setHasMore(result.hasMore);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load more posts');
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        async function fetchInitialPosts() {
            try {
                setLoading(true);
                const result = await getPosts(1);
                // Randomize the order of the fetched posts
                const randomizedPosts = result.items.sort(() => Math.random() - 0.5);
                setPosts(randomizedPosts);
                setHasMore(result.hasMore);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch posts');
            } finally {
                setLoading(false);
            }
        }

        fetchInitialPosts();

        // Subscribe to realtime updates
        const unsubscribe = pb.collection('posts').subscribe<PostRecord>('*', async function (e) {
            console.log('Realtime event:', e.action);
            console.log('Record:', e.record);

            // If this is a create or update action, fetch the complete record with author
            if (e.action === 'create' || e.action === 'update') {
                try {
                    // Fetch the author data
                    const author = await getUserByID(e.record.author);
                    const completeRecord = {
                        ...e.record,
                        expand: {
                            author: author ? {
                                email: author.email,
                                name: author.name
                            } : undefined
                        }
                    };

                    // Update the posts state with the complete record
                    setPosts((prevPosts) => {
                        if (e.action === 'create') {
                            return [completeRecord, ...prevPosts];
                        } else {
                            return prevPosts.map((post) =>
                                post.id === completeRecord.id ? completeRecord : post
                            );
                        }
                    });
                } catch (error) {
                    console.error('Error processing realtime update:', error);
                }
            } else if (e.action === 'delete') {
                setPosts((prevPosts) =>
                    prevPosts.filter((post) => post.id !== e.record.id)
                );
            }
        });

        // Cleanup subscription on component unmount
        return () => {
            unsubscribe.then((unsub) => unsub());
        };
    }, []);

    if (loading) {
        return <div className="w-full text-center p-4">Loading posts...</div>;
    }

    if (error) {
        return <div className="w-full text-center p-4 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4 flex flex-wrap w-full sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
            </div>

            {hasMore && (
                <div className="w-full text-center py-4">
                    <Button
                        onClick={loadMorePosts}
                        disabled={loadingMore}
                        className="px-4 py-2 bg-black text-white border-2 border-black rounded-none hover:bg-white hover:text-black disabled:bg-gray-300 transition-colors"
                    >
                        {loadingMore ? 'Loading...' : 'Load More Posts'}
                    </Button>
                </div>
            )}
        </div>
    );
}