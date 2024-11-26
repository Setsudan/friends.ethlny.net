import { Download } from "lucide-react"

interface VideoPlayerProps {
    url: string;
    mimeType: string;
}

export const VideoPlayer = ({ url, mimeType }: VideoPlayerProps) => (
    <div className="relative w-full pt-[56.25%]">
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
                <a href={url} download className="text-blue-600 hover:text-blue-800 underline ml-2">
                    <Download size={16} /> Télécharger la vidéo
                </a>
            </p>
        </video>
    </div>
);