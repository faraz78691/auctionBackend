const {
  getOffersAutoUpdate,
  getMaxBidOnOffer,
  checkTransactionID,
  insertPaymentFlowInsert,
  insertUserFeesPay,
  insertTransaction,
  updateOfferBuyStatus,
  getUserBidByOfferId
} = require("../models/product");
const {
  getData, getSelectedColumn, insertData
} = require("../models/common");
var moment = require("moment");
var randomstring = require("randomstring");
const { send_notification } = require("../helper/sendNotification");
const { findSetting } = require("../models/admin");

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
              const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offerId}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
              const getUserWhoBid = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${buyer}`, `users.user_name, tbl_user_notifications.item_sold`);
              const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.item_sold');
              if (getFCM[0].item_sold == 1) {
                const message = {
                  notification: {
                    title: 'Congratulations! Your Item Has Been Sold!',
                    body: `${getUserWhoBid[0].user_name} has successfully purchased your item: ${getSellerID[0].title}.`
                  },
                  token: getFCM[0].fcm_token
                };
                const data = {
                  user_id: getSellerID[0].user_id,
                  notification_type: 'Alert',
                  title: 'Congratulations! Your Item Has Been Sold!',
                  message: `${getUserWhoBid[0].user_name} has successfully purchased your item: ${getSellerID[0].title}.`
                }
                await insertData('tbl_notification_messages', '', data);
                await send_notification(message, getSellerID[0].user_id);
              }
              const userBidsResult = await getUserBidByOfferId(offerId);
              if (userBidsResult.length > 0) {
                for (let elem of userBidsResult) {
                  const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offerId}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
                  const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${elem.user_id}`, 'users.id, users.fcm_token, tbl_user_notifications.item_sold');
                  if (getFCM[0].auction_not_won == 1) {
                    const message = {
                      notification: {
                        title: 'Better Luck Next Time!',
                        body: `Unfortunately, you didn't win the auction for: ${getSellerID[0].title}. Stay tuned for more exciting offers!`
                      },
                      token: getFCM[0].fcm_token
                    };
                    const data = {
                      user_id: getFCM[0].id,
                      notification_type: 'Alert',
                      title: 'Better Luck Next Time!',
                      message: `Unfortunately, you didn't win the auction for: ${getSellerID[0].title}. Stay tuned for more exciting offers!`
                    }
                    await insertData('tbl_notification_messages', '', data);
                    await send_notification(message, getFCM[0].id);
                  }
                }
              }
              const resultSetting = await findSetting();
              const userFessPayDetails = {
                transaction_id: transactionId,
                buyer_id: buyer,
                seller_id: seller,
                offer_id: offerId,
                amount: max_bid,
                commissin_percent: resultSetting[0].commission,
                pay_amount: (max_bid * resultSetting[0].commission) / 100 <= 200 ? (max_bid * resultSetting[0].commission) / 100 : 200,
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
          } else {
            const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offerId}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
            const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.item_sold');
            if (getFCM[0].item_not_sold == 1) {
              const message = {
                notification: {
                  title: 'Unfortunately, Your Item Was Not Sold!',
                  body: `The listing for your item, ${getSellerID[0].title}, has ended without a successful sale.`
                },
                token: getFCM[0].fcm_token
              };
              const data = {
                user_id: getSellerID[0].user_id,
                notification_type: 'Alert',
                title: 'Unfortunately, Your Item Was Not Sold!',
                message: `The listing for your item, ${getSellerID[0].title}, has ended without a successful sale.`
              }
              await insertData('tbl_notification_messages', '', data);
              await send_notification(message, getSellerID[0].user_id);
            }
            console.log("Not any bid found in this offer");
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
