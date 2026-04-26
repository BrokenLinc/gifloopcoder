# Embedding `@glc/engine`

The GLC engine is published as a standalone ESM package, separate from the studio
app. You can drop it into any web page or framework and drive it directly. This
replaces the legacy `glcConfig.externalEditor` + `<script src="path/to/sketch.js">`
flow from earlier versions.

## Install

```bash
pnpm add @glc/engine
# or: npm i @glc/engine
```

## Minimal example

```html
<canvas id="stage" width="400" height="400"></canvas>

<script type="module">
  import { createGLC } from '@glc/engine';

  const canvas = document.getElementById('stage');
  const glc = createGLC(canvas, { canvasWidth: 400, canvasHeight: 400 });

  glc.size(400, 400);
  glc.setDuration(2);
  glc.setFPS(30);
  glc.setMode('bounce');

  glc.renderList.addCircle({
    x: [100, 300],
    y: 200,
    radius: [20, 60],
    fillStyle: ['#ff5050', '#3a86ff'],
  });

  glc.loop();
</script>
```

## API surface

`createGLC(canvas, opts?)` returns a `GLC` instance. The shape mirrors the
in-app `glc` object that older sketches received via `function onGLC(glc) { ... }`,
so existing sketches in [examples/](https://github.com/bit101/gifloopcoder/tree/master/examples)
keep running unchanged:

| Method                    | Description                                       |
| ------------------------- | ------------------------------------------------- |
| `glc.size(w, h)`          | Set canvas size.                                  |
| `glc.setDuration(s)`      | Set loop duration in seconds.                     |
| `glc.setFPS(fps)`         | Set frames per second.                            |
| `glc.setMode(mode)`       | `'bounce'` or `'single'`.                         |
| `glc.setEasing(bool)`     | Toggle sine easing.                               |
| `glc.setMaxColors(n)`     | GIF color quantization cap (≤ 256).               |
| `glc.setQuality(n)`       | NeuQuant quality (1 = best, slower; 10 default).  |
| `glc.loop()`              | Start looping playback.                           |
| `glc.playOnce()`          | Play one cycle, then stop.                        |
| `glc.stop()`              | Stop playback.                                    |
| `glc.toggleLoop()`        | Toggle loop / pause.                              |
| `glc.makeGif()`           | Encode the next playthrough as a GIF.             |
| `glc.makeSpriteSheet()`   | Encode the next playthrough as a sprite sheet.    |
| `glc.captureStill()`      | Return a PNG data URL for the current frame.      |
| `glc.reset()`             | Clear render list and reset settings to defaults. |
| `glc.renderList`          | The shape add/clear API (see [Objects](/objects)).|
| `glc.color`               | Color helpers (`rgb`, `hsv`, gradients, …).       |
| `glc.styles`              | Default style sheet for new shapes.               |
| `glc.onEnterFrame`        | Optional `(t) => void` hook before each frame.    |
| `glc.onExitFrame`         | Optional `(t) => void` hook after each frame.     |
| `glc.setStatusListener()` | Receive `onStart` / `onRender` / `onComplete` / `onGifReady`. |

## Re-using existing sketches

If you have a sketch file that still uses the original convention:

```js
function onGLC(glc) {
  glc.renderList.addCircle({ x: 200, y: 200, radius: [20, 100] });
  glc.loop();
}
```

call it explicitly after creating the engine:

```js
import { createGLC } from '@glc/engine';
import onGLC from './sketches/spinner.js';

const glc = createGLC(document.getElementById('stage'));
onGLC(glc);
```

The studio app uses the same pattern under the hood: it evaluates user code
through `new Function`, captures the `onGLC` symbol, and invokes it with a fresh
`createGLC` instance.
