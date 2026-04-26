# GIF Loop Coder (GLC)

Code looping animations in JavaScript and export them as GIFs, sprite sheets, or single-frame stills. 

> This is a modern refactor of the brilliant [bit101](https://codeberg.org/bit101)'s original gifloopcoder project, done mostly with Opus 4.7. I've left the Cursor Plan for this refactor in the repo for posterity.

GLC is split into two pieces:

- **`@glc/engine`** — a small, framework-free TypeScript library that owns the
  render list, scheduler, color and value parsers, and GIF encoder. Embed it in
  any web page or React/Vue/Svelte app.
- **`@glc/app`** — a Vite + React 18 + Chakra UI 2 "studio" that wraps the
  engine with a CodeMirror editor, scrubber, and export modals.

Documentation is published as a VitePress site to GitHub Pages.

## Repo layout

```
gifloopcoder/
  package.json            # pnpm workspaces, Volta-pinned toolchain
  pnpm-workspace.yaml
  packages/
    engine/               # @glc/engine (publishable library)
    app/                  # @glc/app (studio, depends on workspace:engine)
  docs/                   # VitePress site → GitHub Pages
  examples/               # legacy onGLC(glc) sketches, still runnable
  .github/workflows/      # CI + docs deploy
```

## Prerequisites

The toolchain is pinned via [Volta](https://volta.sh):

- Node.js `20.18.0`
- pnpm `9.10.0`

Install them once and Volta auto-switches when you `cd` into the repo:

```bash
curl https://get.volta.sh | bash
volta install node@20.18.0 pnpm@9.10.0
```

If you'd rather use `nvm` / `corepack`, the matching version is in `.nvmrc`
and `package.json`'s `packageManager` field.

## Common commands

All scripts run from the repo root:

```bash
pnpm install              # install workspace dependencies
pnpm dev                  # run the studio app (Vite dev server)
pnpm build                # build @glc/engine + @glc/app for production
pnpm test                 # run all Vitest unit tests
pnpm e2e:install          # download Playwright browsers (first time only)
pnpm e2e                  # run Playwright end-to-end specs
pnpm lint                 # ESLint (flat config)
pnpm format               # Prettier write
pnpm format:check         # Prettier check (used in CI)
pnpm typecheck            # tsc --noEmit across all packages
pnpm docs:dev             # run the VitePress docs locally
pnpm docs:build           # build the static docs site
pnpm docs:preview         # preview the built docs
```

Per-package commands work too, e.g. `pnpm --filter @glc/engine test:watch`.

## Using the studio app

`pnpm dev` starts the app on http://localhost:5173. From there you can:

- edit the sketch in the CodeMirror pane (auto-saved to `localStorage`)
- press **Compile** or `Ctrl/Cmd+Enter` to re-evaluate the sketch
- toggle **Loop** / **Pause** with the toolbar or `Ctrl/Cmd+Space`
- generate a **GIF**, **sprite sheet**, or **still PNG** and download from the
  output modal

Sketches use the original `onGLC(glc)` convention, so files in
[`examples/`](examples/) keep working unchanged. Paste the contents of any
example file into the editor and hit Compile.

## Embedding `@glc/engine` in your own app

The engine is published as ESM and ships its own type definitions:

```ts
import { createGLC } from '@glc/engine';

const canvas = document.querySelector<HTMLCanvasElement>('#stage')!;
const glc = createGLC(canvas, { canvasWidth: 480, canvasHeight: 480 });

glc.size(480, 480);
glc.setDuration(2);
glc.setFPS(30);

glc.renderList.addCircle({
  x: [120, 360],
  y: 240,
  radius: [20, 80],
  fillStyle: ['#ff5050', '#3a86ff'],
});

glc.loop();
```

For the full embedding guide (status listeners, GIF encoding, sprite sheets),
see the [Embed docs](docs/embed.md).

## Testing & CI

- **Unit tests** live next to each package (`packages/engine/tests`,
  `packages/app/src/**/*.test.ts`) and run under Vitest with `jsdom`.
- **End-to-end tests** live in `packages/app/e2e/` and run under Playwright
  against the production build via `pnpm preview`.
- GitHub Actions runs lint, typecheck, unit tests, builds, and Playwright on
  every push / PR (`.github/workflows/ci.yml`).
- A separate workflow rebuilds and deploys the VitePress docs to GitHub Pages
  whenever `docs/**` changes (`.github/workflows/deploy-docs.yml`).

## Migration notes (vs. the original 1.x layout)

The 2.0 rewrite intentionally drops a lot of legacy plumbing:

- **No more Pandoc.** The `src/build.sh` shell script and `src/docs/main.css`
  Pandoc header are gone; docs are authored in plain Markdown and rendered by
  VitePress.
- **No more RequireJS or vendored CodeMirror.** AMD `define()` modules became
  ES modules; the editor is `@uiw/react-codemirror` from npm.
- **No more `glclauncher.js` / `glcConfig` globals.** Use `createGLC(canvas)`
  directly instead.
- **No more PNG icons or vendor-prefixed CSS.** Toolbar buttons use
  FontAwesome free icons; Chakra UI handles theming.
- **No more `<script>`-injection sketch loader.** The studio evaluates user code
  through `new Function`, captures the `onGLC` symbol, and invokes it with a
  fresh engine instance.

## License

MIT © Keith Peters. See [LICENSE](LICENSE).
