// ======= GLOBAL CART FUNCTIONS =======

// Ambil cart dari localStorage
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Simpan cart ke localStorage
function setCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update badge cart
function updateCartCount() {
  const badge = document.getElementById("cartCount");
  const cart = getCart();
  if (badge) badge.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
}

// Tambahkan produk ke cart
function addToCart(name, price, img) {
  let cart = getCart();
  const index = cart.findIndex((item) => item.name === name);
  if (index > -1) {
    cart[index].quantity += 1;
  } else {
    cart.push({ id: `prod-${Date.now()}`, name, price, quantity: 1, image: img });
  }
  setCart(cart);
  alert(`${name} added to cart!`);
}

// ======= PAGE LOAD INIT =======
document.addEventListener("DOMContentLoaded", () => {

  // --- BUTTONS ADD TO CART ---
  const addButtons = document.querySelectorAll(".add");
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const productCard = btn.closest(".product-card");
      const name = productCard.querySelector("p").innerText;
      const img = productCard.querySelector("img").src;

      let price = 0;
      if (name.includes("Slick")) price = 250000;
      else if (name.includes("Tall")) price = 300000;
      else if (name.includes("Short")) price = 200000;
      else if (name.includes("Wireless")) price = 350000;

      addToCart(name, price, img);
    });
  });

  // --- BUTTONS BUY ---
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
      setCart(cart);

      window.location.href = "checkout.html";
    });
  });

  // --- CART MODAL (jika ada) ---
  const cartModalEl = document.getElementById("cartModal");
  if (cartModalEl) {
    cartModalEl.addEventListener("show.bs.modal", () => {
      const cart = getCart();
      const cartItems = document.getElementById("cartItems");
      const cartTotal = document.getElementById("cartTotal");
      if (!cartItems) return;

      let subtotal = 0;
      cartItems.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
          <div class="d-flex align-items-center mb-2">
            <img src="${item.image}" width="50"/>
            <span class="ms-2">${item.name} x ${item.quantity}</span>
            <span class="ms-auto">Rp ${item.price * item.quantity}</span>
            <button class="delete-btn btn btn-sm btn-outline-danger ms-2" data-index="${index}">&times;</button>
          </div>
        `;
      }).join("");

      if (cartTotal) {
        cartTotal.innerText = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      }

      // Listener Delete per produk
      const deleteBtns = cartModalEl.querySelectorAll(".delete-btn");
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = btn.dataset.index;
          cart.splice(index, 1);
          setCart(cart);
          // rerender modal
          cartModalEl.dispatchEvent(new Event("show.bs.modal"));
        });
      });
    });
  }

  // --- CHECKOUT PAGE RENDER ---
  const itemList = document.querySelector(".item-list");
  const subtotalEl = document.querySelector(".details .detail-row:nth-child(1) span:last-child");
  const vatEl = document.querySelector(".details .detail-row:nth-child(2) span:last-child");
  const totalEl = document.querySelector(".details .detail-row.total span:last-child");
  const clearBtn = document.getElementById("clearCart");

  if (itemList && subtotalEl && vatEl && totalEl) {
    function renderCheckout() {
      let cart = getCart();
      if (cart.length === 0) {
        itemList.innerHTML = "<p>Cart kosong</p>";
        subtotalEl.innerText = "Rp 0";
        vatEl.innerText = "Rp 0";
        totalEl.innerText = "Rp 0";
        return;
      }

      let subtotal = 0;
      itemList.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span>${item.name} x ${item.quantity}</span>
            <span>Rp ${item.price * item.quantity}</span>
            <button class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">Delete</button>
          </div>
        `;
      }).join("");

      const vat = Math.round(subtotal * 0.11);
      const total = subtotal + vat;

      subtotalEl.innerText = `Rp ${subtotal}`;
      vatEl.innerText = `Rp ${vat}`;
      totalEl.innerText = `Rp ${total}`;

      // Delete per produk
      const deleteBtns = document.querySelectorAll(".delete-btn");
      deleteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const index = btn.dataset.index;
          cart.splice(index, 1);
          setCart(cart);
          renderCheckout();
        });
      });
    }

    renderCheckout();

    // Clear Cart
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (confirm("Apakah yakin ingin menghapus semua produk di cart?")) {
          setCart([]);
          renderCheckout();
        }
      });
    }
  }

  // Inisialisasi badge
  updateCartCount();
});

document.addEventListener("DOMContentLoaded", () => {
  // --- BUNDLE BUTTON ---
  const bundleButtons = document.querySelectorAll(".bundle-btn");
  bundleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cart = [
        { id: `prod-${Date.now()}`, name: "BUNDLE 10 FANS", price: 67000, quantity: 1, image: "img/bundle.png" }
      ];
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = "checkout.html";
    });
  });
});
