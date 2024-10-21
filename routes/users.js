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
router.post('/insertUserRole', userController.insertUserRole);
router.get('/getUserRoleDetails', userController.getUserRoleDetails);
router.post('/insertUserProfileC', userController.insertUserProfileC);
router.post('/updateUserProfileC', userController.updateUserProfileC);
router.get('/getUserRoleProfile', userController.getUserRoleProfile);
router.get('/notification', userController.notification);
router.post('/getChatMessage', userController.getChatMessage);
router.post('/update-profile', auth, userController.updateProfile);

module.exports = router;