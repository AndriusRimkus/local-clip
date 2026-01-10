import { RangeSlider } from '@/components/RangeSlider';
import {
    VideoPlayer,
    type VideoMetadata,
    type VideoPlayerHandle,
} from '@/components/VideoPlayer';
import { useRef, useState } from 'react';

interface VideoEditorProps {
    videoUrl: string;
}

export function VideoEditor({ videoUrl }: VideoEditorProps) {
    const playerRef = useRef<VideoPlayerHandle>(null);
    const [duration, setDuration] = useState<number>();
    const [range, setRange] = useState<[number, number]>();
    const [currentTime, setCurrentTime] = useState<number>(0);

    function handleOnLoadedMetadata(videoMetadata: VideoMetadata) {
        setDuration(videoMetadata.duration);
        setRange([0, videoMetadata.duration]);
    }

    function handleTimeUpdate(time: number) {
        setCurrentTime(time);
    }

    function handleRangeUpdate(range: [number, number]) {
        setRange(range);
        playerRef.current?.seek(range[0]);
    }

    function handleSeek(time: number) {
        playerRef.current?.seek(time);
    }

    return (
        <div className="flex flex-col gap-6">
            <VideoPlayer
                ref={playerRef}
                key={videoUrl}
                src={videoUrl}
                className="aspect-video"
                onLoadedMetadata={handleOnLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
            />

            {duration !== undefined && range !== undefined && (
                <RangeSlider
                    value={range}
                    onValueChange={handleRangeUpdate}
                    min={0}
                    max={duration}
                    currentTime={currentTime}
                    onSeek={handleSeek}
                />
            )}
        </div>
    );
}
