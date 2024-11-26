import { MediaType } from "@/types/posts";

const MIME_TYPES = {
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'video/ogg',
    'm4v': 'video/mp4',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mov': 'video/quicktime',
    'svg': 'image/svg+xml'
} as const;

const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'm4v', 'mov'];
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'svg'];

export const mediaUtils = {
    getExtension: (media: string) => media.split('.').pop()?.toLowerCase(),

    getMimeType: (extension: string): string =>
        MIME_TYPES[extension as keyof typeof MIME_TYPES] || '',

    getMediaType: (media: string): MediaType => {
        const extension = mediaUtils.getExtension(media) || '';
        if (VIDEO_EXTENSIONS.includes(extension)) return 'video';
        if (IMAGE_EXTENSIONS.includes(extension)) return 'image';
        return 'unknown';
    }
};