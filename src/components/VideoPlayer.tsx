import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export interface VideoMetadata {
    duration: number;
    videoWidth: number;
    videoHeight: number;
}

interface VideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    className?: string;
    currentTime?: number;
    onLoadStart?: () => void;
    onLoadedMetadata?: (metadata: VideoMetadata) => void;
    onCanPlay?: () => void;
    onTimeUpdate?: (currentTime: number) => void;
    onError?: (error?: MediaError) => void;
}

function VideoPlayer({
    src,
    autoPlay = true,
    className,
    currentTime,
    onLoadStart,
    onLoadedMetadata,
    onCanPlay,
    onError,
    onTimeUpdate,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null!);

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>();

    const showOverlay = isLoading || !!errorMessage;

    function handleLoadedMetadata() {
        onLoadedMetadata?.({
            duration: videoRef.current.duration,
            videoWidth: videoRef.current.videoWidth,
            videoHeight: videoRef.current.videoHeight,
        });
    }

    function handleCanPlay() {
        setIsLoading(false);
        onCanPlay?.();
    }

    function handleTimeUpdate() {
        onTimeUpdate?.(videoRef.current.currentTime);
    }

    function handleError() {
        const error = videoRef.current.error;
        const errorMessage =
            error?.message ||
            'An unknown error occurred while loading the video.';

        setIsLoading(false);
        setErrorMessage(errorMessage);

        onError?.(videoRef.current.error ?? undefined);
    }

    useEffect(() => {
        videoRef.current.load();
    }, [src]);

    useEffect(() => {
        if (currentTime !== undefined) {
            videoRef.current.currentTime = currentTime;
        }
    }, [currentTime]);

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
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onError={handleError}
                onTimeUpdate={handleTimeUpdate}
                className={cn('h-full w-full', showOverlay && 'invisible')}
            />
        </div>
    );
}

export { VideoPlayer };
