import { Progress } from '@/components/ui/progress';

interface UploadProgressProps {
    progress: string;
}

export const UploadProgress = ({ progress }: UploadProgressProps) => (
    <div className="mb-4">
        <Progress
            value={progress ? parseFloat(progress) : 0}
            className="h-2 bg-white border-2 border-black"
        />
        <p className="mt-2 text-sm font-bold">{`Uploading: ${progress}%`}</p>
    </div>
);