const db = require("../utils/database");
module.exports = {
    findEmail: async (email) => {
        return db.query(`SELECT * FROM users WHERE email = "${email}"`);
    },

    tokenUpdate: async (token, id) => {
        return db.query(`UPDATE users SET token = ${token} WHERE id = ${id}`);
    },

    fetchAllUsers: async () => {
        return db.query('SELECT first_name, last_name, email, phone_number, concat(street_number, " ", street, " ", city, " ", state, " ", country, " ", postal_code ) AS address FROM `users` WHERE role_id = 1');
    },

    fetchAllUsersOffers: async () => {
        return db.query('SELECT category.cat_name AS category_name, product.name AS product_name, CONCAT( users.first_name, " ", users.last_name ) AS seller_name, offers_created.* FROM `offers_created` LEFT JOIN product ON product.id = offers_created.product_id LEFT JOIN category ON product.category_id = category.id LEFT JOIN users ON users.id = offers_created.user_id ORDER BY offers_created.end_date;');
    },

    findAdminById: async (id) => {
        return db.query(`SELECT * FROM users WHERE id = "${id}"`);
    },

    addCategory: async (cat_name) => {
        return db.query("insert into category set ?", [cat_name]);
    },

    getAllCategory: async () => {
        return db.query("SELECT id, cat_name FROM `category`;");
    },

    getCategorybyId: async (categoryId) => {
        return db.query("select cat_name from category where id=?", [categoryId]);
    },

    addProduct: async (product) => {
        return db.query("insert into product set ?", [product]);
    },

    findCategoryId: async (category_id) => {
        return db.query("SELECT id, cat_name FROM `category` WHERE id = ?", [category_id]);
    },

    findProductByCategoryId: async (category_id) => {
        return db.query("SELECT id, name FROM `product` WHERE category_id = ?", [category_id]);
    },

    findProductAndCategoryById: async (product_id, category_id) => {
        return db.query("SELECT id, name FROM `product` WHERE id = ? AND category_id = ?", [product_id, category_id]);
    },

    addProductAttributeType: async (data) => {
        return db.query("insert into product_type_attribute set ?", [data]);
    },

    findTypeAttributesByProductId: async (product_id) => {
        return db.query(`SELECT product_type_attribute.id, product_type_attribute.attribute_name, product_type_attribute.heading, product_type_attribute.input_type, product.name FROM product_type_attribute LEFT JOIN product ON product.id = product_type_attribute.product_id WHERE product_id = ${product_id}`);
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

    findAttributesByAttributesTypeId: async (attribute_id) => {
        return db.query(`SELECT product_attributes_mapping.*, product_type_attribute.attribute_name FROM product_attributes_mapping LEFT JOIN product_type_attribute ON product_type_attribute.id = product_attributes_mapping.attribute_id WHERE attribute_id = ${attribute_id}`);
    },

    getAllMessageUserWise: async () => {
        return db.query("SELECT cs.user_id, cs.admin_id, CONCAT(u.first_name, ' ', u.last_name) AS user_name, u.online_status, m.message, m.created_at, cs.unread_count FROM tbl_chat_sessions cs JOIN users u ON cs.user_id = u.id JOIN tbl_messages m ON cs.last_message_id = m.id ORDER BY m.created_at DESC");
    }

};