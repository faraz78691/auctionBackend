const express = require('express');
const moovController = require('../controller/moovController');
const router = express.Router();

router.post('/customer', moovController.createCustomer);

module.exports = router;