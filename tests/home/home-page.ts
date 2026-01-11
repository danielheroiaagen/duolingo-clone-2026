import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

// ============================================
// HOME PAGE - Page Object Model
// ============================================

export class HomePage extends BasePage {
  readonly unitTitle: Locator;
  readonly levelBadge: Locator;
  readonly startButton: Locator;
  readonly bottomNav: Locator;
  readonly homeNavItem: Locator;
  readonly profileNavItem: Locator;

  constructor(page: Page) {
    super(page);
    this.unitTitle = page.getByText(/Unidad \d+/i).first();
    this.levelBadge = page.getByText(/NIVEL \d+/i);
    this.startButton = page.getByText(/¡Empieza!/i);
    this.bottomNav = page.locator("nav").last();
    this.homeNavItem = page.getByText("Inicio");
    this.profileNavItem = page.getByText("Perfil");
  }

  async goto(): Promise<void> {
    await super.goto("/");
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.unitTitle).toBeVisible();
  }

  async verifyNavbarVisible(): Promise<void> {
    await expect(this.homeNavItem).toBeVisible();
  }

  async verifyLevelBadgeVisible(): Promise<void> {
    await expect(this.levelBadge).toBeVisible();
  }

  async clickProfile(): Promise<void> {
    await this.profileNavItem.click();
  }
}
