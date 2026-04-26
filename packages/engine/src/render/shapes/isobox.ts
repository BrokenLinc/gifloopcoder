import type { ShapeType } from '../../types';

export const Isobox: ShapeType = {
  draw(context, t) {
    const x = this.getNumber('x', t, 100);
    const y = this.getNumber('y', t, 100);
    const size = this.getNumber('size', t, 60);
    const h = this.getNumber('h', t, 40);
    const colorLeft = this.getColor('colorLeft', t, '#999999');
    const colorRight = this.getColor('colorRight', t, '#cccccc');
    const colorTop = this.getColor('colorTop', t, '#eeeeee');

    context.translate(x, y);

    if (h >= 0) {
      context.fillStyle = colorTop as string;
      context.beginPath();
      context.moveTo(-size / 2, -h);
      context.lineTo(0, -size / 4 - h);
      context.lineTo(size / 2, -h);
      context.lineTo(size / 2, -1);
      context.lineTo(0, size / 4 - 1);
      context.lineTo(-size / 2, -1);
      context.lineTo(-size / 2, -h);
      (this as any).drawFillAndStroke(context, t, true, false);

      context.fillStyle = colorLeft as string;
      context.beginPath();
      context.moveTo(-size / 2, 0);
      context.lineTo(0, size / 4);
      context.lineTo(0, size / 4 - h);
      context.lineTo(-size / 2, -h);
      context.lineTo(-size / 2, 0);
      (this as any).drawFillAndStroke(context, t, true, false);

      context.fillStyle = colorRight as string;
      context.beginPath();
      context.moveTo(size / 2, 0);
      context.lineTo(0, size / 4);
      context.lineTo(0, size / 4 - h);
      context.lineTo(size / 2, -h);
      context.lineTo(size / 2, 0);
      (this as any).drawFillAndStroke(context, t, true, false);
    } else {
      context.beginPath();
      context.moveTo(-size / 2, 0);
      context.lineTo(0, -size / 4);
      context.lineTo(size / 2, 0);
      context.lineTo(0, size / 4);
      context.lineTo(-size / 2, 0);
      context.clip();

      context.fillStyle = colorRight as string;
      context.beginPath();
      context.moveTo(-size / 2, 0);
      context.lineTo(0, -size / 4);
      context.lineTo(0, -size / 4 - h);
      context.lineTo(-size / 2, -h);
      context.lineTo(-size / 2, 0);
      (this as any).drawFillAndStroke(context, t, true, false);

      context.fillStyle = colorLeft as string;
      context.beginPath();
      context.moveTo(size / 2, 0);
      context.lineTo(0, -size / 4);
      context.lineTo(0, -size / 4 - h);
      context.lineTo(size / 2, -h);
      context.lineTo(size / 2, 0);
      (this as any).drawFillAndStroke(context, t, true, false);

      context.fillStyle = colorTop as string;
      context.beginPath();
      context.moveTo(-size / 2, -h);
      context.lineTo(0, -size / 4 - h);
      context.lineTo(size / 2, -h);
      context.lineTo(0, size / 4 - h);
      context.lineTo(-size / 2, -h);
      (this as any).drawFillAndStroke(context, t, true, false);
    }
  },
};
