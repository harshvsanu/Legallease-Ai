import { test, expect } from '@playwright/test';

test.describe('LegalEase AI End-to-End Workflow', () => {
  test('loads landing page, verifies disclaimer, and explores sample lease', async ({ page }) => {
    await page.goto('/');

    // Check page title and legal disclaimer banner
    await expect(page).toHaveTitle(/LegalEase AI/i);
    await expect(page.locator('text=Informational Legal Assistance Only')).toBeVisible();

    // Click "Try Sample Lease Agreement"
    await page.click('text=Try Sample Lease Agreement');

    // Should navigate to Document Workspace
    await expect(page.locator('text=Residential Lease Agreement')).toBeVisible();
    await expect(page.locator('text=Risk Radar')).toBeVisible();

    // Verify Risk findings are displayed
    await expect(page.locator('text=Contract Exposure Radar')).toBeVisible();
    await expect(page.locator('text=Automatic Renewal / Evergreen Trap')).toBeVisible();

    // Switch to Checklist Tab
    await page.click('text=Checklist');
    await expect(page.locator('text=Pre-Signing Readiness')).toBeVisible();

    // Switch to Q&A Chat Tab and send an inquiry
    await page.click('text=Q&A Chat');
    await expect(page.locator('text=Grounded Citations')).toBeVisible();

    // Switch to Privacy Center
    await page.click('text=Privacy Center');
    await expect(page.locator('text=100% On-Device Privacy Architecture')).toBeVisible();
    await expect(page.locator('text=WebGPU Diagnostics')).toBeVisible();
  });
});
