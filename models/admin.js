const db = require("../utils/database");
module.exports = {
    findEmail: async (email) => {
        return db.query(`SELECT * FROM users WHERE email = "${email}"`);
    },

    tokenUpdate: async (token, id) => {
        return db.query(`UPDATE users SET token = ${token} WHERE id = ${id}`);
    },

    getTotalOffers: async () => {
        return await db.query('SELECT COUNT(*) AS total_offers FROM `offers_created`');
    },

    getTotalDeliverdOffers: async () => {
        return await db.query('SELECT COUNT(*) AS total_delivered FROM `offers_created` LEFT JOIN buy_sell_transactions ON buy_sell_transactions.offer_id = offers_created.id WHERE buy_sell_transactions.buyer_status >= "3";');
    },

    getTotalRevenue: async () => {
        return await db.query('SELECT SUM(pay_amount) AS total_revenue FROM `tbl_user_commissin_fees`;');
    },

    getTotalPaidRevenue: async () => {
        return await db.query('SELECT SUM(pay_amount) AS total_paid_revenue FROM `tbl_user_commissin_fees` WHERE tbl_user_commissin_fees.status = "1";');
    },

    fetchAllUsers: async () => {
        return db.query('SELECT id, first_name, last_name, user_name, email, phone_number, profile_image, address postal_code, latitude, longitude, block_status, block_reason FROM `users` WHERE role_id = 1 ORDER BY id DESC');
    },

    fetchAllUsersOffers: async () => {
        return db.query('SELECT category.cat_name AS category_name, product.name AS product_name, users.user_name AS seller_name, users.profile_image AS seller_profile_image, offers_created.* FROM `offers_created` LEFT JOIN product ON product.id = offers_created.product_id LEFT JOIN category ON product.category_id = category.id LEFT JOIN users ON users.id = offers_created.user_id ORDER BY offers_created.end_date;');
    },

    fetchAllUsersOffersByUserId: async (id) => {
        return db.query('SELECT category.cat_name AS category_name, product.name AS product_name, users.user_name AS seller_name, users.profile_image AS seller_profile_image, offers_created.* FROM `offers_created` LEFT JOIN product ON product.id = offers_created.product_id LEFT JOIN category ON product.category_id = category.id LEFT JOIN users ON users.id = offers_created.user_id WHERE offers_created.user_id = ? ORDER BY offers_created.end_date;', [id]);
    },

    userBlockStatusUpdateById: async (user_id, status, reason) => {
        return await db.query('UPDATE `users` SET `block_status`= "' + status + '", `block_reason` = ? WHERE id = "' + user_id + '"', [reason]);
    },

    findAdminById: async (id) => {
        return db.query(`SELECT * FROM users WHERE id = "${id}"`);
    },

    addCategory: async (cat_name) => {
        return db.query("insert into category set ?", [cat_name]);
    },

    getAllCategory: async () => {
        return db.query("SELECT id, cat_name FROM `category` ORDER BY id DESC;");
    },

    getCategorybyId: async (categoryId) => {
        return db.query("select id, cat_name from category where id = ?", [categoryId]);
    },

    addPopularCategory: async (data) => {
        return await db.query('insert into tbl_popular_category set ?', [data]);
    },

    getAllPopularCategory: async () => {
        return await db.query('SELECT tbl_popular_category.*, category.cat_name AS category_name FROM `tbl_popular_category` LEFT JOIN category ON category.id = tbl_popular_category.category_id ORDER BY tbl_popular_category.id DESC;')
    },

    getPopularCategoryById: async (id) => {
        return await db.query('SELECT * FROM `tbl_popular_category` WHERE id = ?', [id]);
    },

    updatePopularCategoryById: async (id, category_id, category_image) => {
        return await db.query('UPDATE `tbl_popular_category` SET `category_id`= "' + category_id + '", `category_image` = "' + category_image + '" WHERE id = "' + id + '"');
    },

    deletePopularCategoryById: async (id) => {
        return await db.query('DELETE FROM `tbl_popular_category` WHERE id = ?', [id]);
    },

    addProduct: async (product) => {
        return db.query("insert into product set ?", [product]);
    },

    findCategoryId: async (category_id) => {
        return db.query("SELECT id, cat_name FROM `category` WHERE id = ?", [category_id]);
    },

    findProductByCategoryId: async (category_id) => {
        return db.query("SELECT id, name FROM `product` WHERE category_id = ? ORDER BY product.id DESC", [category_id]);
    },

    findProductAndCategoryById: async (product_id, category_id) => {
        return db.query("SELECT id, name FROM `product` WHERE id = ? AND category_id = ?", [product_id, category_id]);
    },

    addProductAttributeType: async (data) => {
        return db.query("insert into product_type_attribute set ?", [data]);
    },

    findTypeAttributesByProductId: async (product_id) => {
        return db.query(`SELECT product_type_attribute.id, product_type_attribute.attribute_name, product_type_attribute.heading, product_type_attribute.input_type, product.name FROM product_type_attribute LEFT JOIN product ON product.id = product_type_attribute.product_id WHERE product_id = ${product_id} ORDER BY product_type_attribute.id DESC`);
    },

    findProductById: async (product_id) => {
        return db.query(`SELECT * FROM product WHERE id = ${product_id}`);
    },

    findTypeAttributesByIdAndProductId: async (product_id, attribute_id) => {
        return db.query(`SELECT * FROM product_type_attribute WHERE product_id = ${product_id} AND id = ${attribute_id}`);
    },

    addProductAttribute: async (data) => {
        return db.query("insert into product_attributes_mapping set ?", [data]);
    },

    findTypeAttributeById: async (id) => {
        return await db.query('SELECT * FROM `product_type_attribute` WHERE id = "' + id + '"');
    },

    findAttributesByAttributesTypeId: async (attribute_id) => {
        return db.query(`SELECT product_attributes_mapping.*, product_type_attribute.attribute_name FROM product_attributes_mapping LEFT JOIN product_type_attribute ON product_type_attribute.id = product_attributes_mapping.attribute_id WHERE attribute_id = ${attribute_id} ORDER BY product_attributes_mapping.id DESC`);
    },

    getAllChatUsers: async () => {
        return await db.query("SELECT users.id AS user_id, users.user_name, users.profile_image AS user_profile_image, users.online_status FROM `tbl_messages` LEFT JOIN users ON users.id = tbl_messages.user_id GROUP BY tbl_messages.user_id;");
    },

    getLastMessageAllUser: async (id) => {
        return await db.query('SELECT tbl_messages.*, (SELECT COUNT(is_read) FROM tbl_messages WHERE user_id = "' + id + '" AND is_read = "0") AS unread_count FROM tbl_messages WHERE user_id = "' + id + '" ORDER BY id DESC LIMIT 1')
    },

    updateCategoryById: async (category_id, cat_name) => {
        return await db.query('UPDATE `category` SET `cat_name`= "' + cat_name + '" WHERE id = "' + category_id + '"');
    },

    updateProductById: async (product_id, name) => {
        return await db.query('UPDATE `product` SET `name`= "' + name + '" WHERE id = "' + product_id + '"');
    },

    productTypeDeleteById: async (id) => {
        return await db.query('DELETE FROM `product_type_attribute` WHERE id = "' + id + '"');
    },

    productAttributeMappingDeleteById: async (id) => {
        return await db.query('DELETE FROM `product_attributes_mapping` WHERE id = "' + id + '"');
    },

    productAttributeMappingUpdateById: async (data) => {
        return await db.query('UPDATE `product_attributes_mapping` SET `attribute_value_name`= "' + data.attribute_value_name + '" WHERE id = "' + data.id + '"');
    },

    updateProductMappingById: async (id) => {
        return await db.query('UPDATE `product_attributes_mapping` SET `is_sub_attribute` = "1",`sub_attribute_heading` = "Model" WHERE id = ?', [id]);
    },

    subAttributeMappingAdd: async (data) => {
        return await db.query('INSERT INTO `sub_attribute_mapping` SET ?', [data]);
    },

    getSubAttributesByProductAttributesMappingId: async (id) => {
        return await db.query('SELECT * FROM `sub_attribute_mapping` WHERE attribute_mapping_id = ?', [id]);
    },

    getProductAttributeMappingById: async (id) => {
        return await db.query('SELECT * FROM `product_attributes_mapping` WHERE id = ?', [id]);
    },

    updateSubAttributeMappingById: async (id, value) => {
        return await db.query('UPDATE `sub_attribute_mapping` SET `value`= ? WHERE id = ?', [value, id]);
    },
    updateMsgCount: async (id) => {
        return await db.query('UPDATE tbl_messages SET is_read = "1" WHERE user_id = ?', [id]);
    },

    deleteSubAttributesById: async (id) => {
        return await db.query('DELETE FROM `sub_attribute_mapping` WHERE id = ?', [id]);
    },

    findLiveHighestBid: async () => {
        return await db.query("SELECT ub.offer_id, MAX(ub.bid) AS highest_bid, SUM(ub.count) AS total_bid, oc.offer_unique_id, oc.start_price, oc.title, oc.start_date, oc.end_date, u.user_name, u.profile_image FROM user_bids ub LEFT JOIN offers_created oc ON oc.id = ub.offer_id LEFT JOIN users u ON u.id = ( SELECT user_id FROM user_bids WHERE offer_id = ub.offer_id ORDER BY bid DESC LIMIT 1 ) GROUP BY ub.offer_id, oc.offer_unique_id, oc.start_price, oc.title, oc.start_date, oc.end_date, u.first_name, u.last_name, u.profile_image ORDER BY highest_bid DESC;");
    },

    getTransactionByOfferId: async (id) => {
        return await db.query("SELECT users.id, users.user_name AS full_name, users.profile_image AS user_profile_image FROM `buy_sell_transactions` LEFT JOIN users ON users.id = buy_sell_transactions.buyer_id WHERE offer_id = ?", [id]);
    },

    findAllTransaction: async () => {
        return await db.query("SELECT buy_sell_transactions.*, buyer_user.user_name AS buyer_name, buyer_user.profile_image AS buyer_profile_image, seller_user.user_name AS seller_name, seller_user.profile_image AS seller_profile_image, offers_created.id AS offer_id, offers_created.offer_unique_id, offers_created.title FROM `buy_sell_transactions` LEFT JOIN users AS buyer_user ON buyer_user.id = buy_sell_transactions.buyer_id LEFT JOIN users AS seller_user ON seller_user.id = buy_sell_transactions.seller_id LEFT JOIN offers_created ON offers_created.id = buy_sell_transactions.offer_id ORDER BY buy_sell_transactions.created_at DESC;");
    },

    findSetting: async () => {
        return await db.query('SELECT * FROM `tbl_setting`');
    },

    updateSettingById: async (id, commission) => {
        return await db.query('UPDATE `tbl_setting` SET `commission`= "' + commission + '" WHERE id = "' + id + '"');
    },

    getOffersByDate: async (currDate) => {
        return await db.query(`SELECT id, offer_unique_id, product_id, title, product_type, images_id, offerStart,is_bid_or_fixed, start_date, length_oftime, end_date, FLOOR( HOUR(TIMEDIFF(end_date, CURRENT_TIMESTAMP)) / 24) AS remaining_days, (TIMEDIFF(end_date, CURRENT_TIMESTAMP)) AS remaining_time, start_price, increase_step, buyto_price, fixed_offer_price, duration, boost_plan_id, offfer_buy_status, user_id from offers_created WHERE offfer_buy_status != '1' AND boost_plan_id = '3' AND TIMESTAMP(start_date) <= '${currDate}' AND TIMESTAMP(end_date) >= '${currDate}' ORDER BY id DESC LIMIT 4;`);
    },

    getUpcommingOffersByDate: async (currDate) => {
        return await db.query(`SELECT id, offer_unique_id, product_id, title, product_type, images_id, offerStart,is_bid_or_fixed, start_date, length_oftime, end_date, FLOOR( HOUR(TIMEDIFF(end_date, CURRENT_TIMESTAMP)) / 24) AS remaining_days, (TIMEDIFF(end_date, CURRENT_TIMESTAMP)) AS remaining_time, start_price, increase_step, buyto_price, fixed_offer_price, duration, boost_plan_id, offfer_buy_status, user_id from offers_created WHERE offfer_buy_status != '1' AND boost_plan_id = '3' AND TIMESTAMP(start_date) >= '${currDate}' ORDER BY start_date LIMIT 4;`);
    },

    getPremierSeller: async () => {
        return await db.query('SELECT offers_created.id, offers_created.offer_unique_id, users.id AS user_id, users.profile_image, users.user_name, CONCAT(users.address, " ", users.postal_code) AS address FROM offers_created LEFT JOIN users ON users.id = offers_created.user_id LEFT JOIN tbl_user_commissin_fees ON tbl_user_commissin_fees.offer_id = offers_created.id WHERE offers_created.boost_plan_id = "3" AND tbl_user_commissin_fees.fees_type = "2";');
    },

    getAllOfferImagesById: async (id) => {
        return await db.query('SELECT * FROM `offer_images` WHERE id = ?', [id]);
    },

    addTermCondition: async (data) => {
        return await db.query("insert into tbl_term_condition set ? ", [data]);
    },

    getTermHeading: async () => {
        return await db.query("SELECT id, heading FROM tbl_term_condition WHERE parent_id IS NULL");
    },

    getTermSubHeading: async (id) => {
        return await db.query("SELECT id, parent_id, sub_heading, description FROM tbl_term_condition WHERE parent_id = ?", [id]);
    },

    deleteTermConditionById: async (id) => {
        return await db.query("DELETE FROM `tbl_term_condition` WHERE id = ?", [id]);
    },

    updateTermCondition: async (data, condition) => {
        return await db.query("update tbl_term_condition set ? where ?", [data, condition])
    },

    getAllFeaturedProduct: async () => {
        return await db.query('SELECT * FROM `tbl_featured_product` ORDER BY id DESC');
    },

    getFeaturedProductById: async (id) => {
        return await db.query('SELECT * FROM `tbl_featured_product` WHERE id = ?', [id]);
    },

    updateFeaturedProductById: async (id, featured_image) => {
        return await db.query('UPDATE `tbl_featured_product` SET `featured_image` = ? WHERE id = ?', [featured_image, id]);
    },

    getAllReports: async () => {
        return await db.query('SELECT users.id AS reporter_id, users.user_name AS reporter_name, seller.id AS seller_id, seller.user_name AS seller_name, offers_created.offer_unique_id, offers_created.title AS offer_title, tbl_report.report_title, tbl_report.report_description, DATE_FORMAT( tbl_report.created_at, "%d %M %Y" ) AS report_date FROM tbl_report LEFT JOIN users ON users.id = tbl_report.user_id LEFT JOIN offers_created ON offers_created.id = tbl_report.offer_id LEFT JOIN users AS seller ON seller.id = offers_created.user_id WHERE tbl_report.report_title IS NOT NULL AND seller.id IS NOT NULL;');
    }

};