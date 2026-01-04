import video1 from '@/assets/demo_video_1.mp4';
import video2 from '@/assets/demo_video_2.mp4';
import video3 from '@/assets/not_a_video.mp4';
import { RangeSlider } from '@/components/RangeSlider';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoSelector } from '@/components/VideoSelector';
import { Button } from '@/components/ui/button';
import ffmpeg from '@/lib/ffmpeg';
import { parseFileName, urlToFile } from '@/utils/file';
import { fetchFile } from '@ffmpeg/util';
import { useEffect, useState } from 'react';

function App() {
    const [videoUrl, setVideoUrl] = useState('');
    const [range, setRange] = useState<[number, number]>([0, 100]);

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
                <VideoPlayer
                    key={videoUrl}
                    src={videoUrl}
                    autoPlay
                    className="aspect-video"
                />
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

            <RangeSlider
                value={range}
                onValueChange={setRange}
                min={0}
                max={100}
                className="mt-6"
            />
        </div>
    );
}

export default App;
