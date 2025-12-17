import { Upload } from 'lucide-react';
import { useRef, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoSelectorProps {
    onVideoSelect: (file: File) => void;
    className?: string;
}

function VideoSelector({ onVideoSelect, className }: VideoSelectorProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        if (file.type.startsWith('video/')) {
            onVideoSelect(file);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            handleFile(file);
        }
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors',
                className
            )}
        >
            <input
                ref={inputRef}
                type="file"
                accept="video/*"
                onChange={handleInputChange}
                className="hidden"
            />

            <Upload className="size-12 text-muted-foreground" />

            <Button onClick={handleClick} variant="outline">
                Choose File
            </Button>
        </div>
    );
}

export { VideoSelector };
