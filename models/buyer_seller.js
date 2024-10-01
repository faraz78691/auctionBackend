const db = require("../utils/database");

module.exports = {
  insertPriceSuggestion: async (data) => {
    return db.query("insert into price_suggestion set ?", [data]);
  },

  updateStatus: async (offer_id, buyer, seller) => {
    return db.query(
      "update price_suggestion set status = 'Approved' where offer_id = ? and seller_id = ? and buyer_id =?",
      [offer_id, seller, buyer]
    );
  },

  rejectStatus: async (offer_id, buyer, seller) => {
    return db.query(
      "update price_suggestion set status = 'Rejected' where offer_id = ? and seller_id = ? and buyer_id =?",
      [offer_id, seller, buyer]
    );
  },

  getPriceSuggestionSeller: async (seller, status) => {
    if ((status = "All")) {
      return db.query("select * from price_suggestion where seller_id = ?", [
        seller,
      ]);
    } else {
      return db.query(
        "select * from price_suggestion where seller_id = ? and status = ?",
        [seller, status]
      );
    }
  },

  getPriceSuggestionBuyer: async (buyer) => {
    return db.query("select * from price_suggestion where buyer_id = ?", [
      buyer,
    ]);
  },

  getOffersWithMaxBids: async (seller) => {
    return db.query(
      `SELECT max(bid), offer_id FROM user_bids WHERE user_id = ${seller} group by offer_id`
    );
  },

  getOffersBySeller: async (seller) => {
    return db.query(
      `SELECT id as offer_id,start_price, title, end_date,is_bid_or_fixed, fixed_offer_price, buyto_price, images_id FROM offers_created WHERE user_id = ${seller} and offfer_buy_status = 0 ORDER BY created_at DESC`
    );
  },

  getOffersByOfferId: async (offer_id) => {
    return db.query(
      `SELECT id as offer_id,offers_created.*  FROM offers_created WHERE id = ${offer_id}`
    );
  },


  getOffersDetailsNotBoughtByOfferId: async (offer_id) => {
    return db.query(
      `SELECT id as offer_id, title, end_date,is_bid_or_fixed,offerStart,length_oftime, fixed_offer_price, buyto_price, images_id, start_price  FROM offers_created WHERE id = ${offer_id}  and offfer_buy_status = 0 ORDER BY created_at DESC`
    );
  },
  getOffersDetailsByOfferId: async (offer_id) => {
    return db.query(
      `SELECT id as offer_id, title, end_date,is_bid_or_fixed,offerStart,length_oftime, fixed_offer_price, buyto_price, images_id, start_price  FROM offers_created WHERE id = ${offer_id}  ORDER BY created_at DESC`
    );
  },

  

  getSoldOffersBySeller: async (seller) => {
    return db.query(
      `SELECT offer_id,transaction_id , seller_id, buyer_id,created_at, amount FROM buy_sell_transactions WHERE seller_id = ${seller} ORDER BY created_at DESC`
    );
  },

  getMaxBidbyOfferID: async (offerId) => {
    return db.query(
      `SELECT max(bid) as price, user_id FROM user_bids WHERE offer_id = ${offerId}`
    );
  },

  getOffersByBuyerID: async (buyer) => {
    return db.query(
      `SELECT offer_id  FROM user_bids WHERE user_id = ${buyer} ORDER BY created_at DESC`
    );
  },


  getBidDetailsByID: async (offerId, user_id) => {
    return db.query(
      `SELECT bid FROM user_bids WHERE offer_id = ${offerId} and user_id = ${user_id}`
    );
  },

  getBidCountsByOfferID: async (offerId) => {
    return db.query(
      `SELECT count(*) as bid_count FROM user_bids WHERE offer_id = ${offerId}`
    );
  },
};
