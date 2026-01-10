import { RangeSlider } from '@/components/RangeSlider';
import { Input } from '@/components/ui/input';
import {
    VideoPlayer,
    type VideoMetadata,
    type VideoPlayerHandle,
} from '@/components/VideoPlayer';
import type { TimeRange } from '@/lib/types';
import { useRef, useState } from 'react';

interface VideoEditorProps {
    videoUrl: string;
}

export function VideoEditor({ videoUrl }: VideoEditorProps) {
    const playerRef = useRef<VideoPlayerHandle>(null);
    const [duration, setDuration] = useState<number>();
    const [range, setRange] = useState<TimeRange>();
    const [currentTime, setCurrentTime] = useState<number>(0);

    function handleOnLoadedMetadata(videoMetadata: VideoMetadata) {
        setDuration(videoMetadata.duration);
        setRange([0, videoMetadata.duration]);
    }

    function handleTimeUpdate(time: number) {
        setCurrentTime(time);

        if (range && time >= range[1]) {
            playerRef.current?.seek(range[0]);
        }
    }

    function handleRangeUpdate(range: TimeRange) {
        setRange(range);
        playerRef.current?.seek(range[0]);
    }

    function handleSeek(time: number) {
        playerRef.current?.seek(time);
    }

    function handleStartChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!range || !duration) {
            return;
        }

        const value = Math.min(Math.max(0, Number(e.target.value)), range[1]);
        
        handleRangeUpdate([value, range[1]]);
    }

    function handleEndChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!range || !duration) {
            return;
        }

        const value = Math.min(
            Math.max(range[0], Number(e.target.value)),
            duration
        );

        handleRangeUpdate([range[0], value]);
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
                <>
                    <RangeSlider
                        value={range}
                        onValueChange={handleRangeUpdate}
                        min={0}
                        max={duration}
                        currentTime={currentTime}
                        onSeek={handleSeek}
                    />

                    <div className="flex gap-4">
                        <Input
                            type="number"
                            value={range[0].toFixed(1)}
                            onChange={handleStartChange}
                            min={0}
                            max={range[1]}
                            step={0.1}
                            className="w-24"
                        />
                        <Input
                            type="number"
                            value={range[1].toFixed(1)}
                            onChange={handleEndChange}
                            min={range[0]}
                            max={duration}
                            step={0.1}
                            className="w-24"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
