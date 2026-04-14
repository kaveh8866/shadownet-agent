import { test, expect } from "@playwright/test";

test("/dashboard/global renders", async ({ page }) => {
  await page.goto("/dashboard/global");
  await expect(page.getByRole("heading", { name: /Live Dashboard/i })).toBeVisible();
  await expect(page.getByText("Network Map")).toBeVisible();
  await expect(page.getByText("Privacy mode")).toBeVisible();
});

test("/dashboard/protocols renders", async ({ page }) => {
  await page.goto("/dashboard/protocols");
  await expect(page.getByRole("heading", { name: /Live Dashboard/i })).toBeVisible();
  await expect(page.getByText("Protocol Health", { exact: true })).toBeVisible();
  await expect(page.getByText("Release Health", { exact: true })).toBeVisible();
});
