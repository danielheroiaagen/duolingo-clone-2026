import { Page, expect } from "@playwright/test";

// ============================================
// BASE PAGE - Parent class for ALL pages
// ============================================

export class BasePage {
  constructor(protected page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState("networkidle");
    await this.dismissCookieModal();
  }

  /**
   * Dismiss cookie/privacy modal if present
   */
  async dismissCookieModal(): Promise<void> {
    const acceptButton = this.page.getByRole("button", { name: /ACEPTAR TODO/i });
    try {
      await acceptButton.click({ timeout: 3000 });
    } catch {
      // Modal not present, continue
    }
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
  }

  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await expect(this.page).toHaveTitle(expectedTitle);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}
