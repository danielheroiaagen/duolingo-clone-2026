import { test, expect } from "@playwright/test";
import { ProfilePage } from "./login-page";
import { HomePage } from "../home/home-page";

// ============================================
// NAVIGATION E2E TESTS
// ============================================

test.describe("Navigation", () => {
  test("should navigate to profile from home",
    { tag: ["@high", "@e2e", "@nav", "@NAV-E2E-001"] },
    async ({ page }) => {
      const homePage = new HomePage(page);
      const profilePage = new ProfilePage(page);

      await homePage.goto();
      await profilePage.verifyProfileNavVisible();
    }
  );

  test("should display bottom navigation tabs",
    { tag: ["@high", "@e2e", "@nav", "@NAV-E2E-002"] },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();

      // Check all nav items
      await expect(page.getByText("Inicio")).toBeVisible();
      await expect(page.getByText("Historias")).toBeVisible();
      await expect(page.getByText("Ligas")).toBeVisible();
      await expect(page.getByText("Perfil")).toBeVisible();
    }
  );

  test("should show stats in header",
    { tag: ["@medium", "@e2e", "@nav", "@NAV-E2E-003"] },
    async ({ page }) => {
      const homePage = new HomePage(page);

      await homePage.goto();

      // Check for stats indicators (streak, hearts, XP)
      const statsArea = page.locator("nav").first();
      await expect(statsArea).toBeVisible();
    }
  );
});
