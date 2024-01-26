import { chromium, test, expect } from '@playwright/test';

test('has 4 parent divs', async ({ page }) => {

  await page.goto('/packages/query/test/html/page');

  // Locate all elements with class 'parent'
  const parentElements = page.locator('.parent');

  // Get the count of elements
  const count = await parentElements.count();

  // Iterate over all elements and expect them to be visible
  for (let i = 0; i < count; i++) {
    const element = parentElements.nth(i);
    await expect(element).toBeVisible();
  }
});
