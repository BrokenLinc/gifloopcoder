import { describe, expect, it } from 'vitest';
import { createStyles } from '../src/render/Styles';

describe('Styles', () => {
  it('initializes with sensible defaults', () => {
    const s = createStyles();
    expect(s.backgroundColor).toBe('#ffffff');
    expect(s.lineWidth).toBe(1);
    expect(s.fillStyle).toBe('#000000');
    expect(s.strokeStyle).toBe('#000000');
    expect(s.lineDash).toEqual([]);
  });

  it('reset() restores defaults', () => {
    const s = createStyles();
    s.lineWidth = 99;
    s.backgroundColor = '#000000';
    s.lineDash = [4, 2];
    s.reset();
    expect(s.lineWidth).toBe(1);
    expect(s.backgroundColor).toBe('#ffffff');
    expect(s.lineDash).toEqual([]);
  });
});
