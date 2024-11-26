'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MediaPreview } from './post-form/MediaPreview';
import { MediaUploadButton } from './post-form/MediaUploadButton';
import { UploadProgress } from './post-form/UploadProgress';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { usePostSubmit } from '@/hooks/usePostSubmit';

export default function CreatePostForm() {
    const [content, setContent] = useState('');
    const { data: session } = useSession();

    const {
        mediaFiles,
        error: mediaError,
        handleMediaChange,
        removeMedia
    } = useMediaUpload();

    const {
        loading,
        error: submitError,
        uploadProgress,
        submitPost
    } = usePostSubmit();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id) return;

        const success = await submitPost(content, mediaFiles, session.user.id);
        if (success) {
            setContent('');
        }
    };

    const handleMediaSelect = (files: FileList | null) => {
        if (files) {
            handleMediaChange(Array.from(files));
        }
    };

    const error = mediaError || submitError;

    return (
        <form onSubmit={handleSubmit} className="bg-lime-300 p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {error && (
                <Alert variant="destructive" className="mb-4 border-2 border-black">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {uploadProgress && <UploadProgress progress={uploadProgress} />}

            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Un ptit message pour aller avec ?"
                className="w-full p-2 mb-4 bg-white border-2 border-black rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
            />

            {mediaFiles.length > 0 && (
                <MediaPreview
                    mediaFiles={mediaFiles}
                    onRemove={removeMedia}
                />
            )}

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between space-y-4 md:space-y-0">
                <MediaUploadButton
                    onMediaSelect={handleMediaSelect}
                    disabled={loading}
                />

                <Button
                    type="submit"
                    disabled={loading || (!content && mediaFiles.length === 0)}
                    className={`bg-blue-500 text-white px-6 py-3 rounded-none border-2 border-black font-bold text-lg transform rotate-2 transition-transform hover:rotate-0 ${loading || (!content && mediaFiles.length === 0)
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-blue-600'
                        }`}
                >
                    {loading ? 'ça s\'envoie....' : 'Publier ?'}
                </Button>
            </div>
        </form>
    );
}