import { RangeSlider } from '@/components/RangeSlider';
import { VideoPlayer, type VideoMetadata } from '@/components/VideoPlayer';
import { useState } from 'react';

interface VideoEditorProps {
    videoUrl: string;
}

export function VideoEditor({ videoUrl }: VideoEditorProps) {
    const [duration, setDuration] = useState<number>();
    const [range, setRange] = useState<[number, number]>();
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [seekTime, setSeekTime] = useState<number>();

    function handleOnLoadedMetadata(videoMetadata: VideoMetadata) {
        if (duration === undefined) {
            setDuration(videoMetadata.duration);
            setRange([0, videoMetadata.duration]);
        }
    }

    function handleTimeUpdate(time: number) {
        setCurrentTime(time);
    }

    function handleRangeUpdate(range: [number, number]) {
        setRange(range);
        setSeekTime(range[0]);
    }

    function handleSeek(time: number) {
        setSeekTime(time);
    }

    return (
        <div className="flex flex-col gap-6">
            <VideoPlayer
                key={videoUrl}
                src={videoUrl}
                seekTime={seekTime}
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
