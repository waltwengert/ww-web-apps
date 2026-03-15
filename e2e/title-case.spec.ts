import { expect, test } from '@playwright/test';

test('title-case loads', async ({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('heading', { name: 'TitleCase' })
    ).toBeVisible();
});
