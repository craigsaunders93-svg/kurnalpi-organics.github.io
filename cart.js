// ========================
// CART SCRIPT
// ========================

// Get cart total from localStorage, default to 0 if not set
let cartTotal = 0;
const storedTotal = localStorage.getItem('cartTotal');

if (storedTotal !== null && !isNaN(parseFloat(storedTotal))) {
    cartTotal = parseFloat(storedTotal);
}

// Update the cart display in the header
function updateCartDisplay() {
    const cartTotalElement = document.getElementById('cart-total');
    if (cartTotalElement) {
        cartTotalElement.textContent = `R${cartTotal.toFixed(2)}`;
    }
}

// Add an item to the cart
function addToCart(price) {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
        console.error('Invalid price:', price);
        return;
    }

    cartTotal += price;
    localStorage.setItem('cartTotal', cartTotal.toFixed(2));
    updateCartDisplay();
    alert(`Added to cart! Total: R${cartTotal.toFixed(2)}`);
}

// Initialize cart display on page load
window.addEventListener('DOMContentLoaded', updateCartDisplay);
