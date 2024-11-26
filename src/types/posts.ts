import { RecordModel } from 'pocketbase';

export interface UserRecord extends RecordModel {
    email: string;
    name?: string;
}

export interface PostRecord extends RecordModel {
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

export interface MediaItem {
    url: string;
    originalMedia: string;
}

export type MediaType = 'video' | 'image' | 'unknown';