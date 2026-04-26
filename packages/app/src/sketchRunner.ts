import type { GLC } from '@glc/engine';

export interface SketchResult {
  ok: boolean;
  error?: string;
}

export function runSketch(code: string, glc: GLC): SketchResult {
  try {
    const factory = new Function(
      'glc',
      `${code}\nreturn typeof onGLC === 'function' ? onGLC : null;`,
    );
    const onGLC = factory(glc);
    if (typeof onGLC === 'function') {
      onGLC(glc);
    } else {
      return { ok: false, error: 'Sketch did not define an onGLC(glc) function.' };
    }
    return { ok: true };
  } catch (err) {
    const error = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return { ok: false, error };
  }
}
