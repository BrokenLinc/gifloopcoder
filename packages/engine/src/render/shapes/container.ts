import type { ShapeType } from '../../types';

export const Container: ShapeType = {
  draw(context, t) {
    const x = this.getNumber('x', t, 0);
    const y = this.getNumber('y', t, 0);
    context.translate(x, y);
    context.rotate((this.getNumber('rotation', t, 0) * Math.PI) / 180);
  },
};
