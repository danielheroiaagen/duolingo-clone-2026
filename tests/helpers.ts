// ============================================
// TEST HELPERS - Shared utilities
// ============================================

/**
 * Generate unique test email
 */
export function generateUniqueEmail(): string {
  return `test.${Date.now()}@example.com`;
}

/**
 * Generate test user data
 */
export function generateTestUser() {
  return {
    name: "Test User",
    email: generateUniqueEmail(),
  };
}

/**
 * Wait for specified milliseconds
 */
export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
