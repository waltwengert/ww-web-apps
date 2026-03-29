import { expect, test } from '@playwright/test';

test('portfolio loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.getByRole('button', { name: 'Projects' }).click();
    await expect(
        page.getByRole('heading', { name: 'Secret Santa' })
    ).toBeVisible();
});
