import { test, expect } from "@playwright/test";
import { HomePage } from "./home-page";

// ============================================
// HOME PAGE E2E TESTS
// ============================================

test.describe("Home Page", () => {
  test("should load homepage successfully",
    { tag: ["@critical", "@e2e", "@home", "@HOME-E2E-001"] },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();
      await homePage.verifyPageLoaded();

      await expect(page).toHaveTitle(/Duolingo 2026/i);
    }
  );

  test("should display main content sections",
    { tag: ["@high", "@e2e", "@home", "@HOME-E2E-002"] },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();

      await homePage.verifyNavbarVisible();
      await homePage.verifySectionTitleVisible();
      await expect(homePage.mainTitle).toBeVisible();
    }
  );

  test("should have working navigation",
    { tag: ["@high", "@e2e", "@home", "@HOME-E2E-003"] },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();

      // Verify navbar is present
      await homePage.verifyNavbarVisible();

      // Check for login link
      const loginLink = page.getByRole("link", { name: /Iniciar|Login/i });
      await expect(loginLink).toBeVisible();
    }
  );

  test("should be responsive on mobile viewport",
    { tag: ["@medium", "@e2e", "@home", "@HOME-E2E-004"] },
    async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const homePage = new HomePage(page);
      await homePage.goto();

      // Main content should still be visible
      await homePage.verifyPageLoaded();
    }
  );
});
