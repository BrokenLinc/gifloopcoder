import type { ShapeType } from '../../types';

export const Oval: ShapeType = {
  draw(context, t) {
    const x = this.getNumber('x', t, 100);
    const y = this.getNumber('y', t, 100);
    let rx = this.getNumber('rx', t, 50);
    let ry = this.getNumber('ry', t, 50);
    const startAngle = this.getNumber('startAngle', t, 0);
    const endAngle = this.getNumber('endAngle', t, 360);
    const drawFromCenter = this.getBool('drawFromCenter', t, false);

    rx = Math.abs(rx);
    ry = Math.abs(ry);

    context.translate(x, y);
    context.rotate((this.getNumber('rotation', t, 0) * Math.PI) / 180);
    context.save();
    context.scale(rx / 100, ry / 100);
    if (drawFromCenter) {
      context.moveTo(0, 0);
    }
    context.arc(0, 0, 100, (startAngle * Math.PI) / 180, (endAngle * Math.PI) / 180);
    if (drawFromCenter) {
      context.closePath();
    }
    context.restore();

    (this as any).drawFillAndStroke(context, t, true, false);
  },
};
