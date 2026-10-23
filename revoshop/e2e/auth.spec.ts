import { expect, test } from "@playwright/test";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  expectPath,
  loginViaUi,
  newCustomer,
  pathname,
  registerViaApi,
  waitForGuestHeader,
} from "./helpers";

test.describe("Register", () => {
  test("validates every field before sending", async ({ page }) => {
    await page.goto("/register");
    await waitForGuestHeader(page);

    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByText("Enter a username.")).toBeVisible();
    await expect(page.getByText("Enter your email.")).toBeVisible();
    await expect(page.getByText("Create a password.")).toBeVisible();
    await expect(page.getByText("Type your password again.")).toBeVisible();

    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Password", { exact: true }).fill("short");
    await page.getByLabel("Confirm password").fill("different");
    await expect(page.getByText("Enter a valid email, like name@example.com.")).toBeVisible();
    await expect(page.getByText("Use at least 8 characters.")).toBeVisible();
    await expect(page.getByText("Passwords do not match.")).toBeVisible();
    await expectPath(page, "/register");
  });

  test("registers, logs in, keeps the session after refresh, then logs out", async ({ page }) => {
    const user = newCustomer();
    await page.goto("/register");
    await waitForGuestHeader(page);

    await page.getByLabel("Username").fill(user.username);
    await page.getByLabel("Email").fill(user.email);
    await page.getByLabel("Password", { exact: true }).fill(user.password);
    await page.getByLabel("Confirm password").fill(user.password);
    await page.getByRole("button", { name: "Create account" }).click();

    await expectPath(page, "/");
    await expect(page.getByText(`Account created. Welcome, ${user.username}!`)).toBeVisible();
    await expect(page.getByTestId("header-username")).toHaveText(user.username);

    await page.reload();
    await expect(page.getByTestId("header-username")).toHaveText(user.username);

    await page.getByRole("button", { name: user.username }).click();
    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page.getByText("You are logged out.")).toBeVisible();
    await expect(page.getByTestId("header-username")).toHaveCount(0);
  });
});

test.describe("Login", () => {
  test("shows an error message for invalid credentials", async ({ page }) => {
    await loginViaUi(page, "nobody@revoshop.test", "wrong-password");

    await expect(page.getByRole("alert").filter({ hasText: "Invalid email or password" })).toBeVisible();
    await expectPath(page, "/login");
  });

  test("customer is redirected to the home page", async ({ page, request }) => {
    const user = newCustomer();
    await registerViaApi(request, user);

    await loginViaUi(page, user.email, user.password);

    await expectPath(page, "/");
    await expect(page.getByTestId("header-username")).toHaveText(user.username);
  });

  test("admin is redirected to the dashboard", async ({ page }) => {
    test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local");

    await loginViaUi(page, ADMIN_EMAIL, ADMIN_PASSWORD);

    await expectPath(page, "/dashboard");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });
});

test.describe("Route protection", () => {
  test("logged-out visitors are sent to login", async ({ page }) => {
    for (const path of ["/orders", "/checkout", "/dashboard"]) {
      await page.goto(path);
      await expectPath(page, "/login");
      expect(new URL(page.url()).searchParams.get("next")).toBe(path);
    }
  });

  test("customers cannot open admin pages", async ({ page, request }) => {
    const user = newCustomer();
    await registerViaApi(request, user);
    await loginViaUi(page, user.email, user.password);
    await expectPath(page, "/");

    for (const path of ["/dashboard", "/dashboard/orders", "/dashboard/categories"]) {
      await page.goto(path);
      await expect.poll(() => pathname(page)).toBe("/");
    }
  });
});
