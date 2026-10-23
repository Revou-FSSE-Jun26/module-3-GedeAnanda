import { expect, test } from "@playwright/test";
import {
  cancelPendingOrders,
  expectPath,
  formatPrice,
  getProducts,
  loginViaUi,
  newCustomer,
  registerViaApi,
  waitForGuestHeader,
} from "./helpers";

let customer: ReturnType<typeof newCustomer> | null = null;

// Runs even after a failure
test.afterEach(async ({ request }) => {
  if (!customer) return;
  await cancelPendingOrders(request, customer.email, customer.password);
  customer = null;
});

test("header search filters while typing from any page", async ({ page }) => {
  await page.goto("/");
  await waitForGuestHeader(page);

  await page.getByLabel("Search products").pressSequentially("mouse", { delay: 50 });

  await expect(page).toHaveURL(/\/products\?search=mouse$/);
  await expect(page.getByRole("heading", { name: 'Results for "mouse"' })).toBeVisible();
  await expect(page.getByLabel("Search products")).toHaveValue("mouse");
});

test("empty cart shows an empty state and a disabled checkout button", async ({ page }) => {
  await page.goto("/cart");

  await expect(page.getByText("Your cart is empty")).toBeVisible();
  await expect(page.getByRole("button", { name: "Proceed to checkout" })).toBeDisabled();
});

test("browse products, add to cart, check out, and see the order", async ({ page, request }) => {
  // Most stock
  const products = await getProducts(request);
  const product = products.filter((item) => item.is_active && item.stock >= 2).sort((a, b) => b.stock - a.stock)[0];
  expect(product, "needs an active product with stock").toBeTruthy();

  const user = newCustomer();
  await registerViaApi(request, user);
  customer = user;
  await loginViaUi(page, user.email, user.password);
  await expectPath(page, "/");

  // Product list
  await page.goto("/products");
  const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: product.name, exact: true }) });
  await card.getByRole("button", { name: "Increase quantity" }).click();
  await card.getByRole("button", { name: `Add 2 ${product.name} to cart` }).click();
  await expect(page.getByText(`${product.name} × 2 added to cart`)).toBeVisible();

  // Cart
  await page.getByRole("link", { name: "Cart, 2 items" }).click();
  await expectPath(page, "/cart");
  const row = page.getByRole("row", { name: new RegExp(product.name) });
  await expect(row.getByRole("group", { name: `Quantity of ${product.name}` })).toContainText("2");
  await expect(page.getByTestId("cart-total")).toHaveText(formatPrice(product.price * 2));

  await page.reload();
  await expect(row).toBeVisible();

  // Checkout
  await page.getByRole("button", { name: "Proceed to checkout" }).click();
  await expectPath(page, "/checkout");
  await page.getByRole("button", { name: "Confirm order" }).click();

  await expectPath(page, "/orders");
  const toast = page.getByText(/^Order #\d+ confirmed$/);
  await expect(toast).toBeVisible();
  const orderId = (await toast.innerText()).match(/\d+/)![0];
  await expect(page.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();

  const orderLink = page.getByRole("link", { name: new RegExp(`Order #${orderId}\\b`) });
  await expect(orderLink).toBeVisible();
  await orderLink.click();
  await expect(page.getByRole("heading", { name: `Order #${orderId}` })).toBeVisible();
  await expect(page.getByRole("link", { name: product.name })).toBeVisible();
});
