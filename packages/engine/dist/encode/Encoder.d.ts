export interface EncoderApi {
    start(): void;
    addFrame(context: CanvasRenderingContext2D): void;
    complete(): void;
    isEncoding(): boolean;
    getDataURL(): string | null;
    setSize(w: number, h: number): void;
    setMaxColors(maxColors: number): void;
    setFPS(fps: number): void;
    setQuality(quality: number): void;
}
export declare function createEncoder(): EncoderApi;
//# sourceMappingURL=Encoder.d.ts.map