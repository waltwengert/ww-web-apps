import { expect, test } from '@playwright/test';

test('future-weight loads', async ({ page }) => {
    await page.goto('/');
    await expect(
        page.getByRole('heading', { name: /future weight/i })
    ).toBeVisible();

    await page.getByLabel('Age', { exact: true }).fill('30');
    await page.getByLabel('Height', { exact: true }).fill('175');
    await page.getByLabel('Weight', { exact: true }).fill('75');
    await page.getByRole('button', { name: 'Calculate' }).click();

    await expect(page.getByText('BMR (kcal/day)')).toBeVisible();
    await expect(page.getByText('TDEE (kcal/day)')).toBeVisible();
    await expect(page.getByText('BMI', { exact: true })).toBeVisible();
});
