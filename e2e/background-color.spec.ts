import { expect, test, type Page } from '@playwright/test';
import { abortHub } from './helpers';

async function openWithTransparentSource(page: Page) {
  await abortHub(page);
  await page.goto('/?boot=skip');
  const b64 = await page.evaluate(() => {
    const c = document.createElement('canvas');
    c.width = 320;
    c.height = 240;
    const x = c.getContext('2d')!;
    x.fillStyle = '#c05030';
    x.beginPath();
    x.arc(160, 120, 80, 0, 7);
    x.fill();
    return c.toDataURL('image/png').split(',')[1];
  });
  await page.getByTestId('file-input').setInputFiles({ name: 't.png', mimeType: 'image/png', buffer: Buffer.from(b64, 'base64') });
  await page.waitForFunction(() => {
    const c = document.querySelector('[data-testid="canvas-result"]') as HTMLCanvasElement | null;
    return !!c && c.width > 0;
  });
  await page.locator('[data-tab="background"]').click();
}

const cornerPixel = (page: Page) =>
  page.evaluate(() => {
    const c = document.querySelector('[data-testid="canvas-result"]') as HTMLCanvasElement;
    return Array.from(c.getContext('2d')!.getImageData(2, 2, 1, 1).data);
  });

const activeSwatches = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('#bg-swatches button, #custom-swatch')]
      .filter((e) => e.className.includes('ring-accent-bg'))
      .map((e) => (e.id === 'custom-swatch' ? 'custom' : (e.getAttribute('data-color') ?? ''))),
  );

test('custom background colour is always reachable and applies immediately', async ({ page }) => {
  await openWithTransparentSource(page);

  await expect(page.locator('#inp-color')).toBeVisible();
  expect(await cornerPixel(page)).toEqual([0, 0, 0, 0]);

  await page.locator('#inp-color').click();
  await expect.poll(() => cornerPixel(page)).toEqual([139, 92, 246, 255]);
  expect(await activeSwatches(page)).toEqual(['custom']);

  await page.locator('#inp-color').fill('#00ff00');
  await expect.poll(() => cornerPixel(page)).toEqual([0, 255, 0, 255]);
  await expect(page.locator('#custom-swatch')).toHaveCSS('background-color', 'rgb(0, 255, 0)');

  await page.locator('[data-color="#db1436"]').click();
  await expect.poll(() => cornerPixel(page)).toEqual([219, 20, 54, 255]);
  expect(await activeSwatches(page)).toEqual(['#db1436']);

  await page.locator('#inp-color').fill('#0000ff');
  await expect.poll(() => cornerPixel(page)).toEqual([0, 0, 255, 255]);
  expect(await activeSwatches(page)).toEqual(['custom']);

  await page.locator('[data-mode="dim"]').click();
  await expect(page.locator('#inp-color')).toBeVisible();
  expect(await activeSwatches(page)).toEqual([]);

  await page.locator('[data-mode="color"]').click();
  await expect.poll(() => cornerPixel(page)).toEqual([0, 0, 255, 255]);
  expect(await activeSwatches(page)).toEqual(['custom']);

  await page.locator('[data-force-mode="transparent"]').click();
  await expect.poll(() => cornerPixel(page)).toEqual([0, 0, 0, 0]);
  expect(await activeSwatches(page)).toEqual(['#ffffff']);
});
