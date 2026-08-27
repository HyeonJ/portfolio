import { test, expect } from '@playwright/test';

test('clicking 작업 on the cover turns to /contents', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation', { name: '차례' }).getByRole('link', { name: /작업/ }).click();
  await expect(page).toHaveURL('/contents');
  await expect(page.locator('html[data-turn]')).toHaveCount(0);
  await expect(page.getByRole('navigation', { name: '차례' }).getByRole('link')).toHaveCount(8);
});

test('arrow keys walk the whole book forward and back', async ({ page }) => {
  await page.goto('/');
  const order = ['/contents', '/about', '/work/hsm-key-integrity', '/work/gift-payment-reconciliation', '/work/closed-network-qr', '/projects', '/resume', '/contact'];
  for (const path of order) {
    await page.keyboard.press('ArrowRight');
    await expect(page).toHaveURL(path);
    await expect(page.locator('html[data-turn]')).toHaveCount(0);
  }
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL('/contact');
  await expect(page.locator('html[data-turn]')).toHaveCount(0);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL('/resume');
});

test('edge buttons exist on desktop and navigate', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/contents');
  await page.getByTestId('edge-next').click();
  await expect(page).toHaveURL('/about');
  await page.getByTestId('edge-prev').click();
  await expect(page).toHaveURL('/contents');
});

test('reduced motion still navigates (fallback path)', async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/');
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL('/contents');
  await context.close();
});
