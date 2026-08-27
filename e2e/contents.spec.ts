import { test, expect } from '@playwright/test';

test('contents page shows intro, expanded toc with 3 sub-chapters, and contact line', async ({ page }) => {
  await page.goto('/contents');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('정 현 인');
  await expect(page.getByText(/Java · Spring 백엔드에서 React 프론트까지/)).toBeVisible();
  const toc = page.getByRole('navigation', { name: '차례' });
  await expect(toc.getByRole('link')).toHaveCount(8);
  await expect(toc.getByRole('link', { name: /HSM 키 관리 시스템/ })).toHaveAttribute('href', '/work/hsm-key-integrity');
  await expect(page.getByRole('link', { name: 'bpx2710@gmail.com' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'github.com/HyeonJ' })).toHaveAttribute('href', 'https://github.com/HyeonJ');
});
