import { run } from '@playwright/test';

async function runTests() {
  try {
    // Running Playwright tests programmatically
    await run({
      reporter: 'list', // or any other reporter you prefer
      testMatch: '**/*.spec.js',
    });
  } catch (error) {
    console.error('Failed to run tests:', error);
    process.exit(1);
  }
}

await runTests();
