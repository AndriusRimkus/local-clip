import { VideoRangeSelector } from '@/components/VideoRangeSelector';
import { Button } from '@/components/ui/button';
import type { Clip, TimeRange } from '@/lib/types';
import { useProjectStore } from '@/stores/projectStore';
import { generateThumbnail } from '@/utils/video';
import { useState } from 'react';

interface VideoEditorProps {
    videoUrl: string;
    editingClip?: Clip;
    onEditComplete?: () => void;
}

function VideoEditor({
    videoUrl,
    editingClip,
    onEditComplete,
}: VideoEditorProps) {
    const [range, setRange] = useState<TimeRange | undefined>(
        editingClip?.range
    );

    const addClip = useProjectStore((state) => state.addClip);
    const updateClip = useProjectStore((state) => state.updateClip);

    async function handleCreateClip() {
        if (!range) {
            return;
        }

        const thumbnail = await generateThumbnail(videoUrl, range[0], 160);
        addClip(videoUrl, range, thumbnail);
    }

    async function handleUpdateClip() {
        if (!editingClip || !range) {
            return;
        }

        const thumbnail = await generateThumbnail(videoUrl, range[0], 160);
        updateClip(editingClip.id, range, thumbnail);
        onEditComplete?.();
    }

    function handleCancelEdit() {
        onEditComplete?.();
    }

    return (
        <div className="flex flex-col gap-6">
            <VideoRangeSelector
                videoUrl={videoUrl}
                range={range}
                onRangeChange={setRange}
            />

            {range && (
                <div className="flex gap-4">
                    {editingClip ? (
                        <>
                            <Button onClick={handleUpdateClip}>Save</Button>
                            <Button
                                variant="outline"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <Button onClick={handleCreateClip}>Create Clip</Button>
                    )}
                </div>
            )}
        </div>
    );
}

export { VideoEditor };
