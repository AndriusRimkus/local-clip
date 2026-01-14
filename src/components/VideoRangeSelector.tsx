import { RangeSlider, type RangeSliderHandle } from '@/components/RangeSlider';
import {
    VideoPlayer,
    type VideoMetadata,
    type VideoPlayerHandle,
} from '@/components/VideoPlayer';
import type { TimeRange } from '@/lib/types';
import { TIME_STEP } from '@/lib/types';
import { useRef, useState } from 'react';

interface VideoRangeSelectorProps {
    videoUrl: string;
    range?: TimeRange;
    onRangeChange?: (range: TimeRange) => void;
}

function VideoRangeSelector({
    videoUrl,
    range: externalRange,
    onRangeChange,
}: VideoRangeSelectorProps) {
    const playerRef = useRef<VideoPlayerHandle>(null);
    const sliderRef = useRef<RangeSliderHandle>(null);
    const [duration, setDuration] = useState<number>();
    const [range, setRange] = useState<TimeRange | undefined>(externalRange);

    function handleLoadedMetadata(videoMetadata: VideoMetadata) {
        setDuration(videoMetadata.duration);

        if (!range) {
            const initialRange: TimeRange = [0, videoMetadata.duration];

            setRange(initialRange);
            onRangeChange?.(initialRange);
        }
    }

    function handleFrame(metadata: VideoFrameCallbackMetadata) {
        if (sliderRef.current && duration) {
            const percent = (metadata.mediaTime / duration) * 100;
            sliderRef.current.setPlayheadProgress(percent);
        }

        if (range && metadata.mediaTime >= range[1]) {
            playerRef.current?.seek(range[0]);
        }
    }

    function handleRangeUpdate(newRange: TimeRange) {
        setRange(newRange);
        onRangeChange?.(newRange);
        playerRef.current?.seek(newRange[0]);
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
                onLoadedMetadata={handleLoadedMetadata}
                onFrame={handleFrame}
            />

            {duration !== undefined && range !== undefined && (
                <RangeSlider
                    value={range}
                    onValueChange={handleRangeUpdate}
                    min={0}
                    max={duration}
                    step={TIME_STEP}
                    onSeek={handleSeek}
                    ref={sliderRef}
                />
            )}
        </div>
    );
}

export { VideoRangeSelector };
