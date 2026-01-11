import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

// ============================================
// HOME PAGE - Page Object Model
// ============================================

export class HomePage extends BasePage {
  readonly sectionTitle: Locator;
  readonly mainTitle: Locator;
  readonly navbar: Locator;
  readonly learningPath: Locator;
  readonly continueButton: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.sectionTitle = page.getByText("Sección 1");
    this.mainTitle = page.getByRole("heading", { name: /Introducción al Futuro/i });
    this.navbar = page.locator("nav");
    this.learningPath = page.locator("section").first();
    this.continueButton = page.getByRole("button", { name: /CONTINUAR/i });
    this.loginButton = page.getByRole("link", { name: /Iniciar/i });
  }

  async goto(): Promise<void> {
    await super.goto("/");
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.mainTitle).toBeVisible();
  }

  async verifyNavbarVisible(): Promise<void> {
    await expect(this.navbar).toBeVisible();
  }

  async verifySectionTitleVisible(): Promise<void> {
    await expect(this.sectionTitle).toBeVisible();
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click();
  }
}
