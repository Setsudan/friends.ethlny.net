export interface MediaFile {
    file: File;
    preview: string;
    type: 'image' | 'video';
}

export type AllowedImageType =
    | 'image/vnd.mozilla.apng'
    | 'image/webp'
    | 'image/png'
    | 'image/jpeg'
    | 'image/gif'
    | 'image/jpg'
    | 'image/bmp'
    | 'image/svg+xml'
    | 'image/tiff'
    | 'image/x-icon';

export type AllowedVideoType =
    | 'video/ogg'
    | 'video/mpeg'
    | 'video/quicktime'
    | 'video/mp4'
    | 'video/webm'
    | 'video/x-flv'
    | 'video/x-msvideo';

export type AllowedMediaType = AllowedImageType | AllowedVideoType;