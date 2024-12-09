const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const sendEmail = async (mailOptions) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false,
        auth: {
            user: '7d4083002@smtp-brevo.com',
            pass: 'WsQ4wJ7U2OdGz1DM',
        },
    });

    // Send the email
    return transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };