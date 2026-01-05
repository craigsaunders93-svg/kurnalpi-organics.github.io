
// ========================
// CART.JS
// ========================

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart total in header
function updateCartDisplay() {
    const cart = getCart();
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    const cartTotalElement = document.getElementById("cart-total");
    if (cartTotalElement) {
        cartTotalElement.textContent = "R" + total.toFixed(2);
    }
}

// Add item to cart
function addToCart(name, price, pack = "", quantity = 1, image = "") {
    if (!name || isNaN(price) || price < 0 || quantity < 1) {
        console.error("Invalid cart data");
        return;
    }

    let cart = getCart();
    const existingItem = cart.find(item => item.name === name && item.pack === pack);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name, price, pack, quantity, image });
    }

    saveCart(cart);
    updateCartDisplay();
    alert(`Added ${quantity} x ${name} to cart!`);
}

// ========================
// RENDER CART PAGE
// ========================
function renderCartPage() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartGrandTotal = document.getElementById("cart-grand-total");
    const cartMessage = document.getElementById("cart-message");

    if (!cartItemsContainer || !cartGrandTotal) return;

    const cart = getCart();
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        if (cartMessage) cartMessage.textContent = "Your cart is currently empty.";
        cartGrandTotal.textContent = "Total: R0";
        return;
    }

    if (cartMessage) cartMessage.textContent = "";

    cart.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        const row = document.createElement("tr");
        row.classList.add("cart-item");
        row.innerHTML = `
            <td>
                <img src="${item.image}" alt="${item.name}" width="80" height="80">
                <div>${item.name}</div>
            </td>
            <td>${item.pack || "-"}</td>
            <td>R${item.price.toFixed(2)}</td>
            <td>
                <button class="qty-btn minus" data-index="${index}">−</button>
                <span class="qty">${item.quantity}</span>
                <button class="qty-btn plus" data-index="${index}">+</button>
            </td>
            <td>R${subtotal.toFixed(2)}</td>
            <td>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </td>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartGrandTotal.textContent = `Total: R${total.toFixed(2)}`;
    updateCartDisplay();

    attachCartActions();
}

// ========================
// ATTACH BUTTON ACTIONS
// ========================
function attachCartActions() {
    const cart = getCart();

    // Quantity buttons
    document.querySelectorAll(".qty-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            if (btn.classList.contains("minus") && cart[index].quantity > 1) {
                cart[index].quantity--;
            }
            if (btn.classList.contains("plus")) {
                cart[index].quantity++;
            }
            saveCart(cart);
            renderCartPage();
        };
    });

    // Remove buttons
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.onclick = () => {
            const index = parseInt(btn.dataset.index);
            cart.splice(index, 1);
            saveCart(cart);
            renderCartPage();
        };
    });
}

// ========================
// INITIALIZE ON PAGE LOAD
// ========================
document.addEventListener("DOMContentLoaded", () => {
    renderCartPage();
});
