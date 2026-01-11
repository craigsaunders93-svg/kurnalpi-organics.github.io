// 1️⃣ Order reference generator (STEP 1)
function generateOrderReference() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.floor(1000 + Math.random() * 9000);

  return `KPO-${y}${m}${d}-${rand}`;
}

// 2️⃣ Build WhatsApp + Email message
function buildMessage(orderRef) {
  return `
🧾 *New Order*
Reference: ${orderRef}

Customer: John Doe
Phone: 071 234 5678

Items:
- Organic Honey x2
- Herbal Tea x1

Total: R350
`;
}

// 3️⃣ Checkout function
function checkoutWhatsApp() {
  const orderRef = generateOrderReference();
  const message = buildMessage(orderRef);

  sendEmailNotification(message, orderRef);

  window.open(
    `https://wa.me/27615136124?text=${encodeURIComponent(message)}`,
    '_blank'
  );

  completeOrder();
}

// 4️⃣ Send email
function sendEmailNotification(message, orderRef) {
  fetch('http://localhost:5000/send-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      orderRef,
      toEmail: 'kurnalpiorganics@gmail.com',
    }),
  })
    .then(res => {
      if (!res.ok) throw new Error('Email failed');
      return res.json();
    })
    .then(() => console.log(`📧 Email sent (Ref: ${orderRef})`))
    .catch(err => console.error('❌ Email error:', err.message));
}
