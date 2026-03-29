import { expect, test } from '@playwright/test';

test('secret-santa loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/secret santa/i).first()).toBeVisible();

    const nameInput = page.getByPlaceholder('Name');
    await nameInput.fill('alice');
    await page.getByRole('button', { name: 'Add' }).click();
    await nameInput.fill('bob');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Shuffle' }).click();

    await expect(page.getByText('alice')).toHaveCount(2);
    await expect(page.getByText('bob')).toHaveCount(2);
});
