import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

// ============================================
// LOGIN PAGE - Page Object Model
// ============================================

export class LoginPage extends BasePage {
  readonly pageTitle: Locator;
  readonly subtitle: Locator;
  readonly googleButton: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole("heading", { name: /LONGO/i });
    this.subtitle = page.getByText(/Inicia sesión para continuar/i);
    this.googleButton = page.getByRole("button", { name: /Continuar con Google/i });
    this.backToHomeLink = page.getByRole("link", { name: /Volver al inicio/i });
  }

  async goto(): Promise<void> {
    await super.goto("/login");
  }

  async verifyPageLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible();
    await expect(this.subtitle).toBeVisible();
  }

  async verifyGoogleButtonVisible(): Promise<void> {
    await expect(this.googleButton).toBeVisible();
  }

  async clickBackToHome(): Promise<void> {
    await this.backToHomeLink.click();
  }

  async verifyRedirectedToHome(): Promise<void> {
    await expect(this.page).toHaveURL("/");
  }
}
