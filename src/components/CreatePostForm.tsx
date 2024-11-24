'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { pb } from '@/lib/pocketbase';
import Image from 'next/image';
import { ClientResponseError } from 'pocketbase';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';

// Define allowed MIME types matching PocketBase configuration
const ALLOWED_MEDIA_TYPES = {
    image: [
        'image/vnd.mozilla.apng',
        'image/webp',
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/jpg'
    ],
    video: [
        'video/ogg',
        'video/mpeg',
        'video/quicktime',
        'video/mp4',
        'video/webm',
        'video/x-flv',
        'video/x-msvideo'
    ]
};

// Max file size (5MB)
const MAX_FILE_SIZE = 500 * 1024 * 1024;

interface MediaFile {
    file: File;
    preview: string;
    type: 'image' | 'video';
}

export default function CreatePostForm() {
    const [content, setContent] = useState('');
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    const validateFile = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            throw new Error('File size must be less than 500MB.');
        }

        const isImage = ALLOWED_MEDIA_TYPES.image.includes(file.type);
        const isVideo = ALLOWED_MEDIA_TYPES.video.includes(file.type);

        if (!isImage && !isVideo) {
            throw new Error(
                'Please select valid files. Supported formats:\n' +
                '- Images: APNG, WebP, PNG\n' +
                '- Videos: MP4, WebM, OGG, MPEG, QuickTime, FLV, AVI'
            );
        }

        return isImage ? 'image' : 'video';
    };

    const createFilePreview = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setError(null);

        // Check if adding these files would exceed the maximum number of files (99)
        if (mediaFiles.length + files.length > 99) {
            setError('Maximum of 99 files allowed');
            e.target.value = '';
            return;
        }

        const newMediaFiles: MediaFile[] = [];

        for (const file of files) {
            try {
                const mediaType = validateFile(file);
                const preview = await createFilePreview(file);
                newMediaFiles.push({
                    file,
                    preview,
                    type: mediaType
                });
            } catch (err) {
                setError((err as Error).message);
                e.target.value = '';
                return;
            }
        }

        setMediaFiles(prev => [...prev, ...newMediaFiles]);
        e.target.value = '';
    };

    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content && mediaFiles.length === 0) return;
        if (!session?.user?.id) return;

        setLoading(true);
        setError(null);
        setUploadProgress(null);

        try {
            // Create a single FormData instance for the entire post
            const formData = new FormData();

            // Add the content and author
            formData.append('content', content);
            formData.append('author', session.user.id);

            // Add all media files
            for (let i = 0; i < mediaFiles.length; i++) {
                const file = mediaFiles[i].file;
                const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const newFile = new File([file], cleanFileName, { type: file.type });

                // Append each media file with a unique key
                formData.append('media', newFile);
                setUploadProgress(`Uploading file ${i + 1} of ${mediaFiles.length}...`);
            }

            // Create the post with a single request
            setUploadProgress('Creating post...');
            const createdPost = await pb.collection('posts').create(formData);
            console.log('Post created successfully:', createdPost);

            // Reset form
            setContent('');
            setMediaFiles([]);
            setUploadProgress(null);
            router.refresh();
        } catch (err) {
            console.error('Full error:', err);

            if (err instanceof ClientResponseError) {
                const errorMessage = err.data?.media?.message
                    || err.data?.content?.message
                    || err.message
                    || 'Failed to create post. Please try again.';
                setError(errorMessage);
            } else {
                setError((err as Error).message || 'An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-lime-300 p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            {error && (
                <Alert variant="destructive" className="mb-4 border-2 border-black">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {uploadProgress !== null && (
                <div className="mb-4">
                    <Progress value={uploadProgress ? parseFloat(uploadProgress) : 0} className="h-2 bg-white border-2 border-black" />
                    <p className="mt-2 text-sm font-bold">{`Uploading: ${uploadProgress}%`}</p>
                </div>
            )}

            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-2 mb-4 bg-white border-2 border-black rounded-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
            />

            {mediaFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {mediaFiles.map((media, index) => (
                        <div key={index} className="relative border-2 border-black">
                            {media.type === 'image' ? (
                                <Image
                                    src={media.preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover"
                                    width={128}
                                    height={128}
                                />
                            ) : (
                                <video
                                    src={media.preview}
                                    className="w-full h-32 object-cover"
                                    controls
                                />
                            )}
                            <Button
                                type="button"
                                onClick={() => removeMedia(index)}
                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-none w-6 h-6 p-0 flex items-center justify-center border border-black"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between space-y-4 md:space-y-0">
                <div className="flex flex-col space-y-2 w-full md:w-auto">
                    <Button
                        type="button"
                        variant="outline"
                        className="bg-white text-black border-2 border-black rounded-none hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onClick={() => document.getElementById('media-upload')?.click()}
                    >
                        Add Media
                    </Button>
                    <input
                        type="file"
                        accept={[...ALLOWED_MEDIA_TYPES.image, ...ALLOWED_MEDIA_TYPES.video].join(',')}
                        onChange={handleMediaChange}
                        className="hidden"
                        id="media-upload"
                        multiple
                    />
                    <span className="text-xs font-mono bg-white p-2 border-2 border-black">
                        Max: 99 files, 5MB each. Supported formats:
                        <br />
                        Images: APNG, WebP, PNG
                        <br />
                        Videos: MP4, WebM, OGG, MPEG, QuickTime, FLV, AVI
                    </span>
                </div>
                <Button
                    type="submit"
                    disabled={loading || (!content && mediaFiles.length === 0)}
                    className={`bg-blue-500 text-white px-6 py-3 rounded-none border-2 border-black font-bold text-lg transform rotate-2 transition-transform hover:rotate-0 ${loading || (!content && mediaFiles.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                >
                    {loading ? 'Posting...' : 'Post'}
                </Button>
            </div>
        </form>
    );
}