import { expect, test } from '@playwright/test';

const modelId = 'Xenova/modnet';

test('boot dialog stays closed when the model weights are already cached', async ({ page }) => {
  await page.goto('/?boot=skip');
  await page.evaluate(async (id) => {
    const cache = await caches.open('transformers-cache');
    await cache.put(
      `https://huggingface.co/${id}/resolve/main/onnx/model.onnx`,
      new Response(new Uint8Array([0]), { headers: { 'content-length': '1' } }),
    );
  }, modelId);
  await page.route(/huggingface\.co|hf\.co/, () => new Promise(() => {}));
  await page.goto('/');
  await page.waitForTimeout(1500);
  await expect(page.getByTestId('boot-dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '上传图片' })).toBeVisible();
});

test('boot dialog opens when the model weights are not cached', async ({ page }) => {
  await page.route(/huggingface\.co|hf\.co/, () => new Promise(() => {}));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '正在下载模型' })).toBeVisible();
  await expect(page.getByText('下载完成后会留在这台设备上。')).toBeVisible();
});
