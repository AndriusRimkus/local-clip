import { cn } from '@/lib/utils';
import * as Slider from '@radix-ui/react-slider';
import { useDrag } from '@use-gesture/react';
import { useRef, useState } from 'react';

interface RangeSliderProps {
    value: [number, number];
    onValueChange: (value: [number, number]) => void;
    min: number;
    max: number;
    className?: string;
}

function RangeSlider({
    value,
    onValueChange,
    min,
    max,
    className,
}: RangeSliderProps) {
    const trackRef = useRef<HTMLSpanElement>(null!);
    const rangeRef = useRef<HTMLSpanElement>(null!);
    const [isDragging, setIsDragging] = useState(false);
    const initialRangeRef = useRef<[number, number]>([0, 0]);

    const bindDrag = useDrag(
        ({ movement: [mx], active, first }) => {
            setIsDragging(active);

            if (first) {
                initialRangeRef.current = value;
            }

            const trackWidth = trackRef.current.offsetWidth;
            const valueRange = max - min;
            const valueOffset = (mx / trackWidth) * valueRange;

            const rangeDuration =
                initialRangeRef.current[1] - initialRangeRef.current[0];

            let newStart = initialRangeRef.current[0] + valueOffset;
            let newEnd = initialRangeRef.current[1] + valueOffset;

            if (newStart < min) {
                newStart = min;
                newEnd = min + rangeDuration;
            } else if (newEnd > max) {
                newEnd = max;
                newStart = max - rangeDuration;
            }

            onValueChange([newStart, newEnd]);
        },
        {
            preventDefault: true,
        }
    );

    return (
        <Slider.Root
            value={value}
            onValueChange={onValueChange}
            min={min}
            max={max}
            step={0.1}
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
                <div className="absolute inset-0 flex justify-between px-1 pointer-events-none">
                    {Array.from({ length: 51 }, (_, i) => (
                        <div
                            key={i}
                            className={cn(
                                'w-px bg-gray-300 self-center',
                                i % 5 === 0 ? 'h-2/3' : 'h-1/3'
                            )}
                        />
                    ))}
                </div>
                <Slider.Range
                    ref={rangeRef}
                    {...bindDrag()}
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
        <Slider.Thumb className="flex flex-col gap-1 justify-center items-center w-4 h-14 bg-purple-700 rounded-sm border-2 border-white shadow-lg cursor-ew-resize hover:bg-sky-500 hover:ring-sky-300 focus:bg-sky-500 focus:outline-none ring-1 ring-purple-700 focus:ring-sky-300">
            <div className="size-0.5 bg-white rounded-full" />
            <div className="size-0.5 bg-white rounded-full" />
            <div className="size-0.5 bg-white rounded-full" />
        </Slider.Thumb>
    );
}

export { RangeSlider };
