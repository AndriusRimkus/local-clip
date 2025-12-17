export async function urlToFile(url: string, filename: string) {
    const response = await fetch(url);
    const blob = await response.blob();

    return new File([blob], filename, { type: blob.type });
}

export function parseFileName(url: string, fallback = 'video.mp4') {
    return url.split('/').pop() || fallback;
}
