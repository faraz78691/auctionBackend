const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const { auth } = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post('/resetPassword', userController.resetPassword);
router.get('/verifyhomeUser/:token/:id', userController.verifyhomeUser);
router.post('/forgetPassword', userController.forgetPassword);
router.get('/verifyPassword/:token/', userController.verifyPassword);
router.post('/updatePassword', userController.updatePassword);
router.post('/insertUserRole', auth, userController.insertUserRole);
router.get('/getUserRoleDetails', auth, userController.getUserRoleDetails);
router.post('/insertUserProfileC', userController.insertUserProfileC);
router.post('/updateUserProfileC', userController.updateUserProfileC);
router.get('/getUserRoleProfile', auth, userController.getUserRoleProfile);
router.get('/notification', userController.notification);
router.post('/getChatMessage', userController.getChatMessage);
router.post('/update-profile', auth, userController.updateProfile);
router.post('/order-updatestatus', auth, userController.orderUpdateStatus);

module.exports = router;