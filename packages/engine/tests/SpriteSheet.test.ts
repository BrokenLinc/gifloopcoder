import { describe, expect, it } from 'vitest';
import { createSpriteSheet } from '../src/encode/SpriteSheet';

describe('SpriteSheet', () => {
  it('starts in a non-encoding state', () => {
    const ss = createSpriteSheet();
    expect(ss.isEncoding()).toBe(false);
    expect(ss.getSpriteSheetSize()).toBe(0);
  });

  it('start() picks a square size for 4 frames @ 100x100', () => {
    const ss = createSpriteSheet();
    ss.start(2, 2, 100, 100);
    expect(ss.isEncoding()).toBe(true);
    expect(ss.getSpriteSheetSize()).toBe(200);
    ss.complete();
    expect(ss.isEncoding()).toBe(false);
  });

  it('confirmLarge cancels a large sheet', () => {
    const ss = createSpriteSheet();
    ss.start(60, 5, 1024, 1024, () => false);
    expect(ss.isEncoding()).toBe(false);
  });
});
