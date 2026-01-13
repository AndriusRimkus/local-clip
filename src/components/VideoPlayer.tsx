import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import type { Ref } from 'react';
import { useEffect, useImperativeHandle, useRef, useState } from 'react';

export interface VideoMetadata {
    duration: number;
    videoWidth: number;
    videoHeight: number;
}

export interface VideoPlayerHandle {
    seek: (time: number) => void;
}

interface VideoPlayerProps {
    src: string;
    autoPlay?: boolean;
    className?: string;
    ref?: Ref<VideoPlayerHandle>;
    onLoadStart?: () => void;
    onLoadedMetadata?: (metadata: VideoMetadata) => void;
    onCanPlay?: () => void;
    onFrame?: (metadata: VideoFrameCallbackMetadata) => void;
    onError?: (error?: MediaError) => void;
}

function VideoPlayer({
    src,
    autoPlay = true,
    className,
    ref,
    onLoadStart,
    onLoadedMetadata,
    onCanPlay,
    onError,
    onFrame,
}: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null!);

    useImperativeHandle(ref, () => ({
        seek(time: number) {
            videoRef.current.currentTime = time;
        },
    }));

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>();

    const showOverlay = isLoading || !!errorMessage;

    useEffect(() => {
        const video = videoRef.current;
        let handle: number;

        function onVideoFrame(
            _now: DOMHighResTimeStamp,
            metadata: VideoFrameCallbackMetadata
        ) {
            onFrame?.(metadata);
            handle = video.requestVideoFrameCallback(onVideoFrame);
        }

        handle = video.requestVideoFrameCallback(onVideoFrame);

        return () => video.cancelVideoFrameCallback(handle);
    }, [onFrame]);

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

    function handleError() {
        const error = videoRef.current.error;
        const errorMessage =
            error?.message ||
            'An unknown error occurred while loading the video.';

        setIsLoading(false);
        setErrorMessage(errorMessage);

        onError?.(videoRef.current.error ?? undefined);
    }

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
                onLoadStart={onLoadStart}
                onLoadedMetadata={handleLoadedMetadata}
                onCanPlay={handleCanPlay}
                onError={handleError}
                className={cn('h-full w-full', showOverlay && 'invisible')}
            />
        </div>
    );
}

export { VideoPlayer };
