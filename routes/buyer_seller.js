const express = require('express');
const buyerSellerController = require('../controller/buyerSellerController');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.post('/suggestPrice', buyerSellerController.suggestPrice);
router.post('/acceptPrice', buyerSellerController.acceptPrice);
router.post('/rejectPrice', buyerSellerController.rejectPrice);
router.post('/getPriceSuggestedBySellerStatus', auth, buyerSellerController.getPriceSuggestedBySellerStatus);
router.post('/getPriceSuggestedForBuyer', auth, buyerSellerController.getPriceSuggestedForBuyer);
router.get('/getSellingSectionForSeller', auth, buyerSellerController.getSellingSectionForSeller);
router.post('/uploadBuyerQuestion', auth, buyerSellerController.uploadBuyerQuestion);
router.post('/uploadSellerAnswer', auth, buyerSellerController.uploadSellerAnswer);
router.post('/getQuestionAnswerForBuyer', buyerSellerController.getQuestionAnswerForBuyer);
router.get('/getQuestionAnswerForSeller', auth, buyerSellerController.getQuestionAnswerForSeller);
router.get('/getSoldSectionForSeller', auth, buyerSellerController.getSoldSectionForSeller);
router.get('/getOffersByBuyer', auth, buyerSellerController.getOffersByBuyer);
router.post('/ordersummary', auth, buyerSellerController.productOfferOrderDetail);
router.post('/updatetransaction-status', auth, buyerSellerController.updateTransactionStatus);
router.get('/getfeespay-userid', auth, buyerSellerController.getFeesPayUserId);
router.get('/getallbid-offerid', buyerSellerController.getAllBidsByOfferId);
router.get('/getAllAdminCommissionFees', buyerSellerController.getAllAdminCommissionFees);
router.get('/checkUserNameExist/:username', buyerSellerController.checkUserNameExist);
router.get('/getBoostPlan', buyerSellerController.getBoostPlan);
router.post('/add-ratingreview', buyerSellerController.addRatingReview);
router.get('/get-ratingreview', buyerSellerController.getRatingReview);
router.get('/get-ratingreviewbyreceivingid', buyerSellerController.getRatingReviewByReceivingId);

module.exports = router;