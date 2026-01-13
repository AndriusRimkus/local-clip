export function generateThumbnail(
    videoUrl: string,
    time: number,
    width: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.src = videoUrl;
        video.currentTime = time || 0.001;

        video.addEventListener('seeked', () => {
            const canvas = document.createElement('canvas');
            const aspectRatio = video.videoHeight / video.videoWidth;
            canvas.width = width;
            canvas.height = width * aspectRatio;

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob from canvas'));

                        return;
                    }

                    const blobUrl = URL.createObjectURL(blob);
                    video.src = '';

                    resolve(blobUrl);
                },
                'image/jpeg',
                0.8
            );
        });

        video.addEventListener('error', () => {
            reject(new Error('Failed to load video for thumbnail'));
        });
    });
}
