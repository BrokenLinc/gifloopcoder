import { describe, expect, it } from 'vitest';
import { Color } from '../src/render/Color';

describe('Color.rgb / rgba', () => {
  it('formats rgb', () => {
    expect(Color.rgb(255, 128, 64)).toBe('rgba(255,128,64,1)');
  });
  it('formats rgba', () => {
    expect(Color.rgba(10, 20, 30, 0.5)).toBe('rgba(10,20,30,0.5)');
  });
});

describe('Color.gray / num', () => {
  it('makes gray', () => {
    expect(Color.gray(50)).toBe('rgba(50,50,50,1)');
  });
  it('parses 0xff8800 numbers', () => {
    expect(Color.num(0xff8800)).toBe('rgba(255,136,0,1)');
  });
});

describe('Color.hsv', () => {
  it('red at 0', () => {
    expect(Color.hsv(0, 1, 1)).toBe('rgba(255,0,0,1)');
  });
  it('green at 120', () => {
    expect(Color.hsv(120, 1, 1)).toBe('rgba(0,255,0,1)');
  });
  it('blue at 240', () => {
    expect(Color.hsv(240, 1, 1)).toBe('rgba(0,0,255,1)');
  });
});

describe('Color.createLinearGradient', () => {
  it('builds the gradient descriptor', () => {
    const g = Color.createLinearGradient(0, 0, 100, 0);
    g.addColorStop(0, '#000000');
    g.addColorStop(1, '#ffffff');
    expect(g.type).toBe('linearGradient');
    expect(g.colorStops.length).toBe(2);
    expect(g.colorStops[0].color).toBe('#000000');
  });
});
