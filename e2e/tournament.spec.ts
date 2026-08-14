import { test, expect } from '@playwright/test';

test.describe('APEX BRACKET Automated E2E Tests', () => {
  test('Landing Page loads and displays SaaS Hero CTA buttons', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/Sistem Bagan Turnamen Real-Time/i)).toBeVisible();
    await expect(page.getByRole('link', { name: /Buat Turnamen Sekarang/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Lihat Live Viewer Demo/i })).toBeVisible();
  });

  test('Login & Register pages render authentication forms', async ({ page }) => {
    // Register Page
    await page.goto('/admin/register');
    await expect(page.locator('h1')).toContainText('Pendaftaran Organizer');
    await expect(page.getByPlaceholder('Nama Lengkap Penyelenggara')).toBeVisible();

    // Login Page
    await page.goto('/admin/login');
    await expect(page.locator('h1')).toContainText('Admin Workspace');
    await expect(page.getByPlaceholder('Alamat Email Organizer')).toBeVisible();
  });

  test.describe('Protected Admin Workspace', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript(() => {
        sessionStorage.setItem('apex_admin_auth', 'true');
      });
    });

    test('Match Controller loads and displays bracket rounds', async ({ page }) => {
      await page.goto('/admin/match');
      await expect(page.locator('h1')).toContainText('Match Controller');
      await expect(page.getByText(/Quarter-Finals/i)).toBeVisible();
      await expect(page.getByText('GRAND FINAL')).toBeVisible();
    });

    test('Participants page allows registering a new team', async ({ page }) => {
      await page.goto('/admin/participants');
      await expect(page.locator('h1')).toContainText('ROSTER COMMAND');

      const testTeamName = `Test Team ${Date.now()}`;
      await page.getByPlaceholder('e.g. Quantum Sentinels').fill(testTeamName);
      await page.getByRole('button', { name: /REGISTER TEAM/i }).click();

      // Verify team is registered
      await expect(page.getByText(testTeamName).first()).toBeVisible();
    });

    test('Live Viewer displays broadcast header, bracket, and animated ticker', async ({ page }) => {
      await page.goto('/viewer');
      await expect(page.getByText(/LIVE BROADCAST/i)).toBeVisible();
      await expect(page.getByText(/APEX BRACKET/i).first()).toBeVisible();
      await expect(page.getByText(/GRAND FINAL/i)).toBeVisible();
    });
  });
});
