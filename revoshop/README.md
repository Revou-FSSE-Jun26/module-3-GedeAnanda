# RevoShop: Checkpoint 2

The RevoShop storefront, built with Next.js (App Router), TypeScript and Tailwind CSS.
Every page reads live data from the Flask API built in Module 2.

- **API:** https://module-2-gede-ananda.vercel.app
- **Backend repo:** https://github.com/Revou-FSSE-Jun26/module-2-GedeAnanda

## Getting started

```bash
cd revoshop
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Where it is used | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Every request in `lib/api.ts` | Base URL of the Flask API, no trailing slash |
| `API_AUTH_EMAIL` | `/orders` (server only) | Account used to log in, because `GET /orders` needs a JWT |
| `API_AUTH_PASSWORD` | `/orders` (server only) | Never prefixed with `NEXT_PUBLIC_`, so it never reaches the browser |

`.env.local` is ignored by git (`.env*` in `.gitignore`); only `.env.example` is committed.

## Routes

| Route | Data from the API | Files |
|---|---|---|
| `/` | `GET /products?per_page=5`, `GET /categories` | `page.tsx`, `loading.tsx`, `error.tsx` |
| `/products` | `GET /products?search=&category_id=`, `GET /categories` | `layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx` |
| `/products/[id]` | `GET /products/:id`, `GET /categories/:id` | `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx` |
| `/categories` | `GET /categories`, `GET /products` | `page.tsx`, `loading.tsx`, `error.tsx` |
| `/orders` | `POST /auth/login`, `GET /orders`, `GET /orders/:id` | `page.tsx`, `loading.tsx`, `error.tsx` |

All fetching happens in Server Components. `loading.tsx` shows a skeleton shaped like the page,
and `error.tsx` shows a friendly message with a **Try again** button.

## Project structure

```
revoshop/
├── app/                    Routes (App Router)
│   ├── layout.tsx          Root layout: <Header />, page, <Footer /> on every page
│   ├── page.tsx            Home: hero, 5 products, categories
│   ├── products/
│   │   ├── layout.tsx      Nested layout with the cart column, stays mounted
│   │   ├── page.tsx        Catalog: renders <ProductGrid />
│   │   └── [id]/page.tsx   Product detail + generateMetadata
│   ├── categories/
│   └── orders/
├── components/             Reusable UI (all TypeScript)
│   ├── Header.tsx, NavLinks.tsx, Footer.tsx
│   ├── Card.tsx            Shared surface wrapper
│   ├── ProductCard.tsx     ProductCardProps, quantity counter, stock states
│   ├── ProductGrid.tsx     Search + category filter + cards + add form
│   ├── SearchBar.tsx, CategoryFilter.tsx, AddProductForm.tsx
│   ├── CartProvider.tsx    Cart state (useReducer, immutable updates)
│   └── CartSummary.tsx     Item count and total
└── lib/
    ├── api.ts              Fetch helpers for the Flask API
    ├── types.ts            Product, Category, Order, CartItem
    └── format.ts           Rupiah, dates, placeholder images
```

## How the requirements are covered

**Components**
- `ProductCard` takes a `ProductCardProps` interface. Optional props (`categoryName`, `imageUrl`,
  `isActive`, `isNew`, `priority`) get defaults through destructuring.
- `Card` wraps product cards, the cart summary, the add form, category cards and order rows.
- `QuantityCounter` increments and decrements between 1 and the product's stock.
- In stock shows a green **Add to cart** button; out of stock shows a disabled **Out of stock** button
  and a greyed image.
- `SearchBar` is a controlled input. Typing filters the list on every keystroke, then (after 350 ms)
  `router.push()` writes `?search=` to the URL so the server refetches from the API.
- Category chips write `?category=` to the URL; search and category are sent to the API together.
- Add to cart dispatches to a reducer that returns new arrays/objects (`[...state, item]`, `map`,
  `filter`). The cart summary and the header badge show item count and total.
- `AddProductForm` validates name, price, stock and category, shows errors under each field, and
  appends the new product to the list (local state only, saving to the API is Checkpoint 3).

**App Router**
- The catalog page only returns `<ProductGrid />`; `<Header />` and `<Footer />` come from the root layout.
- `app/products/layout.tsx` holds the cart column, so moving between `/products` and
  `/products/[id]` keeps it mounted.
- `NavLinks` uses `usePathname()` to highlight the active route (`aria-current="page"`).
- Each route exports `metadata`; the product page uses `generateMetadata` for a title like
  `Mechanical Keyboard | RevoShop`.

## Notes

- The API has no image field yet, so products use stable placeholder photos from picsum.photos.
- Prices are formatted as Indonesian rupiah.
- Light and dark mode follow the system setting.
