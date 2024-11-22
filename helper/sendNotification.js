
const admin = require('firebase-admin');
const serviceAccount = require('../utils/fcm.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

exports.send_notification = async (message, userId) => {    
    try {
        // Send the notification
        const response = await admin.messaging().send(message);

        // Determine the status of the response
        const status = response.failureCount > 0 ? 'failed' : 'success';
        const responseText = JSON.stringify(response);

        // Log the notification response
        console.log('Notification Response:', response);

        // Example: Save notification details to the database (uncomment and implement `create_notification` if needed)
        // await create_notification({
        //     user_id: userId,
        //     message: JSON.stringify(message),
        //     status,
        //     response: responseText
        // });

        if (status === 'failed') {
            const failedTokens = [];

            // Collect tokens that caused failures (for batch messaging)
            if (response.responses) {
                response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                        failedTokens.push(message.token); // Adjust if tokens are in a list
                    }
                });
            } else {
                // For single messages
                console.log('Notification failed for token:', message.token);
            }

            console.log('List of tokens that caused failures:', failedTokens);

            return {
                success: false,
                message: 'Some notifications failed to send',
                failedTokens,
            };
        } else {
            return {
                success: true,
                message: 'Notification sent successfully',
                data: response,
            };
        }
    } catch (error) {
        console.error('Error sending notification:', error);

        // Check specific Firebase error codes
        if (error.code === "messaging/registration-token-not-registered") {
            console.log('FCM token is expired or invalid.');

            // Example: Remove the expired token from your database
            // await remove_fcm_token(userId, message.token);

            return {
                success: false,
                message: 'FCM token expired or invalid',
                error: error.message,
            };
        }

        // General error handling
        return {
            success: false,
            message: 'Error sending notification',
            error: error.message,
        };
    }
};
