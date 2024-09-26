const express = require('express');
const buyerSellerController = require('../controller/buyerSellerController');
const router = express.Router();
const upload_files = require('../middleware/upload')

router.post('/suggestPrice', buyerSellerController.suggestPrice);
router.post('/acceptPrice', buyerSellerController.acceptPrice);
router.post('/rejectPrice', buyerSellerController.rejectPrice);
router.post('/getPriceSuggestedBySellerStatus', buyerSellerController.getPriceSuggestedBySellerStatus);
router.post('/getPriceSuggestedForBuyer', buyerSellerController.getPriceSuggestedForBuyer);
router.get('/getSellingSectionForSeller', buyerSellerController.getSellingSectionForSeller);
router.get('/getSoldSectionForSeller', buyerSellerController.getSoldSectionForSeller);
router.get('/getOffersByBuyer', buyerSellerController.getOffersByBuyer);
module.exports = router;