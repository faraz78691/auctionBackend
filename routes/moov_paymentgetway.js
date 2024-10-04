const express = require('express');
const moovController = require('../controller/moovController');
const router = express.Router();

router.post('/moov-payment', moovController.moovPayment);

module.exports = router;