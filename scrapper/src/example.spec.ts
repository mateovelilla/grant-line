import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  test.setTimeout(120000);
  await page.goto('https://onepiece.fandom.com/wiki/List_of_Canon_Characters');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/List of Canon Characters/);
});

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
