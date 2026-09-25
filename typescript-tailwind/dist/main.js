import { products } from "./data.js";
// ambil elemen DOM
function getElement(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Element "${selector}" not found`);
    }
    return element;
}
const searchInput = getElement("#search");
const productGrid = getElement("#product-grid");
const resultCount = getElement("#result-count");
const emptyState = getElement("#empty-state");
const emptyQuery = getElement("#empty-query");
const cartCount = getElement("#cart-count");
const cartTotal = getElement("#cart-total");
// warna badge dari data, class ditulis lengkap biar kebaca Tailwind
const categoryBadgeClass = {
    Electronics: "bg-sky-100 text-sky-800",
    Fashion: "bg-pink-100 text-pink-800",
    Home: "bg-brand-light text-brand-dark",
};
const stockBadgeClass = {
    "in-stock": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "low-stock": "bg-amber-50 text-amber-700 ring-amber-600/30",
    "out-of-stock": "bg-red-50 text-red-700 ring-red-600/20",
};
const stockLabel = {
    "in-stock": "In stock",
    "low-stock": "Low stock",
    "out-of-stock": "Sold out",
};
// helper
const LOW_STOCK_LIMIT = 5;
const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});
function getStockStatus(stock) {
    if (stock === 0)
        return "out-of-stock";
    if (stock <= LOW_STOCK_LIMIT)
        return "low-stock";
    return "in-stock";
}
function getFinalPrice(product) {
    const { price, discount } = product;
    if (!discount)
        return price;
    switch (discount.type) {
        case "percent":
            return Math.round(price * (1 - discount.value / 100));
        case "fixed":
            return Math.max(0, price - discount.amount);
        default: {
            // jaga-jaga kalau ada tipe diskon baru yang lupa di-handle
            const unhandled = discount;
            return unhandled;
        }
    }
}
function formatDiscount(discount) {
    return discount.type === "percent"
        ? `-${discount.value}%`
        : `-${rupiah.format(discount.amount)}`;
}
function findProduct(productId) {
    return products.find((product) => product.id === productId);
}
function filterProducts(items, query) {
    const keyword = query.trim().toLowerCase();
    if (!keyword)
        return items;
    return items.filter((product) => [product.name, product.category, ...product.tags].some((text) => text.toLowerCase().includes(keyword)));
}
// keranjang
function getQuantityInCart(cart, productId) {
    return cart.find((item) => item.productId === productId)?.quantity ?? 0;
}
function canAddToCart(cart, product) {
    return getQuantityInCart(cart, product.id) < product.stock;
}
// bikin array baru, yang lama jangan diubah
function addToCart(cart, productId) {
    const isInCart = cart.some((item) => item.productId === productId);
    if (!isInCart)
        return [...cart, { productId, quantity: 1 }];
    return cart.map((item) => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
}
function getCartSummary(cart) {
    return cart.reduce((summary, item) => {
        const product = findProduct(item.productId);
        if (!product)
            return summary;
        return {
            count: summary.count + item.quantity,
            total: summary.total + getFinalPrice(product) * item.quantity,
        };
    }, { count: 0, total: 0 });
}
// state
let state = { query: "", cart: [] };
function setState(patch) {
    state = { ...state, ...patch };
    render();
}
// render
function getButtonLabel(status, canAdd) {
    if (status === "out-of-stock")
        return "Sold out";
    return canAdd ? "Add to cart" : "Max stock in cart";
}
function renderPrice(product) {
    const finalPrice = rupiah.format(getFinalPrice(product));
    if (!product.discount) {
        return `<p class="text-xl font-extrabold tracking-tight">${finalPrice}</p>`;
    }
    return `
    <p class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span class="text-xl font-extrabold tracking-tight text-brand-dark">${finalPrice}</span>
      <span class="text-sm text-muted line-through"><span class="sr-only">Original price </span>${rupiah.format(product.price)}</span>
      <span class="rounded-md bg-brand-dark px-1.5 py-0.5 text-xs font-semibold text-white">${formatDiscount(product.discount)}</span>
    </p>`;
}
function renderTags(tags) {
    return tags
        .map((tag) => `<li class="rounded-md bg-page px-2 py-0.5 text-xs text-muted">#${tag}</li>`)
        .join("");
}
function renderCard(product, cart) {
    const status = getStockStatus(product.stock);
    const quantity = getQuantityInCart(cart, product.id);
    const canAdd = canAddToCart(cart, product);
    const quantityClass = quantity > 0 ? "font-semibold text-brand" : "text-muted";
    return `
    <li>
      <article data-card-id="${product.id}" tabindex="-1" class="flex h-full flex-col gap-4 rounded-xl border border-line bg-white p-5 shadow-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-brand">
        <div class="flex flex-wrap items-center gap-2">
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold ${categoryBadgeClass[product.category]}">${product.category}</span>
          <span class="rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${stockBadgeClass[status]}">${stockLabel[status]}</span>
        </div>

        <div>
          <h2 class="text-lg font-semibold leading-snug">${product.name}</h2>
          <p class="mt-1 text-sm text-muted">
            <span class="text-amber-500" aria-hidden="true">★</span>
            <span class="font-semibold text-ink">${product.rating.average.toFixed(1)}</span>
            (${product.rating.count} reviews)
          </p>
        </div>

        <ul class="flex flex-wrap gap-1.5" aria-label="Tags">${renderTags(product.tags)}</ul>

        <div class="mt-auto">${renderPrice(product)}</div>

        <div>
          <button
            type="button"
            data-product-id="${product.id}"
            class="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors enabled:hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
            ${canAdd ? "" : "disabled"}
          >${getButtonLabel(status, canAdd)}</button>
          <p class="mt-2 text-center text-sm ${quantityClass}">${quantity} in cart</p>
        </div>
      </article>
    </li>`;
}
function renderCart(summary) {
    cartCount.textContent = `${summary.count} ${summary.count === 1 ? "item" : "items"}`;
    cartTotal.textContent = rupiah.format(summary.total);
}
function render() {
    const visibleProducts = filterProducts(products, state.query);
    productGrid.innerHTML = visibleProducts
        .map((product) => renderCard(product, state.cart))
        .join("");
    resultCount.textContent = `Showing ${visibleProducts.length} of ${products.length} products`;
    // pakai textContent biar input user nggak jadi HTML
    emptyQuery.textContent = state.query.trim();
    emptyState.hidden = visibleProducts.length > 0;
    renderCart(getCartSummary(state.cart));
}
// event
// tombol ke-render ulang, jadi fokusnya harus dibalikin
function restoreFocus(productId) {
    const button = productGrid.querySelector(`button[data-product-id="${productId}"]`);
    if (button && !button.disabled) {
        button.focus();
        return;
    }
    // tombol disabled nggak bisa difokus, pindah ke card aja
    productGrid.querySelector(`[data-card-id="${productId}"]`)?.focus();
}
function handleGridClick(event) {
    if (!(event.target instanceof Element))
        return;
    const button = event.target.closest("button[data-product-id]");
    if (!button)
        return;
    const product = findProduct(Number(button.dataset.productId));
    if (!product || !canAddToCart(state.cart, product))
        return;
    setState({ cart: addToCart(state.cart, product.id) });
    restoreFocus(product.id);
}
function handleSearch() {
    setState({ query: searchInput.value });
}
searchInput.addEventListener("input", handleSearch);
productGrid.addEventListener("click", handleGridClick);
render();
