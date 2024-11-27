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
        return db.query('SELECT id, first_name, last_name,user_name, email, phone_number, street_number, street, city, state, country, postal_code,  concat(street_number, " ", street, " ", city, " ", state, " ", country, " ", postal_code ) AS address FROM `users` WHERE role_id = 1 ORDER BY id DESC');
    },

    fetchAllUsersOffers: async () => {
        return db.query('SELECT category.cat_name AS category_name, product.name AS product_name, CONCAT( users.first_name, " ", users.last_name ) AS seller_name, offers_created.* FROM `offers_created` LEFT JOIN product ON product.id = offers_created.product_id LEFT JOIN category ON product.category_id = category.id LEFT JOIN users ON users.id = offers_created.user_id ORDER BY offers_created.end_date;');
    },

    fetchAllUsersOffersByUserId: async (id) => {
        return db.query('SELECT category.cat_name AS category_name, product.name AS product_name, CONCAT( users.first_name, " ", users.last_name ) AS seller_name, offers_created.* FROM `offers_created` LEFT JOIN product ON product.id = offers_created.product_id LEFT JOIN category ON product.category_id = category.id LEFT JOIN users ON users.id = offers_created.user_id WHERE offers_created.user_id = ? ORDER BY offers_created.end_date;', [id]);
    },

    findAdminById: async (id) => {
        return db.query(`SELECT * FROM users WHERE id = "${id}"`);
    },

    addCategory: async (cat_name) => {
        return db.query("insert into category set ?", [cat_name]);
    },

    getAllCategory: async () => {
        return db.query("SELECT id, cat_name, status FROM `category` ORDER BY id DESC;");
    },

    getCategorybyId: async (categoryId) => {
        return db.query("select id, cat_name from category where id = ?", [categoryId]);
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
        return await db.query("SELECT users.id AS user_id, CONCAT( users.first_name, ' ', users.last_name ) AS user_name, users.online_status FROM `tbl_messages` LEFT JOIN users ON users.id = tbl_messages.user_id GROUP BY tbl_messages.user_id;");
    },

    getLastMessageAllUser: async (id) => {
        return await db.query('SELECT tbl_messages.*, (SELECT COUNT(is_read) FROM tbl_messages WHERE user_id = "' + id + '" AND is_read = "0") AS unread_count FROM tbl_messages WHERE user_id = "' + id + '" ORDER BY id DESC LIMIT 1')
    },

    updateCategoryById: async (category_id, cat_name) => {
        return await db.query('UPDATE `category` SET `cat_name`= "' + cat_name + '" WHERE id = "' + category_id + '"');
    },

    updateCategoryStatusById: async (category_id, status) => {
        return await db.query('UPDATE `category` SET `status`= "' + status + '" WHERE id = "' + category_id + '"');
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
        return await db.query("SELECT user_bids.offer_id, MAX(user_bids.bid) AS highest_bid, SUM(user_bids.count) AS total_bid, offers_created.offer_unique_id, offers_created.start_price, offers_created.title, offers_created.start_date, offers_created.end_date, user_bids.user_id, CONCAT(users.first_name, ' ', users.last_name) AS user_name FROM user_bids LEFT JOIN offers_created ON offers_created.id = user_bids.offer_id LEFT JOIN users ON users.id = user_bids.user_id GROUP BY user_bids.offer_id, offers_created.offer_unique_id, offers_created.start_price, offers_created.title, offers_created.start_date, offers_created.end_date, user_bids.user_id, users.first_name, users.last_name ORDER BY highest_bid DESC;");
    },

    getTransactionByOfferId: async (id) => {
        return await db.query("SELECT users.id, CONCAT(users.first_name, ' ', users.last_name) AS full_name FROM `buy_sell_transactions` LEFT JOIN users ON users.id = buy_sell_transactions.buyer_id WHERE offer_id = ?", [id]);
    },

    findAllTransaction: async () => {
        return await db.query("SELECT buy_sell_transactions.*, CONCAT( buyer_user.first_name, ' ', buyer_user.last_name ) AS buyer_name, CONCAT( seller_user.first_name, ' ', seller_user.last_name ) AS seller_name, offers_created.id AS offer_id, offers_created.offer_unique_id, offers_created.title FROM `buy_sell_transactions` LEFT JOIN users AS buyer_user ON buyer_user.id = buy_sell_transactions.buyer_id LEFT JOIN users AS seller_user ON seller_user.id = buy_sell_transactions.seller_id LEFT JOIN offers_created ON offers_created.id = buy_sell_transactions.offer_id ORDER BY buy_sell_transactions.created_at DESC;");
    },

    findSetting: async () => {
        return await db.query('SELECT * FROM `tbl_setting`');
    },

    updateSettingById: async (id, commission) => {
        return await db.query('UPDATE `tbl_setting` SET `commission`= "' + commission + '" WHERE id = "' + id + '"');
    },

    getOffersByDate: async (currDate) => {
        return await db.query(`SELECT offers_created.*, product.name AS product_name FROM offers_created LEFT JOIN product ON product.id = offers_created.product_id WHERE offfer_buy_status != '1' AND TIMESTAMP(end_date) <= '${currDate}'`);
    }

};