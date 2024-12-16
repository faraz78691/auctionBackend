
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
      `SELECT id as offer_id, offer_unique_id, start_price, title, end_date, is_bid_or_fixed, fixed_offer_price, buyto_price, images_id, offfer_buy_status FROM offers_created WHERE user_id = ${seller} and offfer_buy_status = 0 ORDER BY created_at DESC`
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
      `SELECT offer_id,transaction_id , seller_id, buyer_id, buyer_status, seller_status, created_at, amount FROM buy_sell_transactions WHERE seller_id = ${seller} ORDER BY created_at DESC`
    );
  },

  getMaxBidbyOfferID: async (offer_id) => {
    return db.query(
      `SELECT user_id, (SELECT SUM(count) FROM user_bids WHERE offer_id = ${offer_id}) AS count, MAX(bid) AS max_bid FROM user_bids WHERE offer_id = ${offer_id} GROUP BY user_id ORDER BY max_bid DESC LIMIT 1`
    );
  },

  getOffersByBuyerID: async (buyer) => {
    return db.query(`SELECT offer_id, MAX(created_at) AS latest_created_at FROM user_bids WHERE user_id = ${buyer} GROUP BY offer_id ORDER BY latest_created_at DESC;`);
  },


  getBidDetailsByID: async (offerId, user_id) => {
    return db.query(
      `SELECT MAX(bid) AS bid FROM user_bids WHERE offer_id = ${offerId} and user_id = ${user_id}`
    );
  },

  getQuestionAnsForSeller: async (offerId, sellerID) => {
    return db.query(
      `SELECT 
      qa.id,
      qa.offer_id,
      qa.seller_id,
      seller.user_name AS seller_name,
      qa.buyer_id,
      buyer.user_name AS buyer_name,
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
  getQuestionAnsForBuyer: async (offerId) => {
    return db.query(
      `SELECT 
      qa.id,
      qa.offer_id,
      qa.seller_id,
      seller.user_name AS seller_name,
      qa.buyer_id,
      buyer.user_name AS buyer_name,
      qa.question,
      qa.answer,
      qa.status,
      qa.public_status,
      qa.created_at,
      qa.updated_at
  FROM 
      question_answer qa
  JOIN 
      users seller ON qa.seller_id = seller.id
  JOIN 
      users buyer ON qa.buyer_id = buyer.id
  WHERE qa.offer_id = ${offerId};
  `
    );
  },

  findOfferOrderDetailsById: async (offer_id, buyer_id, seller_id) => {
    return await db.query('SELECT buy_sell_transactions.transaction_id, buy_sell_transactions.buyer_id, buy_sell_transactions.seller_id, buy_sell_transactions.offer_id, buy_sell_transactions.amount, offers_created.title, offers_created.offer_unique_id, offers_created.delivery_type, offer_images.main_image, buyer.user_name AS buyer_name, concat(buyer.address, " ", buyer.postal_code ) AS address, seller.user_name AS seller_name, seller.email AS seller_email, seller.phone_number AS seller_number FROM `buy_sell_transactions` LEFT JOIN offers_created ON offers_created.id = buy_sell_transactions.offer_id LEFT JOIN offer_images ON offer_images.id = offers_created.images_id LEFT JOIN users AS buyer ON buyer.id = buy_sell_transactions.buyer_id LEFT JOIN users AS seller ON seller.id = buy_sell_transactions.seller_id WHERE (buyer_id = ? OR seller_id = ?) AND offer_id = ?', [buyer_id, seller_id, offer_id]);
  },

  findOrderSummaryDeatils: async (offer_id, buyer_id, seller_id) => {
    return await db.query('SELECT buyer_status, seller_status, buyer_message, seller_message, buyer_created_at, seller_created_at FROM `tbl_payment_flow_status` WHERE offer_id = ? AND (buyer_id = ? OR seller_id = ?) ORDER BY buyer_created_at DESC, seller_created_at DESC;', [offer_id, buyer_id, seller_id]);
  },

  findOfferByOfferBuyerSellerId: async (offer_id, buyer_id, seller_id) => {
    return await db.query('SELECT * FROM `buy_sell_transactions` WHERE offer_id = ? AND buyer_id = ? AND seller_id = ?', [offer_id, buyer_id, seller_id]);
  },

  updateOfferBuyerStatus: async (offer_id, buyer_id, seller_id, buyer_status, seller_status) => {
    return await db.query('UPDATE `buy_sell_transactions` SET `buyer_status`= "' + buyer_status + '",`seller_status`= "' + seller_status + '" WHERE offer_id = ? AND buyer_id = ? AND seller_id = ?', [offer_id, buyer_id, seller_id]);
  },

  addPaymenetFlowStatus: async (data) => {
    return await db.query("INSERT INTO `tbl_payment_flow_status` set ?", [data]);
  },

  getAllCommissionFeesPayByUserId: async (seller_id) => {
    return await db.query('SELECT tbl_user_commissin_fees.*, offers_created.offer_unique_id, offers_created.title FROM `tbl_user_commissin_fees` LEFT JOIN offers_created ON offers_created.id = tbl_user_commissin_fees.offer_id WHERE tbl_user_commissin_fees.seller_id = ? ORDER BY tbl_user_commissin_fees.id ', [seller_id]);
  },

  checkUserNameExist: async (username) => {
    return await db.query('SELECT user_name from users where user_name = ? ', [username]);
  },

  getBoostPlan: async () => {
    return await db.query('SELECT * FROM `tbl_boost_plan`');
  },

  getAllBidsByOfferId: async (offer_id) => {
    return await db.query('SELECT user_bids.*, offers_created.offer_unique_id, offers_created.title, users.user_name, users.profile_image AS user_profile_image FROM `user_bids` LEFT JOIN offers_created ON offers_created.id = user_bids.offer_id LEFT JOIN users ON users.id = user_bids.user_id WHERE user_bids.offer_id = ? ORDER BY user_bids.id', [offer_id]);
  },

  getAllAdminCommissionFees: async () => {
    return await db.query('SELECT tbl_user_commissin_fees.*, offers_created.offer_unique_id, offers_created.title, seller_user.user_name AS seller_name, seller_user.profile_image AS seller_profile_image, buyer_user.user_name AS buyer_name, buyer_user.profile_image AS buyer_profile_image FROM `tbl_user_commissin_fees` LEFT JOIN offers_created ON offers_created.id = tbl_user_commissin_fees.offer_id LEFT JOIN users AS buyer_user ON buyer_user.id = tbl_user_commissin_fees.buyer_id LEFT JOIN users AS seller_user ON seller_user.id = tbl_user_commissin_fees.seller_id ORDER BY tbl_user_commissin_fees.id DESC;');
  },

  addRatingReview: async (data) => {
    return await db.query("insert into tbl_rating_review set ?", [data]);
  },

  getRatingReview: async (offer_id) => {
    return await db.query("SELECT SUM(CASE WHEN tbl_rating_review.rating = 'Positive' THEN 1 ELSE 0 END) AS positive_ratings_count, SUM(CASE WHEN tbl_rating_review.rating = 'Neutral' THEN 1 ELSE 0 END) AS neutral_ratings_count, SUM(CASE WHEN tbl_rating_review.rating = 'Negative' THEN 1 ELSE 0 END) AS negative_ratings_count, tbl_rating_review.id, tbl_rating_review.offer_id, tbl_rating_review.buyer_id, tbl_rating_review.seller_id, tbl_rating_review.receiving_id, tbl_rating_review.rating, tbl_rating_review.review, DATE_FORMAT(tbl_rating_review.created_at, '%M %D, %Y') AS createDate, buyer.user_name AS buyer_name, buyer.profile_image AS buyer_profile_image, seller.user_name AS seller_name, seller.profile_image AS seller_profile_image, offers_created.offer_unique_id FROM tbl_rating_review LEFT JOIN users AS buyer ON tbl_rating_review.buyer_id = buyer.id LEFT JOIN users AS seller ON tbl_rating_review.seller_id = seller.id LEFT JOIN offers_created ON tbl_rating_review.offer_id = offers_created.id WHERE tbl_rating_review.offer_id = ? GROUP BY tbl_rating_review.id;", [offer_id]);
  },

  getRatingReviewByUserId: async (receiving_id) => {
    return await db.query("SELECT SUM(CASE WHEN tbl_rating_review.rating = 'Positive' THEN 1 ELSE 0 END) AS positive_ratings_count, SUM(CASE WHEN tbl_rating_review.rating = 'Neutral' THEN 1 ELSE 0 END) AS neutral_ratings_count, SUM(CASE WHEN tbl_rating_review.rating = 'Negative' THEN 1 ELSE 0 END) AS negative_ratings_count, tbl_rating_review.id, tbl_rating_review.offer_id, tbl_rating_review.buyer_id, tbl_rating_review.seller_id, tbl_rating_review.receiving_id, tbl_rating_review.rating, tbl_rating_review.review, DATE_FORMAT(tbl_rating_review.created_at, '%M %D, %Y') AS createDate, buyer.user_name AS buyer_name, buyer.profile_image AS buyer_profile_image, seller.user_name AS seller_name, seller.profile_image AS seller_profile_image, offers_created.offer_unique_id FROM tbl_rating_review LEFT JOIN users AS buyer ON tbl_rating_review.buyer_id = buyer.id LEFT JOIN users AS seller ON tbl_rating_review.seller_id = seller.id LEFT JOIN offers_created ON tbl_rating_review.offer_id = offers_created.id WHERE tbl_rating_review.receiving_id = ? GROUP BY tbl_rating_review.id;", [receiving_id])
  }

};

