export const DEFAULT_SKETCH = `// GIF Loop Coder sketch
// Edit and press Ctrl+Enter (or Cmd+Enter) to recompile.

function onGLC(glc) {
  glc.size(400, 400);
  glc.setDuration(2);
  glc.setFPS(30);
  glc.setMode("bounce");
  glc.setEasing(true);

  const list = glc.renderList;

  list.addCircle({
    x: [100, 300],
    y: 200,
    radius: [20, 60],
    fillStyle: ["#ff5050", "#3a86ff"],
  });
}
`;
