import { describe, expect, it } from 'vitest';
import { ColorParser } from '../src/render/ColorParser';

describe('ColorParser.getColor', () => {
  it('returns a string literal as-is', () => {
    expect(ColorParser.getColor('#ff0000', 0)).toBe('#ff0000');
  });

  it('returns the default when undefined', () => {
    expect(ColorParser.getColor(undefined, 0, '#000000')).toBe('#000000');
  });

  it('interpolates between two hex colors', () => {
    const c = ColorParser.getColor(['#000000', '#ffffff'], 0.5);
    expect(c).toBe('rgba(128,128,128,1)');
  });

  it('parses rgb()', () => {
    const c = ColorParser.getColor(['rgb(0,0,0)', 'rgb(100,100,100)'], 0);
    expect(c).toBe('rgba(0,0,0,1)');
  });

  it('parses rgba() and lerps alpha', () => {
    const c = ColorParser.getColor(['rgba(0,0,0,0)', 'rgba(0,0,0,1)'], 0.5);
    expect(c).toBe('rgba(0,0,0,0.5)');
  });

  it('expands 3-digit hex', () => {
    const c = ColorParser.getColor(['#fff', '#000'], 0);
    expect(c).toBe('rgba(255,255,255,1)');
  });

  it('uses named colors', () => {
    const c = ColorParser.getColor(['red', 'blue'], 0);
    expect(c).toBe('rgba(255,0,0,1)');
  });
});
