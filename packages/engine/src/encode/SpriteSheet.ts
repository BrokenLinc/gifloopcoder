export interface SpriteSheetApi {
  start(
    fps: number,
    duration: number,
    width: number,
    height: number,
    confirmLarge?: (size: number) => boolean,
  ): void;
  addFrame(frame: HTMLCanvasElement): void;
  complete(): void;
  getDataURL(): string;
  getSpriteSheetSize(): number;
  isEncoding(): boolean;
}

export function createSpriteSheet(): SpriteSheetApi {
  if (typeof document === 'undefined') {
    throw new Error('createSpriteSheet requires a DOM environment');
  }
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  let spriteSheetSize = 0;
  let spriteSheetX = 0;
  let spriteSheetY = 0;
  let frameWidth = 0;
  let frameHeight = 0;
  let encoding = false;

  return {
    addFrame(frame) {
      context.drawImage(frame, spriteSheetX, spriteSheetY);
      spriteSheetX += frameWidth;
      if (spriteSheetX + frameWidth > spriteSheetSize) {
        spriteSheetX = 0;
        spriteSheetY += frameHeight;
      }
    },
    getDataURL: () => canvas.toDataURL(),
    start(fps, duration, width, height, confirmLarge) {
      const numFrames = fps * duration;
      frameWidth = width;
      frameHeight = height;
      let w = frameWidth * numFrames;
      let h = frameHeight;
      let i = 1;
      while (h <= w) {
        i++;
        w = frameWidth * Math.ceil(numFrames / i);
        h = frameHeight * i;
      }
      i--;
      spriteSheetSize = frameWidth * Math.ceil(numFrames / i);

      if (spriteSheetSize > 2048 && confirmLarge) {
        if (!confirmLarge(spriteSheetSize)) {
          return;
        }
      }

      canvas.width = canvas.height = spriteSheetSize;
      context.clearRect(0, 0, spriteSheetSize, spriteSheetSize);
      spriteSheetX = 0;
      spriteSheetY = 0;
      encoding = true;
    },
    complete() {
      encoding = false;
    },
    getSpriteSheetSize: () => spriteSheetSize,
    isEncoding: () => encoding,
  };
}
