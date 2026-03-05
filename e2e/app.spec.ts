import { test, expect } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page loads and shows hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Astro Coach/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=Sign In")).toBeVisible();
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register");
    await expect(page.locator("text=Create Account")).toBeVisible();
  });

  test("forgot password page loads", async ({ page }) => {
    await page.goto("/forgot-password");
    await expect(page.locator("text=Forgot Password")).toBeVisible();
  });
});

test.describe("Auth flow", () => {
  const email = `test-${Date.now()}@example.com`;
  const password = "TestPassword123!";

  test("can register a new account", async ({ page }) => {
    await page.goto("/register");
    await page.fill('input[name="name"]', "Test User");
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    // Should redirect to onboarding
    await page.waitForURL(/onboarding/, { timeout: 10000 });
    await expect(page.url()).toContain("/onboarding");
  });

  test("can log in with existing account", async ({ page }) => {
    // First register
    await page.goto("/register");
    const loginEmail = `login-${Date.now()}@example.com`;
    await page.fill('input[name="name"]', "Login User");
    await page.fill('input[name="email"]', loginEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/onboarding/, { timeout: 10000 });

    // Log out (clear cookies) then log in
    await page.context().clearCookies();
    await page.goto("/login");
    await page.fill('input[name="email"]', loginEmail);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/onboarding|dashboard/, { timeout: 10000 });
  });

  test("shows error for invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "nonexistent@example.com");
    await page.fill('input[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');
    // Should stay on login page and show error
    await page.waitForTimeout(2000);
    await expect(page.url()).toContain("/login");
  });
});

test.describe("Protected routes redirect", () => {
  test("dashboard redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL(/login/, { timeout: 10000 });
  });

  test("chat redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/chat");
    await page.waitForURL(/login/, { timeout: 10000 });
  });

  test("settings redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/settings");
    await page.waitForURL(/login/, { timeout: 10000 });
  });
});
