export interface SpriteSheetApi {
    start(fps: number, duration: number, width: number, height: number, confirmLarge?: (size: number) => boolean): void;
    addFrame(frame: HTMLCanvasElement): void;
    complete(): void;
    getDataURL(): string;
    getSpriteSheetSize(): number;
    isEncoding(): boolean;
}
export declare function createSpriteSheet(): SpriteSheetApi;
//# sourceMappingURL=SpriteSheet.d.ts.map