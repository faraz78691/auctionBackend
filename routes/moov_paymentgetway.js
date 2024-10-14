const express = require('express');
const moovController = require('../controller/moovController');
const router = express.Router();

router.post('/account', moovController.createAccount);

module.exports = router;