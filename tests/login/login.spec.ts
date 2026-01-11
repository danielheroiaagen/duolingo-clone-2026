import { test, expect } from "@playwright/test";
import { LoginPage } from "./login-page";
import { HomePage } from "../home/home-page";

// ============================================
// LOGIN PAGE E2E TESTS
// ============================================

test.describe("Login Page", () => {
  test("should load login page successfully",
    { tag: ["@critical", "@e2e", "@login", "@LOGIN-E2E-001"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.verifyPageLoaded();
    }
  );

  test("should display Google OAuth button",
    { tag: ["@critical", "@e2e", "@login", "@LOGIN-E2E-002"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();
      await loginPage.verifyGoogleButtonVisible();
    }
  );

  test("should navigate back to home",
    { tag: ["@high", "@e2e", "@login", "@LOGIN-E2E-003"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);

      await loginPage.goto();
      await loginPage.clickBackToHome();

      await loginPage.verifyRedirectedToHome();
      await homePage.verifyPageLoaded();
    }
  );

  test("should display branding correctly",
    { tag: ["@medium", "@e2e", "@login", "@LOGIN-E2E-004"] },
    async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.goto();

      // Check branding
      await expect(loginPage.pageTitle).toContainText("LONGO");
      await expect(page.getByText("2026")).toBeVisible();
    }
  );

  test("should be responsive on mobile viewport",
    { tag: ["@medium", "@e2e", "@login", "@LOGIN-E2E-005"] },
    async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const loginPage = new LoginPage(page);
      await loginPage.goto();

      // All elements should still be visible
      await loginPage.verifyPageLoaded();
      await loginPage.verifyGoogleButtonVisible();
    }
  );
});
