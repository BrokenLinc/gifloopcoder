import type { Ctx, InterpolationApi, ShapeInstance, ShapeProps, StylesObject } from '../types';
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
export declare function createRenderList(init: RenderListInit): RenderListApi;
//# sourceMappingURL=RenderList.d.ts.map