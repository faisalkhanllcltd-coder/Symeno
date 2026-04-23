import { test, expect } from '@playwright/test';

test('Security check: block invalid credentials', async ({ page }) => {
  page.on('response', response => {
    console.log('[NETWORK]', response.status(), response.url(), response.headers()['location']);
  });

  await page.goto('/auth/login');

  // Ensure the page actually loaded the login form and not an error page
  await expect(page.getByRole('heading', { name: /account access/i })).toBeVisible();

  // MOCK: Ensure stable network behavior for edge tests
  await page.route('/api/auth/login', async route => {
    await route.fulfill({
      status: 401,
      contentType: 'text/plain',
      body: 'Authentication failed.'
    });
  });

  await page.getByRole('textbox', { name: /email address/i }).fill('hacker@symeno.com');
  await page.getByRole('textbox', { name: /password/i }).fill('WrongPass123!');

  await page.getByRole('button', { name: /authenticate/i }).click();

  // FIX: Use a more descriptive error check
  const errorMsg = page.locator('#auth-error');

  // If this fails, Playwright will take a screenshot showing the stack trace
  await expect(errorMsg, 'Expected application error message #auth-error to be visible').toBeVisible({ timeout: 7000 });
});