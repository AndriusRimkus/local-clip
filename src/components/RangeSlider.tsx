import { cn } from '@/lib/utils';
import * as Slider from '@radix-ui/react-slider';

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
    return (
        <Slider.Root
            value={value}
            onValueChange={onValueChange}
            min={min}
            max={max}
            className={cn(
                'relative flex h-14 select-none touch-none',
                className
            )}
        >
            <Slider.Track className="relative bg-gray-50 border-1 border-gray-200 rounded-sm grow h-14">
                <Slider.Range className="absolute h-full bg-purple-500" />
            </Slider.Track>

            <Thumb />
            <Thumb />
        </Slider.Root>
    );
}

function Thumb() {
    return (
        <Slider.Thumb className="flex flex-col gap-1 justify-center items-center w-4 h-14 bg-purple-700 rounded-sm border-2 border-white shadow-lg cursor-ew-resize hover:bg-sky-500 focus:bg-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-300 focus:ring-offset-1">
            <div className="size-0.5 bg-white rounded-full" />
            <div className="size-0.5 bg-white rounded-full" />
            <div className="size-0.5 bg-white rounded-full" />
        </Slider.Thumb>
    );
}

export { RangeSlider };
