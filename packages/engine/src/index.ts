import { createScheduler, type SchedulerApi } from './core/Scheduler';
import { createEncoder, type EncoderApi } from './encode/Encoder';
import { createSpriteSheet, type SpriteSheetApi } from './encode/SpriteSheet';
import { Color, type ColorApi } from './render/Color';
import { createInterpolation } from './render/Interpolation';
import { createRenderList, type RenderListApi } from './render/RenderList';
import { createStyles } from './render/Styles';
import type { GLCOptions, GLCStatusListener, InterpolationMode, StylesObject } from './types';

export type {
  GLCOptions,
  GLCStatusListener,
  InterpolationApi,
  InterpolationMode,
  ShapeInstance,
  ShapeProps,
  ShapeType,
  StylesObject,
} from './types';

export { Color } from './render/Color';

export interface GLC {
  readonly canvas: HTMLCanvasElement;
  readonly context: CanvasRenderingContext2D;
  readonly color: ColorApi;
  readonly styles: StylesObject;
  readonly renderList: RenderListApi;
  readonly scheduler: SchedulerApi;
  readonly encoder: EncoderApi;
  readonly spriteSheet: SpriteSheetApi;
  w: number;
  h: number;
  onEnterFrame: ((t: number) => void) | null;
  onExitFrame: ((t: number) => void) | null;

  loop(): void;
  playOnce(): void;
  stop(): void;
  toggleLoop(): void;
  size(w: number, h: number): void;
  reset(): void;
  setDuration(value: number): void;
  setFPS(value: number): void;
  setMaxColors(value: number): void;
  setMode(mode: InterpolationMode | string): void;
  setEasing(value: boolean): void;
  setQuality(value: number): void;
  makeGif(): void;
  makeSpriteSheet(confirmLarge?: (size: number) => boolean): void;
  captureStill(): string;
  setStatusListener(listener: GLCStatusListener | null): void;
  destroy(): void;
}

const DEFAULTS: Required<GLCOptions> = {
  canvasWidth: 400,
  canvasHeight: 400,
  duration: 2,
  fps: 30,
  maxColors: 256,
  mode: 'bounce',
  easing: true,
  quality: 10,
};

export function createGLC(canvas: HTMLCanvasElement, opts: GLCOptions = {}): GLC {
  const config = { ...DEFAULTS, ...opts };
  const styles = createStyles();
  const interpolation = createInterpolation();
  interpolation.setMode(config.mode);
  interpolation.setEasing(config.easing);

  const hooks = {
    onEnterFrame: null as ((t: number) => void) | null,
    onExitFrame: null as ((t: number) => void) | null,
  };
  const renderList = createRenderList({
    canvas,
    styles,
    interpolation,
    hooks,
    width: config.canvasWidth,
    height: config.canvasHeight,
  });

  const encoder = createEncoder();
  const spriteSheet = createSpriteSheet();
  encoder.setSize(config.canvasWidth, config.canvasHeight);
  encoder.setMaxColors(config.maxColors);
  encoder.setFPS(config.fps);
  encoder.setQuality(config.quality);

  let statusListener: GLCStatusListener | null = null;

  const scheduler = createScheduler({
    onStart() {
      statusListener?.onStart?.();
    },
    onRender(t: number) {
      statusListener?.onRender?.(t);
      renderList.render(t);
      if (encoder.isEncoding()) {
        encoder.addFrame(renderList.getContext());
      } else if (spriteSheet.isEncoding()) {
        spriteSheet.addFrame(renderList.getCanvas());
      }
    },
    onComplete() {
      statusListener?.onComplete?.();
      if (encoder.isEncoding()) {
        encoder.complete();
        const url = encoder.getDataURL();
        if (url) statusListener?.onGifReady?.(url, glc.w, glc.h);
      } else if (spriteSheet.isEncoding()) {
        spriteSheet.complete();
        const url = spriteSheet.getDataURL();
        statusListener?.onSpriteSheetReady?.(url, spriteSheet.getSpriteSheetSize());
      }
    },
  });
  scheduler.setDuration(config.duration);
  scheduler.setFPS(config.fps);

  function size(w: number, h: number) {
    canvas.width = w;
    canvas.height = h;
    renderList.setSize(w, h);
    encoder.setSize(w, h);
    glc.w = w;
    glc.h = h;
  }

  const glc: GLC = {
    canvas,
    context: renderList.getContext(),
    color: Color,
    styles,
    renderList,
    scheduler,
    encoder,
    spriteSheet,
    w: config.canvasWidth,
    h: config.canvasHeight,
    onEnterFrame: null,
    onExitFrame: null,
    loop: () => scheduler.loop(),
    playOnce: () => scheduler.playOnce(),
    stop: () => scheduler.stop(),
    toggleLoop() {
      if (scheduler.isRunning()) {
        scheduler.stop();
      } else {
        scheduler.loop();
      }
    },
    size,
    reset() {
      renderList.clear();
      this.setDuration(DEFAULTS.duration);
      this.setFPS(DEFAULTS.fps);
      this.setMaxColors(DEFAULTS.maxColors);
      this.setMode(DEFAULTS.mode);
      this.setEasing(DEFAULTS.easing);
      this.size(config.canvasWidth, config.canvasHeight);
      styles.reset();
      this.onEnterFrame = null;
      this.onExitFrame = null;
      hooks.onEnterFrame = null;
      hooks.onExitFrame = null;
    },
    setDuration: (v) => scheduler.setDuration(v),
    setFPS(v) {
      scheduler.setFPS(v);
      encoder.setFPS(v);
    },
    setMaxColors: (v) => encoder.setMaxColors(v),
    setMode: (mode) => interpolation.setMode(mode),
    setEasing: (v) => interpolation.setEasing(v),
    setQuality: (v) => encoder.setQuality(v),
    makeGif() {
      encoder.start();
      scheduler.playOnce();
    },
    makeSpriteSheet(confirmLarge) {
      spriteSheet.start(scheduler.getFPS(), scheduler.getDuration(), this.w, this.h, confirmLarge);
      if (spriteSheet.isEncoding()) {
        scheduler.playOnce();
      }
    },
    captureStill() {
      scheduler.stop();
      return canvas.toDataURL();
    },
    setStatusListener(listener) {
      statusListener = listener;
    },
    destroy() {
      scheduler.stop();
      statusListener = null;
    },
  };

  // Sync hook bridge so user can assign onEnterFrame/onExitFrame on the glc obj.
  Object.defineProperty(glc, 'onEnterFrame', {
    get: () => hooks.onEnterFrame,
    set: (v: ((t: number) => void) | null) => {
      hooks.onEnterFrame = v;
    },
    enumerable: true,
  });
  Object.defineProperty(glc, 'onExitFrame', {
    get: () => hooks.onExitFrame,
    set: (v: ((t: number) => void) | null) => {
      hooks.onExitFrame = v;
    },
    enumerable: true,
  });

  size(config.canvasWidth, config.canvasHeight);

  return glc;
}
