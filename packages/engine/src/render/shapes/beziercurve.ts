import type { ShapeType } from '../../types';

export const BezierCurve: ShapeType = {
  draw(context, t) {
    const x0 = this.getNumber('x0', t, 50);
    const y0 = this.getNumber('y0', t, 10);
    const x1 = this.getNumber('x1', t, 200);
    const y1 = this.getNumber('y1', t, 100);
    const x2 = this.getNumber('x2', t, 0);
    const y2 = this.getNumber('y2', t, 100);
    const x3 = this.getNumber('x3', t, 150);
    const y3 = this.getNumber('y3', t, 10);
    const showPoints = this.getBool('showPoints', t, false);

    context.moveTo(x0, y0);
    context.bezierCurveTo(x1, y1, x2, y2, x3, y3);

    (this as any).drawFillAndStroke(context, t, false, true);

    if (showPoints) {
      context.fillStyle = 'black';
      context.fillRect(x0 - 2, y0 - 2, 4, 4);
      context.fillRect(x1 - 2, y1 - 2, 4, 4);
      context.fillRect(x2 - 2, y2 - 2, 4, 4);
      context.fillRect(x3 - 2, y3 - 2, 4, 4);
    }
  },
};
