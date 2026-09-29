import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sample = path.join(root, 'docs', 'demo', 'sample-input.jpg');

const chromePattern = /Open Sans|Poppins|--primary|#0f70e6|fonts\.googleapis\.com/i;
const chromeException = /background fill swatch, not product chrome|Checkerboard|Brush cursor/;

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sourceFiles(full));
    else if (/\.(tsx?|css|html)$/.test(entry.name)) out.push(full);
  }
  return out;
}

test('shipped chrome uses Astryx tokens instead of the old palette', async ({ page }) => {
  const files = [path.join(root, 'index.html'), ...sourceFiles(path.join(root, 'src'))];
  const hits: string[] = [];
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((line, index) => {
      if (chromeException.test(line)) return;
      if (chromePattern.test(line)) hits.push(`${path.relative(root, file)}:${index + 1}: ${line.trim()}`);
    });
  }
  expect(hits, hits.join('\n')).toEqual([]);

  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(String(error)));
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (url.includes('fonts.googleapis.com') && /Open\+Sans|Poppins/i.test(url)) fontRequests.push(url);
  });

  await page.goto('/');
  await expect(page.getByRole('button', { name: '上传图片' })).toBeVisible();
  const theme = page.locator('div[data-astryx-theme="neutral"]');
  await expect(theme).toBeVisible();
  const token = await theme.evaluate((el) => getComputedStyle(el).getPropertyValue('--color-accent').trim());
  expect(token.length).toBeGreaterThan(0);

  const upload = page.locator('#btn-upload');
  const style = await upload.evaluate((el) => {
    const computed = getComputedStyle(el);
    return { paddingInline: computed.paddingInline, backgroundColor: computed.backgroundColor };
  });
  expect(style.paddingInline).not.toBe('0px');
  expect(style.backgroundColor).not.toBe('rgb(15, 112, 230)');

  const box = await page.locator('#root').boundingBox();
  expect(box && box.height).toBeGreaterThan(400);
  expect(fontRequests).toEqual([]);
  expect(errors).toEqual([]);

  await page.goto('/?boot=skip');
  await expect(page.getByRole('button', { name: '上传图片' })).toBeVisible();
  const uploadPage = await upload.evaluate((el) => {
    const computed = getComputedStyle(el);
    return { paddingInline: computed.paddingInline, backgroundColor: computed.backgroundColor };
  });
  expect(uploadPage.paddingInline).not.toBe('0px');
  expect(uploadPage.backgroundColor).not.toBe('rgb(15, 112, 230)');

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await upload.evaluate((el) => getComputedStyle(el).paddingInline);
  expect(mobile).not.toBe('0px');
  await page.setViewportSize({ width: 1400, height: 900 });

  await page.route(/huggingface\.co|hf\.co/, (route) => route.abort());
  await page.getByTestId('file-input').setInputFiles(sample);
  await expect(page.getByTestId('btn-download')).toBeVisible();
  await page.getByRole('radio', { name: '背景' }).click();
  await expect(page.getByRole('radio', { name: '纯色' })).toBeVisible();
  await page.getByRole('radio', { name: '抠图' }).click();
  await page.getByTestId('btn-advanced').click();
  await expect(page.getByRole('heading', { name: '高级设置' })).toBeVisible();
  await expect(page.getByRole('button', { name: '载入模型' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('heading', { name: '高级设置' })).toBeHidden();
  expect(errors).toEqual([]);

  const evidence = process.env.ASTRYX_EVIDENCE_DIR;
  if (evidence) {
    fs.mkdirSync(evidence, { recursive: true });
    await page.screenshot({ path: path.join(evidence, 'cutout.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(evidence, 'cutout-mobile.png') });
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto('/?boot=skip');
    await page.screenshot({ path: path.join(evidence, 'home.png') });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(evidence, 'home-mobile.png') });
  }
});
