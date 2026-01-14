import { Button } from '@/components/ui/button';
import type { Clip } from '@/lib/types';
import { useProjectStore } from '@/stores/projectStore';

interface ClipsLibraryProps {
    onEdit: (clip: Clip) => void;
}

function ClipsLibrary({ onEdit }: ClipsLibraryProps) {
    const clips = useProjectStore((state) => state.clips);
    const removeClip = useProjectStore((state) => state.removeClip);

    if (clips.length === 0) {
        return <p className="text-sm text-muted-foreground">No clips yet</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {clips.map((clip) => (
                <div
                    key={clip.id}
                    className="flex items-center justify-between gap-4 rounded-md border p-3"
                >
                    <div className="flex items-center gap-3">
                        {clip.thumbnail && (
                            <img
                                src={clip.thumbnail}
                                alt="Clip thumbnail"
                                className="h-12 w-20 rounded object-cover"
                            />
                        )}
                        <div className="flex flex-col text-sm">
                            <span className="font-medium">
                                {clip.range[0].toFixed(1)}s -{' '}
                                {clip.range[1].toFixed(1)}s
                            </span>
                            <span className="text-muted-foreground">
                                Duration:{' '}
                                {(clip.range[1] - clip.range[0]).toFixed(1)}s
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(clip)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeClip(clip.id)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export { ClipsLibrary };
