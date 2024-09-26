const request = require('request');

const getPagination = (page, size) => {
    const limit = size ? +size : 3;
    const offset = page ? page * limit : 0;

    return { limit, offset };
};


function sendOTP(mobileNumber = '') {
    const options = {
        'method': 'POST',
        'url': 'https://verificationapi-v1.sinch.com/verification/v1/verifications',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Basic MWM1NWUzYjctODQ0ZS00M2RjLWE1OTYtMzA3MDUzYzExNTRlOm81aTJpR2tab1VHZEk0MWF1Ulk2ZlE9PQ=='
        },
        body: JSON.stringify({
            "identity": {
            "type": "number",
            "endpoint": mobileNumber
            },
            "method": "sms"
        })
    };

    request(options, function (error, response) {
        if (error) {
            return res.json({
                "success": false,
                "message": "OTP send failed",
                "status": 400
            });
        }
    });
}


module.exports = {
    getPagination,
    sendOTP
};