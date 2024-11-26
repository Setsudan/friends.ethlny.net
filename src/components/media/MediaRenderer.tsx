import { mediaUtils } from '@/utils/media';
import { VideoPlayer } from './VideoPlayer';
import { ImageViewer } from './ImageViewer';

interface MediaRendererProps {
    url: string;
    mediaItem: string;
}

export const MediaRenderer = ({ url, mediaItem }: MediaRendererProps) => {
    const type = mediaUtils.getMediaType(mediaItem);
    const extension = mediaUtils.getExtension(mediaItem) || '';
    const mimeType = mediaUtils.getMimeType(extension);

    if (type === 'video') return <VideoPlayer url={url} mimeType={mimeType} />;
    if (type === 'image') return <ImageViewer url={url} />;
    return null;
};