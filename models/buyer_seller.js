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
      `SELECT id as offer_id, offer_unique_id, start_price, title, end_date,is_bid_or_fixed, fixed_offer_price, buyto_price, images_id FROM offers_created WHERE user_id = ${seller} and offfer_buy_status = 0 ORDER BY created_at DESC`
    );
  },

  getOffersByOfferId: async (offer_id, user_id) => {
    return db.query(
      `SELECT id as offer_id,offers_created.*, CASE WHEN favourites_offer.offer_id AND favourites_offer.user_id IS NOT NULL THEN 1 ELSE 0
END AS is_favorite FROM offers_created LEFT JOIN favourites_offer ON favourites_offer.offer_id = ${offer_id} AND favourites_offer.user_id = ${user_id} WHERE id = ${offer_id}`
    );
  },


  getOffersDetailsNotBoughtByOfferId: async (offer_id) => {
    return db.query(
      `SELECT id as offer_id, offer_unique_id, title, end_date,is_bid_or_fixed,offerStart,length_oftime, fixed_offer_price, buyto_price, images_id, start_price  FROM offers_created WHERE id = ${offer_id}  and offfer_buy_status = 0 ORDER BY created_at DESC`
    );
  },
  getOffersDetailsByOfferId: async (offer_id) => {
    return db.query(
      `SELECT id as offer_id, offer_unique_id, title, end_date,is_bid_or_fixed,offerStart,length_oftime, fixed_offer_price, buyto_price, images_id, start_price  FROM offers_created WHERE id = ${offer_id}  ORDER BY created_at DESC`
    );
  },

  getSoldOffersBySeller: async (seller) => {    
    return db.query(
      `SELECT offer_id,transaction_id , seller_id, buyer_id, created_at, amount FROM buy_sell_transactions WHERE seller_id = ${seller} ORDER BY created_at DESC`
    );
  },

  getMaxBidbyOfferID: async (offer_id) => {
    return db.query(
      `SELECT user_id, (SELECT SUM(count) FROM user_bids WHERE offer_id = ${offer_id}) AS count, MAX(bid) AS max_bid FROM user_bids WHERE offer_id = ${offer_id} GROUP BY user_id ORDER BY max_bid DESC LIMIT 1`
    );
  },

  getOffersByBuyerID: async (buyer) => {
    return db.query(
      `SELECT offer_id FROM user_bids WHERE user_id = ${buyer} ORDER BY created_at DESC`
    );
  },


  getBidDetailsByID: async (offerId, user_id) => {
    return db.query(
      `SELECT bid FROM user_bids WHERE offer_id = ${offerId} and user_id = ${user_id}`
    );
  },

  getQuestionAnsForSeller: async (offerId, sellerID) => {
    return db.query(
      `SELECT 
      qa.id,
      qa.offer_id,
      qa.seller_id,
      CONCAT(seller.first_name, ' ', seller.last_name) AS seller_name,
      qa.buyer_id,
      CONCAT(buyer.first_name, ' ', buyer.last_name) AS buyer_name,
      qa.question,
      qa.answer,
      qa.status,
      qa.created_at,
      qa.updated_at
  FROM 
      question_answer qa
  JOIN 
      users seller ON qa.seller_id = seller.id
  JOIN 
      users buyer ON qa.buyer_id = buyer.id
  WHERE 
      qa.seller_id = ${sellerID}
  AND 
      qa.offer_id = ${offerId};
  `
    );
  },
  getQuestionAnsForBuyer: async (offerId, sellerID, buyerId) => {
    return db.query(
      `SELECT 
      qa.id,
      qa.offer_id,
      qa.seller_id,
      CONCAT(seller.first_name, ' ', seller.last_name) AS seller_name,
      qa.buyer_id,
      CONCAT(buyer.first_name, ' ', buyer.last_name) AS buyer_name,
      qa.question,
      qa.answer,
      qa.status,
      qa.created_at,
      qa.updated_at
  FROM 
      question_answer qa
  JOIN 
      users seller ON qa.seller_id = seller.id
  JOIN 
      users buyer ON qa.buyer_id = buyer.id
  WHERE 
      qa.seller_id = ${sellerID}
  AND 
      qa.offer_id = ${offerId}
  AND 
      qa.buyer_id = ${buyerId};
  `
    );
  },
};
