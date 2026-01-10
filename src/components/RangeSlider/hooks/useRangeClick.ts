import type { TimeRange } from '@/lib/types';
import type { RefObject } from 'react';

interface UseRangeClickOptions {
    rangeRef: RefObject<HTMLElement | null>;
    value: TimeRange;
    onSeek: (value: number) => void;
    disabled?: boolean;
}

export function useRangeClick({
    rangeRef,
    value,
    onSeek,
    disabled,
}: UseRangeClickOptions) {
    function handleRangeClick(e: React.MouseEvent) {
        if (disabled) {
            return;
        }

        const rect = rangeRef.current?.getBoundingClientRect();

        if (!rect || rect.width === 0) {
            return;
        }

        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const clickValue = value[0] + percentage * (value[1] - value[0]);

        onSeek(clickValue);
    }

    return { handleRangeClick };
}
