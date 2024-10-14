const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { findEmail, updateLoginStatusById, tokenUpdate, fetchAllUsers, fetchAllUsersOffers, findAdminById, addCategory, getAllCategory, getCategorybyId, addProduct, findCategoryId, findProductByCategoryId, findProductAndCategoryById, addProductAttributeType, findTypeAttributesByProductId, findProductById, findTypeAttributesByIdAndProductId, addProductAttribute, findAttributesByAttributesTypeId, getAllMessageUserWise } = require("../models/admin");

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
                const status = "1"
                await updateLoginStatusById(status, getAdmin[0].user_id);
                const token = jwt.sign(
                    {
                        user_id: getAdmin[0].user_id,
                    },
                    "SecretKey",
                    { expiresIn: "24h" }
                );

                await tokenUpdate(`"${token}"`, getAdmin[0].user_id);

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
        console.log(err);
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
            const status = "0"
            await updateLoginStatusById(status, getAdmin[0].user_id);

            await tokenUpdate(null, getAdmin[0].user_id);

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
        console.log(err);
        return res.json({
            success: false,
            message: "Internal server error",
            error: err,
            status: 500,
        });
    }
};

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
                    category: category[0].cat_name,
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
                    message: "product failed to get",
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
                if (addProductTypeAttribute.affectedRows == 1) {
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

        var getAttribute = await findTypeAttributesByProductId(product_id);
        if (getAttribute.length > 0) {
            return res.json({
                success: true,
                message: "Product Attributes fetched successfully",
                product: {
                    id: product_id,
                    name: getAttribute[0].name
                },
                typeAttributes: getAttribute,
                status: 200,
            });
        } else {
            return res.json({
                success: false,
                message: "Product Id Wrong",
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
        var getAttributes = await findAttributesByAttributesTypeId(attribute_id);
        if (getAttributes.length > 0) {
            return res.json({
                success: true,
                message: "Attributes fetched successfully",
                typeAttributes: getAttributes,
                status: 200,
            });
        } else {
            return res.json({
                success: false,
                message: "Attribute Id Wrong",
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

exports.getAllChatMessageUser = async (req, res) => {
    try {
        const findAllMessage = await getAllMessageUserWise();
        if (findAllMessage.length > 0) {
            return res.json({
                message: "fetch user all chat message",
                status: 200,
                success: true,
                data: findAllMessage,
            });
        } else {
            return res.json({
                message: "Fetch user all chat message failed",
                status: 200,
                success: true,
            });
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