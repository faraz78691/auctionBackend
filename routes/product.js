const express = require('express');
const productController = require('../controller/productController');
const router = express.Router();
const upload_files = require('../middleware/upload')
const { auth } = require('../middleware/auth');

router.get('/getProducts', auth, productController.getProducts);
router.post('/uploadOfferImages', auth, upload_files.fields([{ name: "main_image" }, { name: "bottom_eside" }, { name: "top_eside" }, { name: "tilted_eside" }, { name: "defects" }, { name: "details" }, { name: "brand" }, { name: "dimension" }, { name: "accessories" }, { name: "context" }]), productController.uploadOfferImages);
router.post('/getProductsAttrByProductID', auth, productController.getProductsAttrByProductID);
router.post('/getProductsAttrTypeByProductID', auth, productController.getProductsAttrTypeByProductID);
router.post('/createOffer', auth, productController.createOffer);
router.post('/updateOffer', auth, productController.updateOffer);
router.post('/getOffers', auth, productController.getOffers);
router.post('/getOffersCountDown', productController.getOffersCountDown);
router.post('/createUserBids', auth, productController.createUserBids);
router.get('/getOffer', productController.getOffer);
router.post('/createBuyTransaction', auth, productController.createBuyTransaction);
router.post('/getOffersFilter', productController.getOffersFilter);
router.get('/transactionHistoryUser', auth, productController.transactionHistoryUser);
router.post('/createOfferFavourites', auth, productController.createOfferFavourites);
router.post('/getFavouriteOffers', auth, productController.getFavouriteOffers);
router.post('/getSubAttributes', productController.getSubAttributes);
router.post('/getAttributesMapping', productController.getAttributesMapping);
router.get('/getCategories', productController.getCategories);
router.post('/getOfferAdvancedFilter', productController.getOfferAdvancedFilter);
router.post('/getProductBySearch', productController.getProductBySearch);
router.post('/getOffersByCategoryId', productController.getOffersByCategoryId);
router.get('/getOffersByProductId', auth, productController.getOffersByProductId);
router.get('/updateOfferExpired', productController.updateOfferExpired);

module.exports = router;