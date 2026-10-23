# RevoShop: Checkpoint 3

RevoShop is an online store built with Next.js (App Router), TypeScript and Tailwind CSS. It runs on
the Flask API from Module 2: shoppers browse the catalog, register, log in, fill a cart and place
orders, while admins manage products and categories and see every order from a dashboard. The app is
covered by a Playwright end-to-end suite.

- **API:** https://module-2-gede-ananda.vercel.app
- **Backend repo:** https://github.com/Revou-FSSE-Jun26/module-2-GedeAnanda

## Repository

```
.
├── revoshop/               Next.js app (this README)
├── screenshots/revoshop/   Screenshots used below
├── html-css/               Checkpoint 1
├── javascript/             Checkpoint 1
└── typescript-tailwind/    Checkpoint 1
```

Checkpoint 1 is documented in [CHECKPOINT-1.md](CHECKPOINT-1.md).

## Features

### Everyone
- Home page with category banners, category tiles and the newest products
- Product listing with live search, category filter, sort, and an "in stock only" toggle
- Product detail page with stock status, related products and a dynamic page title
- Category listing
- Cart that works before logging in and survives a page refresh

### Customers
- **Register** (`/register`): username, email, password and confirmation, each validated. A successful
  registration logs the user in and redirects home.
- **Log in** (`/login`): customers go to `/`, admins go to `/dashboard`. Wrong credentials show an
  error message on the form.
- Header shows the logged-in username, also after a refresh, with a menu for orders and logging out.
- **Cart** (`/cart`): a table with product, price, quantity, subtotal and a remove button per row,
  plus the order total. An empty cart shows an empty state and a disabled checkout button.
- **Checkout** (`/checkout`): review the items and confirm. The order is sent with `POST /orders`,
  the cart is cleared, and the browser goes to `/orders`.
- **Orders** (`/orders`, `/orders/[id]`): the customer's own orders with a status filter, and a detail
  page with every line item.

### Admins
- **Products** (`/dashboard`): table of every product, `CreateProductForm` and `EditProductForm` in a
  dialog, and delete with a confirmation. Deleting a product that is in an order shows the API error
  in the dialog: *Cannot delete product with existing orders*.
- **Categories** (`/dashboard/categories`): the same create, edit and delete flow with
  `CreateCategoryForm` and `EditCategoryForm`. Deleting a category that still has products shows
  *Cannot delete category with existing products*.
- **Orders** (`/dashboard/orders`): read-only overview of orders from every customer.

### Across the app
- Toast notifications (react-hot-toast) for every success and error in cart actions, checkout,
  login, registration and dashboard CRUD
- Protected pages: logged-out visitors are sent to `/login?next=…`; customers who open a dashboard
  page are sent to `/`
- Loading skeletons, friendly error screens with **Try again**, and layouts that work on phones
  (bottom tab bar, fixed buy bar on product pages, tables that scroll sideways)

## Technologies

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4, Plus Jakarta Sans via `next/font`, Phosphor Icons |
| Notifications | react-hot-toast |
| Navigation | `next/navigation`: `useRouter`, `usePathname`, `useSearchParams`, `router.refresh()` |
| Session and cart | `localStorage`, read with `useSyncExternalStore` |
| API | Flask REST API at `NEXT_PUBLIC_API_BASE_URL`, JWT access and refresh tokens |
| Testing | Playwright (`@playwright/test`) |

## Routes

| Route | Who can open it | API calls |
|---|---|---|
| `/` | Everyone | `GET /products`, `GET /categories` |
| `/products` | Everyone | `GET /products?search=&category_id=`, `GET /categories` |
| `/products/[id]` | Everyone | `GET /products/:id`, `GET /categories/:id` |
| `/categories` | Everyone | `GET /categories`, `GET /products` |
| `/register` | Logged out | `POST /auth/register`, then `POST /auth/login` |
| `/login` | Logged out | `POST /auth/login` |
| `/cart` | Everyone | None (cart lives in `localStorage`) |
| `/checkout` | Logged in | `POST /orders` |
| `/orders` | Logged in | `GET /orders` |
| `/orders/[id]` | Logged in | `GET /orders/:id` |
| `/dashboard` | Admin | `GET /products`, `POST`, `PUT`, `DELETE /products/:id` |
| `/dashboard/categories` | Admin | `GET /categories`, `POST`, `PUT`, `DELETE /categories/:id` |
| `/dashboard/orders` | Admin | `GET /orders`, `GET /users` |

