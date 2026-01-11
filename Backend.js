const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors'); // For handling cross-origin requests

const app = express();
const port = 5000;  // The port your server will run on

// Middleware
app.use(cors());  // Enable cross-origin requests
app.use(bodyParser.json());  // Parse JSON bodies

// Setup Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',  // Replace with your Gmail address
        pass: 'your-email-password',   // Replace with your Gmail password or App Password
    }
});

// Send email route
app.post('/send-email', (req, res) => {
    const { message, toEmail } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com',  // Replace with your email
        to: toEmail,                   // Send to the provided email
        subject: 'New Order from Kurnalpi Organics',
        text: message,                 // Email body containing the order details
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Email not sent' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Email sent successfully', info });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

