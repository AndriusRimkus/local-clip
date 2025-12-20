import { FFmpeg as FFmpegLib } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';
import ffmpegCoreUrl from '/ffmpeg-core-mt/ffmpeg-core.js?url';
import ffmpegWasmUrl from '/ffmpeg-core-mt/ffmpeg-core.wasm?url';
import ffmpegWorkerUrl from '/ffmpeg-core-mt/ffmpeg-core.worker.js?url';

class FFmpeg {
    private lib: FFmpegLib | null = null;
    private loadPromise: Promise<FFmpegLib> | null = null;

    async load(): Promise<FFmpegLib> {
        if (this.lib) {
            return this.lib;
        }

        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this.init();

        try {
            this.lib = await this.loadPromise;

            return this.lib;
        } catch (error) {
            this.loadPromise = null;

            throw error;
        }
    }

    get(): FFmpegLib {
        if (!this.lib) {
            throw new Error('FFmpeg not loaded. Call load() first.');
        }

        return this.lib;
    }

    async exec(args: string[]): Promise<number> {
        return this.get().exec(args);
    }

    private async init() {
        const ffmpeg = new FFmpegLib();

        await ffmpeg.load({
            coreURL: await toBlobURL(ffmpegCoreUrl, 'text/javascript'),
            wasmURL: await toBlobURL(ffmpegWasmUrl, 'application/wasm'),
            workerURL: await toBlobURL(ffmpegWorkerUrl, 'text/javascript'),
        });

        return ffmpeg;
    }
}

export default new FFmpeg();
