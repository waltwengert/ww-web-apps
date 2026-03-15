import { expect, test } from '@playwright/test';

test('future-weight loads', async ({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('heading', { name: /future weight/i })
    ).toBeVisible();
});
