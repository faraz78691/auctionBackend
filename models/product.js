const db = require("../utils/database");


module.exports = {
  getProductDetails: async () => {
    return db.query("select * from product");
  },

  getProductAttributesByID: async (product_id) => {
    return db.query("select * from product_attributes_mapping where product_id= ?", [product_id]);
  },

  getProductTypeAttributeByID: async (product_id) => {
    return db.query("select * from product_type_attribute where product_id= ?", [product_id]);
  },

  insertOfferImages: async (data) => {
    return db.query("insert into offer_images set ?", [data]);
  },
  getOfferIdByAttributes: async (product_id, ids) => {
    return db.query("select offer_id  from offer_proattr_mapping where product_id=? and attribute_id IN (?)", [product_id, ids]);
  },

  getOfferIdByConditions :async (product_id, ids) => {
    return db.query("SELECT offer_id FROM offer_condition_mapping WHERE product_id = ? AND condition_id IN (?)", [product_id, ids]);
  },
  getOfferIdByAuctionType :async (product_id, ids) => {
    return db.query("SELECT id FROM offers_created WHERE product_id = ? AND is_bid_or_fixed IN (?)", [product_id, ids]);
  },

  getProductAttributeTypeMapping: async (product_id, attribute_id) => {
    return db.query("select id, attribute_value_name, is_sub_attribute, sub_attribute_heading from product_attributes_mapping where product_id= ? and attribute_id = ?", [product_id, attribute_id]);
  },

  insertOfferCreated: async (data) => {
    return db.query("insert into offers_created set ?", [data]);
  },

  getOffersByWhereClause: async (where, limit, offset) => {
    return db.query(`select id,
                              product_id,
                              title, 
                              product_type,
                              images_id,
                              offerStart,
                              is_bid_or_fixed,
                              start_date,
                              length_oftime,
                              FLOOR(HOUR(TIMEDIFF(end_date,CURRENT_TIMESTAMP))/24) as remaining_days,
                              (TIMEDIFF(end_date,CURRENT_TIMESTAMP)) as remaining_time,
                              start_price, increase_step, buyto_price,
                              fixed_offer_price,duration,offfer_buy_status,
                              user_id
                              from offers_created ${where}
                              ORDER BY  remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset};`);
  },

  getNoOfBids: async (offer_id) => {
    // removing product_id no need of this
    return db.query("select count(*) as count, max(bid) as max_bid from user_bids where offer_id =?", [ offer_id]);
  },

  getMainImage: async (id) => {
    return db.query("select main_image from offer_images where id = ?", [id]);
  },

  insertAttributOffers: async (data) => {
    return db.query("insert into offer_proattr_mapping set ?", [data]);
  },

  insertConditionOffers: async (data) => {
    return db.query("insert into offer_condition_mapping set ?", [data]);
  },


  getCountDownByOfferId: async (offerId) => {
    return db.query(`select FLOOR(HOUR(TIMEDIFF(end_date,CURRENT_TIMESTAMP))/24) as remaining_days,
                            (TIMEDIFF(end_date,CURRENT_TIMESTAMP)) as remaining_time
                            from offers_created where id='${offerId}'`);
  },

  getOfferRecord: async (offerId) => {
    return db.query(`select buyto_price from offers_created where id = ?`, [offerId]);
  },

  selectBidbyUser: async (offerId, product_id, user_id) => {
    return db.query(`select bid from user_bids where  offer_id = ? and product_id =? and user_id =?`, [offerId, product_id, user_id]);
  },

  updateBidsByUser: async (offer_id, user_id, product_id, bid, lastBid) => {
    return db.query("update user_bids set last_bid =?, bid=? where offer_id = ? and product_id =? and user_id =?", [lastBid, bid, offer_id, product_id, user_id]);
  },

  insertBidByUser: async (data) => {
    return db.query("insert into user_bids set ?", [data]);
  },

  getCategoryIdByProductId: async (product_id) => {
    return db.query("select category_id from product where id=?", [product_id]);
  },

  getCategorybyId: async (categoryId) => {
    return db.query("select cat_name from category where id=?", [categoryId]);
  },

  getProductDetailsByID: async (product_id) => {
    return db.query("select * from product where id=?", [product_id]);
  },

  getOfferDetailsByID: async (offer_id) => {
    return db.query("select * from offers_created where id=?", [offer_id]);
  },
  getOfferAttributesDetailsByID: async (offer_id) => {
    return db.query("select * from offer_proattr_mapping where offer_id=?", [offer_id]);
  },

  getOfferAttributesDetailsByProductID: async (offer_id) => {
    return db.query("select * from offer_proattr_mapping where product_id =?", [offer_id]);
  },

  getOfferImages: async (id) => {
    return db.query("select * from offer_images where id = ?", [id]);
  },

  getProductTypeAttribute: async (product_id, attribute_id) => {
    return db.query("select id, attribute_name, heading from product_type_attribute where product_id= ? and id = ?", [product_id, attribute_id]);
  },

  getProductAttributeTypeMappingByIDP: async (product_id, id) => {
    return db.query("select * from product_attributes_mapping where product_id= ? and id = ?", [product_id, id]);
  },

  checkTransactionID: async (transactionID) => {
    return db.query("select count(*) from buy_sell_transactions where transaction_id = ?", [transactionID]);
  },

  insertTransaction: async (data) => {
    return db.query("insert into buy_sell_transactions set ?", [data]);
  },

  getProductIdsByName: async (product_name) => {
    return db.query(`select id from product where name like '%${product_name}%'`);
  },

  getTransactionsHistory: async (user_id) => {
    return db.query(`select * from  buy_sell_transactions where buyer_id = '${user_id}'`);
  },

  // updated code 26-07-2024
  getTransactionsHistoryUpdated: async (user_id) => {

    return db.query(`select A.*,S.first_name,S.last_name,O.images_id,O.offerStart,O.fixed_offer_price, O.title from  buy_sell_transactions A 
    LEFT JOIN offers_created O ON A.offer_id = O.id  
    LEFT JOIN users S ON A.seller_id = S.id  
    where A.buyer_id = '${user_id}'`);
  },
  // updated code 26-07-2024
  getoffer_images: async (images_id) => {
    return db.query(`select * from  offer_images where id  = '${images_id}'`);
  },

  //updated code 26-07-2024
  updateOfferBuyStatus: async (offfer_buy_status, offer_id) => {
    return db.query("update offers_created set offfer_buy_status =? where id = ?", [offfer_buy_status, offer_id]);
  },

  insertOfferFavourites: async (data) => {
    return db.query("insert into favourites_offer set ?", [data]);
  },

  getFavouriteOffersByUserId: async (user_id) => {
    return db.query(`select * from  favourites_offer where user_id  = '${user_id}'`);
  },

  getSubAttributesByID: async (id) => {
    return db.query(`select * from  sub_attribute_mapping where attribute_mapping_id  = '${id}'`);
  },

  getSubAttributesHeadingByIDValue: async (attributeId, attributeValue) => {
    return db.query(`select sub_attribute_heading from  product_attributes_mapping where attribute_id  = '${attributeId}' and attribute_value_name='${attributeValue}'`);
  },

  getSubAttributesByIID: async (id) => {
    return db.query(`select * from  sub_attribute_mapping where id  = '${id}'`);
  },

  getCategoriesAll: async (id) => {
    return db.query(`select id, cat_name, product_id from  category`);
  },

  getProductNameByID: async (category_id) => {
    return db.query(`select id, name from product where category_id = '${category_id}'`);
  },

  getOffersBDynamically: async (from, where, limit, offset) => {
    return db.query(`select oc.id,
       oc.product_id,
       oc.title, 
       oc.product_type,
       oc.images_id,
       oc.offerStart,
       oc.is_bid_or_fixed,
       oc.start_date,
       oc.length_oftime,
       FLOOR(HOUR(TIMEDIFF(oc.end_date,CURRENT_TIMESTAMP))/24) as remaining_days,
       (TIMEDIFF(oc.end_date,CURRENT_TIMESTAMP)) as remaining_time,
       oc.start_price, oc.increase_step, oc.buyto_price,
       oc.fixed_offer_price, oc.duration, oc.offfer_buy_status,
       oc.user_id
       ${from}  ${where}
       ORDER BY  remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset};`);
  },

  getOfferIds: async (table_name, product_id, ids) => {
    return db.query(`select offer_id  from ${table_name} where product_id=? and attribute_id IN (?)`, [product_id, ids]);
  },

  getOffersByIDs :async (ids) => {
    return db.query("SELECT * FROM offers_created WHERE offfer_buy_status != 1 AND id IN (?)", [ ids]);
  },

  getOffersByIDsWhereClause: async (ids, limit, offset) => {
    return db.query(`select id,
                              product_id,
                              title, 
                              product_type,
                              images_id,
                              offerStart,
                              is_bid_or_fixed,
                              start_date,
                              length_oftime,
                              FLOOR(HOUR(TIMEDIFF(end_date,CURRENT_TIMESTAMP))/24) as remaining_days,
                              (TIMEDIFF(end_date,CURRENT_TIMESTAMP)) as remaining_time,
                              start_price, increase_step, buyto_price,
                              fixed_offer_price,duration,offfer_buy_status,
                              user_id
                              from offers_created WHERE offfer_buy_status != 1 AND id IN (?)
                              ORDER BY  remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset}`, [ids]);
  },


  getOffersAutoUpdate: async () => {
    return db.query(`select id, user_id, product_id from offers_created where is_bid_or_fixed=1 and offfer_buy_status=0 and end_date < CURRENT_TIMESTAMP `);
  },

  getMaxBidOnOffer:async(offer_id) =>{
    var max_bid =  await db.query(`select max(bid) as max from user_bids where offer_id = ${offer_id}`);
    return db.query(`select user_id, bid from user_bids where offer_id = ${offer_id} and bid =${max_bid[0].max}`);
  }

}                       