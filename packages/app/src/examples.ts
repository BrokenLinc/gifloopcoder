const modules = import.meta.glob('../../../examples/**/*.js', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export interface ExampleSketch {
  folder: string;
  name: string;
  path: string;
  code: string;
}

const PATH_PREFIX = '../../../examples/';

function naturalCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function toExample(rawPath: string, code: string): ExampleSketch {
  const relative = rawPath.startsWith(PATH_PREFIX) ? rawPath.slice(PATH_PREFIX.length) : rawPath;
  const segments = relative.split('/');
  const name = segments.pop() ?? relative;
  const folder = segments.join('/');
  return { folder, name, path: relative, code };
}

export const EXAMPLES: ExampleSketch[] = Object.entries(modules)
  .map(([path, code]) => toExample(path, code))
  .sort((a, b) => {
    if (a.folder !== b.folder) {
      if (a.folder === '') return -1;
      if (b.folder === '') return 1;
      return naturalCompare(a.folder, b.folder);
    }
    return naturalCompare(a.name, b.name);
  });

export interface ExampleGroup {
  folder: string;
  items: ExampleSketch[];
}

export const EXAMPLE_GROUPS: ExampleGroup[] = (() => {
  const map = new Map<string, ExampleSketch[]>();
  for (const example of EXAMPLES) {
    const list = map.get(example.folder) ?? [];
    list.push(example);
    map.set(example.folder, list);
  }
  return Array.from(map.entries()).map(([folder, items]) => ({ folder, items }));
})();
