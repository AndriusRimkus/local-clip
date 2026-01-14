import type { TimeRange } from '@/lib/types';
import { cn } from '@/lib/utils';
import * as Slider from '@radix-ui/react-slider';
import { useImperativeHandle, useRef, type RefObject } from 'react';
import { useRangeDrag } from './hooks/useRangeDrag';

interface RangeSliderProps {
    value: TimeRange;
    onValueChange: (value: TimeRange) => void;
    min: number;
    max: number;
    step: number;
    onSeek?: (time: number) => void;
    className?: string;
    ref?: RefObject<RangeSliderHandle | null>;
}

export interface RangeSliderHandle {
    setPlayheadProgress: (percentage: number) => void;
}

function RangeSlider({
    value,
    onValueChange,
    min,
    max,
    step,
    onSeek,
    className,
    ref,
}: RangeSliderProps) {
    const trackRef = useRef<HTMLSpanElement>(null);
    const rangeRef = useRef<HTMLSpanElement>(null);
    const arrowRef = useRef<HTMLSpanElement>(null);

    const { bindDrag, isDragging, justFinishedDragging } = useRangeDrag({
        trackRef,
        value,
        min,
        max,
        onDrag: onValueChange,
    });

    useImperativeHandle(ref, () => ({
        setPlayheadProgress(percentage: number) {
            if (arrowRef.current) {
                arrowRef.current.style.left = `${percentage}%`;
            }
        },
    }));

    function handleRangeClick(e: React.MouseEvent) {
        if (isDragging || justFinishedDragging) {
            return;
        }

        const rect = rangeRef.current?.getBoundingClientRect();

        if (!rect || rect.width === 0) {
            return;
        }

        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const clickValue = value[0] + percentage * (value[1] - value[0]);

        onSeek?.(clickValue);
    }

    return (
        <Slider.Root
            value={value}
            onValueChange={onValueChange}
            min={min}
            max={max}
            step={step}
            disabled={isDragging}
            className={cn(
                'relative flex h-14 select-none touch-none',
                className
            )}
        >
            <Slider.Track
                ref={trackRef}
                className="relative bg-gray-50 border-1 border-gray-200 rounded-sm grow h-14"
            >
                <TrackBackground />
                <TrackArrow ref={arrowRef} />

                <Slider.Range
                    ref={rangeRef}
                    {...bindDrag()}
                    onClick={handleRangeClick}
                    className={cn(
                        'absolute h-full bg-purple-500/50 touch-none',
                        isDragging ? 'cursor-grabbing' : 'cursor-grab'
                    )}
                />
            </Slider.Track>

            <Thumb />
            <Thumb />
        </Slider.Root>
    );
}

function Thumb() {
    return (
        <Slider.Thumb className="flex flex-col gap-1 justify-center items-center w-5 h-14 bg-purple-700 rounded-sm border-2 border-white shadow-lg cursor-ew-resize hover:bg-sky-500 hover:ring-sky-300 focus:bg-sky-500 focus:outline-none ring-1 ring-purple-700 focus:ring-sky-300">
            <div className="size-0.5 bg-white rounded-full" />
            <div className="size-0.5 bg-white rounded-full" />
            <div className="size-0.5 bg-white rounded-full" />
        </Slider.Thumb>
    );
}

function TrackArrow({ ref }: { ref: RefObject<HTMLSpanElement | null> }) {
    return (
        <span
            ref={ref}
            className="absolute h-full w-0.5 bg-sky-500 z-10 -translate-x-1/2"
        />
    );
}

function TrackBackground() {
    const lines = Array.from({ length: 51 }, (_, i) => i);

    return (
        <span className="absolute inset-0 flex justify-between px-1 pointer-events-none">
            {lines.map((i) => (
                <div
                    key={i}
                    className={cn(
                        'w-px bg-gray-300 self-center',
                        i % 5 === 0 ? 'h-2/3' : 'h-1/3'
                    )}
                />
            ))}
        </span>
    );
}

export { RangeSlider };
