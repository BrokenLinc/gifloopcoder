import type { ShapeType } from '../../types';

export const ArcSegment: ShapeType = {
  draw(context, t) {
    const x = this.getNumber('x', t, 100);
    const y = this.getNumber('y', t, 100);
    const radius = this.getNumber('radius', t, 50);
    let startAngle = this.getNumber('startAngle', t, 0);
    let endAngle = this.getNumber('endAngle', t, 360);

    if (startAngle > endAngle) {
      [startAngle, endAngle] = [endAngle, startAngle];
    }
    const arc = this.getNumber('arc', t, 20);
    let start = startAngle - 1;
    let end = startAngle + t * (endAngle - startAngle + arc);

    if (end > startAngle + arc) {
      start = end - arc;
    }
    if (end > endAngle) {
      end = endAngle + 1;
    }

    context.translate(x, y);
    context.rotate((this.getNumber('rotation', t, 0) * Math.PI) / 180);
    context.arc(0, 0, radius, (start * Math.PI) / 180, (end * Math.PI) / 180);

    (this as any).drawFillAndStroke(context, t, false, true);
  },
};
