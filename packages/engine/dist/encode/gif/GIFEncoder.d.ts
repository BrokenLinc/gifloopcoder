import { type ByteSink } from './LZWEncoder';
export declare class ByteArray implements ByteSink {
    bin: number[];
    getData(): string;
    writeByte(val: number): void;
    writeUTFBytes(s: string): void;
    writeBytes(arr: ArrayLike<number>, offset?: number, length?: number): void;
}
export declare class GIFEncoder {
    private width;
    private height;
    private transparent;
    private transIndex;
    private repeat;
    private delay;
    private started;
    private out;
    private image;
    private pixels;
    private indexedPixels;
    private colorDepth;
    private colorTab;
    private usedEntry;
    private palSize;
    private dispose;
    private firstFrame;
    private sizeSet;
    private sample;
    private comment;
    private maxColors;
    setDelay(ms: number): void;
    setDispose(code: number): void;
    setRepeat(iter: number): void;
    setTransparent(c: number | null): void;
    setComment(c: string): void;
    setFrameRate(fps: number): void;
    setQuality(quality: number): void;
    setSize(w: number, h: number): void;
    setMaxColors(colors: number): void;
    start(): boolean;
    addFrame(im: CanvasRenderingContext2D | Uint8ClampedArray, isImageData?: boolean): boolean;
    finish(): boolean;
    stream(): ByteArray;
    private reset;
    private analyzePixels;
    private findClosest;
    private getImagePixels;
    private writeGraphicCtrlExt;
    private writeCommentExt;
    private writeImageDesc;
    private writeLSD;
    private writeNetscapeExt;
    private writePalette;
    private WriteShort;
    private writePixels;
}
//# sourceMappingURL=GIFEncoder.d.ts.map