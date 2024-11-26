// hooks/usePostMedia.ts
import { useState, useEffect } from 'react';
import { pb } from '@/lib/pocketbase';
import { PostRecord, MediaItem } from '@/types/posts';

export const usePostMedia = (post: PostRecord) => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isMultipleMedia, setIsMultipleMedia] = useState(false);

    useEffect(() => {
        const media = Array.isArray(post.media) ? post.media : post.media ? [post.media] : [];
        const items = media.map(mediaItem => ({
            url: new URL(pb.files.getUrl(post, mediaItem)).toString(),
            originalMedia: mediaItem
        }));

        setMediaItems(items);
        setIsMultipleMedia(items.length > 1);
    }, [post]);

    return { mediaItems, isMultipleMedia };
};

