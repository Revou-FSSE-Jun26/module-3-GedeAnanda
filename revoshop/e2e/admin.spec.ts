import { expect, test } from "@playwright/test";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  API_URL,
  apiToken,
  expectPath,
  formatPrice,
  getProducts,
  loginViaUi,
  uniqueId,
} from "./helpers";

test.describe("Admin dashboard", () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, "Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in .env.local");

  test.beforeEach(async ({ page }) => {
    await loginViaUi(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    await expectPath(page, "/dashboard");
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });

  test("creates, edits and deletes a product", async ({ page }) => {
    const name = `E2E Product ${uniqueId()}`;
    const dialog = page.getByRole("dialog");

    // Create
    await page.getByRole("button", { name: "New product" }).click();
    await dialog.getByRole("button", { name: "Create product" }).click();
    await expect(dialog.getByText("Enter a product name.")).toBeVisible();

    await dialog.getByLabel("Product name").fill(name);
    await dialog.getByLabel("Price (IDR)").fill("99000");
    await dialog.getByLabel("Stock").fill("5");
    await dialog.getByLabel("Category").selectOption({ index: 1 });
    await dialog.getByLabel("Description").fill("Created by the Playwright suite.");
    await dialog.getByRole("button", { name: "Create product" }).click();

    await expect(page.getByText(`${name} created`)).toBeVisible();
    const row = page.getByRole("row", { name: new RegExp(name) });
    await expect(row).toContainText(formatPrice(99000));

    // Edit
    const renamed = `${name} v2`;
    await row.getByRole("button", { name: `Edit ${name}` }).click();
    await dialog.getByLabel("Product name").fill(renamed);
    await dialog.getByLabel("Price (IDR)").fill("125000");
    await dialog.getByRole("button", { name: "Save changes" }).click();

    await expect(page.getByText(`${renamed} updated`)).toBeVisible();
    const editedRow = page.getByRole("row", { name: new RegExp(renamed) });
    await expect(editedRow).toContainText(formatPrice(125000));

    // Delete
    await editedRow.getByRole("button", { name: `Delete ${renamed}` }).click();
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(page.getByText(`${renamed} deleted`)).toBeVisible();
    await expect(editedRow).toHaveCount(0);
  });

  test("shows an error when deleting a product that has orders", async ({ page, request }) => {
    const token = await apiToken(request, ADMIN_EMAIL, ADMIN_PASSWORD);
    const headers = { Authorization: `Bearer ${token}` };
    const orders = (await (await request.get(`${API_URL}/orders?per_page=1`, { headers })).json()).data;
    test.skip(orders.length === 0, "No orders in the API yet");

    const order = (await (await request.get(`${API_URL}/orders/${orders[0].id}`, { headers })).json()).data;
    const name: string = order.items[0].product.name;

    await page.getByRole("button", { name: `Delete ${name}` }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(dialog.getByRole("alert")).toHaveText("Cannot delete product with existing orders");
    await dialog.getByRole("button", { name: "Close", exact: true }).last().click();
    await expect(page.getByRole("row", { name: new RegExp(name) })).toBeVisible();
  });

  test("creates, edits and deletes a category", async ({ page, request }) => {
    const existing = (await (await request.get(`${API_URL}/categories`)).json()).data[0].name as string;
    const name = `E2E Category ${uniqueId()}`;
    const dialog = page.getByRole("dialog");

    await page.goto("/dashboard/categories");
    await expect(page.getByRole("heading", { name: "Categories" })).toBeVisible();

    // Validation
    await page.getByRole("button", { name: "New category" }).click();
    await dialog.getByRole("button", { name: "Create category" }).click();
    await expect(dialog.getByText("Enter a category name.")).toBeVisible();

    await dialog.getByLabel("Category name").fill(existing);
    await dialog.getByRole("button", { name: "Create category" }).click();
    await expect(dialog.getByText("Category name already exists. Pick another name.")).toBeVisible();

    // Create
    await dialog.getByLabel("Category name").fill(name);
    await dialog.getByRole("button", { name: "Create category" }).click();
    await expect(page.getByText(`${name} created`)).toBeVisible();
    const row = page.getByRole("row", { name: new RegExp(name) });
    await expect(row).toBeVisible();

    // Edit
    await row.getByRole("button", { name: `Edit ${name}` }).click();
    await dialog.getByLabel("Description").fill("Edited by the Playwright suite.");
    await dialog.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByText(`${name} updated`)).toBeVisible();
    await expect(row).toContainText("Edited by the Playwright suite.");

    // Delete
    await row.getByRole("button", { name: `Delete ${name}` }).click();
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();
    await expect(page.getByText(`${name} deleted`)).toBeVisible();
    await expect(row).toHaveCount(0);
  });

  test("shows an error when deleting a category that has products", async ({ page, request }) => {
    const products = await getProducts(request);
    const categoryId = products.find((product) => product.category_id !== null)?.category_id;
    test.skip(!categoryId, "No product has a category yet");

    const category = (await (await request.get(`${API_URL}/categories/${categoryId}`)).json()).data;

    await page.goto("/dashboard/categories");
    await page.getByRole("button", { name: `Delete ${category.name}` }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: "Delete", exact: true }).click();

    await expect(dialog.getByRole("alert")).toHaveText("Cannot delete category with existing products");
  });

  test("shows a read-only overview of all orders", async ({ page }) => {
    await page.goto("/dashboard/orders");

    await expect(page.getByRole("heading", { name: "Orders" })).toBeVisible();
    await expect(page.getByRole("table")).toBeVisible();
    await expect(page.getByRole("button", { name: /Edit|Delete/ })).toHaveCount(0);
  });
});
