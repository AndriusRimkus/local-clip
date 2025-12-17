import video1 from '@/assets/demo_video_1.mp4';
import video2 from '@/assets/demo_video_2.mp4';
import video3 from '@/assets/not_a_video.mp4';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoSelector } from '@/components/VideoSelector';
import { Button } from '@/components/ui/button';
import { parseFileName, urlToFile } from '@/utils/file';
import { useEffect, useState } from 'react';

function App() {
    const [videoUrl, setVideoUrl] = useState('');

    const handleVideoSelect = (file: File) => {
        setVideoUrl(URL.createObjectURL(file));
    };

    const loadDemoVideo = async (videoPath: string) => {
        const file = await urlToFile(videoPath, parseFileName(videoPath));

        handleVideoSelect(file);
    };

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
        </div>
    );
}

export default App;