## Getting started

Requirements: Node.js 20.9 or newer, and the Flask API running (or the deployed URL above).

```bash
cd revoshop
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Needed for | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | The app | Base URL of the Flask API, no trailing slash |
| `E2E_ADMIN_EMAIL` | Tests | An account with the `admin` role |
| `E2E_ADMIN_PASSWORD` | Tests | Password for that account |
| `PLAYWRIGHT_BASE_URL` | Tests, optional | Run the suite against a deployed URL instead of a local server |

`.env.local` is ignored by git; only `.env.example` is committed.

Registration always creates a `customer`. To get an admin, register an account and promote it in the
database (`UPDATE users SET role = 'admin' WHERE email = '…';`), as described in the backend README.

## Running the tests

```bash
cd revoshop
npx playwright install chromium   # first time only
npm run test:e2e                  # builds the app, starts it on :3000 and runs the suite
npm run test:e2e:report           # opens the HTML report
```

If a server is already running on port 3000, Playwright reuses it. To test a deployed copy:

```bash
PLAYWRIGHT_BASE_URL=https://your-revoshop.vercel.app npm run test:e2e
```

The suite has 14 tests in `revoshop/e2e/`:

| File | What it covers |
|---|---|
| `auth.spec.ts` | Register validation; register, auto login, username kept after refresh, log out; invalid login error; customer goes to `/`, admin goes to `/dashboard`; logged-out and customer redirects on protected pages |
| `shopping.spec.ts` | Empty cart state and disabled checkout; full journey: product list → add to cart → cart totals → refresh → checkout → order history → order detail |
| `admin.spec.ts` | Product create, edit and delete; product delete guard; category create (with validation and duplicate name), edit and delete; category delete guard; read-only orders overview |

The tests run against the real API, so they clean up after themselves: products and categories they
create are deleted, and the test order is cancelled so the stock goes back. Each run registers a few
`e2e+…@revoshop.test` customer accounts, because the API has no endpoint for deleting users.

## Project structure

```
revoshop/
├── app/                        Routes (App Router)
│   ├── layout.tsx              Providers, header, footer, tab bar, toaster
│   ├── page.tsx                Home
│   ├── products/               Listing (with sidebar layout) and [id] detail
│   ├── categories/
│   ├── login/, register/
│   ├── cart/, checkout/
│   ├── orders/                 Order history and [id] detail
│   └── dashboard/              Admin: products (page.tsx), categories/, orders/
├── components/
│   ├── auth/                   LoginForm, RegisterForm, UserMenu, AuthGuard, GuestGuard
│   ├── cart/                   AddToCartButton, CartView, CheckoutView
│   ├── orders/                 OrderList, OrderDetail, OrderStatusBadge
│   ├── dashboard/              ProductManager, CategoryManager, OrderOverview,
│   │                           Create/Edit Product and Category forms, ConfirmDelete
│   └── …                       Shared UI: Header, ProductCard, Modal, FormField, Card, …
├── context/                    AuthContext, CartContext, CatalogContext
├── hooks/                      useAuth, useCart, useCatalog, useFetch, useHydrated
├── lib/
│   ├── http.ts                 fetch wrapper and ApiError
│   ├── api.ts                  Catalog reads for Server Components
│   ├── client-api.ts           Auth, orders and admin calls from the browser (with token refresh)
│   ├── session.ts, local-store.ts   localStorage stores for the session and the cart
│   └── types.ts, format.ts, images.ts, validation.ts
├── e2e/                        Playwright specs and helpers
└── playwright.config.ts
```

## How it works

- **Session.** Logging in stores the user, access token and refresh token in `localStorage`
  (`revoshop.session`). `AuthContext` reads it with `useSyncExternalStore`, so the header and every
  page stay in sync, also across tabs. Access tokens last 30 minutes; when a request gets a 401,
  `client-api.ts` uses the refresh token once and retries, and logs the user out if that fails.
- **Route protection.** `AuthGuard` wraps `/checkout`, `/orders` and the dashboard layout. It waits until
  the session has been read, then redirects: no user goes to `/login?next=…`, a customer on an admin
  page goes to `/`. `GuestGuard` sends logged-in users away from `/login` and `/register`.
- **Cart.** `CartContext` keeps items in `localStorage` (`revoshop.cart`) with immutable reducer
  updates. `AddToCartButton` checks stock before adding and shows a toast either way.
- **Data.** Public catalog pages fetch on the server. Pages that need a token (orders, dashboard orders)
  fetch in the browser with `useFetch`. After a dashboard create, edit or delete, `router.refresh()`
  reloads the table from the API.
- **Delete guards.** The API refuses to delete a product that appears in an order or a category that
  still has products (409). `ConfirmDelete` keeps the dialog open, shows the message and explains what
  to do instead.

## Requirement checklist

| Requirement | Where |
|---|---|
| `CreateProductForm` submits and the product appears in the table | `components/dashboard/CreateProductForm.tsx`, `ProductManager.tsx` |
| Cart table, quantities, totals, remove per row, empty state, disabled checkout | `components/cart/CartView.tsx` |
| Checkout confirms the order, clears the cart, redirects to `/orders` | `components/cart/CheckoutView.tsx` |
| `CreateCategoryForm` validates the name and creates a category | `components/dashboard/CreateCategoryForm.tsx`, `CategoryForm.tsx` |
| `RegisterForm` validates every field, logs in and redirects | `components/auth/RegisterForm.tsx`, `context/AuthContext.tsx` |
| Header shows the username and keeps it after refresh | `components/auth/UserMenu.tsx`, `lib/session.ts` |
| `LoginForm` redirects by role and shows an error for bad credentials | `components/auth/LoginForm.tsx`, `GuestGuard.tsx` |
| Protected and admin-only pages redirect | `components/auth/AuthGuard.tsx` |
| Product CRUD with a visible error when the product has orders | `components/dashboard/ProductManager.tsx`, `ConfirmDelete.tsx` |
| Toasts on success and error for CRUD and cart actions | react-hot-toast across `components/cart` and `components/dashboard` |
| Playwright suite for register/login, shopping journey and admin CRUD | `revoshop/e2e/` |

## Screenshots

Taken locally from a production build (`npm run build && npm run start`) against the live API.

### Home
![Home page with category banners and the newest products](screenshots/revoshop/home.png)

### Product listing
![Product listing with the category sidebar](screenshots/revoshop/products.png)

Live search filters as you type and writes `?search=` to the URL:

![Live search for "mo"](screenshots/revoshop/live-search.png)

### Product detail
![Product detail page](screenshots/revoshop/product-detail.png)

### Category listing
![Categories page](screenshots/revoshop/categories.png)

### Register
Every field is validated before anything is sent.
![Register form with validation errors](screenshots/revoshop/register.png)

### Login
![Login form](screenshots/revoshop/login.png)

Wrong credentials show the error from the API:

![Login form with "Invalid email or password"](screenshots/revoshop/login-error.png)

### Add to cart
![Toasts after adding two products](screenshots/revoshop/add-to-cart-toast.png)

### Cart
![Cart table with quantities, subtotals and total](screenshots/revoshop/cart.png)

![Empty cart with a disabled checkout button](screenshots/revoshop/cart-empty.png)

### Checkout
![Checkout review with Confirm order](screenshots/revoshop/checkout.png)

### Orders
![Order history after checkout](screenshots/revoshop/orders.png)

![Order detail with every line item](screenshots/revoshop/order-detail.png)

### Header user menu
The username stays in the header after a refresh; the menu links to orders and logs out.
![Header user menu open on the order detail page](screenshots/revoshop/user-menu.png)

### Admin dashboard: products
![Admin product table](screenshots/revoshop/dashboard.png)

![Create product form with validation errors](screenshots/revoshop/dashboard-create-product.png)

![Delete guard for a product that has orders](screenshots/revoshop/dashboard-delete-guard.png)

### Admin dashboard: categories
![Admin category table](screenshots/revoshop/dashboard-categories.png)

![Create category form with a name error](screenshots/revoshop/dashboard-create-category.png)

### Admin dashboard: orders
![Read-only overview of all orders](screenshots/revoshop/dashboard-orders.png)

### Playwright report
![Playwright HTML report with 14 passing tests](screenshots/revoshop/e2e-report.png)

## Notes

- Product photos come from `image_url` when a product has one (admins can paste an https link in
  the product form). The seeded products have no `image_url`, so `lib/images.ts` matches them by name
  to free-license photos from [Unsplash](https://unsplash.com).
- Prices are shown in Indonesian rupiah.
- Deploying to Vercel and running the suite against the live URL is part of the final Module 3
  submission.
