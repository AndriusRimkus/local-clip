import type { Clip, TimeRange } from '@/lib/types';
import { create } from 'zustand';

interface ProjectStore {
    clips: Clip[];
    getClipById: (id: string) => Clip;
    addClip: (sourceUrl: string, range: TimeRange, thumbnail?: string) => Clip;
    updateClip: (id: string, range: TimeRange, thumbnail?: string) => Clip;
    removeClip: (id: string) => void;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    clips: [],

    getClipById(id) {
        const clip = get().clips.find((clip) => clip.id === id);

        if (!clip) {
            throw new Error(`Clip with id ${id} not found`);
        }

        return clip;
    },

    addClip(sourceUrl, range, thumbnail) {
        const id = crypto.randomUUID();
        const newClip = { id, sourceUrl, range, thumbnail };

        set((state) => ({
            clips: [newClip, ...state.clips],
        }));

        return newClip;
    },

    updateClip(id, range, thumbnail) {
        const existingClip = get().getClipById(id);

        const updatedClip = {
            ...existingClip,
            range,
            thumbnail: thumbnail ?? existingClip.thumbnail,
        };

        set((state) => ({
            clips: state.clips.map((clip) =>
                clip.id === id ? updatedClip : clip
            ),
        }));

        return updatedClip;
    },

    removeClip(id) {
        set((state) => ({
            clips: state.clips.filter((clip) => clip.id !== id),
        }));
    },
}));
