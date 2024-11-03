
const admin = require('firebase-admin');
const serviceAccount = require('../utils/fcm.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.send_notification = async (message , userId) => {
    try {
        const response = await admin.messaging().send(message);

        const status = response.failureCount > 0 ? 'failed' : 'success';
        const responseText = JSON.stringify(response);
        // Save notification details to the database
        // const result = await create_notification(message, status, responseText)
        console.log('Notification saved to database:', response);

        if (status === 'failed') {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(message.token);
                }
            });
            console.log('List of tokens that caused failures:', failedTokens);
        } else {
            return {
                success: true,
                message: 'Notification sent successfully',
                data: response,
            };
        }
    } catch (error) {
        if (errorCode == "messaging/registration-token-not-registered") {

        //    delete krna h fcm token user k
            return {
                success: false,
                message: 'FCM token  expired'
               
            };
        }
        console.error('Error sending notification:', error);
    }
};