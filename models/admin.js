const db = require("../utils/database");
module.exports = {
    findEmail: async (email) => {
        return db.query(`SELECT * FROM users WHERE email = "${email}"`);
    },

    tokenUpdate: async (token, id) => {
        return db.query(`UPDATE users SET token = ${token} WHERE id = ${id}`);
    },

    fetchAllUsers: async () => {
        return db.query('SELECT first_name, last_name, email, phone_number, street_number, street, city, state, country, postal_code,  concat(street_number, " ", street, " ", city, " ", state, " ", country, " ", postal_code ) AS address FROM `users` WHERE role_id = 1');
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
        return db.query("select id, cat_name from category where id = ?", [categoryId]);
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

    findTypeAttributeById: async (id) => {
        return await db.query('SELECT * FROM `product_type_attribute` WHERE id = "' + id + '"');
    },

    findAttributesByAttributesTypeId: async (attribute_id) => {
        return db.query(`SELECT product_attributes_mapping.*, product_type_attribute.attribute_name FROM product_attributes_mapping LEFT JOIN product_type_attribute ON product_type_attribute.id = product_attributes_mapping.attribute_id WHERE attribute_id = ${attribute_id}`);
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

    updateSubAttributeMappingById: async (id, value) => {
        return await db.query('UPDATE `sub_attribute_mapping` SET `value`= ? WHERE id = ?', [value, id]);
    },

    deleteSubAttributesById: async (id) => {
        return await db.query('DELETE FROM `sub_attribute_mapping` WHERE id = ?', [id]);
    }

};