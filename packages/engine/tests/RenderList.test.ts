import { describe, expect, it } from 'vitest';
import { createInterpolation } from '../src/render/Interpolation';
import { createRenderList } from '../src/render/RenderList';
import { createStyles } from '../src/render/Styles';

function makeList() {
  const canvas = document.createElement('canvas');
  canvas.width = 100;
  canvas.height = 100;
  const styles = createStyles();
  const interpolation = createInterpolation();
  const hooks = { onEnterFrame: null, onExitFrame: null };
  return createRenderList({ canvas, styles, interpolation, hooks, width: 100, height: 100 });
}

describe('RenderList', () => {
  it('starts empty', () => {
    const list = makeList();
    expect(list.list.length).toBe(0);
  });

  it('adds shapes via addCircle', () => {
    const list = makeList();
    const c = list.addCircle({ x: 10, y: 10, radius: 5 });
    expect(list.list.length).toBe(1);
    expect(list.list[0]).toBe(c);
  });

  it('clear() removes all shapes', () => {
    const list = makeList();
    list.addCircle();
    list.addRect();
    list.clear();
    expect(list.list.length).toBe(0);
  });

  it('nests under a parent container', () => {
    const list = makeList();
    const parent = list.addContainer({ x: 50, y: 50 });
    const child = list.addCircle({ parent, radius: 5 });
    expect(list.list.length).toBe(1);
    expect(parent.list.length).toBe(1);
    expect(parent.list[0]).toBe(child);
  });

  it('renders without throwing', () => {
    const list = makeList();
    list.addCircle({ x: 50, y: 50, radius: 10, fillStyle: '#ff0000' });
    expect(() => list.render(0.5)).not.toThrow();
  });
});
