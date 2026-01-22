const { test, expect } = require('@playwright/test');

test.describe('Registration System Automation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('http://127.0.0.1:5500/index.html');
  });

  test('Flow A & B: Negative to Positive Scenario', async ({ page }) => {

    await page.fill('#firstName', 'John');
    await page.fill('#email', 'john.doe@example.com');
    await page.fill('#phone', '+15551234567');
    await page.check("input[value='male']");
    await page.check('#terms');

    const submitBtn = page.locator('#submitBtn');
    await expect(submitBtn).toBeDisabled();
    await page.focus('#lastName');
    await page.locator('#lastName').evaluate(el => el.blur());

    const lastNameError = page.locator('#err-lastName');
    await expect(lastNameError).toBeVisible();
    await page.fill('#lastName', 'Doe');
    await page.selectOption('#country', 'USA');
    await page.selectOption('#state', 'California');
    await page.selectOption('#city', 'Los Angeles');
    await page.fill('#password', 'Password123');
    await page.fill('#confirmPassword', 'Password123');
    await submitBtn.click({ force: true });
    await expect(page.locator('#firstName')).toBeEmpty();
    await expect(page.locator('#lastName')).toBeEmpty();
    await expect(page.locator('#email')).toBeEmpty();

    await page.screenshot({ path: 'screenshots/success-state.png' });
  });

  test('Flow C: Form Logic Validation', async ({ page }) => {

    const country = page.locator('#country');
    const state = page.locator('#state');
    const city = page.locator('#city');

    await expect(state).toBeDisabled();
    await country.selectOption('USA');
    await expect(state).toBeEnabled();

    await state.selectOption('California');
    await expect(city).toBeEnabled();
    await city.selectOption('Los Angeles');

    const password = page.locator('#password');
    const strengthText = page.locator('.strength-text');

    await password.fill('123');
    await expect(strengthText).toHaveText('Weak');

    await password.fill('abcdef');
    await expect(strengthText).toHaveText('Medium');

    await password.fill('Password123');
    await expect(strengthText).toHaveText('Strong');

    await page.fill('#confirmPassword', 'WrongPass');
    await page.locator('#confirmPassword').evaluate(el => el.blur());

    const mismatchError = page.locator('#err-confirmPassword');
    await expect(mismatchError).toBeVisible();

    const submitBtn = page.locator('#submitBtn');
    await expect(submitBtn).toBeDisabled();
  });

});
