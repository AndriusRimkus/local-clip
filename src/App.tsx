import video1 from '@/assets/demo_video_1.mp4';
import video2 from '@/assets/demo_video_2.mp4';
import video3 from '@/assets/not_a_video.mp4';
import { ClipsLibrary } from '@/components/ClipsLibrary';
import { VideoEditor } from '@/components/VideoEditor';
import { VideoSelector } from '@/components/VideoSelector';
import { Button } from '@/components/ui/button';
import ffmpeg from '@/lib/ffmpeg';
import type { Clip } from '@/lib/types';
import { parseFileName, urlToFile } from '@/utils/file';
import { fetchFile } from '@ffmpeg/util';
import { useEffect, useState } from 'react';

function App() {
    const [videoUrl, setVideoUrl] = useState('');
    const [editingClip, setEditingClip] = useState<Clip>();

    async function handleVideoSelect(file: File) {
        setVideoUrl(URL.createObjectURL(file));

        await ffmpeg.load();
        await ffmpeg.get().writeFile(file.name, await fetchFile(file));

        const entries = await ffmpeg.get().listDir('/');
        const filesOnly = entries.filter((entry) => !entry.isDir);

        console.log(
            'Files:',
            filesOnly.map((f) => f.name)
        );
    }

    async function loadDemoVideo(videoPath: string) {
        const file = await urlToFile(videoPath, parseFileName(videoPath));

        await handleVideoSelect(file);
    }

    function handleEditClip(clip: Clip) {
        setEditingClip(clip);
    }

    function handleEditComplete() {
        setEditingClip(undefined);
    }

    useEffect(() => {
        return () => {
            if (videoUrl) {
                URL.revokeObjectURL(videoUrl);
            }
        };
    }, [videoUrl]);

    return (
        <div className="container mx-auto max-w-4xl p-8">
            <h1 className="mb-8 text-2xl font-bold">Video Player</h1>

            {!videoUrl ? (
                <VideoSelector onVideoSelect={handleVideoSelect} />
            ) : (
                <div className="flex flex-col gap-8">
                    <VideoEditor
                        key={editingClip?.id ?? videoUrl}
                        videoUrl={videoUrl}
                        editingClip={editingClip}
                        onEditComplete={handleEditComplete}
                    />

                    <div>
                        <h2 className="mb-4 text-lg font-semibold">Clips</h2>
                        <ClipsLibrary onEdit={handleEditClip} />
                    </div>
                </div>
            )}

            <div className="flex gap-4 justify-center mt-6">
                <Button onClick={() => loadDemoVideo(video1)}>
                    Load Demo Video 1
                </Button>
                <Button onClick={() => loadDemoVideo(video2)}>
                    Load Demo Video 2
                </Button>
                <Button
                    variant={'secondary'}
                    onClick={() => loadDemoVideo(video3)}
                >
                    Load Invalid Video
                </Button>
            </div>
        </div>
    );
}

export default App;
