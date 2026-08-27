import { test, expect } from '@playwright/test';

test('day/night toggle persists across reload and responds to N key', async ({ page }) => {
  await page.goto('/');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme', 'day');
  await page.getByTestId('day-night').click();
  await expect(html).toHaveAttribute('data-theme', 'night');
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'night');
  await page.keyboard.press('n');
  await expect(html).toHaveAttribute('data-theme', 'day');
});

test('system dark preference is the initial value when nothing is stored', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'night');
  await context.close();
});
