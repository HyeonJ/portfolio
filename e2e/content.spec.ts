import { test, expect } from '@playwright/test';

test('case study 02.1 renders full content', async ({ page }) => {
  await page.goto('/work/hsm-key-integrity');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('HSM 키 관리 시스템');
  await expect(page.getByRole('heading', { name: 'Problem' })).toBeVisible();
  await expect(page.getByRole('figure').first()).toBeVisible();
  await expect(page.getByText('준비 중입니다.')).toHaveCount(0);
});

test('about, projects, resume, contact have real content', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByText(/규칙을 먼저 읽고/)).toBeVisible();
  await page.goto('/projects');
  await expect(page.getByRole('link', { name: /chapter-react/ })).toBeVisible();
  await page.goto('/resume');
  await expect(page.getByRole('link', { name: /이력서 PDF 내려받기/ })).toHaveAttribute('href', '/resume-public.pdf');
  await page.goto('/contact');
  await expect(page.getByRole('link', { name: 'bpx2710@gmail.com' })).toBeVisible();
});

test('no page still shows the stub placeholder', async ({ page }) => {
  for (const p of ['/about', '/work/gift-payment-reconciliation', '/work/closed-network-qr', '/projects', '/resume', '/contact']) {
    await page.goto(p);
    await expect(page.getByText('준비 중입니다.')).toHaveCount(0);
  }
});
