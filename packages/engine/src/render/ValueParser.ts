export const ValueParser = {
  getNumber(prop: any, t: number, def?: number): number {
    if (typeof prop === 'number') {
      return prop;
    }
    if (typeof prop === 'function') {
      return prop(t);
    }
    if (prop && prop.length === 2) {
      const start = prop[0];
      const end = prop[1];
      return start + (end - start) * t;
    }
    if (prop && prop.length) {
      return prop[Math.round(t * (prop.length - 1))];
    }
    return def as number;
  },

  getString(prop: any, t: number, def?: string): string {
    if (prop === undefined) {
      return def as string;
    }
    if (typeof prop === 'string') {
      return prop;
    }
    if (typeof prop === 'function') {
      return prop(t);
    }
    if (prop && prop.length) {
      return prop[Math.round(t * (prop.length - 1))];
    }
    return prop;
  },

  getBool(prop: any, t: number, def?: boolean): boolean {
    if (prop === undefined) {
      return def as boolean;
    }
    if (typeof prop === 'function') {
      return prop(t);
    }
    if (prop && prop.length) {
      return prop[Math.round(t * (prop.length - 1))];
    }
    return prop;
  },

  getArray(prop: any, t: number, def?: any[]): any[] {
    if (typeof prop === 'string') {
      return def as any[];
    }
    if (typeof prop === 'function') {
      return prop(t);
    }
    if (prop && prop.length === 2 && prop[0]?.length && prop[1]?.length) {
      const arr0 = prop[0];
      const arr1 = prop[1];
      const len = Math.min(arr0.length, arr1.length);
      const result: number[] = [];
      for (let i = 0; i < len; i++) {
        const v0 = arr0[i];
        const v1 = arr1[i];
        result.push(v0 + (v1 - v0) * t);
      }
      return result;
    }
    if (prop && prop.length > 1) {
      return prop;
    }
    return def as any[];
  },

  getObject(prop: any, t: number, def?: any): any {
    if (prop === undefined) {
      return def;
    }
    if (typeof prop === 'function') {
      return prop(t);
    }
    if (prop && prop.length) {
      return prop[Math.round(t * (prop.length - 1))];
    }
    return prop;
  },

  getPosition(prop: any, t: number, def?: any): any {
    return ValueParser.getObject(prop, t, def);
  },
};
