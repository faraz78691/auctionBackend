const express = require('express');
const productController = require('../controller/productController');
const router = express.Router();
const upload_files = require('../middleware/upload')

router.get('/getProducts', productController.getProducts);
router.post('/uploadOfferImages', upload_files.fields([{name : "main_image"},{ name:"bottom_eside" }, { name: "top_eside" }, { name: "tilted_eside" }, { name: "defects" },  { name: "details" }, { name: "brand" }, { name: "dimension" }, { name: "accessories" }, { name: "context" }]), productController.uploadOfferImages);
router.post('/getProductsAttrByProductID', productController.getProductsAttrByProductID);
router.post('/getProductsAttrTypeByProductID', productController.getProductsAttrTypeByProductID);  
router.post('/createOffer', productController.createOffer); 
router.post('/getOffers', productController.getOffers);
router.post('/getOffersCountDown', productController.getOffersCountDown);
router.post('/createUserBids', productController.createUserBids);
router.get('/getOffer', productController.getOffer); 
router.post('/createBuyTransaction', productController.createBuyTransaction);
router.post('/getOffersFilter', productController.getOffersFilter);
router.get('/transactionHistoryUser', productController.transactionHistoryUser);
router.post('/createOfferFavourites', productController.createOfferFavourites);
router.post('/getFavouriteOffers', productController.getFavouriteOffers); 
router.post('/getSubAttributes', productController.getSubAttributes); 
router.post('/getAttributesMapping', productController.getAttributesMapping);
router.get('/getCategories', productController.getCategories); 
router.post('/getOfferAdvancedFilter', productController.getOfferAdvancedFilter);

module.exports = router;