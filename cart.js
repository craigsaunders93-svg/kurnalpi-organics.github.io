// ========================
// CART.JS – STOCK-AWARE (SAFE VERSION)
// ========================

// ---------- GET / SAVE CART ----------
function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartDisplay();
}

// ---------- HEADER CART TOTAL ----------
function updateCartDisplay() {
  const cart = getCart();
  let total = 0;

  cart.forEach(item => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    total += price * qty;
  });

  const el = document.getElementById("cart-total");
  if (el) el.textContent = "R" + total.toFixed(2);
}

// ---------- ADD TO CART ----------
function addToCart(
  name,
  price,
  quantity = 1,
  image = "",
  pack = "",
  stock = Infinity
) {
  if (!name || isNaN(price) || price < 0 || quantity < 1) return;

  let cart = getCart();

  const existing = cart.find(
    item => item.name === name && item.pack === pack
  );

  if (existing) {
    existing.quantity = Math.min(existing.quantity + quantity, stock);
    if (existing.quantity >= stock) {
      alert(`Only ${stock} available for "${name}".`);
    }
  } else {
    cart.push({
      name,
      price,
      pack,
      quantity: Math.min(quantity, stock),
      image,
      stock
    });
  }

  saveCart(cart);
}

// ========================
// RENDER CART PAGE
// ========================
function renderCartPage() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-grand-total");
  const messageEl = document.getElementById("cart-message");

  if (!itemsEl || !totalEl) return;

  const cart = getCart();
  itemsEl.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    if (messageEl) messageEl.textContent = "Your cart is currently empty.";
    totalEl.textContent = "Total: R0.00";
    updateCartDisplay();
    return;
  }

  if (messageEl) messageEl.textContent = "";

  cart.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <img src="${item.image || 'placeholder.png'}" width="80">
        <div>${item.name}</div>
      </td>
      <td>${item.pack || "-"}</td>
      <td>R${item.price.toFixed(2)}</td>
      <td>
        <button class="qty-btn minus" data-index="${index}" ${item.quantity <= 1 ? "disabled" : ""}>−</button>
        <input class="qty-input" type="number" min="1" value="${item.quantity}" data-index="${index}">
        <button class="qty-btn plus" data-index="${index}">+</button>
      </td>
      <td>R${subtotal.toFixed(2)}</td>
      <td>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </td>
    `;
    itemsEl.appendChild(row);
  });

  totalEl.textContent = `Total: R${total.toFixed(2)}`;
  updateCartDisplay();
  attachCartActions();
}

// ========================
// CART BUTTON ACTIONS
// ========================
function attachCartActions() {
  const cart = getCart();

  document.querySelectorAll(".qty-btn").forEach(btn => {
    btn.onclick = () => {
      const i = parseInt(btn.dataset.index);
      const stock = cart[i].stock ?? Infinity;

      if (btn.classList.contains("minus") && cart[i].quantity > 1) {
        cart[i].quantity--;
      }

      if (btn.classList.contains("plus") && cart[i].quantity < stock) {
        cart[i].quantity++;
      }

      saveCart(cart);
      renderCartPage();
    };
  });

  document.querySelectorAll(".qty-input").forEach(input => {
    input.onchange = () => {
      const i = parseInt(input.dataset.index);
      let qty = parseInt(input.value);
      const stock = cart[i].stock ?? Infinity;

      if (!qty || qty < 1) qty = 1;
      if (qty > stock) {
        alert(`Only ${stock} available for "${cart[i].name}".`);
        qty = stock;
      }

      cart[i].quantity = qty;
      saveCart(cart);
      renderCartPage();
    };
  });

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.onclick = () => {
      const i = parseInt(btn.dataset.index);
      cart.splice(i, 1);
      saveCart(cart);
      renderCartPage();
    };
  });
}

// ========================
// INIT (SAFE)
// ========================
document.addEventListener("DOMContentLoaded", () => {
  updateCartDisplay();
  if (document.getElementById("cart-items")) {
    renderCartPage();
  }
});
