import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    className?: string;
    onLoadStart?: () => void;
    onCanPlay?: () => void;
    onError?: (error?: MediaError) => void;
}

function VideoPlayer({
    src,
    autoPlay = true,
    className,
    onLoadStart,
    onCanPlay,
    onError,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>();

    const showOverlay = isLoading || !!errorMessage;

    const handleCanPlay = () => {
        setIsLoading(false);
        onCanPlay?.();
    };

    const handleError = () => {
        const error = videoRef.current?.error;
        const errorMessage =
            error?.message ||
            'An unknown error occurred while loading the video.';

        setIsLoading(false);
        setErrorMessage(errorMessage);

        onError?.(videoRef.current?.error ?? undefined);
    };

    useEffect(() => {
        videoRef.current?.load();
    }, [src]);

    return (
        <div className={cn('relative overflow-hidden rounded-lg', className)}>
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <Loader2 className="animate-spin text-primary" size={32} />
                </div>
            )}

            {errorMessage && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <p className="text-sm text-destructive">{errorMessage}</p>
                </div>
            )}

            <video
                ref={videoRef}
                src={src}
                autoPlay={autoPlay}
                controls
                onLoadStart={() => onLoadStart?.()}
                onCanPlay={handleCanPlay}
                onError={handleError}
                className={cn('h-full w-full', showOverlay && 'invisible')}
            />
        </div>
    );
}

export { VideoPlayer };
