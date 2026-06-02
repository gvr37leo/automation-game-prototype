import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:8000');
  await expect(page).toHaveTitle(/Document/);
});
