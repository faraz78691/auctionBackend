const db = require("../utils/database");
module.exports = {
    findEmail: async (email) => {
        return db.query(`SELECT * FROM user_profile WHERE email = "${email}"`);
    },

    updateLoginStatusById: async (status, id) => {
        return db.query(`UPDATE user_profile SET login_status = "${status}" WHERE user_id = ${id}`);
    },

    tokenUpdate: async (token, id) => {
        return db.query(`UPDATE user_profile SET token = ${token} WHERE user_id = ${id}`);
    },

    fetchAllUsers: async () => {
        return db.query('SELECT first_name, last_name, email, phone_number, concat(street_number, " ", street, " ", city, " ", state, " ", country, " ", postal_code ) AS address FROM `users`;');
    },

    fetchAllUsersOffers: async () => {
        return db.query('SELECT offers_created.title, category.cat_name AS category_name, product.name AS product_name, offers_created.start_price AS price, DATE_FORMAT( offers_created.start_date, "%h:%i %p" ) AS start_date, DATE_FORMAT( offers_created.end_date, "%h:%i %p" ) AS end_date, CONCAT( users.first_name, " ", users.last_name ) AS seller_name FROM `offers_created` LEFT JOIN product ON product.id = offers_created.product_id LEFT JOIN category ON product.category_id = category.id LEFT JOIN users ON users.id = offers_created.user_id ORDER BY offers_created.end_date;');
    },

    findAdminById: async (id) => {
        return db.query(`SELECT * FROM user_profile WHERE user_id = "${id}"`);
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
        return db.query(`SELECT id, attribute_name, heading, input_type FROM product_type_attribute where product_id = ${product_id}`);
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
        return db.query(`SELECT * FROM product_attributes_mapping WHERE attribute_id = ${attribute_id}`);
    }

};