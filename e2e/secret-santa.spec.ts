import { expect, test } from '@playwright/test';

test('secret-santa loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/secret santa/i).first()).toBeVisible();
});
