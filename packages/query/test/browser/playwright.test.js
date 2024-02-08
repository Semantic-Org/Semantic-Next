import { Browser, BrowserContext, chromium, expect, Page } from '@playwright/test';
import { afterAll, beforeAll, describe, test } from 'vitest';

describe('query', () => {

  let page = Page;
  let browser = Browser;
  let context = BrowserContext;

  beforeAll(async () => {
    browser = await chromium.launch();
    let context = await browser.newContext();
    page = await context.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  test('empty', () => {
    expect('to').toBeDefined();
  });

  /*

  test('page loaded', async () => {

    await page.goto('localhost:8000/packages/query/test/fixtures/page');

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
  */

});
