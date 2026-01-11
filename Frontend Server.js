<script>
const SHIPPING = 150;
let ORDER_REF = null;

let inputName, inputPhone, inputEmail, inputAddress, inputNotes;

// Initialize form inputs
function initInputs() {
    inputName = document.getElementById("name");
    inputPhone = document.getElementById("phone");
    inputEmail = document.getElementById("email");
    inputAddress = document.getElementById("address");
    inputNotes = document.getElementById("notes");
}

// Generate a unique order reference
function generateOrderReference() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `KPO-${y}${m}${day}-${rand}`;
}

// Get cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

// Clear cart after order
function clearCart() {
    localStorage.removeItem("cart");
}

// Load checkout page
function loadCheckout() {
    initInputs();
    const cart = getCart();
    if (cart.length === 0) {
        alert("Your cart is empty.");
        window.location.href = "cart.html";
        return;
    }

    ORDER_REF = generateOrderReference();
    const eftRefInput = document.getElementById("eft-ref");
    if (eftRefInput) eftRefInput.value = ORDER_REF;

    let subtotal = 0;
    const tbody = document.getElementById("order-items");
    tbody.innerHTML = "";

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        tbody.innerHTML += `<tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>R${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`;
    });

    document.getElementById("subtotal").textContent = "R" + subtotal.toFixed(2);
    document.getElementById("total").textContent = "R" + (subtotal + SHIPPING).toFixed(2);
}

// Build order message
function buildMessage(paymentMethod = "Online") {
    const cart = getCart();
    let msg = `🧾 NEW ORDER\nReference: ${ORDER_REF}\nPayment Method: ${paymentMethod}\n\n`;
    cart.forEach(item => {
        msg += `${item.name} x ${item.quantity} - R${(item.price * item.quantity).toFixed(2)}\n`;
    });
    msg += `\nTotal (incl shipping): ${document.getElementById("total").textContent}\n\n`;
    msg += `Name: ${inputName.value}\nPhone: ${inputPhone.value}\nEmail: ${inputEmail.value}\nAddress: ${inputAddress.value}\n`;
    if (inputNotes.value) msg += `Notes: ${inputNotes.value}\n`;
    return msg;
}

// Complete order UI update
function completeOrder() {
    clearCart();
    document.getElementById("checkout-section").style.display = "none";
    document.getElementById("thank-you").style.display = "block";
}

// Send email via backend
async function sendEmailNotification(message, paymentMethod = "Online") {
    try {
        const response = await fetch("http://kurnalpiorganics@gmail.com", { // <-- Use your server URL here
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message,
                orderRef: ORDER_REF,
                paymentMethod,
                toEmail: "kurnalpiorganics@gmail.com"
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Unknown server error");
        console.log(`📧 Email sent (Ref: ${ORDER_REF})`);
        return true;
    } catch (err) {
        console.error("❌ Email error:", err.message);
        alert("Email could not be sent:\n" + err.message);
        return false;
    }
}

// Checkout via WhatsApp
async function checkoutWhatsApp() {
    if (!validateInputs()) return;

    const message = buildMessage();
    window.open(`https://wa.me/27615136124?text=${encodeURIComponent(message)}`, "_blank");

    const emailSent = await sendEmailNotification(message);
    if (emailSent) completeOrder();
}

// Checkout via Email
async function checkoutEmail() {
    if (!validateInputs()) return;

    const message = buildMessage();
    const emailSent = await sendEmailNotification(message);
    if (emailSent) completeOrder();
}

// Show EFT section
function showEFT() {
    const eftBox = document.getElementById("eft-box");
    const eftRefInput = document.getElementById("eft-ref");
    if (!ORDER_REF) ORDER_REF = generateOrderReference();
    if (eftRefInput) eftRefInput.value = ORDER_REF;
    eftBox.style.display = "block";
}

// Confirm EFT
async function eftConfirm() {
    if (!validateInputs()) return;

    const message = buildMessage("EFT");
    const emailSent = await sendEmailNotification(message, "EFT");
    if (emailSent) completeOrder();
    alert("Thank you! Please use this reference for EFT payment:\n" + ORDER_REF);
}

// Simple input validation
function validateInputs() {
    if (!inputName.value || !inputPhone.value || !inputEmail.value || !inputAddress.value) {
        alert("Please fill in all required fields (Name, Phone, Email, Address).");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", loadCheckout);
</script>
