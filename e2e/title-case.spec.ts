import { expect, test } from '@playwright/test';

test('title-case loads', async ({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('heading', { name: 'TitleCase' })
    ).toBeVisible();

    await page.getByLabel('Input text').fill('hello world from test');
    await expect(page.getByLabel('Output text')).toHaveValue(
        'Hello World From Test'
    );
});
