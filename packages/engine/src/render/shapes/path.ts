import type { ShapeType } from '../../types';

export const Path: ShapeType = {
  draw(context, t) {
    const path = this.getArray('path', t, []) as number[];
    const startPercent = this.getNumber('startPercent', t, 0);
    const endPercent = this.getNumber('endPercent', t, 1);
    const startPoint = Math.floor((path.length / 2) * startPercent);
    const endPoint = Math.floor((path.length / 2) * endPercent);
    let startIndex = startPoint * 2;
    let endIndex = endPoint * 2;

    if (startIndex > endIndex) {
      [startIndex, endIndex] = [endIndex, startIndex];
    }

    context.moveTo(path[startIndex], path[startIndex + 1]);

    for (let i = startIndex + 2; i < endIndex - 1; i += 2) {
      context.lineTo(path[i], path[i + 1]);
    }

    (this as any).drawFillAndStroke(context, t, false, true);
  },
};
