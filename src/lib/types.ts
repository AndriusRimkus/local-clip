export interface Clip {
    id: string;
    sourceUrl: string;
    range: TimeRange;
    thumbnail?: string;
}

export type TimeRange = [number, number];

export const TIME_STEP = 0.1;
