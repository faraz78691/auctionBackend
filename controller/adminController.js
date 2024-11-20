const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var moment = require('moment-timezone');

const { findEmail, tokenUpdate, getTotalOffers, getTotalDeliverdOffers, getTotalRevenue, getTotalPaidRevenue, fetchAllUsers, fetchAllUsersOffers, fetchAllUsersOffersByUserId, findAdminById, addCategory, getAllCategory, getCategorybyId, addProduct, findCategoryId, findProductByCategoryId, findProductAndCategoryById, addProductAttributeType, findTypeAttributesByProductId, findProductById, findTypeAttributesByIdAndProductId, addProductAttribute, findTypeAttributeById, findAttributesByAttributesTypeId, getAllChatUsers, getLastMessageAllUser, updateCategoryById, updateProductById, productTypeDeleteById, productAttributeMappingDeleteById, productAttributeMappingUpdateById, updateProductMappingById, subAttributeMappingAdd, getSubAttributesByProductAttributesMappingId, getProductAttributeMappingById, updateSubAttributeMappingById, deleteSubAttributesById, findLiveHighestBid, getTransactionByOfferId, findAllTransaction, updateMsgCount, findSetting, updateSettingById } = require("../models/admin");
const { updateData, getSelectedColumn } = require("../models/common");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                email: Joi.string()
                    .min(5)
                    .max(255)
                    .email({ tlds: { allow: false } })
                    .lowercase()
                    .required(),
                password: Joi.string().min(5).max(20).required().messages({
                    "any.required": "Password is required!!",
                    "string.empty": "can't be empty!!",
                    "string.min": "minimum 5 value required",
                    "string.max": "maximum 10 values allowed",
                }),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: true,
            });
        }

        const getAdmin = await findEmail(email);
        if (getAdmin.length > 0) {
            const match = bcrypt.compareSync(password, getAdmin[0].password);
            if (match) {
                const token = jwt.sign(
                    {
                        user_id: getAdmin[0].id,
                    },
                    "SecretKey"
                );

                await tokenUpdate(`"${token}"`, getAdmin[0].id);

                delete getAdmin[0].token;

                delete getAdmin[0].password;

                return res.json({
                    success: true,
                    message: "Successfully Login",
                    status: 200,
                    token: token,
                    userinfo: getAdmin[0],
                });
            } else {
                return res.json({
                    message: "Wrong password",
                    success: false,
                    status: 200,
                    userinfo: {},
                });
            }
        } else {
            return res.json({
                success: false,
                message: "Incorrect Email",
                status: 400,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.logout = async (req, res) => {
    try {
        const { id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: true,
            });
        }

        const getAdmin = await findAdminById(id);
        if (getAdmin.length > 0) {
            await tokenUpdate(null, getAdmin[0].id);

            delete getAdmin[0].token;

            delete getAdmin[0].password;

            return res.json({
                success: true,
                message: "Successfully Logout",
                status: 200,
                userinfo: getAdmin[0],
            });
        } else {
            return res.json({
                success: false,
                message: "Incorrect Id",
                status: 400,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.dashboard = async (req, res) => {
    try {
        const totalOffers = await getTotalOffers();
        const totalDeliveredOffers = await getTotalDeliverdOffers();
        const totalRevenue = await getTotalRevenue();
        const totalPaidRevenue = await getTotalPaidRevenue();
        return res.json({
            success: true,
            data: {
                totalOffers: totalOffers[0].total_offers,
                totalDeliveredOffers: totalDeliveredOffers[0].total_delivered,
                totalRevenue: totalRevenue[0].total_revenue,
                totalPaidRevenue: totalPaidRevenue[0].total_paid_revenue,
            },
            message: "Dashboard data retrieved successfully",
        });
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const results = await fetchAllUsers();
        if (results.length !== 0) {
            return res.json({
                message: "fetch all users details success",
                status: 200,
                success: true,
                data: results,
            });
        } else {
            return res.json({
                message: "Fetch all users failed",
                status: 200,
                success: true,
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500,
        });
    }
};

exports.getAllUsersOffers = async (req, res) => {
    try {
        const results = await fetchAllUsersOffers();
        if (results.length !== 0) {
            return res.json({
                message: "fetch all users offers details success",
                status: 200,
                success: true,
                data: results,
            });
        } else {
            return res.json({
                message: "Fetch all users offers failed",
                status: 200,
                success: true,
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500,
        });
    }
};

exports.getAllOffersByUserId = async (req, res) => {
    try {
        const { user_id } = req.query
        const schema = Joi.alternatives(
            Joi.object({
                user_id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.query);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: true,
            });
        }
        const results = await fetchAllUsersOffersByUserId(user_id);
        if (results.length !== 0) {
            return res.json({
                message: "fetch all users offers details success",
                status: 200,
                success: true,
                data: results,
            });
        } else {
            return res.json({
                message: "Fetch all users offers failed",
                status: 200,
                success: true,
            });
        }
    } catch (error) {
        return res.json({
            success: false,
            message: "Internal server error",
            status: 500,
        });
    }
};

exports.addCategory = async (req, res) => {
    try {
        const { cat_name } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                cat_name: Joi.string().required().empty(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: true,
            });
        }

        let category = {
            cat_name: cat_name
        };

        const resultInserted = await addCategory(category);
        if (resultInserted.affectedRows > 0) {
            return res.json({
                success: true,
                message: "category Successfully add",
                status: 200,
                insertId: resultInserted.insertId,
            });
        } else {
            return res.json({
                success: false,
                message: "category failed to add",
                status: 400,
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.getAllCategory = async (req, res) => {
    try {
        const results = await getAllCategory();
        if (results.length !== 0) {
            return res.json({
                success: true,
                message: "fetch all categorys success",
                status: 200,
                insertId: results,
            });
        } else {
            return res.json({
                success: true,
                message: "Fetch all categorys failed",
                status: 200,
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const { category_id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                category_id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: true,
            });
        }
        const results = await getCategorybyId(category_id);
        if (results.length !== 0) {
            return res.json({
                success: true,
                message: "fetch categorys by id success",
                status: 200,
                insertId: results[0],
            });
        } else {
            return res.json({
                success: true,
                message: "Fetch categorys by id failed",
                status: 200,
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.updateCategoryById = async (req, res) => {
    try {
        const { category_id, cat_name } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                category_id: Joi.number().required().empty(),
                cat_name: Joi.string().required().empty(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: true,
            });
        }
        const results = await getCategorybyId(category_id);
        if (results.length !== 0) {
            const updateCategory = await updateCategoryById(category_id, cat_name);
            if (updateCategory.affectedRows > 0) {
                return res.json({
                    success: true,
                    message: "Successfully update",
                    status: 200,
                    insertId: updateCategory,
                });
            } else {
                return res.json({
                    success: true,
                    message: "Not update",
                    status: 200,
                });
            }
        } else {
            return res.json({
                success: true,
                message: "Wrong category id",
                status: 200,
            });
        }
    } catch (err) {
        console.log(err);
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, category_id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                name: Joi.string().required().empty(),
                category_id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }

        var category = await getCategorybyId(category_id);
        if (category.length > 0) {
            const product = {
                name: name,
                category_id: category_id
            }
            const productAdd = await addProduct(product);
            if (productAdd.affectedRows == 1) {
                return res.json({
                    success: true,
                    message: "Product successfully add",
                    productAdd: productAdd.insertId,
                    status: 200,
                });
            } else {
                return res.json({
                    success: false,
                    message: "product failed to add",
                    status: 400,
                });
            }
        } else {
            return res.json({
                success: false,
                message: "Category Id Wrong",
                status: 400,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.getProductByCategoryId = async (req, res) => {
    try {
        const { category_id } = req.query;
        const schema = Joi.alternatives(
            Joi.object({
                category_id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.query);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }

        var category = await findCategoryId(category_id);
        if (category.length > 0) {
            const product = await findProductByCategoryId(category_id);
            if (product.length > 0) {
                const data = {
                    category: category[0],
                    products: product
                }
                return res.json({
                    success: true,
                    message: "Product successfully get",
                    productList: data,
                    status: 200,
                });
            } else {
                return res.json({
                    success: false,
                    category: category[0],
                    message: "product failed to get",
                    status: 200,
                });
            }
        } else {
            return res.json({
                success: false,
                message: "Category Id Wrong",
                status: 200,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.getProductByProductId = async (req, res) => {
    try {
        const { product_id } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                product_id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }
        const results = await findProductById(product_id);
        if (results.length !== 0) {
            return res.json({
                success: true,
                message: "fetch product by id success",
                status: 200,
                productList: results[0],
            });
        } else {
            return res.json({
                success: false,
                message: "Fetch product by id failed",
                status: 200,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.updateProductByProductId = async (req, res) => {
    try {
        const { product_id, name } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                product_id: Joi.number().required().empty(),
                name: Joi.string().required().empty(),
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }
        const getProduct = await findProductById(product_id);
        if (getProduct.length <= 0) {
            return res.json({
                success: false,
                message: "product id is wrong",
                status: 200,
            });
        }
        const updateProduct = await updateProductById(product_id, name);
        if (updateProduct.affectedRows > 0) {
            return res.json({
                success: true,
                message: "Successfully update",
                status: 200,
                insertId: updateProduct,
            });
        } else {
            return res.json({
                success: false,
                message: "Not update",
                status: 200,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.addProductTypeAttributes = async (req, res) => {
    try {
        const { product_id, category_id, attribute_name, heading, input_type } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                product_id: Joi.number().required().empty(),
                category_id: Joi.number().required().empty(),
                attribute_name: Joi.string().required().empty(),
                heading: Joi.string().required().empty(),
                input_type: Joi.string().required().empty()
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }

        const category = await findCategoryId(category_id);
        if (category.length > 0) {
            const product = await findProductAndCategoryById(product_id, category_id);
            if (product.length > 0) {
                const attribute = {
                    product_id: product_id,
                    category_id: category_id,
                    attribute_name: attribute_name,
                    heading: heading,
                    input_type: input_type
                }
                const addProductTypeAttribute = await addProductAttributeType(attribute);
                if (addProductTypeAttribute.affectedRows > 0) {
                    if (attribute_name == 'Country' || attribute_name == 'Color') {
                        const attributeMapping = {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: attribute_name == 'Color' ? 'All colors' : 'Any Country' // Default to attribute_name if not mapped
                        };
                        try {
                            const addProductAttributeMapping = await addProductAttribute(attributeMapping);
                        } catch (error) {
                            console.error('Error adding product attribute mapping:', error);
                        }
                    } else if (attribute_name == 'Miscellaneous' && input_type == 'input') {
                        const attributeMapping = {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Any' // Default to attribute_name if not mapped
                        };
                        try {
                            const addProductAttributeMapping = await addProductAttribute(attributeMapping);
                        } catch (error) {
                            console.error('Error adding product attribute mapping:', error);
                        }
                    } else if (attribute_name == 'Miscellaneous' && heading == 'Gender') {
                        const attributeMapping = [{
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Men' // Default to attribute_name if not mapped
                        },
                        {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Women' // Default to attribute_name if not mapped
                        },
                        {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Unisex' // Default to attribute_name if not mapped
                        },
                        ];
                        for (let x of attributeMapping) {
                            try {
                                const addProductAttributeMapping = await addProductAttribute(x);
                            } catch (error) {
                                console.error('Error adding product attribute mapping:', error);
                            }
                        }
                    } else if (attribute_name == 'Miscellaneous' && heading == 'Guarantee') {
                        const attributeMapping = [{
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'No guarantee' // Default to attribute_name if not mapped
                        },
                        {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Up to 24 months' // Default to attribute_name if not mapped
                        },
                        {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Up to 12 months' // Default to attribute_name if not mapped
                        },
                        {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Up to 6 months' // Default to attribute_name if not mapped
                        },
                        {
                            product_id: product_id,
                            attribute_id: addProductTypeAttribute.insertId,
                            attribute_value_name: 'Over 24 months' // Default to attribute_name if not mapped
                        },
                        ];
                        for (let x of attributeMapping) {
                            try {
                                const addProductAttributeMapping = await addProductAttribute(x);
                            } catch (error) {
                                console.error('Error adding product attribute mapping:', error);
                            }
                        }
                    }
                    return res.json({
                        success: true,
                        message: "Product type attributes add successfully",
                        subAttributes: addProductTypeAttribute.insertId,
                        status: 200,
                    });
                } else {
                    return res.json({
                        success: false,
                        message: "product type attribute failed to add",
                        status: 400,
                    });
                }
            } else {
                return res.json({
                    success: false,
                    message: "Product id is wrong or the prodcut id not add in this category id",
                    status: 400,
                });
            }
        } else {
            return res.json({
                success: false,
                message: "Category Id Wrong",
                status: 400,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.getTypeAttributesByProductId = async (req, res) => {
    try {
        const { product_id } = req.query;
        const schema = Joi.alternatives(
            Joi.object({
                product_id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.query);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }

        var getProduct = await findProductById(product_id);
        const getCategory = await findCategoryId(getProduct[0].category_id)
        var getAttribute = await findTypeAttributesByProductId(product_id);
        if (getAttribute.length > 0) {
            return res.json({
                success: true,
                message: "Product Attributes fetched successfully",
                category: {
                    id: getCategory[0].id,
                    name: getCategory[0].cat_name
                },
                product: {
                    id: getProduct[0].id,
                    name: getAttribute[0].name
                },
                typeAttributes: getAttribute,
                status: 200,
            });
        } else if (getProduct.length > 0) {
            return res.json({
                error: true,
                success: false,
                message: "Product fetched successfully",
                category: {
                    id: getCategory[0].id,
                    name: getCategory[0].cat_name
                },
                product: {
                    id: getProduct[0].id,
                    name: getProduct[0].name
                },
                typeAttributes: null,
                status: 200,
            });
        } else {
            return res.json({
                success: false,
                message: "Product attributes no t found",
                status: 200,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.addProductAttributes = async (req, res) => {
    try {
        const { product_id, attribute_id, attribute_value_name } = req.body;
        const schema = Joi.alternatives(
            Joi.object({
                product_id: Joi.number().required().empty(),
                attribute_id: Joi.number().required().empty(),
                attribute_value_name: Joi.string().required().empty()
            })
        );
        const result = schema.validate(req.body);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }

        const product = await findProductById(product_id);
        if (product.length > 0) {
            const attribute = await findTypeAttributesByIdAndProductId(product_id, attribute_id);
            if (attribute.length > 0) {
                const data = {
                    product_id: product_id,
                    attribute_id: attribute_id,
                    attribute_value_name: attribute_value_name,
                }
                const addProductTypeAttribute = await addProductAttribute(data);
                if (addProductTypeAttribute.affectedRows == 1) {
                    return res.json({
                        success: true,
                        message: "Product attributes add successfully",
                        subAttributes: addProductTypeAttribute.insertId,
                        status: 200,
                    });
                } else {
                    return res.json({
                        success: false,
                        message: "product attribute failed to add",
                        status: 400,
                    });
                }
            } else {
                return res.json({
                    success: false,
                    message: "Attribute id is wrong or the attribute id not add in this product id",
                    status: 400,
                });
            }
        } else {
            return res.json({
                success: false,
                message: "Product id is wrong",
                status: 400,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.getAttributesByAttributeTypeId = async (req, res) => {
    try {
        const { attribute_id } = req.query;
        const schema = Joi.alternatives(
            Joi.object({
                attribute_id: Joi.number().required().empty(),
            })
        );
        const result = schema.validate(req.query);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            return res.json({
                message: result.error.details[0].message,
                error: message,
                missingParams: result.error.details[0].message,
                status: 200,
                success: false,
            });
        }
        var getTypeAttributes = await findTypeAttributeById(attribute_id);
        var getAttributes = await findAttributesByAttributesTypeId(attribute_id);
        const getProduct = await findProductById(getTypeAttributes[0].product_id);
        const getCategory = await findCategoryId(getProduct[0].category_id)
        if (getAttributes.length > 0) {
            return res.json({
                success: true,
                message: "Attributes fetched successfully",
                category: {
                    id: getCategory[0].id,
                    name: getCategory[0].cat_name
                },
                product: {
                    id: getProduct[0].id,
                    name: getProduct[0].name
                },
                attributeName: getTypeAttributes[0].attribute_name,
                typeAttributes: getAttributes,
                status: 200,
            });
        } else if (getTypeAttributes.length > 0) {
            return res.json({
                success: false,
                message: "Attributes Type fetched successfully",
                category: {
                    id: getCategory[0].id,
                    name: getCategory[0].cat_name
                },
                product: {
                    id: getProduct[0].id,
                    name: getProduct[0].name
                },
                attributeName: getTypeAttributes[0].attribute_name,
                typeAttributes: null,
                status: 200,
            });
        } else {
            return res.json({
                success: false,
                message: "Attribute Id Wrong",
                status: 200,
            });
        }
    } catch (err) {
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

exports.getAllChatMessageUser = async (req, res) => {
    try {
        const findChatUser = await getAllChatUsers();
        if (findChatUser.length > 0) {
            for (let user of findChatUser) {
                const findLastMessage = await getLastMessageAllUser(user.user_id);
                user.message = findLastMessage[0].message,
                    user.unread_count = findLastMessage[0].unread_count
            }
            return res.status(200).json({ error: false, message: "Get all chat message", userChat: findChatUser, status: 200, success: true })
        } else {
            return res.status(200).json({ error: true, message: "Not get all chat message", userChat: null, status: 200, success: false })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message,
            status: 500,
        });
    }
};

exports.adminUpdateLoginStatus = async (adminId, status) => {
    try {
        const schema = Joi.alternatives(
            Joi.object({
                adminId: Joi.number().required().empty(),
                status: Joi.string().required().empty()
            })
        );
        const result = schema.validate(adminId, status);
        if (result.error) {
            const message = result.error.details.map((i) => i.message).join(",");
            console.log("error =>", message);
        }
        const userstatus = {
            online_status: status
        }
        const updateStatus = await updateData('users', `WHERE id = ${adminId}`, userstatus);
        console.log(updateStatus);

    } catch (err) {
        console.log("Internal Server Error =>", err);
    }
};

exports.deleteProductTypeAttribute = async (req, res) => {
    try {
        const { product_type_id } = req.body;
        const schema = Joi.object({
            product_type_id: Joi.string().required().messages({
                'string.base': 'Product Type Id must be a string',
                'string.empty': 'Product Type Id is required',
                'any.required': 'Product Type Id is required',
            })
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const deleteResult = await productTypeDeleteById(product_type_id);
            if (deleteResult.affectedRows > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully delete",
                    status: 200,
                    success: true
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Not delete",
                    status: 400,
                    success: false
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.deleteProductAttributeMapping = async (req, res) => {
    try {
        const { product_attribute_id } = req.body;
        const schema = Joi.object({
            product_attribute_id: Joi.string().required().messages({
                'string.base': 'Product Attribute Id must be a string',
                'string.empty': 'Product Attribute Id is required',
                'any.required': 'Product Attribute Id is required',
            })
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const deleteResult = await productAttributeMappingDeleteById(product_attribute_id);
            if (deleteResult.affectedRows > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully delete",
                    status: 200,
                    success: true
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Not delete",
                    status: 400,
                    success: false
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.updateProductAttributeMapping = async (req, res) => {
    try {
        const { id, attribute_value_name } = req.body;
        const schema = Joi.object({
            id: Joi.string().required().messages({
                'string.base': 'Id must be a string',
                'string.empty': 'Id is required',
                'any.required': 'Id is required',
            }),
            attribute_value_name: Joi.string().required().messages({
                'string.base': 'Attribute Value Name must be a string',
                'string.empty': 'Attribute Value Name is required',
                'any.required': 'Attribute Value Name is required',
            })
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const update = {
                id: id,
                attribute_value_name: attribute_value_name
            }
            const updateResult = await productAttributeMappingUpdateById(update);
            if (updateResult.affectedRows > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully update",
                    status: 200,
                    success: true
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Not update",
                    status: 400,
                    success: false
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.addSubAttributesMapping = async (req, res) => {
    try {
        const { attribute_mapping_id, value } = req.body;
        const schema = Joi.object({
            attribute_mapping_id: Joi.number().required().messages({
                'number.base': 'Attrribute Mapping Id must be a number',
                'number.empty': 'Attrribute Mapping Id is required',
                'any.required': 'Attrribute Mapping Id is required',
            }),
            value: Joi.string().required().messages({
                'string.base': 'Value must be a string',
                'string.empty': 'Value is required',
                'any.required': 'Value is required',
            })
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const update = await updateProductMappingById(attribute_mapping_id);
            const add = {
                attribute_mapping_id: attribute_mapping_id,
                value: value
            }
            const addResult = await subAttributeMappingAdd(add);
            if (addResult.affectedRows > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully add",
                    status: 200,
                    success: true,
                    subAttributeAdd: addResult
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Not add",
                    status: 400,
                    success: false
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.getSubAttributesByProductAttributesMappingId = async (req, res) => {
    try {
        const { attribute_mapping_id } = req.query;
        const schema = Joi.object({
            attribute_mapping_id: Joi.number().required().messages({
                'number.base': 'Attrribute Mapping Id must be a number',
                'number.empty': 'Attrribute Mapping Id is required',
                'any.required': 'Attrribute Mapping Id is required',
            })
        })

        const { error } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const result = await getSubAttributesByProductAttributesMappingId(attribute_mapping_id);
            const getAttributeMapping = await getProductAttributeMappingById(attribute_mapping_id);
            const getTypeAttributes = await findTypeAttributeById(getAttributeMapping[0].attribute_id);
            // var getAttributes = await findAttributesByAttributesTypeId(getTypeAttributes[0].id);
            const getProduct = await findProductById(getTypeAttributes[0].product_id);
            const getCategory = await findCategoryId(getTypeAttributes[0].category_id)
            if (result.length > 0) {
                return res.status(200).json({
                    error: false, message: "Data successfully found", success: true, status: 200,
                    category: {
                        id: getCategory[0].id,
                        name: getCategory[0].cat_name
                    },
                    product: {
                        id: getProduct[0].id,
                        name: getProduct[0].name
                    },
                    attributeType: {
                        id: getTypeAttributes[0].id,
                        attribute_name: getTypeAttributes[0].attribute_name
                    },
                    attributeMapping: {
                        id: getAttributeMapping[0].id,
                        attribute_mapping_name: getAttributeMapping[0].attribute_value_name
                    },
                    subAttributeData: result
                });
            } else {
                return res.status(200).json({
                    error: true, message: "Data not found", success: false, status: 200, category: {
                        id: getCategory[0].id,
                        name: getCategory[0].cat_name
                    },
                    product: {
                        id: getProduct[0].id,
                        name: getProduct[0].name
                    },
                    attributeType: {
                        id: getTypeAttributes[0].id,
                        attribute_name: getTypeAttributes[0].attribute_name
                    },
                    attributeMapping: {
                        id: getAttributeMapping[0].id,
                        attribute_mapping_name: getAttributeMapping[0].attribute_value_name
                    },
                    subAttributeData: null
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.updateSubAttributesById = async (req, res) => {
    try {
        const { id, value } = req.body;
        const schema = Joi.object({
            id: Joi.number().required().messages({
                'number.base': 'Id must be a number',
                'number.empty': 'Id is required',
                'any.required': 'Id is required',
            }),
            value: Joi.string().required().messages({
                'string.base': 'Value must be a string',
                'string.empty': 'Value is required',
                'any.required': 'Value is required',
            })
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const updateResult = await updateSubAttributeMappingById(id, value);
            if (updateResult.affectedRows > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully update",
                    status: 200,
                    success: true,
                    updateData: updateResult
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Not update",
                    status: 400,
                    success: false
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.deleteSubAttributesById = async (req, res) => {
    try {
        const { id } = req.query;
        const schema = Joi.object({
            id: Joi.number().required().messages({
                'number.base': 'Id must be a number',
                'number.empty': 'Id is required',
                'any.required': 'Id is required',
            })
        })

        const { error } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const result = await deleteSubAttributesById(id);
            if (result.affectedRows > 0) {
                return res.status(200).json({ error: false, message: "Data successfully delete", success: true, status: 200, subAttributeData: result });
            } else {
                return res.status(404).json({ error: true, message: "Data not delete or id not found", success: false, status: 404 });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.getLiveHighestBid = async (req, res) => {
    try {
        const currDate = moment().tz('Europe/Zurich');
        const result = await findLiveHighestBid();
        for (let element of result) {
            const endDate = moment(element.end_date);
            if (endDate.isBefore(currDate)) {
                const resultTransaction = await getTransactionByOfferId(element.offer_id);
                if (resultTransaction && resultTransaction.length > 0) {
                    element.status = 'Finish';
                    element.buyer = {
                        id: resultTransaction[0].id,
                        name: resultTransaction[0].full_name,
                    };
                } else {
                    element.status = 'Open';
                    element.buyer = '';
                }
            } else {
                element.status = 'Open';
                element.buyer = '';
            }
        }
        if (result.length > 0) {
            return res.status(200).json({ error: false, message: "Highest bid successfully found", success: true, status: 200, highestBid: result });
        } else {
            return res.status(200).json({ error: true, message: "No Live Bids Found", success: false, status: 200, highestBid: null });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.getAllTransaction = async (req, res) => {
    try {
        const resultTransaction = await findAllTransaction();
        if (resultTransaction.length > 0) {
            return res.status(200).json({ error: false, message: "Transaction successfully found", success: true, status: 200, transdactionData: resultTransaction });
        } else {
            return res.status(200).json({ error: true, message: "Transaction not found", success: false, status: 404, highestBid: null });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.getSetting = async (req, res) => {
    try {
        const resultSetting = await findSetting();
        if (resultSetting.length > 0) {
            return res.status(200).json({ error: false, message: "Seeting successfully found", success: true, status: 200, transdactionData: resultSetting });
        } else {
            return res.status(200).json({ error: true, message: "Setting not found", success: false, status: 404, highestBid: null });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};

exports.updateSetting = async (req, res) => {
    try {
        const { id, commission } = req.body;
        const schema = Joi.object({
            id: Joi.number().required().messages({
                'number.base': 'Id must be a number',
                'number.empty': 'Id is required',
                'any.required': 'Id is required',
            }),
            commission: Joi.number().required().messages({
                'number.base': 'Commission must be a number',
                'number.empty': 'Commission is required',
                'any.required': 'Commission is required',
            })
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const resultSetting = await updateSettingById(id, commission);
            if (resultSetting.affectedRows > 0) {
                return res.status(200).json({ error: false, message: "Commission update successfully", success: true, status: 200, transdactionData: resultSetting });
            } else {
                return res.status(200).json({ error: true, message: "Commission not update", success: false, status: 404, highestBid: null });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
}

exports.updateMsgCount = async (req, res) => {
    try {
        const { id } = req.body;
        const schema = Joi.object({
            id: Joi.number().required().messages({
                'number.base': 'Id must be a number',
                'number.empty': 'Id is required',
                'any.required': 'Id is required',
            }),
        })

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                message: error.details[0].message,
                status: 400,
                success: false
            });
        } else {
            const updateResult = await updateMsgCount(id);
            if (updateResult.affectedRows > 0) {
                return res.status(200).json({
                    error: false,
                    message: "Successfully update",
                    status: 200,
                    success: true,
                });
            } else {
                return res.status(400).json({
                    error: true,
                    message: "Not update",
                    status: 400,
                    success: false
                });
            }
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
    }
};
