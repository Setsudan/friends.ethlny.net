import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaFile } from '@/types/post-form';

interface MediaPreviewProps {
    mediaFiles: MediaFile[];
    onRemove: (index: number) => void;
}

export const MediaPreview = ({ mediaFiles, onRemove }: MediaPreviewProps) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {mediaFiles.map((media, index) => (
            <div key={index} className="relative border-2 border-black">
                {media.type === 'image' ? (
                    <Image
                        src={media.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                        width={128}
                        height={128}
                    />
                ) : (
                    <video
                        src={media.preview}
                        className="w-full h-32 object-cover"
                        controls
                    />
                )}
                <Button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-none w-6 h-6 p-0 flex items-center justify-center border border-black"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        ))}
    </div>
);