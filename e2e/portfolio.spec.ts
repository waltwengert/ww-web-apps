import { expect, test } from '@playwright/test';

test('portfolio loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
