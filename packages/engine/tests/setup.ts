import { vi } from 'vitest';

function createMockContext(): CanvasRenderingContext2D {
  const noop = () => {};
  const ctx: Record<string, unknown> = {
    canvas: null as unknown as HTMLCanvasElement,
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    shadowBlur: 0,
    shadowColor: 'rgba(0,0,0,0)',
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    save: noop,
    restore: noop,
    scale: noop,
    rotate: noop,
    translate: noop,
    transform: noop,
    setTransform: noop,
    resetTransform: noop,
    beginPath: noop,
    closePath: noop,
    moveTo: noop,
    lineTo: noop,
    bezierCurveTo: noop,
    quadraticCurveTo: noop,
    arc: noop,
    arcTo: noop,
    ellipse: noop,
    rect: noop,
    fill: noop,
    stroke: noop,
    clip: noop,
    fillRect: noop,
    strokeRect: noop,
    clearRect: noop,
    fillText: noop,
    strokeText: noop,
    measureText: () => ({ width: 0 }) as TextMetrics,
    drawImage: noop,
    createLinearGradient: () => ({ addColorStop: noop }),
    createRadialGradient: () => ({ addColorStop: noop }),
    createPattern: () => null,
    getImageData: (_x: number, _y: number, w: number, h: number) =>
      ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
        colorSpace: 'srgb',
      }) as ImageData,
    putImageData: noop,
    setLineDash: noop,
    getLineDash: () => [] as number[],
    isPointInPath: () => false,
    isPointInStroke: () => false,
    createImageData: (w: number, h: number) =>
      ({
        data: new Uint8ClampedArray(w * h * 4),
        width: w,
        height: h,
        colorSpace: 'srgb',
      }) as ImageData,
  };
  return ctx as unknown as CanvasRenderingContext2D;
}

HTMLCanvasElement.prototype.getContext = vi.fn(function (this: HTMLCanvasElement, type: string) {
  if (type === '2d') {
    const ctx = createMockContext() as unknown as { canvas: HTMLCanvasElement };
    ctx.canvas = this;
    return ctx as unknown as CanvasRenderingContext2D;
  }
  return null;
}) as unknown as HTMLCanvasElement['getContext'];

HTMLCanvasElement.prototype.toDataURL = function () {
  return 'data:image/png;base64,';
};
