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
    }
  );

  test("should display learning unit",
    { tag: ["@high", "@e2e", "@home", "@HOME-E2E-002"] },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();

      await homePage.verifyPageLoaded();
      await homePage.verifyLevelBadgeVisible();
    }
  );

  test("should have bottom navigation",
    { tag: ["@high", "@e2e", "@home", "@HOME-E2E-003"] },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();

      await homePage.verifyNavbarVisible();
      await expect(homePage.profileNavItem).toBeVisible();
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
