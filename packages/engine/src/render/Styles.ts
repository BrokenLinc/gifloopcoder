import type { StylesObject } from '../types';

const defaults = {
  backgroundColor: '#ffffff',
  lineWidth: 1,
  strokeStyle: '#000000',
  fillStyle: '#000000',
  lineCap: 'round' as CanvasLineCap,
  lineJoin: 'round' as CanvasLineJoin,
  lineDash: [] as number[],
  miterLimit: 10,
  shadowColor: null as string | null,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowBlur: 0,
  globalAlpha: 1,
  translationX: 0,
  translationY: 0,
  shake: 0,
  blendMode: 'source-over' as GlobalCompositeOperation,
};

export function createStyles(): StylesObject {
  const styles = { ...defaults } as StylesObject;
  styles.reset = function reset() {
    Object.assign(this, defaults);
    this.lineDash = [];
  };
  return styles;
}
