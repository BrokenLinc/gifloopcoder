import type {
  Ctx,
  InterpolationApi,
  ShapeInstance,
  ShapeProps,
  ShapeType,
  StylesObject,
} from '../types';
import { ColorParser } from './ColorParser';
import { ValueParser } from './ValueParser';

export interface ShapeFactory {
  styles: StylesObject | null;
  interpolation: InterpolationApi | null;
  create(type: ShapeType, props?: ShapeProps): ShapeInstance;
}

export function createShapeFactory(): ShapeFactory {
  const proto: any = {
    styles: null,
    interpolation: null,

    create(this: any, type: ShapeType, props?: ShapeProps): ShapeInstance {
      const obj = Object.create(this);
      obj.init(type, props || {});
      return obj;
    },

    init(this: any, type: ShapeType, props: ShapeProps) {
      this.props = props;
      for (const prop in props) {
        const p = (props as any)[prop];
        if (typeof p === 'function') {
          (props as any)[prop] = p.bind(props);
        }
      }
      this.draw = type.draw;
      this.list = [];
    },

    add(this: any, item: ShapeInstance) {
      this.list.push(item);
      return item;
    },

    clear(this: any) {
      this.list.length = 0;
    },

    render(this: any, context: Ctx, t: number) {
      const globalTime = t;
      let local = t;
      local *= this.props.speedMult || 1;
      local += this.props.phase || 0;
      local = this.interpolation.interpolate(local);

      this.startDraw(context, local);
      this.draw(context, local);
      for (let i = 0; i < this.list.length; i++) {
        this.list[i].render(context, globalTime);
      }
      this.endDraw(context);
    },

    startDraw(this: any, context: Ctx, t: number) {
      const styles = this.styles as StylesObject;
      context.save();
      context.lineWidth = this.getNumber('lineWidth', t, styles.lineWidth);
      context.strokeStyle = this.getColor('strokeStyle', t, styles.strokeStyle);
      context.fillStyle = this.getColor('fillStyle', t, styles.fillStyle);
      context.lineCap = this.getString('lineCap', t, styles.lineCap);
      context.lineJoin = this.getString('lineJoin', t, styles.lineJoin);
      context.miterLimit = Number(this.getString('miterLimit', t, String(styles.miterLimit)));
      context.globalAlpha = this.getNumber('globalAlpha', t, styles.globalAlpha);
      context.translate(
        this.getNumber('translationX', t, styles.translationX),
        this.getNumber('translationY', t, styles.translationY),
      );
      context.globalCompositeOperation = this.getString(
        'blendMode',
        t,
        styles.blendMode as string,
      ) as GlobalCompositeOperation;
      const shake = this.getNumber('shake', t, styles.shake);
      context.translate(Math.random() * shake - shake / 2, Math.random() * shake - shake / 2);

      const lineDash = this.getArray('lineDash', t, styles.lineDash);
      if (lineDash) {
        context.setLineDash(lineDash);
      }
      context.beginPath();
    },

    drawFillAndStroke(this: any, context: Ctx, t: number, doFill: boolean, doStroke: boolean) {
      const fill = this.getBool('fill', t, doFill);
      const stroke = this.getBool('stroke', t, doStroke);

      context.save();
      if (fill) {
        this.setShadowParams(context, t);
        context.fill();
      }
      context.restore();
      if (stroke) {
        if (!fill) {
          this.setShadowParams(context, t);
        }
        context.stroke();
      }
    },

    setShadowParams(this: any, context: Ctx, t: number) {
      const styles = this.styles as StylesObject;
      context.shadowColor = this.getColor('shadowColor', t, styles.shadowColor || 'transparent');
      context.shadowOffsetX = this.getNumber('shadowOffsetX', t, styles.shadowOffsetX);
      context.shadowOffsetY = this.getNumber('shadowOffsetY', t, styles.shadowOffsetY);
      context.shadowBlur = this.getNumber('shadowBlur', t, styles.shadowBlur);
    },

    endDraw(this: any, context: Ctx) {
      context.restore();
    },

    getNumber(this: any, prop: string, t: number, def?: number) {
      return ValueParser.getNumber(this.props[prop], t, def);
    },
    getColor(this: any, prop: string, t: number, def?: any) {
      return ColorParser.getColor(this.props[prop], t, def);
    },
    getString(this: any, prop: string, t: number, def?: string) {
      return ValueParser.getString(this.props[prop], t, def);
    },
    getBool(this: any, prop: string, t: number, def?: boolean) {
      return ValueParser.getBool(this.props[prop], t, def);
    },
    getArray(this: any, prop: string, t: number, def?: any[]) {
      return ValueParser.getArray(this.props[prop], t, def);
    },
    getObject(this: any, prop: string, t: number, def?: any) {
      return ValueParser.getObject(this.props[prop], t, def);
    },
    getPosition(this: any, prop: string, t: number, def?: any) {
      return ValueParser.getPosition(this.props[prop], t, def);
    },
  };

  return proto as ShapeFactory;
}
