import { GIFEncoder } from './gif/GIFEncoder';

const KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function encode64(input: string): string {
  let output = '';
  let i = 0;
  const l = input.length;
  while (i < l) {
    const chr1 = input.charCodeAt(i++);
    const chr2 = input.charCodeAt(i++);
    const chr3 = input.charCodeAt(i++);
    const enc1 = chr1 >> 2;
    const enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    let enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    let enc4 = chr3 & 63;
    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    }
    output += KEY.charAt(enc1) + KEY.charAt(enc2) + KEY.charAt(enc3) + KEY.charAt(enc4);
  }
  return output;
}

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

export function createEncoder(): EncoderApi {
  let encoding = false;
  let maxColors = 256;
  let fps = 30;
  let quality = 10;
  let dataURL: string | null = null;
  let width = 400;
  let height = 400;
  const gif = new GIFEncoder();

  return {
    start() {
      gif.setSize(width, height);
      gif.setMaxColors(maxColors);
      gif.setRepeat(0);
      gif.setDelay(1000 / fps);
      gif.setQuality(quality);
      gif.start();
      encoding = true;
    },
    addFrame(context) {
      gif.addFrame(context);
    },
    complete() {
      gif.finish();
      const data = gif.stream().getData();
      dataURL = 'data:image/gif;base64,' + encode64(data);
      encoding = false;
    },
    isEncoding: () => encoding,
    getDataURL: () => dataURL,
    setSize(w, h) {
      width = w;
      height = h;
    },
    setMaxColors(m) {
      maxColors = m;
    },
    setFPS(f) {
      fps = f;
    },
    setQuality(q) {
      quality = q;
    },
  };
}
