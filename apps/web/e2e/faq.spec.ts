import { test, expect } from '@playwright/test';

test.describe('FAQ Section', () => {
  test('renders FAQ section on homepage', async ({ page }) => {
    await page.goto('/');
    const faqSection = page.getByRole('region', { name: /frequently asked questions/i });
    await expect(faqSection).toBeVisible();
  });

  test('displays FAQ heading', async ({ page }) => {
    await page.goto('/');
    const heading = page.getByRole('heading', { name: /frequently asked questions/i });
    await expect(heading).toBeVisible();
  });

  test('accordion items are collapsed by default', async ({ page }) => {
    await page.goto('/');
    const buttons = page.getByRole('button', { name: /question/i });
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      await expect(buttons.nth(i)).toHaveAttribute('aria-expanded', 'false');
    }
  });

  test('expands answer on click', async ({ page }) => {
    await page.goto('/');
    const firstButton = page.getByRole('button', { name: /question/i }).first();
    await firstButton.click();
    
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    const answer = page.getByText(/answer/i).first();
    await expect(answer).toBeVisible();
  });

  test('collapses answer on second click', async ({ page }) => {
    await page.goto('/');
    const firstButton = page.getByRole('button', { name: /question/i }).first();
    
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('allows multiple items to be expanded', async ({ page }) => {
    await page.goto('/');
    const buttons = page.getByRole('button', { name: /question/i });
    
    if ((await buttons.count()) >= 2) {
      await buttons.nth(0).click();
      await buttons.nth(1).click();
      
      await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
      await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'true');
    }
  });

  test('has proper accessibility attributes', async ({ page }) => {
    await page.goto('/');
    const buttons = page.getByRole('button', { name: /question/i });
    const count = await buttons.count();
    
    for (let i = 0; i < count; i++) {
      const button = buttons.nth(i);
      await expect(button).toHaveAttribute('aria-expanded');
      await expect(button).toHaveAttribute('aria-controls');
    }
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    const firstButton = page.getByRole('button', { name: /question/i }).first();
    await firstButton.focus();
    await expect(firstButton).toBeFocused();
    
    await page.keyboard.press('Enter');
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
    
    await page.keyboard.press('Enter');
    await expect(firstButton).toHaveAttribute('aria-expanded', 'false');
  });

  test('is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    const faqSection = page.getByRole('region', { name: /frequently asked questions/i });
    await expect(faqSection).toBeVisible();
    
    const firstButton = page.getByRole('button', { name: /question/i }).first();
    await firstButton.click();
    await expect(firstButton).toHaveAttribute('aria-expanded', 'true');
  });
});
