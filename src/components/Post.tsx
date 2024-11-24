import Image from 'next/image';
import { pb } from '@/lib/pocketbase';
import { formatDistance } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { Card } from './ui/card';

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

export default function Post({ post }: PostProps) {
    const mediaUrl = post.media
        ? new URL(pb.files.getUrl(post, post.media)).toString()
        : null;

    const authorInitial = post.expand?.author?.name?.[0] || '?';

    return (
        <Card className="bg-yellow-300 p-6 rounded-none border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] lg:w-96 md:w-80 sm:w-64">
            <div className="flex flex-col space-y-4">
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

                {mediaUrl && (
                    <div className={"mt-4 border-4 border-black transform -rotate-2 overflow-hidden"}>
                        <Image
                            src={mediaUrl}
                            alt="Post media"
                            width={500}
                            height={500}
                            objectFit="cover"
                            className="w-full h-auto"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
}