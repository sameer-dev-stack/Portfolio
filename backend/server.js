require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Nodemailer transporter setup
// IMPORTANT: This setup assumes a generic SMTP server.
// For Gmail, you might need to enable "Less secure app access" or use an App Password.
// For other services (SendGrid, Mailgun), the configuration will differ.
const transporter = nodemailer.createTransport({
    host: 'smtp.mail.com', // Example: Use your email provider's SMTP server
    port: 587, // Common port for SMTP (TLS)
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // For mail.com, you might need to specify TLS options if STARTTLS is used
    // tls: {
    // ciphers:'SSLv3' // Or other specific ciphers if needed
    // }
});

transporter.verify((error, success) => {
    if (error) {
        console.error('Error with Nodemailer transporter configuration:', error);
    } else {
        console.log('Nodemailer transporter is configured and ready to send emails.');
    }
});

// API endpoint for contact form
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const mailOptions = {
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`, // sender address
        to: process.env.RECIPIENT_EMAIL, // list of receivers
        subject: 'New Contact Form Submission from Portfolio', // Subject line
        text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`, // plain text body
        html: `<p>You have a new contact form submission:</p>
               <ul>
                 <li><strong>Name:</strong> ${name}</li>
                 <li><strong>Email:</strong> ${email}</li>
                 <li><strong>Message:</strong> ${message}</li>
               </ul>`, // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send message. ' + error.message });
        }

        // Optional: Log submission to a file
        const logEntry = `${new Date().toISOString()}, Name: ${name}, Email: ${email}, Message: ${message}\n`;
        fs.appendFile(path.join(__dirname, 'contact_submissions.log'), logEntry, (err) => {
            if (err) {
                console.error('Failed to write to log file:', err);
            }
        });

        res.status(200).json({ success: 'Message sent successfully!' });
    });
});

app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
});
