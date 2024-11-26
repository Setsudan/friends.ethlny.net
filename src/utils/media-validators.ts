import { AllowedImageType, AllowedVideoType } from "@/types/post-form";

export const isAllowedImageType = (type: string): type is AllowedImageType => {
    const allowedTypes: AllowedImageType[] = [
        'image/vnd.mozilla.apng',
        'image/webp',
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/jpg',
        'image/bmp',
        'image/svg+xml',
        'image/tiff',
        'image/x-icon'
    ];
    return allowedTypes.includes(type as AllowedImageType);
};

export const isAllowedVideoType = (type: string): type is AllowedVideoType => {
    const allowedTypes: AllowedVideoType[] = [
        'video/ogg',
        'video/mpeg',
        'video/quicktime',
        'video/mp4',
        'video/webm',
        'video/x-flv',
        'video/x-msvideo'
    ];
    return allowedTypes.includes(type as AllowedVideoType);
};
