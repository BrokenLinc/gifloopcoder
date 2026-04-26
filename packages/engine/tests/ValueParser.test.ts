import { describe, expect, it } from 'vitest';
import { ValueParser } from '../src/render/ValueParser';

describe('ValueParser.getNumber', () => {
  it('returns a literal number unchanged', () => {
    expect(ValueParser.getNumber(42, 0.5)).toBe(42);
  });

  it('calls a function with t', () => {
    expect(ValueParser.getNumber((t: number) => t * 100, 0.25)).toBe(25);
  });

  it('lerps a 2-element tween array', () => {
    expect(ValueParser.getNumber([0, 100], 0.5)).toBe(50);
    expect(ValueParser.getNumber([10, 20], 0)).toBe(10);
    expect(ValueParser.getNumber([10, 20], 1)).toBe(20);
  });

  it('snaps onto a key-frame array', () => {
    const arr = [0, 10, 20, 30, 40];
    expect(ValueParser.getNumber(arr, 0)).toBe(0);
    expect(ValueParser.getNumber(arr, 1)).toBe(40);
    expect(ValueParser.getNumber(arr, 0.5)).toBe(20);
  });

  it('returns the default when prop is undefined', () => {
    expect(ValueParser.getNumber(undefined, 0.5, 7)).toBe(7);
  });
});

describe('ValueParser.getString', () => {
  it('returns string literal', () => {
    expect(ValueParser.getString('hello', 0.3)).toBe('hello');
  });
  it('snaps strings with multiple keyframes', () => {
    expect(ValueParser.getString(['a', 'b', 'c'], 0)).toBe('a');
    expect(ValueParser.getString(['a', 'b', 'c'], 1)).toBe('c');
  });
  it('uses default when undefined', () => {
    expect(ValueParser.getString(undefined, 0.5, 'def')).toBe('def');
  });
});

describe('ValueParser.getBool', () => {
  it('returns literal bool', () => {
    expect(ValueParser.getBool(true, 0.5)).toBe(true);
    expect(ValueParser.getBool(false, 0.5)).toBe(false);
  });
  it('returns default when undefined', () => {
    expect(ValueParser.getBool(undefined, 0, true)).toBe(true);
  });
});

describe('ValueParser.getArray', () => {
  it('tweens between two arrays element-wise', () => {
    expect(
      ValueParser.getArray(
        [
          [0, 10],
          [100, 20],
        ],
        0.5,
      ),
    ).toEqual([50, 15]);
  });
  it('returns the default if undefined', () => {
    expect(ValueParser.getArray(undefined, 0, [1, 2])).toEqual([1, 2]);
  });
});
