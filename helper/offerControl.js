const {
  getOffersAutoUpdate,
  getMaxBidOnOffer,
  checkTransactionID,
  insertTransaction,
  updateOfferBuyStatus
} = require("../models/product");

var randomstring = require("randomstring");

module.exports = {
  updateOfferExpired: async () => {
    try {
      var offerResult = await getOffersAutoUpdate();
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
            product_id: productId,
            offer_id: offerId,
            amount: max_bid,
            is_buy_now: 0,
            is_max_bid: 1,
          };       
          const resultInserted = await insertTransaction(transactionDetails);
          if (resultInserted.affectedRows > 0) {
            const offerupdate = await updateOfferBuyStatus("1", offerId);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
