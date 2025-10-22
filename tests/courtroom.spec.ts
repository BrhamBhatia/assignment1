import { test, expect } from "@playwright/test";

test("Court Room loads, starts timer, and shows a message", async ({ page, baseURL }) => {
  // fast=1 makes delays super short for testing
  await page.goto(`${baseURL}/court-room?fast=1`);
  await expect(page.getByRole("heading", { name: /Court Room/i })).toBeVisible();

  // set a small timer to ensure UI is interactive
  const timer = page.locator('input[type="number"]');
  await timer.fill("5");
  await page.getByRole("button", { name: /Start/i }).click();

  // a message should appear shortly (fast mode)
  await page.waitForTimeout(1200);
  // any message is rendered inside a <strong> tag per our page code
const count = await page.locator("strong").count();
expect(count).toBeGreaterThan(0);


  // acknowledge the first message if button exists
  const fixBtn = page.getByRole("button", { name: /Fix now/i }).first();
  if (await fixBtn.isVisible()) {
    await fixBtn.click();
  }
});
