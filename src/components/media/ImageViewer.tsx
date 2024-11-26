import Image from 'next/image';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImageViewerProps {
    url: string;
}

export const ImageViewer = ({ url }: ImageViewerProps) => (
    <div className="relative w-full pt-[100%]">
        <Dialog>
            <DialogTrigger asChild>
                <Image
                    src={url}
                    alt="Post media"
                    fill
                    className="absolute top-0 left-0 w-full h-full object-contain"
                />
            </DialogTrigger>
            <DialogContent>
                <Image
                    src={url}
                    alt="Post media"
                    layout="responsive"
                    width={1920}
                    height={1080}
                />
            </DialogContent>
        </Dialog>
    </div>
);