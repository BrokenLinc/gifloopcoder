import type {
  Ctx,
  InterpolationApi,
  ShapeInstance,
  ShapeProps,
  ShapeType,
  StylesObject,
} from '../types';
import { createShapeFactory, type ShapeFactory } from './Shape';
import { ArcSegment } from './shapes/arcSegment';
import { Arrow } from './shapes/arrow';
import { BezierCurve } from './shapes/beziercurve';
import { BezierSegment } from './shapes/beziersegment';
import { Circle } from './shapes/circle';
import { Container } from './shapes/container';
import { Cube } from './shapes/cube';
import { Curve } from './shapes/curve';
import { CurveSegment } from './shapes/curvesegment';
import { Gear } from './shapes/gear';
import { Grid } from './shapes/grid';
import { Heart } from './shapes/heart';
import { Isobox } from './shapes/isobox';
import { Line } from './shapes/line';
import { Oval } from './shapes/oval';
import { Path } from './shapes/path';
import { Poly } from './shapes/poly';
import { Ray } from './shapes/ray';
import { RaySegment } from './shapes/raysegment';
import { Rect } from './shapes/rect';
import { Segment } from './shapes/segment';
import { Spiral } from './shapes/spiral';
import { Star } from './shapes/star';
import { Text } from './shapes/text';

export interface FrameHooks {
  onEnterFrame: ((t: number) => void) | null;
  onExitFrame: ((t: number) => void) | null;
}

export interface RenderListApi {
  list: ShapeInstance[];
  setSize(w: number, h: number): void;
  getCanvas(): HTMLCanvasElement;
  getContext(): Ctx;
  add(item: ShapeInstance): ShapeInstance;
  clear(): void;
  render(t: number): void;
  addArrow(props?: ShapeProps): ShapeInstance;
  addArcSegment(props?: ShapeProps): ShapeInstance;
  addBezierCurve(props?: ShapeProps): ShapeInstance;
  addBezierSegment(props?: ShapeProps): ShapeInstance;
  addCircle(props?: ShapeProps): ShapeInstance;
  addContainer(props?: ShapeProps): ShapeInstance;
  addCube(props?: ShapeProps): ShapeInstance;
  addCurve(props?: ShapeProps): ShapeInstance;
  addCurveSegment(props?: ShapeProps): ShapeInstance;
  addGear(props?: ShapeProps): ShapeInstance;
  addGrid(props?: ShapeProps): ShapeInstance;
  addHeart(props?: ShapeProps): ShapeInstance;
  addIsobox(props?: ShapeProps): ShapeInstance;
  addLine(props?: ShapeProps): ShapeInstance;
  addOval(props?: ShapeProps): ShapeInstance;
  addPath(props?: ShapeProps): ShapeInstance;
  addPoly(props?: ShapeProps): ShapeInstance;
  addRay(props?: ShapeProps): ShapeInstance;
  addRaySegment(props?: ShapeProps): ShapeInstance;
  addRect(props?: ShapeProps): ShapeInstance;
  addSegment(props?: ShapeProps): ShapeInstance;
  addSpiral(props?: ShapeProps): ShapeInstance;
  addStar(props?: ShapeProps): ShapeInstance;
  addText(props?: ShapeProps): ShapeInstance;
}

export interface RenderListInit {
  canvas: HTMLCanvasElement;
  styles: StylesObject;
  interpolation: InterpolationApi;
  hooks: FrameHooks;
  width: number;
  height: number;
}

export function createRenderList(init: RenderListInit): RenderListApi {
  const { canvas, styles, interpolation, hooks } = init;
  const context = canvas.getContext('2d', { willReadFrequently: true }) as Ctx;
  let width = init.width;
  let height = init.height;
  const list: ShapeInstance[] = [];

  const factory: ShapeFactory = createShapeFactory();
  factory.styles = styles;
  factory.interpolation = interpolation;

  let scheduledRender: ReturnType<typeof setTimeout> | null = null;

  function add(item: ShapeInstance): ShapeInstance {
    if (item.props.parent) {
      item.props.parent.add(item);
    } else {
      list.push(item);
    }
    if (scheduledRender !== null) {
      clearTimeout(scheduledRender);
    }
    scheduledRender = setTimeout(() => {
      scheduledRender = null;
      render(0);
    }, 0);
    return item;
  }

  function clear() {
    list.length = 0;
  }

  function setSize(w: number, h: number) {
    width = w;
    height = h;
  }

  function render(t: number) {
    if (styles.backgroundColor === 'transparent') {
      context.clearRect(0, 0, width, height);
    } else {
      context.fillStyle = styles.backgroundColor;
      context.fillRect(0, 0, width, height);
    }
    const interpolatedT = interpolation.interpolate(t);
    if (hooks.onEnterFrame) {
      context.save();
      hooks.onEnterFrame(interpolatedT);
      context.restore();
    }
    for (let i = 0; i < list.length; i++) {
      list[i].render(context, t);
    }
    if (hooks.onExitFrame) {
      context.save();
      hooks.onExitFrame(interpolatedT);
      context.restore();
    }
  }

  function makeAdder(type: ShapeType) {
    return (props?: ShapeProps) => add(factory.create(type, props));
  }

  return {
    list,
    setSize,
    getCanvas: () => canvas,
    getContext: () => context,
    add,
    clear,
    render,
    addArrow: makeAdder(Arrow),
    addArcSegment: makeAdder(ArcSegment),
    addBezierCurve: makeAdder(BezierCurve),
    addBezierSegment: makeAdder(BezierSegment),
    addCircle: makeAdder(Circle),
    addContainer: makeAdder(Container),
    addCube: makeAdder(Cube),
    addCurve: makeAdder(Curve),
    addCurveSegment: makeAdder(CurveSegment),
    addGear: makeAdder(Gear),
    addGrid: makeAdder(Grid),
    addHeart: makeAdder(Heart),
    addIsobox: makeAdder(Isobox),
    addLine: makeAdder(Line),
    addOval: makeAdder(Oval),
    addPath: makeAdder(Path),
    addPoly: makeAdder(Poly),
    addRay: makeAdder(Ray),
    addRaySegment: makeAdder(RaySegment),
    addRect: makeAdder(Rect),
    addSegment: makeAdder(Segment),
    addSpiral: makeAdder(Spiral),
    addStar: makeAdder(Star),
    addText: makeAdder(Text),
  };
}
