import type { ShapeType } from '../../types';

export const Circle: ShapeType = {
  draw(context, t) {
    const x = this.getNumber('x', t, 100);
    const y = this.getNumber('y', t, 100);
    let radius = this.getNumber('radius', t, 50);
    const startAngle = this.getNumber('startAngle', t, 0);
    const endAngle = this.getNumber('endAngle', t, 360);
    const drawFromCenter = this.getBool('drawFromCenter', t, false);

    radius = Math.abs(radius);
    context.translate(x, y);
    context.rotate((this.getNumber('rotation', t, 0) * Math.PI) / 180);
    if (drawFromCenter) {
      context.moveTo(0, 0);
    }
    context.arc(0, 0, radius, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
    if (drawFromCenter) {
      context.closePath();
    }

    (this as any).drawFillAndStroke(context, t, true, false);
  },
};
