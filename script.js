// Ambil semua tombol Add to Cart
const addButtons = document.querySelectorAll(".add");

// Tambahkan listener Add to Cart
addButtons.forEach((btn) => {
  btn.addEventListener(
    "click",
    () => {
      const productCard = btn.closest(".product-card");
      const name = productCard.querySelector("p").innerText;
      const img = productCard.querySelector("img").src;

      let price = 0;
      if (name.includes("Slick")) price = 250000;
      else if (name.includes("Tall")) price = 300000;
      else if (name.includes("Short")) price = 200000;
      else if (name.includes("Wireless")) price = 350000;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existIndex = cart.findIndex((item) => item.name === name);
      if (existIndex > -1) {
        cart[existIndex].quantity += 1;
      } else {
        cart.push({ id: `prod-${Date.now()}`, name, price, quantity: 1, image: img });
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert(`${name} added to cart!`);
    },
    { once: false } // listener tetap aktif
  );
});

// Tombol Buy: langsung checkout dengan produk itu saja
const buyButtons = document.querySelectorAll(".buy");
buyButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const productCard = btn.closest(".product-card");
    const name = productCard.querySelector("p").innerText;
    const img = productCard.querySelector("img").src;

    let price = 0;
    if (name.includes("Slick")) price = 250000;
    else if (name.includes("Tall")) price = 300000;
    else if (name.includes("Short")) price = 200000;
    else if (name.includes("Wireless")) price = 350000;

    const cart = [{ id: `prod-${Date.now()}`, name, price, quantity: 1, image: img }];
    localStorage.setItem("cart", JSON.stringify(cart));

    window.location.href = "checkout.html";
  });
});

// Fungsi update badge cart
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById("cartCount");
  if (badge) badge.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Inisialisasi badge saat load halaman
updateCartCount();

// Render cart modal
function renderCartModal() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (!cartItems) return;

  itemList.innerHTML = cart.map((item, index) => {
  subtotal += item.price * item.quantity;
  return `
    <div class="d-flex align-items-center mb-2">
      <span>${item.name} x ${item.quantity}</span>
      <span>Rp ${item.price * item.quantity}</span>
      <button class="delete-btn" data-index="${index}">&times;</button>
    </div>
  `;
}).join("");


  cartTotal.innerText = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Event listener tombol Delete per produk
  const deleteBtns = document.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartModal();
      updateCartCount();
    });
  });
}

// Render modal saat dibuka
const cartModalEl = document.getElementById("cartModal");
if (cartModalEl) {
  cartModalEl.addEventListener("show.bs.modal", renderCartModal);
}

// ===== Checkout page functions =====
function renderCheckout() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemList = document.querySelector(".item-list");
  const subtotalEl = document.querySelector(".details .detail-row:nth-child(1) span:last-child");
  const vatEl = document.querySelector(".details .detail-row:nth-child(2) span:last-child");
  const totalEl = document.querySelector(".details .detail-row.total span:last-child");
  const clearBtn = document.getElementById("clearCart");

  if (!itemList) return; // hanya jalan di checkout.html

  function render() {
    let subtotal = 0;

    if (cart.length === 0) {
      itemList.innerHTML = "<p>Cart kosong</p>";
      subtotalEl.innerText = "Rp 0";
      vatEl.innerText = "Rp 0";
      totalEl.innerText = "Rp 0";
      return;
    }

    itemList.innerHTML = cart
      .map(
        (item, index) => `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <span>${item.name} x ${item.quantity}</span>
        <span>Rp ${item.price * item.quantity}</span>
        <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">Delete</button>
      </div>
    `
      )
      .join("");

    subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const vat = Math.round(subtotal * 0.11);
    const total = subtotal + vat;

    subtotalEl.innerText = `Rp ${subtotal}`;
    vatEl.innerText = `Rp ${vat}`;
    totalEl.innerText = `Rp ${total}`;

    // Event Delete per produk
    const deleteBtns = document.querySelectorAll(".delete-btn");
    deleteBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        render();
        updateCartCount();
      });
    });
  }

  // Event Clear Cart
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (confirm("Apakah yakin ingin menghapus semua produk di cart?")) {
        cart.length = 0;
        localStorage.setItem("cart", JSON.stringify(cart));
        render();
        updateCartCount();
      }
    });
  }

  render();
}

// Panggil di checkout.html
renderCheckout();
