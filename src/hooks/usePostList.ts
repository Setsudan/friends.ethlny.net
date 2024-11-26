// hooks/usePostList.ts
import { useState, useEffect, useCallback } from 'react';
import { pb } from '@/lib/pocketbase';
import { PostRecord, UserRecord } from '@/types/posts';

const POSTS_PER_PAGE = 25;

export const usePostList = () => {
    const [posts, setPosts] = useState<PostRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const getUserByID = useCallback(async (id: string): Promise<UserRecord | null> => {
        try {
            return await pb.collection('users').getOne<UserRecord>(id);
        } catch (error) {
            console.error(`Error fetching user ${id}:`, error);
            return null;
        }
    }, []);

    const getPosts = useCallback(async (page: number = 1) => {
        try {
            const records = await pb.collection('posts').getList<PostRecord>(page, POSTS_PER_PAGE, {
                sort: '-created',
            });

            const postsWithAuthors = await Promise.all(
                records.items.map(async (post) => {
                    const author = await getUserByID(post.author);
                    return author ? {
                        ...post,
                        expand: {
                            author: {
                                email: author.email,
                                name: author.name
                            }
                        }
                    } : post;
                })
            );

            return {
                items: postsWithAuthors,
                totalPages: Math.ceil(records.totalItems / POSTS_PER_PAGE),
                hasMore: records.page < records.totalPages
            };
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Failed to fetch posts');
            return {
                items: [],
                totalPages: 0,
                hasMore: false
            };
        }
    }, [getUserByID]);

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
        let isMounted = true;

        const fetchInitialPosts = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getPosts(1);

                if (isMounted) {
                    setPosts(result.items.sort(() => Math.random() - 0.5));
                    setHasMore(result.hasMore);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch posts');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchInitialPosts();

        const unsubscribe = pb.collection('posts').subscribe<PostRecord>('*', async (e) => {
            if (!isMounted) return;

            if (e.action === 'create' || e.action === 'update') {
                try {
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

                    setPosts(prevPosts => {
                        if (e.action === 'create') return [completeRecord, ...prevPosts];
                        return prevPosts.map(post =>
                            post.id === completeRecord.id ? completeRecord : post
                        );
                    });
                } catch (error) {
                    console.error('Error processing realtime update:', error);
                }
            } else if (e.action === 'delete') {
                setPosts(prevPosts => prevPosts.filter(post => post.id !== e.record.id));
            }
        });

        return () => {
            isMounted = false;
            unsubscribe.then(unsub => unsub());
        };
    }, [getPosts, getUserByID]);

    return {
        posts,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMorePosts
    };
};