import type { GLC } from '@glc/engine';
import { describe, expect, it, vi } from 'vitest';
import { runSketch } from './sketchRunner';

function fakeGLC(): GLC {
  return {} as GLC;
}

describe('runSketch', () => {
  it('invokes onGLC when the sketch defines it', () => {
    const fn = vi.fn();
    const glc = fakeGLC();
    (globalThis as any).__capture = fn;
    const result = runSketch(`function onGLC(glc){ globalThis.__capture(glc); }`, glc);
    expect(result.ok).toBe(true);
    expect(fn).toHaveBeenCalledWith(glc);
    delete (globalThis as any).__capture;
  });

  it('reports an error when no onGLC is defined', () => {
    const result = runSketch(`var x = 1;`, fakeGLC());
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/onGLC/);
  });

  it('catches syntax errors gracefully', () => {
    const result = runSketch(`function onGLC(glc) { (((`, fakeGLC());
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/Error/);
  });
});
