import { useState } from 'react';
import { MediaFile } from '@/types/post-form';
import { MAX_FILE_SIZE, MAX_FILES, SUPPORTED_FORMATS } from '@/constants/media';
import { isAllowedImageType, isAllowedVideoType } from '@/utils/media-validators';

export const useMediaUpload = () => {
    const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): 'image' | 'video' => {
        if (file.size > MAX_FILE_SIZE) {
            throw new Error('File size must be less than 500MB.');
        }

        if (isAllowedImageType(file.type)) return 'image';
        if (isAllowedVideoType(file.type)) return 'video';

        throw new Error(
            'Please select valid files. Supported formats:\n' +
            `- Images: ${SUPPORTED_FORMATS.image}\n` +
            `- Videos: ${SUPPORTED_FORMATS.video}`
        );
    };

    const createFilePreview = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
        });
    };

    const handleMediaChange = async (files: File[]) => {
        setError(null);

        if (mediaFiles.length + files.length > MAX_FILES) {
            setError(`Maximum of ${MAX_FILES} files allowed`);
            return false;
        }

        const newMediaFiles: MediaFile[] = [];

        for (const file of files) {
            try {
                const mediaType = validateFile(file);
                const preview = await createFilePreview(file);
                newMediaFiles.push({ file, preview, type: mediaType });
            } catch (err) {
                setError((err as Error).message);
                return false;
            }
        }

        setMediaFiles(prev => [...prev, ...newMediaFiles]);
        return true;
    };

    const removeMedia = (index: number) => {
        setMediaFiles(prev => prev.filter((_, i) => i !== index));
    };

    return {
        mediaFiles,
        error,
        setError,
        handleMediaChange,
        removeMedia
    };
};