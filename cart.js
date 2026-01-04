// Get current cart total from localStorage or set to 0
let cartTotal = localStorage.getItem('cartTotal') ? parseFloat(localStorage.getItem('cartTotal')) : 0;

// Update the cart total display
function updateCartDisplay() {
    const cartTotalElement = document.getElementById('cart-total');
    if(cartTotalElement) {
        cartTotalElement.textContent = `R${cartTotal.toFixed(2)}`;
    }
}

// Add product to cart
function addToCart(price) {
    cartTotal += price;
    localStorage.setItem('cartTotal', cartTotal);
    updateCartDisplay();
    alert(`Added to cart! Total: R${cartTotal.toFixed(2)}`);
}

// Initialize cart display on page load
window.onload = updateCartDisplay;

