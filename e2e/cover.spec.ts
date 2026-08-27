import { test, expect } from '@playwright/test';

test('cover shows name, tagline, 5 chapters, edition and day/night button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('정 현 인');
  await expect(page.getByText('HYEONIN JEONG')).toBeVisible();
  await expect(page.getByText('웹을 짓는 풀스택 개발자')).toBeVisible();
  const toc = page.getByRole('navigation', { name: '차례' });
  await expect(toc.getByRole('link')).toHaveCount(5);
  await expect(toc.getByRole('link', { name: /작업/ })).toHaveAttribute('href', '/contents');
  await expect(page.getByText('v. I')).toBeVisible();
  await expect(page.getByTestId('day-night')).toBeVisible();
});
