import { describe, expect, it } from 'vitest';
import { createInterpolation } from '../src/render/Interpolation';

describe('Interpolation', () => {
  it('defaults to bounce w/ easing', () => {
    const i = createInterpolation();
    expect(i.getMode()).toBe('bounce');
    expect(i.getEasing()).toBe(true);
  });

  it('bounce + easing returns 0 at t=0 and t=1, peaks ~1 at t=0.5', () => {
    const i = createInterpolation();
    expect(i.interpolate(0)).toBeCloseTo(0, 5);
    expect(i.interpolate(0.5)).toBeCloseTo(1, 5);
    expect(i.interpolate(1)).toBeCloseTo(0, 5);
  });

  it('bounce w/o easing is linear up then down', () => {
    const i = createInterpolation();
    i.setEasing(false);
    expect(i.interpolate(0)).toBeCloseTo(0, 5);
    expect(i.interpolate(0.25)).toBeCloseTo(0.5, 5);
    expect(i.interpolate(0.5)).toBeCloseTo(1, 5);
    expect(i.interpolate(0.75)).toBeCloseTo(0.5, 5);
  });

  it('single mode w/o easing is identity', () => {
    const i = createInterpolation();
    i.setMode('single');
    i.setEasing(false);
    expect(i.interpolate(0)).toBeCloseTo(0, 5);
    expect(i.interpolate(0.5)).toBeCloseTo(0.5, 5);
    expect(i.interpolate(0.999)).toBeCloseTo(0.999, 3);
  });

  it('single mode w/ easing peaks at t=1', () => {
    const i = createInterpolation();
    i.setMode('single');
    i.setEasing(true);
    expect(i.interpolate(0)).toBeCloseTo(0, 5);
    expect(i.interpolate(1)).toBeCloseTo(1, 5);
  });

  it('lowercases the mode', () => {
    const i = createInterpolation();
    i.setMode('SINGLE');
    expect(i.getMode()).toBe('single');
  });
});
