const { Moov } = require('@moovio/node'); // Import the Moov SDK
require('dotenv').config();

// Setup Moov API credentials
const MOOV_ACCOUNT_ID = process.env.MOOV_ACCOUNT_ID;
const MOOV_PUBLIC_KEY = process.env.MOOV_API_KEY;   // Your Moov Public Key
const MOOV_SECRET_KEY = process.env.MOOV_API_SECRET;   // Your Moov Secret Key
const MOOV_DOMAIN = process.env.MOOV_DOMAIN;
const MOOV_API_KEY = process.env.MOOV_API_KEY;

// Log the values for debugging
console.log('MOOV_API_KEY:', MOOV_API_KEY);
console.log('MOOV_ACCOUNT_ID:', MOOV_ACCOUNT_ID);
console.log('MOOV_DOMAIN:', MOOV_DOMAIN);

// Initialize the Moov SDK
const moov = new Moov({
    accountID: MOOV_ACCOUNT_ID,      // Your Moov Account ID
    publicKey: MOOV_PUBLIC_KEY,      // Your Moov Public Key
    secretKey: MOOV_SECRET_KEY,      // Your Moov Secret Key
    domain: MOOV_DOMAIN              // Your Moov domain (e.g., "https://sandbox.moov.io" or "https://api.moov.io")
});

// Create a customer API function
exports.createAccount = async (req, res) => {
    try {
        const accountData = req.body; // Get customer data from request body
        // Create a new customer using Moov SDK
        const customer = await moov.accounts.create(accountData);
        console.log('Customer created successfully:', customer);
        // Send success response
        res.status(201).json(customer);
    } catch (error) {
        // Handle errors accordingly
        if (error.response && error.response.status) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    }
};