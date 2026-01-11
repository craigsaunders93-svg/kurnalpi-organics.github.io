require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendTestEmail() {
  try {
    // Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Gmail transporter verified');

    // Email options
    const mailOptions = {
      from: `"Kurnalpi Organics" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // sending to your Gmail
      subject: `Test Email from Website Backend`,
      text: `Hello! This is a test email to confirm Gmail delivery.`,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('📧 Test email sent:', info.messageId);
  } catch (error) {
    console.error('❌ Test email failed:', error.message);
  }
}

sendTestEmail();
