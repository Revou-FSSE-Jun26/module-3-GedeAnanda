// ---------- Select elements ----------
const categorySelect = document.querySelector("#category-select");
const inStockCheckbox = document.querySelector("#in-stock-only");
const productRows = document.querySelector("#product-rows");
const emptyState = document.querySelector("#empty-state");
const categoryBreakdown = document.querySelector("#category-breakdown");

const statCount = document.querySelector("#stat-count");
const statStock = document.querySelector("#stat-stock");
const statAverage = document.querySelector("#stat-average");
const statValue = document.querySelector("#stat-value");


// ---------- Data ----------
const products = [
  { id: 1, name: "Wireless Mouse", category: "Electronics", price: 150000, stock: 25 },
  { id: 2, name: "Mechanical Keyboard", category: "Electronics", price: 850000, stock: 8 },
  { id: 3, name: "USB-C Hub", category: "Electronics", price: 320000, stock: 0 },
  { id: 4, name: "Denim Jacket", category: "Fashion", price: 450000, stock: 12 },
  { id: 5, name: "Canvas Sneakers", category: "Fashion", price: 380000, stock: 0 },
  { id: 6, name: "Cotton T-Shirt", category: "Fashion", price: 120000, stock: 40 },
  { id: 7, name: "Desk Lamp", category: "Home", price: 210000, stock: 15 },
  { id: 8, name: "Ceramic Mug", category: "Home", price: 65000, stock: 60 },
];

const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});


// ---------- filter ----------
function getVisibleProducts(category, inStockOnly) {
  return products.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;
    const matchesStock = !inStockOnly || product.stock > 0;
    return matchesCategory && matchesStock;
  });
}


// ---------- map ----------
// Menghasilkan array BARU yang siap ditampilkan; array products tetap utuh
function toDisplayRows(items) {
  return items.map((product) => ({
    name: product.name,
    category: product.category,
    price: rupiah.format(product.price),
    stock: product.stock > 0 ? product.stock : "Sold out",
    isSoldOut: product.stock === 0,
  }));
}


// ---------- reduce ----------
function getStats(items) {
  // Nilai awal (argumen kedua) = 0, lalu tiap produk ditambahkan ke sum
  const totalStock = items.reduce((sum, product) => sum + product.stock, 0);
  const totalPrice = items.reduce((sum, product) => sum + product.price, 0);
  const inventoryValue = items.reduce((sum, product) => sum + product.price * product.stock, 0);

  return {
    count: items.length,
    totalStock,
    averagePrice: items.length > 0 ? totalPrice / items.length : 0,
    inventoryValue,
  };
}

// Hasil: { Electronics: 3, Fashion: 3, Home: 2 }
function countByCategory(items) {
  return items.reduce((counts, product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;
    return counts;
  }, {});
}


// ---------- forEach (render) ----------
function renderCategoryOptions() {
  // map ambil semua kategori, Set buang yang dobel
  const categories = [...new Set(products.map((product) => product.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.append(option);
  });
}

function createCell(text, className = "") {
  const td = document.createElement("td");
  td.textContent = text;
  if (className) {
    td.className = className;
  }
  return td;
}

function renderRows(rows) {
  productRows.replaceChildren(); // kosongkan tabel sebelum diisi ulang

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    tr.classList.toggle("sold-out", row.isSoldOut);
    tr.append(
      createCell(row.name),
      createCell(row.category),
      createCell(row.price, "num"),
      createCell(row.stock, "num"),
    );
    productRows.append(tr);
  });
}

function renderStats(stats) {
  statCount.textContent = stats.count;
  statStock.textContent = stats.totalStock;
  statAverage.textContent = rupiah.format(stats.averagePrice);
  statValue.textContent = rupiah.format(stats.inventoryValue);
}

function renderBreakdown(counts) {
  categoryBreakdown.replaceChildren();

  // Object.entries mengubah object jadi array [[key, value], ...] supaya bisa di-forEach
  Object.entries(counts).forEach(([category, count]) => {
    const li = document.createElement("li");
    const countSpan = document.createElement("span");
    countSpan.textContent = count;
    li.append(`${category} `, countSpan);
    categoryBreakdown.append(li);
  });
}

function render() {
  const visibleProducts = getVisibleProducts(categorySelect.value, inStockCheckbox.checked);

  renderRows(toDisplayRows(visibleProducts));
  renderStats(getStats(visibleProducts));
  renderBreakdown(countByCategory(visibleProducts));
  emptyState.hidden = visibleProducts.length > 0;
}


// ---------- Events ----------
categorySelect.addEventListener("change", render);
inStockCheckbox.addEventListener("change", render);


// ---------- Initial render ----------
renderCategoryOptions();
render();