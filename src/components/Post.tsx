import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { pb } from '@/lib/pocketbase';
import { formatDistance } from 'date-fns';
import {
    Avatar, AvatarImage, AvatarFallback,

} from '@radix-ui/react-avatar';
import { Card } from './ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"

interface PostProps {
    post: {
        id: string;
        content?: string;
        media?: string;
        created: string;
        expand?: {
            author?: {
                email: string;
                name?: string;
            };
        };
    };
}

const getMediaExtension = (media: string) => {
    return media.split('.').pop()?.toLowerCase();
}

const getMimeType = (extension: string): string => {
    const mimeTypes = {
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
    };
    return mimeTypes[extension as keyof typeof mimeTypes] || '';
};

const isVideoOrImage = (media: string): 'video' | 'image' | 'unknown' => {
    const extension = getMediaExtension(media) || '';
    if (['mp4', 'webm', 'ogg', 'm4v', 'mov'].includes(extension)) {
        return 'video';
    } else if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) {
        return 'image';
    } else {
        return 'unknown';
    }
}

const VideoPlayer = ({ url, mimeType }: { url: string; mimeType: string }) => {
    return (
        <div className="relative w-full pt-[56.25%]"> {/* 16:9 aspect ratio container */}
            <video
                controls
                className="absolute top-0 left-0 w-full h-full object-contain"
                preload="metadata"
                playsInline
                crossOrigin="anonymous"
            >
                <source src={url} type={mimeType} />
                <source src={url} type="video/webm" />
                <p className="text-center p-4">
                    Ton navigateur ne supporte pas la lecture de vidéos.
                    <a
                        href={url}
                        download
                        className="text-blue-600 hover:text-blue-800 underline ml-2"
                    >
                        <Download size={16} /> Télécharger la vidéo
                    </a>
                </p>
            </video>
        </div>
    );
};

const MediaRenderer = ({ url, mediaItem }: { url: string, mediaItem: string }) => {
    const type = isVideoOrImage(mediaItem);
    const extension = getMediaExtension(mediaItem) || '';
    const mimeType = getMimeType(extension);

    if (type === 'video') {
        return <VideoPlayer url={url} mimeType={mimeType} />;
    } else if (type === 'image') {
        return (
            <div className="relative w-full pt-[100%]"> {/* Default 1:1 aspect ratio container */}
                <Image
                    src={url}
                    alt="Post media"
                    fill
                    className="absolute top-0 left-0 w-full h-full object-contain"
                />
            </div>
        );
    }
    return null;
};

export default function Post({ post }: PostProps) {
    const [mediaItems, setMediaItems] = useState<Array<{ url: string; originalMedia: string }>>([]);
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

    const authorInitial = post.expand?.author?.name?.[0] || '?';

    return (
        <Card className="bg-yellow-300 p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:w-96 md:w-80 sm:w-64 flex flex-col">
            <div className="flex flex-col space-y-4 flex-grow">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12 border-2 border-black">
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${authorInitial}`} />
                            <AvatarFallback>{authorInitial}</AvatarFallback>
                            <span className="sr-only">{post.expand?.author?.name}</span>
                        </Avatar>
                        <div>
                            <div className="font-bold text-lg">{post.expand?.author?.name}</div>
                            <div className="text-sm font-mono">
                                {formatDistance(new Date(post.created), new Date(), { addSuffix: true })}
                            </div>
                        </div>
                    </div>
                </div>

                {post.content && (
                    <p className="text-lg font-semibold mt-4 bg-white p-4 border-2 border-black transform rotate-1">
                        {post.content}
                    </p>
                )}

                {mediaItems.length > 0 && (
                    <div className="mt-4 border-4 border-black transform -rotate-2 overflow-hidden bg-white">
                        {isMultipleMedia ? (
                            <>
                                <Badge className="absolute top-2 right-2 bg-white text-black border-2 border-black transform rotate-1 z-30">
                                    {mediaItems.length} items
                                </Badge>
                                <Carousel className="w-full">
                                    <CarouselContent>
                                        {mediaItems.map((item, index) => (
                                            <CarouselItem key={index} className="w-full">
                                                <MediaRenderer url={item.url} mediaItem={item.originalMedia} />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </>
                        ) : (
                            <MediaRenderer url={mediaItems[0].url} mediaItem={mediaItems[0].originalMedia} />
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
}