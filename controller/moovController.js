require('dotenv').config();
const axios = require('axios');

exports.moovPayment = async (req, res) => {
    const paymentData = {
        // Replace with actual payment data
        amount: req.body.amount,
        currency: req.body.currency,
    };
    try {
        const response = await axios.post(`${process.env.MOOV_BASE_URL}/payments`, paymentData, {
            headers: {
                'Authorization': `Bearer ${process.env.MOOV_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        res.status(201).json(response.data);
    } catch (error) {
        console.error('Payment error:', error);
        res.status(error.response ? error.response.status : 500).json({
            error: error,
            details: error.response ? error.response.data : error.message,
        });
    }
};