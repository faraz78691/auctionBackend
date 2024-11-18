const {
  getOffersAutoUpdate,
  getMaxBidOnOffer,
  checkTransactionID,
  insertPaymentFlowInsert,
  insertUserFeesPay,
  insertTransaction,
  updateOfferBuyStatus
} = require("../models/product");
const {
  getData, getSelectedColumn, insertData
} = require("../models/common");
var moment = require("moment");
var randomstring = require("randomstring");
const { send_notification } = require("../helper/sendNotification");

module.exports = {
  updateOfferExpired: async () => {
    try {
      var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');
      var offerResult = await getOffersAutoUpdate(currDate);
      if (offerResult.length > 0) {
        for (item of offerResult) {
          var offerId = item.id;
          var doContinue = 1;
          var transactionId = 0;
          var seller = item.user_id;
          var productId = item.product_id
          var buyer = 0;
          var max_bid = 0;
          const result = await getMaxBidOnOffer(offerId);

          if (result.length > 0) {
            buyer = result[0].user_id;
            max_bid = result[0].bid
          }
          do {
            transactionId = randomstring.generate({
              length: 12,
              charset: "alphanumeric",
            });
            const found = await checkTransactionID(transactionId);
            if (found.length > 0) {
              doContinue = 0;
            }
          } while (doContinue);
          const transactionDetails = {
            transaction_id: transactionId,
            buyer_id: buyer,
            seller_id: seller,
            // product_id: productId,
            offer_id: offerId,
            amount: max_bid,
            is_buy_now: 0,
            is_max_bid: 1,
            created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          };
          const resultInserted = await insertTransaction(transactionDetails);
          if (resultInserted.affectedRows > 0) {
            const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id WHERE offers_created.id = ${offerId}`, 'offers_created.user_id, product.name');
            const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.bid_received');

            if (getFCM[0].item_sold == 1) {
              const message = {
                notification: {
                  title: 'Your Item Has Been Sold!',
                  body: `Congratulations! Your product "${getSellerID[0].name}" has been sold. Thank you for using our platform!`
                },
                token: getFCM[0].fcm_token
              };
              const data = {
                user_id: getSellerID[0].user_id,
                notification_type: 'Alert',
                title: 'Your Item Has Been Sold!',
                message: `Congratulations! Your product "${getSellerID[0].name}" has been sold. Thank you for using our platform!`
              }
              await insertData('tbl_notification_messages', '', data);
              await send_notification(message, getSellerID[0].user_id);
            }
            const userFessPayDetails = {
              transaction_id: transactionId,
              buyer_id: buyer,
              seller_id: seller,
              offer_id: offerId,
              amount: max_bid,
              commissin_percent: 5,
              pay_amount: (max_bid * 5) / 100 <= 200 ? (max_bid * 5) / 100 : 200,
              is_buy_now: 0,
              is_max_bid: 1,
              created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
            };
            const addUserFeesPayDetails = await insertUserFeesPay(userFessPayDetails);
            const transactionDetail = {
              offer_id: offerId,
              transaction_id: transactionId,
              buyer_id: buyer,
              seller_id: seller,
              buyer_message: 'Congratulations, you have purchased this item!',
              seller_message: 'Congratulations, you have sold this item!',
              buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
              seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
            };
            const paymenytFlowInsert = await insertPaymentFlowInsert(transactionDetail);
            const offerupdate = await updateOfferBuyStatus("1", offerId);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
