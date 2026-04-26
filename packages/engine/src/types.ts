export type Ctx = CanvasRenderingContext2D;

export type AnimatedValue<T> = T | T[] | ((t: number) => T);

export interface Gradient {
  type: 'linearGradient' | 'radialGradient';
  colorStops: { position: number; color: string }[];
  addColorStop(position: number, color: string): void;
  [k: string]: any;
}

export type ColorValue = string | Gradient | (string | Gradient)[] | ((t: number) => string);

export interface ShapeProps {
  parent?: ShapeInstance;
  speedMult?: number;
  phase?: number;
  [key: string]: any;
}

export interface ShapeInstance {
  props: ShapeProps;
  list: ShapeInstance[];
  draw: (context: Ctx, t: number) => void;
  render: (context: Ctx, t: number) => void;
  add: (item: ShapeInstance) => ShapeInstance;
  clear: () => void;
  getNumber(prop: string, t: number, def?: number): number;
  getString(prop: string, t: number, def?: string): string;
  getBool(prop: string, t: number, def?: boolean): boolean;
  getColor(prop: string, t: number, def?: string): string | CanvasGradient;
  getArray(prop: string, t: number, def?: any[]): any[];
  getObject(prop: string, t: number, def?: any): any;
}

export interface ShapeType {
  draw(this: ShapeInstance, context: Ctx, t: number): void;
}

export type InterpolationMode = 'bounce' | 'single';

export interface StylesObject {
  backgroundColor: string;
  lineWidth: number;
  strokeStyle: string;
  fillStyle: string;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  lineDash: number[];
  miterLimit: number;
  shadowColor: string | null;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowBlur: number;
  globalAlpha: number;
  translationX: number;
  translationY: number;
  shake: number;
  blendMode: GlobalCompositeOperation;
  reset(): void;
}

export interface InterpolationApi {
  interpolate(t: number): number;
  setMode(mode: InterpolationMode | string): void;
  setEasing(easing: boolean): void;
  getMode(): InterpolationMode;
  getEasing(): boolean;
}

export interface SchedulerListener {
  onStart(): void;
  onRender(t: number): void;
  onComplete(): void;
}

export interface GLCOptions {
  canvasWidth?: number;
  canvasHeight?: number;
  duration?: number;
  fps?: number;
  maxColors?: number;
  mode?: InterpolationMode;
  easing?: boolean;
  quality?: number;
}

export interface GLCStatusListener {
  onStart?(): void;
  onComplete?(): void;
  onRender?(t: number): void;
  onGifReady?(dataURL: string, w: number, h: number): void;
  onSpriteSheetReady?(dataURL: string, size: number): void;
}
