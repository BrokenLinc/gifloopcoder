import { expect, test } from '@playwright/test';

test.describe('GLC studio app', () => {
  test('loads and renders the default sketch on the canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('glc-canvas')).toBeVisible();
    await page.waitForTimeout(500);

    const isNonEmpty = await page.evaluate(() => {
      const canvas = document.querySelector<HTMLCanvasElement>('[data-testid="glc-canvas"]');
      if (!canvas) return false;
      const ctx = canvas.getContext('2d');
      if (!ctx) return false;
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] !== 0) return true;
      }
      return false;
    });
    expect(isNonEmpty).toBe(true);
  });

  test('Loop -> Pause toggles status', async ({ page }) => {
    await page.goto('/');
    const status = page.getByTestId('status-badge');
    await expect(status).toHaveText('idle');

    await page.getByTestId('tb-loop').click();
    await expect(status).toHaveText('playing');

    await page.getByTestId('tb-loop').click();
    await expect(status).toHaveText('idle');
  });

  test('Ctrl+Enter recompiles edited code', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('glc-canvas')).toBeVisible();

    const editor = page.getByTestId('code-editor').locator('.cm-content');
    await editor.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type(
      'function onGLC(glc){ glc.size(200,200); glc.renderList.addRect({x:100,y:100,w:50,h:50,fillStyle:"#00ff00"}); }',
    );
    const isMac = process.platform === 'darwin';
    await page.keyboard.press(isMac ? 'Meta+Enter' : 'Control+Enter');

    await page.waitForTimeout(300);
    await expect(page.getByTestId('compile-error')).toHaveCount(0);
    const dims = await page.evaluate(() => {
      const c = document.querySelector<HTMLCanvasElement>('[data-testid="glc-canvas"]');
      return c ? { w: c.width, h: c.height } : null;
    });
    expect(dims).toEqual({ w: 200, h: 200 });
  });

  test('Make GIF produces a base64 GIF data URL', async ({ page }) => {
    await page.goto('/');
    page.on('dialog', (d) => d.accept());
    await page.getByTestId('tb-make-gif').click();
    const image = page.getByTestId('output-image');
    await expect(image).toBeVisible({ timeout: 30_000 });
    const src = await image.getAttribute('src');
    expect(src).toMatch(/^data:image\/gif;base64,/);
  });
});
