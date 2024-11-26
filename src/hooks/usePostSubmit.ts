// hooks/usePostSubmit.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { pb } from '@/lib/pocketbase';
import { ClientResponseError } from 'pocketbase';
import { MediaFile } from '@/types/post-form';

export const usePostSubmit = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const router = useRouter();

    const submitPost = async (content: string, mediaFiles: MediaFile[], userId: string) => {
        if (!content && mediaFiles.length === 0) return;
        if (!userId) return;

        setLoading(true);
        setError(null);
        setUploadProgress(null);

        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('author', userId);

            for (let i = 0; i < mediaFiles.length; i++) {
                const file = mediaFiles[i].file;
                const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const newFile = new File([file], cleanFileName, { type: file.type });
                formData.append('media', newFile);
                setUploadProgress(`Uploading file ${i + 1} of ${mediaFiles.length}...`);
            }

            setUploadProgress('Creating post...');
            await pb.collection('posts').create(formData);
            setUploadProgress(null);
            router.refresh();
            return true;
        } catch (err) {
            console.error('Full error:', err);

            if (err instanceof ClientResponseError) {
                setError(
                    err.data?.media?.message ||
                    err.data?.content?.message ||
                    err.message ||
                    'Failed to create post. Please try again.'
                );
            } else {
                setError((err as Error).message || 'An unexpected error occurred. Please try again.');
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        uploadProgress,
        submitPost
    };
};