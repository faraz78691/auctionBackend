const {
  getOffersAutoUpdate,
  getMaxBidOnOffer,
  checkTransactionID,
  insertPaymentFlowInsert,
  insertUserFeesPay,
  insertTransaction,
  updateOfferBuyStatus
} = require("../models/product");
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
            const message = {
              notification: {
                title: 'New Bid on Your Product',
                body: `You have received a bid from ${getUserWhoBid[0].user_name} on your product.`
              },
              token: getFCM[0].fcm_token
            };
            await send_notification(message, seller);
            const userFessPayDetails = {
              transaction_id: transactionId,
              buyer_id: buyer,
              seller_id: seller,
              offer_id: offerId,
              amount: max_bid,
              commissin_percent: 5,
              pay_amount: (max_bid * 5) / 100,
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
