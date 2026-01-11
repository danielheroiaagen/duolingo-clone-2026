import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "../base-page";

// ============================================
// PROFILE PAGE - Page Object Model
// Note: /login redirects to home when logged in
// ============================================

export class ProfilePage extends BasePage {
  readonly profileNavItem: Locator;
  readonly profileTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.profileNavItem = page.getByText("Perfil");
    this.profileTitle = page.getByText(/Perfil|Profile/i).first();
  }

  async gotoViaNav(): Promise<void> {
    await this.profileNavItem.click();
  }

  async verifyProfileNavVisible(): Promise<void> {
    await expect(this.profileNavItem).toBeVisible();
  }
}
