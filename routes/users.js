const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload_files = require('../middleware/upload');
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
router.post('/send-otp', userController.sendOtp);
router.post('/createCheckoutSession', auth, userController.createCheckoutSession);
router.get('/getSavedCards', auth, userController.getSavedCards);
router.post('/payWithSavedCard', auth, userController.payWithSavedCard);
router.get('/getnotificationByUserId', auth, userController.getnotificationByUserId);
router.post('/updatenotificationByUserId', auth, userController.updatenotificationByUserId);
router.post('/add-card', auth, userController.addCrad);
router.post('/delete-card', auth, userController.deleteCard);
router.post('/add-search', auth, userController.addSearch);
router.get('/get-search', auth, userController.getSearch);
router.post('/add-followUp', auth, userController.addFollowUp);
router.get('/get-followUp', auth, userController.getFollowUp);
router.get('/delete-followup', auth, userController.deleteFollowup);
router.get('/get-userbyid', userController.getUserById);
router.post('/add-accountdetail', auth, userController.addAccountDetail);
router.get('/get-accountdetail', auth, userController.getAccountDetail);
router.get('/get-notificationmessage', auth, userController.getNotificationMessage);
router.post('/update-notificationmessagestatus', userController.updateNotificationMessageStatus);
router.post('/upload-profile', auth, upload_files.fields([{ name: "upload_profile" }]), userController.uploadProfile);
router.post('/search-location', userController.searchLocation);
router.get('/get-latlong', userController.getLatLong);
router.post('/update-token', auth, userController.updateToken);

module.exports = router;