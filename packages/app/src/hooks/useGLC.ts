import { createGLC, type GLC } from '@glc/engine';
import { useEffect, useRef, useState } from 'react';
import { runSketch, type SketchResult } from '../sketchRunner';
import { useGLCStore } from '../store/glcStore';

export function useGLC(canvasRef: React.RefObject<HTMLCanvasElement>) {
  const [glc, setGlc] = useState<GLC | null>(null);
  const glcRef = useRef<GLC | null>(null);

  const setStatus = useGLCStore((s) => s.setStatus);
  const setOutput = useGLCStore((s) => s.setOutput);
  const setError = useGLCStore((s) => s.setError);
  const syncFromGLC = useGLCStore((s) => s.syncFromGLC);

  useEffect(() => {
    if (!canvasRef.current) return;
    const instance = createGLC(canvasRef.current);
    instance.setStatusListener({
      onStart: () => setStatus('playing'),
      onComplete: () => setStatus('idle'),
      onGifReady: (url, width, height) => {
        setOutput({ url, width, height, type: 'gif' });
      },
      onSpriteSheetReady: (url, size) => {
        setOutput({ url, width: size, height: size, type: 'spritesheet' });
      },
    });
    glcRef.current = instance;
    setGlc(instance);
    syncFromGLC(instance);
    return () => {
      instance.destroy();
      glcRef.current = null;
      setGlc(null);
    };
  }, [canvasRef, setStatus, setOutput, syncFromGLC]);

  function compile(code: string): SketchResult {
    if (!glcRef.current) return { ok: false, error: 'GLC not ready' };
    glcRef.current.stop();
    glcRef.current.reset();
    const result = runSketch(code, glcRef.current);
    setError(result.ok ? null : (result.error ?? null));
    if (result.ok) {
      syncFromGLC(glcRef.current);
      glcRef.current.renderList.render(0);
    }
    return result;
  }

  return { glc, compile };
}
