const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');
const { adminAuth } = require('../middleware/auth');

router.post('/login', adminController.login);
router.post('/logout', adminController.logout);

//Users
router.get('/getAllUsers', adminAuth, adminController.getAllUsers);
router.get('/getAllUsersOffers', adminAuth, adminController.getAllUsersOffers);

// Category
router.post('/addCategory', adminAuth, adminController.addCategory);
router.get('/getAllCategory', adminAuth, adminController.getAllCategory);

// Product
router.post('/addProduct', adminAuth, adminController.addProduct);
router.get('/getProductByCategoryId', adminAuth, adminController.getProductByCategoryId);
router.post('/addProductTypeAttributes', adminAuth, adminController.addProductTypeAttributes);
router.get('/getTypeAttributesByProductId', adminAuth, adminController.getTypeAttributesByProductId);
router.post('/addProductAttributes', adminAuth, adminController.addProductAttributes);
router.get('/getAttributesByAttributeTypeId', adminAuth, adminController.getAttributesByAttributeTypeId);
router.get('/getAllChatMessageUser', adminAuth, adminController.getAllChatMessageUser);

module.exports = router;