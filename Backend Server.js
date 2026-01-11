require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify Gmail connection
transporter.verify((error) => {
  if (error) {
    console.error('Gmail connection error:', error);
  } else {
    console.log('✅ Gmail is ready to send emails');
  }
});

// Send email route
app.post('/send-email', async (req, res) => {
  try {
    const { message, toEmail } = req.body;

    if (!message || !toEmail) {
      return res.status(400).json({ error: 'Missing message or toEmail' });
    }

    const mailOptions = {
      from: `"Kurnalpi Organics" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'New Order from Kurnalpi Organics',
      text: message,
    };

    await transporter.sendMail(mailOptions);
    console.log('📧 Order email sent');

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
