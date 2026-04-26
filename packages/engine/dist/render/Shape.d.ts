import type { InterpolationApi, ShapeInstance, ShapeProps, ShapeType, StylesObject } from '../types';
export interface ShapeFactory {
    styles: StylesObject | null;
    interpolation: InterpolationApi | null;
    create(type: ShapeType, props?: ShapeProps): ShapeInstance;
}
export declare function createShapeFactory(): ShapeFactory;
//# sourceMappingURL=Shape.d.ts.map