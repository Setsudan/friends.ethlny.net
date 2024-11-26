import { PlusCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AllowedImageType, AllowedVideoType } from '@/types/post-form';
import { isAllowedImageType, isAllowedVideoType } from '@/utils/media-validators';
import { MAX_FILES, MAX_FILE_SIZE } from '@/constants/media';

interface MediaUploadButtonProps {
    onMediaSelect: (files: FileList | null) => void;
    disabled?: boolean;
}

// Get all allowed MIME types
const getAllowedMimeTypes = (): string => {
    const imageTypes = Object.values(isAllowedImageType)
        .filter((type): type is AllowedImageType => typeof type === 'string');
    const videoTypes = Object.values(isAllowedVideoType)
        .filter((type): type is AllowedVideoType => typeof type === 'string');

    return [...imageTypes, ...videoTypes].join(',');
};

const formatFileSize = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb}MB`;
};

export const MediaUploadButton = ({ onMediaSelect, disabled }: MediaUploadButtonProps) => (
    <div className="flex flex-col space-y-2 w-full md:w-auto">
        <Button
            type="button"
            variant="outline"
            className="bg-white text-black border-2 border-black rounded-none hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onClick={() => document.getElementById('media-upload')?.click()}
            disabled={disabled}
        >
            <PlusCircleIcon className="h-6 w-6 mr-2" />
            Ajouter une/des image(s) ou vidéo(s)
        </Button>
        <input
            type="file"
            accept={getAllowedMimeTypes()}
            onChange={(e) => onMediaSelect(e.target.files)}
            className="hidden"
            id="media-upload"
            multiple
        />
        <span className="text-xs font-mono bg-white p-2 border-2 border-black">
            Max: {MAX_FILES} fichiers, {formatFileSize(MAX_FILE_SIZE)} chacun.
        </span>
    </div>
);