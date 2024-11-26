'use client';

import { Button } from '@/components/ui/button';
import Post from './Post';
import { usePostList } from '@/hooks/usePostList';

export default function PostList() {
    const { posts, loading, loadingMore, error, hasMore, loadMorePosts } = usePostList();

    if (error) {
        return (
            <div className="w-full text-center p-4">
                <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="space-y-4 flex flex-wrap w-full sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse bg-gray-200 h-72 w-full rounded-lg"></div>
                ))}
            </div>
        );
    }

    if (!posts.length) {
        return (
            <div className="w-full text-center p-4">
                <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    Aucun post pour le moment.
                </div>
            </div>
        );
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