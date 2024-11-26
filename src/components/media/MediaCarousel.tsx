import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { MediaItem } from '@/types/posts';
import { MediaRenderer } from './MediaRenderer';
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface MediaCarouselProps {
    mediaItems: MediaItem[];
}


export const MediaCarousel = ({ mediaItems }: MediaCarouselProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });

        const interval = setInterval(() => {
            api.scrollNext();
        }, 4000);

        return () => clearInterval(interval);
    }, [api]);

    return (
        <div className="mt-4 border-4 border-black transform -rotate-2 overflow-hidden bg-white">
            <Badge className="absolute top-2 right-2 bg-white text-black border-2 border-black transform rotate-1 z-30">
                {current}/{count}
            </Badge>
            <Carousel className="w-full"
                opts={{
                    loop: true,
                    align: 'center'
                }}
                setApi={setApi}
            >
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
        </div>
    )
};