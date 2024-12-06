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

  getOfferIdByConditions: async (product_id, ids) => {
    return db.query("SELECT offer_id FROM offer_condition_mapping WHERE product_id = ? AND condition_id IN (?)", [product_id, ids]);
  },
  getOfferIdByAuctionType: async (product_id, ids) => {
    return db.query("SELECT id, offer_unique_id FROM offers_created WHERE product_id = ? AND is_bid_or_fixed IN (?)", [product_id, ids]);
  },

  getProductAttributeTypeMapping: async (product_id, attribute_id) => {
    return db.query("select id, attribute_value_name, is_sub_attribute, sub_attribute_heading from product_attributes_mapping where product_id= ? and attribute_id = ?", [product_id, attribute_id]);
  },

  findProductById: async (product_id) => {
    return db.query(`SELECT * FROM product WHERE id = ${product_id}`);
  },

  insertOfferCreated: async (data) => {
    return db.query("insert into offers_created set ?", [data]);
  },

  findBootPlanById: async (id) => {
    return await db.query('SELECT * FROM `tbl_boost_plan` WHERE id = ?', [id]);
  },

  updateOfferById: async (data, offer_id) => {
    return db.query("update offers_created set ? where id = ?", [data, offer_id]);
  },

  getOffersByWhereClause: async (where, user_id, limit, offset) => {
    if (user_id == '') {
      return db.query(`SELECT
        id,
        offer_unique_id,
        product_id,
        title,
        product_type,
        images_id,
        offerStart,
        is_bid_or_fixed,
        start_date,
        length_oftime,
        end_date,
        FLOOR(
            HOUR(
                TIMEDIFF(end_date, CURRENT_TIMESTAMP)
            ) / 24
        ) AS remaining_days,
        (
            TIMEDIFF(end_date, CURRENT_TIMESTAMP)
        ) AS remaining_time,
        start_price,
        increase_step,
        buyto_price,
        fixed_offer_price,
        duration,
        boost_plan_id,
        offfer_buy_status,
        user_id
                                  from offers_created ${where}
                                  ORDER BY remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset};`);
    } else {
      return db.query(`SELECT
        offers_created.id,
        offers_created.offer_unique_id,
        offers_created.product_id,
        offers_created.title,
        offers_created.product_type,
        offers_created.images_id,
        offers_created.offerStart,
        offers_created.is_bid_or_fixed,
        offers_created.start_date,
        offers_created.length_oftime,
        offers_created.end_date,
        FLOOR(
            HOUR(
                TIMEDIFF(offers_created.end_date, CURRENT_TIMESTAMP)
            ) / 24
        ) AS remaining_days,
        (
            TIMEDIFF(offers_created.end_date, CURRENT_TIMESTAMP)
        ) AS remaining_time,
        offers_created.start_price,
        offers_created.increase_step,
        offers_created.buyto_price,
        offers_created.fixed_offer_price,
        offers_created.duration,
        offers_created.boost_plan_id,
        offers_created.offfer_buy_status,
        offers_created.user_id,  
        CASE 
            WHEN favourites_offer.offer_id IS NOT NULL THEN 1
            ELSE 0
        END AS is_favorite
                                  from offers_created LEFT JOIN (SELECT offer_id FROM favourites_offer WHERE user_id = ${user_id}) AS favourites_offer ON favourites_offer.offer_id = offers_created.id ${where}
                                  ORDER BY remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset};`);
    }
  },

  getOffersByUSerId: async (where, limit, offset) => {
    return db.query(`SELECT
        id,
        offer_unique_id,
        product_id,
        title,
        product_type,
        images_id,
        offerStart,
        is_bid_or_fixed,
        start_date,
        length_oftime,
        end_date,
        FLOOR(
            HOUR(
                TIMEDIFF(end_date, CURRENT_TIMESTAMP)
            ) / 24
        ) AS remaining_days,
        (
            TIMEDIFF(end_date, CURRENT_TIMESTAMP)
        ) AS remaining_time,
        start_price,
        increase_step,
        buyto_price,
        fixed_offer_price,
        duration,
        offfer_buy_status,
        user_id
                                  from offers_created ${where}
                                  ORDER BY remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset};`);

  },

  getOffersByCategoryWhereClause: async (where, limit, offset) => {
    return db.query(`select offers_created.id,
      offers_created.offer_unique_id,
      offers_created.product_id,
      offers_created.title, 
      offers_created.product_type,
      offers_created.images_id,
      offers_created.offerStart,
      offers_created.is_bid_or_fixed,
      offers_created.start_date,
      offers_created.length_oftime,
      offers_created.end_date,
      FLOOR(HOUR(TIMEDIFF(offers_created.end_date,CURRENT_TIMESTAMP))/24) as remaining_days,
      (TIMEDIFF(offers_created.end_date,CURRENT_TIMESTAMP)) as remaining_time,
      offers_created.start_price, offers_created.increase_step, offers_created.buyto_price,
      offers_created.fixed_offer_price,offers_created.duration,offers_created.offfer_buy_status,
      offers_created.user_id
      from offers_created LEFT JOIN product ON product.id = offers_created.product_id ${where}
      ORDER BY remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset};`);
  },

  getNoOfBids: async (offer_id) => {
    // removing product_id no need of this
    return db.query(`SELECT user_id, (SELECT SUM(count) FROM user_bids WHERE offer_id = ${offer_id}) AS count, MAX(bid) AS max_bid FROM user_bids WHERE offer_id = ${offer_id} GROUP BY user_id ORDER BY max_bid DESC LIMIT 1`);
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

  updateAttributOffers: async (data, offer_id) => {
    return db.query("update IGNORE offer_proattr_mapping set ? where offer_id = ?", [data, offer_id]);
  },

  updateConditionOffers: async (data, offer_id) => {
    return db.query("update IGNORE offer_condition_mapping set ? where offer_id = ?", [data, offer_id]);
  },

  getCountDownByOfferId: async (offerId) => {
    return db.query(`select FLOOR(HOUR(TIMEDIFF(end_date,CURRENT_TIMESTAMP))/24) as remaining_days,
                            (TIMEDIFF(end_date,CURRENT_TIMESTAMP)) as remaining_time
                            from offers_created where id='${offerId}'`);
  },

  getOfferRecord: async (offerId) => {
    return db.query(`select buyto_price, offer_unique_id from offers_created where id = ?`, [offerId]);
  },

  selectBidbyUser: async (offerId, user_id) => {
    return db.query(`select bid, count from user_bids where offer_id = ? and user_id =?`, [offerId, user_id]);
  },

  updateBidsByUser: async (offer_id, user_id, bid, count) => {
    return db.query("update user_bids set count =?, bid=? where offer_id = ? and user_id =?", [count, bid, offer_id, user_id]);
  },

  insertBidByUser: async (data) => {
    return db.query("insert into user_bids set ?", [data]);
  },

  getCategoryIdByProductId: async (product_id) => {
    return db.query("select category_id, name from product where id=?", [product_id]);
  },

  getCategorybyId: async (categoryId) => {
    return db.query("select cat_name from category where id = ?", [categoryId]);
  },

  getProductDetailsByID: async (product_id) => {
    return db.query("select * from product where id=?", [product_id]);
  },

  getOfferDetailsByID: async (offer_id, user_id) => {
    if (user_id == '') {
      return db.query("SELECT offers_created.* FROM offers_created WHERE id = ?", [offer_id]);
    } else {
      return db.query("SELECT offers_created.*, CASE WHEN favourites_offer.offer_id IS NOT NULL THEN 1 ELSE 0 END AS is_favorite FROM offers_created LEFT JOIN( SELECT DISTINCT offer_id FROM favourites_offer WHERE user_id = ?) AS favourites_offer ON favourites_offer.offer_id = offers_created.id WHERE id = ?", [user_id, offer_id]);
    }
  },

  getOfferAttributesDetailsByID: async (offer_id) => {
    return db.query("select * from offer_proattr_mapping where offer_id=?", [offer_id]);
  },

  getMaxBidbyOfferID: async (offer_id) => {
    return db.query(
      `SELECT user_id, (SELECT SUM(count) FROM user_bids WHERE offer_id = ${offer_id}) AS count, MAX(bid) AS max_bid FROM user_bids WHERE offer_id = ${offer_id} GROUP BY user_id ORDER BY max_bid DESC LIMIT 1`
    );
  },

  getOfferConditionsByID: async (offer_id) => {
    return db.query("select * from offer_condition_mapping where offer_id=?", [offer_id]);
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

  insertPaymentFlowInsert: async (data) => {
    return db.query('insert into tbl_payment_flow_status set ?', [data]);
  },

  insertUserFeesPay: async (data) => {
    return db.query('insert into tbl_user_commissin_fees set ?', [data]);
  },

  insertTransaction: async (data) => {
    return db.query("insert into buy_sell_transactions set ?", [data]);
  },

  getProductIdsByName: async (product_name) => {
    return db.query(`select id from product where name like '%${product_name}%'`);
  },

  getffersByName: async (product_name) => {
    return await db.query(`SELECT * FROM offers_created WHERE title LIKE '%${product_name}%'`);
  },

  getTransactionsHistory: async (user_id) => {
    return db.query(`select * from  buy_sell_transactions where buyer_id = '${user_id}'`);
  },

  // updated code 26-07-2024
  getTransactionsHistoryUpdated: async (user_id) => {
    return db.query(`select A.*,S.first_name,S.last_name,S.profile_image,O.offer_unique_id,O.images_id,O.offerStart,O.fixed_offer_price, O.title from  buy_sell_transactions A 
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
    return db.query("update offers_created set offfer_buy_status = ? where id = ?", [offfer_buy_status, offer_id]);
  },

  getUserBidByOfferId: async (offer_id) => {
    return await db.query('SELECT user_id, MAX(bid) AS max_bid FROM user_bids WHERE offer_id = ? GROUP BY user_id ORDER BY max_bid DESC LIMIT 18446744073709551615 OFFSET 1', [offer_id]);
  },

  deleteOfferById: async (offer_id) => {
    return await db.query('DELETE FROM offers_created WHERE id = ?', [offer_id]);
  },

  insertOfferFavourites: async (data) => {
    return db.query("insert into favourites_offer set ?", [data]);
  },

  getFavouriteOffersByUserId: async (user_id) => {
    return db.query(`select * from  favourites_offer where user_id  = '${user_id}'`);
  },

  deleteFavouriteOffer: async (offer_id, user_id) => {
    return await db.query('DELETE FROM `favourites_offer` WHERE offer_id = ? AND user_id = ?', [offer_id, user_id]);
  },

  getSubAttributesByID: async (id) => {
    return db.query(`select * from  sub_attribute_mapping where attribute_mapping_id  = '${id}'`);
  },

  getSellerDetails: async (id, user_id) => {
    const seller = await db.query(`SELECT users.id, users.first_name, users.last_name, users.user_name, CONCAT( users.address, " ", users.postal_code ) AS address, users.latitude, users.longitude, users.profile_image FROM users WHERE users.id = '${id}'`);
    const follower = await db.query('SELECT * FROM `tbl_followup` WHERE user_id = ? AND follow_user_id = ?', [user_id, id]);
    if (seller.length > 0) {
      seller[0].follower = follower.length > 0 ? 1 : 0;
    }
    return {
      seller,
      follower: seller[0]?.follower || 0, // Include follower value explicitly for clarity
    };
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
      oc.offer_unique_id,
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

  getOffersByIDs: async (ids) => {
    return db.query("SELECT * FROM offers_created WHERE offfer_buy_status != 1 AND id IN (?)", [ids]);
  },

  getOffersByIDsWhereClause: async (ids, product_id, price, limit, offset) => {
    if (Array.isArray(price) && price.length === 0 || price == []) {
      return db.query(`select id,
        offer_unique_id,
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
        from offers_created WHERE offfer_buy_status != 1 AND ${ids == undefined ? 'product_id = ?' : 'id IN (?)'} ORDER BY remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset}`, [ids == undefined ? product_id : ids]);
    } else {
      return db.query(`select id,
        offer_unique_id,
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
        from offers_created WHERE offfer_buy_status != 1 AND ${ids == undefined ? 'product_id = ?' : 'id IN (?)'} AND start_price BETWEEN ${price[0].start_price} AND ${price[1].end_price} ORDER BY  remaining_days, remaining_time ASC  LIMIT ${limit} OFFSET ${offset}`, [ids == undefined ? product_id : ids]);
    }
  },


  getOffersAutoUpdate: async (currentTime) => {
    return await db.query(`select id, user_id, product_id, offer_unique_id from offers_created where is_bid_or_fixed=1 AND offfer_buy_status = 0 AND (is_reactivable = 0 OR (is_reactivable = 1 AND no_of_times_reactivated = 0)) AND TIMESTAMP(end_date) < '${currentTime}'`);
  },

  getMaxBidOnOffer: async (offer_id) => {
    var max_bid = await db.query(`select max(bid) as max from user_bids where offer_id = ${offer_id}`);
    return db.query(`select user_id, bid from user_bids where offer_id = ${offer_id} and bid =${max_bid[0].max}`);
  },

  getSearchByProduct: async (search) => {
    const category = await db.query(`SELECT category.id, category.cat_name FROM category WHERE cat_name LIKE "${search}%" LIMIT 2`);
    const product = await db.query(`SELECT product.id, product.name, category.id AS category_id, category.cat_name AS category_name FROM product LEFT JOIN category ON category.id = product.category_id WHERE name LIKE "${search}%" LIMIT 8`);
    const data = {
      category: category,
      product: product
    }
    return data;
  },

  getOffers: async (currDate) => {
    return db.query(`SELECT offers_created.*, product.name AS product_name FROM offers_created LEFT JOIN product ON product.id = offers_created.product_id WHERE offfer_buy_status != '1' AND is_reactivable = 1 AND TIMESTAMP(end_date) <= '${currDate}' AND no_of_times_reactivated != 0`);
  },

  getOffersByUserid: async (userId, currDate) => {
    return db.query(`SELECT offers_created.*, product.name AS product_name FROM offers_created LEFT JOIN product ON product.id = offers_created.product_id WHERE user_id = ${userId} AND offfer_buy_status != '1' AND is_reactivable = 1 AND TIMESTAMP(end_date) <= '${currDate}' AND no_of_times_reactivated != 0`);
  },

  updateOfferEndDate: async (offer_id, offerStartDate, newEndDate, noOfReactivations) => {
    if (noOfReactivations == '') {
      return db.query('UPDATE offers_created SET end_date = ?, offerStart = ? WHERE id = ?', [newEndDate, offerStartDate, offer_id]);
    } else {
      return db.query('UPDATE offers_created SET end_date = ?, offerStart = ?, no_of_times_reactivated = ? WHERE id = ?', [newEndDate, offerStartDate, noOfReactivations, offer_id]);
    }
  },

  getLatestOffer: async () => {
    return db.query(`SELECT offers_created.*, product.name AS product_name FROM offers_created LEFT JOIN product ON product.id = offers_created.product_id WHERE offfer_buy_status != 1 AND is_reactivable = 1`);
  },

  findBidCountUserId: async (offer_id) => {
    return db.query(`SELECT id, user_id, bid, offer_id, (SELECT SUM(count) FROM user_bids WHERE offer_id = ${offer_id}) AS bidCount FROM user_bids WHERE offer_id = ${offer_id} ORDER BY id DESC LIMIT 2;`);
  }

}                       