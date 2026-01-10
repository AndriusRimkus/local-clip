import { useDrag } from '@use-gesture/react';
import type { RefObject } from 'react';
import { useEffect, useState } from 'react';

interface UseRangeDragOptions {
    trackRef: RefObject<HTMLElement | null>;
    value: [number, number];
    min: number;
    max: number;
    onDrag: (value: [number, number]) => void;
}

interface DragMemo {
    initialValue: [number, number];
    trackWidth: number;
}

export function useRangeDrag({
    trackRef,
    value,
    min,
    max,
    onDrag,
}: UseRangeDragOptions) {
    const [isDragging, setIsDragging] = useState(false);
    const [justFinishedDragging, setJustFinishedDragging] = useState(false);

    const bindDrag = useDrag(
        ({ movement: [mx], active, first, memo: _memo }): DragMemo => {
            const memo = _memo as DragMemo;

            setIsDragging(active);

            if (first) {
                return {
                    initialValue: value,
                    trackWidth: trackRef.current?.offsetWidth || 0,
                };
            }

            if (!active) {
                setJustFinishedDragging(true);
            }

            const valueRange = max - min;
            const valueOffset = (mx / memo.trackWidth) * valueRange;

            const [start, end] = memo.initialValue;
            let newStart = start + valueOffset;
            let newEnd = end + valueOffset;

            const rangeDuration = end - start;

            if (newStart < min) {
                newStart = min;
                newEnd = min + rangeDuration;
            } else if (newEnd > max) {
                newEnd = max;
                newStart = max - rangeDuration;
            }

            onDrag([newStart, newEnd]);

            return memo;
        },
        {
            preventDefault: true,
            threshold: 3,
        }
    );

    useEffect(() => {
        if (justFinishedDragging) {
            const timeout = setTimeout(() => {
                setJustFinishedDragging(false);
            }, 0);

            return () => clearTimeout(timeout);
        }
    }, [justFinishedDragging]);

    return {
        bindDrag,
        isDragging,
        justFinishedDragging,
    };
}
