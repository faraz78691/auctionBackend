const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { adminAuth } = require('../middleware/auth');

router.post('/login', adminController.login);
router.post('/logout', adminController.logout);
router.get('/dashboard', adminAuth, adminController.dashboard);
//Users
router.get('/getAllUsers', adminAuth, adminController.getAllUsers);
router.get('/getAllUsersOffers', adminAuth, adminController.getAllUsersOffers);
router.get('/getAllOffersByUserId', adminAuth, adminController.getAllOffersByUserId);

// Category
router.post('/addCategory', adminAuth, adminController.addCategory);
router.get('/getAllCategory', adminAuth, adminController.getAllCategory);
router.post('/getCategoryById', adminAuth, adminController.getCategoryById)
router.post('/updateCategoryById', adminAuth, adminController.updateCategoryById);

// Product
router.post('/addProduct', adminAuth, adminController.addProduct);
router.get('/getProductByCategoryId', adminAuth, adminController.getProductByCategoryId);
router.post('/getProductByProductId', adminAuth, adminController.getProductByProductId);
router.post('/updateProductByProductId', adminAuth, adminController.updateProductByProductId);
router.post('/addProductTypeAttributes', adminAuth, adminController.addProductTypeAttributes);
router.get('/getTypeAttributesByProductId', adminAuth, adminController.getTypeAttributesByProductId);
router.post('/addProductAttributes', adminAuth, adminController.addProductAttributes);
router.get('/getAttributesByAttributeTypeId', adminAuth, adminController.getAttributesByAttributeTypeId);
router.get('/getAllChatMessageUser', adminAuth, adminController.getAllChatMessageUser);
router.post('/deleteProductTypeAttribute', adminAuth, adminController.deleteProductTypeAttribute);
router.post('/deleteProductAttributeMapping', adminAuth, adminController.deleteProductAttributeMapping);
router.post('/updateProductAttributeMapping', adminAuth, adminController.updateProductAttributeMapping);
router.post('/addSubAttributesMapping', adminAuth, adminController.addSubAttributesMapping);
router.post('/updateMsgCount', adminAuth, adminController.updateMsgCount);
router.get('/getSubAttributesByProductAttributesMappingId', adminAuth, adminController.getSubAttributesByProductAttributesMappingId);
router.post('/updateSubAttributesById', adminAuth, adminController.updateSubAttributesById);
router.delete('/deleteSubAttributesById', adminAuth, adminController.deleteSubAttributesById);
router.get('/getLiveHighestBid', adminAuth, adminController.getLiveHighestBid);
router.get('/getAllTransaction', adminAuth, adminController.getAllTransaction);
router.get('/get-setting', adminAuth, adminController.getSetting);
router.post('/update-setting', adminAuth, adminController.updateSetting);

module.exports = router;