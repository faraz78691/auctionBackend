const {
  getProductDetails,
  getProductAttributesByID,
  getProductTypeAttributeByID,
  insertOfferImages,
  getProductAttributeTypeMapping,
  findProductById,
  insertOfferCreated,
  findBootPlanById,
  updateOfferById,
  getOffersByWhereClause,
  getOffersByCategoryWhereClause,
  getNoOfBids,
  getMainImage,
  insertAttributOffers,
  insertConditionOffers,
  updateAttributOffers,
  updateConditionOffers,
  getCountDownByOfferId,
  getOfferRecord,
  insertBidByUser,
  selectBidbyUser,
  updateBidsByUser,
  getCategorybyId,
  getCategoryIdByProductId,
  getProductDetailsByID,
  getOfferDetailsByID,
  getOfferAttributesDetailsByID,
  getMaxBidbyOfferID,
  getOfferImages,
  getProductTypeAttribute,
  getProductAttributeTypeMappingByIDP,
  getOffersAutoUpdate,
  getMaxBidOnOffer,
  checkTransactionID,
  insertPaymentFlowInsert,
  insertUserFeesPay,
  insertTransaction,
  getProductIdsByName,
  getffersByName,
  getTransactionsHistory,
  getTransactionsHistoryUpdated,
  getoffer_images,
  updateOfferBuyStatus, // updated 26-07-2024
  insertOfferFavourites,
  getFavouriteOffersByUserId,
  getSubAttributesByID,
  getSubAttributesHeadingByIDValue,
  getSubAttributesByIID,
  getCategoriesAll,
  getProductNameByID,
  //getOfferAttributesDetailsByProductID,
  getOffersBDynamically,
  getOfferIdByAttributes,
  getOfferIdByConditions,
  getOfferIdByAuctionType,
  getOffersByIDsWhereClause,
  getOfferConditionsByID,
  getSellerDetails,
  getSearchByProduct,
  getOffers,
  updateOfferEndDate,
  getLatestOffer,
  findBidCountUserId,
  getOffersByUserid,
  getOffersByUSerId
} = require("../models/product");
const { findSetting } = require("../models/admin");
const { send_notification } = require("../helper/sendNotification");
const {
  getData, getSelectedColumn, insertData
} = require("../models/common");
const db = require("../utils/database");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();
var randomstring = require("randomstring");
var moment = require('moment-timezone');

exports.getProducts = async (req, res) => {
  try {
    const productDetails = await getProductDetails();
    if (productDetails.length > 0) {
      res.json({
        success: true,
        status: 200,
        msg: "Products are found",
        productDetails: productDetails,
      });
    } else {
      return res.json({
        success: false,
        status: 400,
        msg: "No roles assigned to User",
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

exports.getProductsAttrByProductID = async (req, res) => {
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
        success: true,
      });
    }
    const productAttrDetails = await getProductAttributesByID(product_id);
    if (productAttrDetails.length > 0) {
      res.json({
        success: true,
        status: 200,
        msg: "Products Attributes Types are found",
        productAttrDetails: productAttrDetails,
      });
    } else {
      return res.json({
        success: false,
        status: 400,
        msg: "No Attributes Found",
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

exports.getProductsAttrTypeByProductID = async (req, res) => {
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
        success: true,
      });
    }
    var productAttributeTypeValueMap = [];
    const productAttrTypeDetails = await getProductTypeAttributeByID(
      product_id
    );
    for (elem of productAttrTypeDetails) {
      var tempDetail = { ...elem };
      tempDetail.values = [];
      if (elem.product_id !== 0 && elem.id !== 0) {
        const result = await getProductAttributeTypeMapping(
          elem.product_id,
          elem.id
        );
        if (result.length > 0) {
          result.map((elem) => tempDetail.values.push(elem));
        }
      }
      productAttributeTypeValueMap.push(tempDetail);
    }
    if (productAttributeTypeValueMap.length > 0) {
      res.json({
        success: true,
        status: 200,
        msg: "Products Attributes Types are found",
        productAttributeTypeValueMap: productAttributeTypeValueMap,
      });
    } else {
      return res.json({
        success: false,
        status: 400,
        msg: "No Attributes Type Found",
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

exports.uploadOfferImages = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      main_image,
      bottom_eside,
      top_eside,
      tilted_eside,
      defects,
      details,
      brand,
      dimension,
      accessories,
      context,
    } = req.files;
    var mainImageLink = "";
    var bottomEsideLink = "";
    var topEsideLink = "";
    var tiltedEsideLink = "";
    var defectsLink = "";
    var detailsLink = "";
    var brandLink = "";
    var dimensionLink = "";
    var accessoriesLink = "";
    var contextLink = "";

    if (req.files?.main_image) {
      mainImageLink = main_image[0].filename;
    }
    if (req.files?.bottom_eside) {
      bottomEsideLink = bottom_eside[0].filename;
    }
    if (req.files?.top_eside) {
      topEsideLink = top_eside[0].filename;
    }
    if (req.files?.tilted_eside) {
      tiltedEsideLink = tilted_eside[0].filename;
    }
    if (req.files?.defects) {
      defectsLink = defects[0].filename;
    }
    if (req.files?.details) {
      detailsLink = details[0].filename;
    }
    if (req.files?.brand) {
      brandLink = brand[0].filename;
    }
    if (req.files?.dimension) {
      dimensionLink = dimension[0].filename;
    }
    if (req.files?.accessories) {
      accessoriesLink = accessories[0].filename;
    }
    if (req.files?.context) {
      contextLink = context[0].filename;
    }

    const offer_images = {
      main_image: mainImageLink,
      bottom_eside: bottomEsideLink,
      top_eside: topEsideLink,
      tilted_eside: tiltedEsideLink,
      defects: defectsLink,
      details: detailsLink,
      brand: brandLink,
      dimension: dimensionLink,
      accessories: accessoriesLink,
      context: contextLink,
      user_id: user_id,
    };
    const resultInserted = await insertOfferImages(offer_images);
    if (resultInserted.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Offer Images Uploaded",
        status: 200,
        insertId: resultInserted.insertId,
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

exports.createOffer = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      product_id,
      title,
      product_type,
      condition_desc,
      reference_no,
      is_bid_or_fixed,
      start_price,
      increase_step,
      buyto_price,
      fixed_offer_price,
      duration,
      length_oftime,
      images_id,
      offerStart,
      boost_plan_id,
      start_date,
      is_reactivable,
      is_psuggestion_enable,
      attributes,
      conditions
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().required().empty(),
        title: Joi.string().required().empty(),
        product_type: Joi.string().required().empty(),
        condition_desc: Joi.string().required().empty(),
        reference_no: Joi.string().optional().allow(null).allow(""),
        is_bid_or_fixed: Joi.string().required().empty(),
        start_price: Joi.number().optional().allow(null).allow(""),
        increase_step: Joi.number().optional().allow(null).allow(""),
        buyto_price: Joi.number().optional().allow(null).allow(""),
        fixed_offer_price: Joi.number().optional().allow(null).allow(""),
        duration: Joi.number().required().empty(),
        length_oftime: Joi.number().required().empty(),
        images_id: Joi.number().required().empty(),
        offerStart: Joi.string().required().empty(),
        boost_plan_id: Joi.number().optional().allow(null).allow(""),
        start_date: Joi.string().required().empty(),
        is_reactivable: Joi.number().required().empty(),
        is_psuggestion_enable: Joi.number().required().empty(),
        attributes: Joi.string().empty().required(),
        conditions: Joi.string().empty().required(),
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

    const findProduct = await findProductById(product_id);
    if (findProduct.length > 0) {
      const itemsJson = JSON.parse(attributes);
      const condJson = JSON.parse(conditions);
      const startDate = new Date(start_date); //date -- YYYY-MM-DD
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + Number(length_oftime),
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds(),
        startDate.getMilliseconds()
      );

      let unique_id;
      let isUnique = false;

      // Loop to generate a unique offer ID
      while (!isUnique) {
        unique_id = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit unique ID

        // Check if the unique_id exists in the database
        const [rows] = await db.query('SELECT COUNT(*) AS count FROM offers_created WHERE offer_unique_id = ?', [unique_id]);
        if (rows.count === 0) {
          isUnique = true; // If no existing offer has this unique_id, we can use it
        }
      }

      const offer_created = {
        offer_unique_id: unique_id,
        product_id: product_id,
        title: title,
        product_type: product_type,
        condition_desc: condition_desc,
        reference_no: reference_no,
        is_bid_or_fixed: is_bid_or_fixed,
        start_price: start_price,
        increase_step: increase_step,
        buyto_price: buyto_price,
        fixed_offer_price: fixed_offer_price,
        duration: duration,
        length_oftime: length_oftime,
        images_id: images_id,
        offerStart: offerStart,
        boost_plan_id: boost_plan_id == null || boost_plan_id == '' ? null : boost_plan_id,
        start_date: startDate,
        end_date: endDate,
        user_id: user_id,
        is_reactivable: is_reactivable,
        is_psuggestion_enable: is_psuggestion_enable
      };

      var offerId = 0;
      var attributesInserted = 0;
      var condInserted = 0;
      var transactionId = 0;
      const resultInserted = await insertOfferCreated(offer_created);
      if (resultInserted.affectedRows > 0) {
        if (boost_plan_id) {
          const getBootplan = await findBootPlanById(boost_plan_id);
          do {
            transactionId = randomstring.generate({
              length: 12,
              charset: "alphanumeric",
            });
            const found = await checkTransactionID(transactionId);
            if (found.length > 0) {
              doContinue = 0;
            }
          } while (doContinue);
          const data = {
            fees_type: '2',
            transaction_id: transactionId,
            seller_id: user_id,
            offer_id: resultInserted.insertId,
            amount: getBootplan[0].price,
            pay_amount: getBootplan[0].price,
            is_buy_now: 0,
            is_max_bid: 0,
            created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          }
          await insertUserFeesPay(data);
        }
        offerId = resultInserted.insertId;
        if (itemsJson.length > 0) {
          for (element of itemsJson) {
            const attributesData = {
              offer_id: offerId,
              product_id: product_id,
              attribute_id: element.attribute_id,
              attribute_value: element.attribute_value,
              subattribute_id: element.subattribute_id,
            };

            const insertedRows = await insertAttributOffers(attributesData);
            attributesInserted = attributesInserted + insertedRows.affectedRows;
          }
        }

        if (condJson.length > 0) {
          for (element of condJson) {
            const condData = {
              offer_id: offerId,
              product_id: product_id,
              condition_id: element.condition_id,
              condition_value: element.condition_value,
            };
            const insertedRows = await insertConditionOffers(condData);
            condInserted = condInserted + insertedRows.affectedRows;
          }
        }
        return res.json({
          success: true,
          message: "Offer Created",
          status: 200,
          insertId: offerId,
          attributesInserted: attributesInserted,
          conditionsInserted: condInserted,
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
    console.log(err);

    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.updateOffer = async (req, res) => {
  try {
    const {
      offer_id,
      product_id,
      title,
      product_type,
      condition_desc,
      reference_no,
      is_bid_or_fixed,
      start_price,
      increase_step,
      buyto_price,
      fixed_offer_price,
      duration,
      length_oftime,
      images_id,
      offer_start,
      start_date,
      is_reactivable,
      is_psuggestion_enable,
      attributes,
      conditions
    } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        offer_id: Joi.number().required().empty(),
        product_id: Joi.number().required().empty(),
        title: Joi.string().required().empty(),
        product_type: Joi.string().required().empty(),
        condition_desc: Joi.string().required().empty(),
        reference_no: Joi.string().optional().allow(null).allow(""),
        is_bid_or_fixed: Joi.string().required().empty(),
        start_price: Joi.number().optional().allow(null).allow(""),
        increase_step: Joi.number().optional().allow(null).allow(""),
        buyto_price: Joi.number().optional().allow(null).allow(""),
        fixed_offer_price: Joi.number().optional().allow(null).allow(""),
        duration: Joi.number().required().empty(),
        length_oftime: Joi.number().required().empty(),
        images_id: Joi.number().required().empty(),
        offer_start: Joi.string().required().empty(),
        start_date: Joi.string().required().empty(),
        is_reactivable: Joi.number().required().empty(),
        is_psuggestion_enable: Joi.number().required().empty(),
        attributes: Joi.string().empty().required(),
        conditions: Joi.string().empty().required(),
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

    const findProduct = await findProductById(product_id);
    if (findProduct.length > 0) {
      const itemsJson = JSON.parse(attributes);
      const condJson = JSON.parse(conditions);
      const offerStart = new Date(offer_start);
      const startDate = new Date(start_date); //date -- YYYY-MM-DD
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + Number(length_oftime),
        startDate.getHours(),
        startDate.getMinutes(),
        startDate.getSeconds(),
        startDate.getMilliseconds()
      );

      const offer_update = {
        product_id: product_id,
        title: title,
        product_type: product_type,
        condition_desc: condition_desc,
        reference_no: reference_no,
        is_bid_or_fixed: is_bid_or_fixed,
        start_price: start_price,
        increase_step: increase_step,
        buyto_price: buyto_price,
        fixed_offer_price: fixed_offer_price,
        duration: duration,
        length_oftime: length_oftime,
        images_id: images_id,
        offerStart: offerStart,
        start_date: startDate,
        end_date: endDate,
        is_reactivable: is_reactivable,
        is_psuggestion_enable: is_psuggestion_enable
      };

      var offerId = 0;
      var attributesUpdate = 0;
      var condUpdate = 0;
      const resultUpdate = await updateOfferById(offer_update, offer_id);
      if (resultUpdate.affectedRows > 0) {
        offerId = offer_id;
        if (itemsJson.length > 0) {
          for (element of itemsJson) {
            const attributesData = {
              product_id: product_id,
              attribute_id: element.attribute_id,
              attribute_value: element.attribute_value,
              subattribute_id: element.subattribute_id,
            };

            const updateRows = await updateAttributOffers(attributesData, offerId);
            attributesUpdate = attributesUpdate + updateRows.affectedRows;
          }
        }

        if (condJson.length > 0) {
          for (element of condJson) {
            const condData = {
              product_id: product_id,
              condition_id: element.condition_id,
              condition_value: element.condition_value,
            };
            const updateRows = await updateConditionOffers(condData, offerId);
            condUpdate = condUpdate + updateRows.affectedRows;
          }
        }
        return res.json({
          success: true,
          message: "Offer Successfully Update",
          status: 200,
          insertId: offerId,
          attributesUpdate: attributesUpdate,
          conditionsInserted: condUpdate,
        });
      } else {
        return res.json({
          success: false,
          message: "Offer Not Update",
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

exports.getOffers = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader != undefined ? authHeader.replace("Bearer ", "") : '';
    const decoded = jwt.decode(token);
    const user_id = decoded != null ? decoded["user_id"] : '';
    const { product_id, page, page_size } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().optional().allow("").allow(null),
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
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

    var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');

    const offer = await getOffers(currDate);

    for (let element of offer) {
      const newEndDate = moment(element.end_date)
        .add(Number(element.length_oftime), 'days').format('YYYY-MM-DD HH:mm:ss'); // Add length of time (in days)

      const offerStartDate = moment(element.offerStart)
        .add(Number(element.length_oftime), 'days').format('YYYY-MM-DD HH:mm:ss');

      // Update the number of times the offer has been reactivated, but ensure it doesn't go below zero
      element.no_of_times_reactivated = element.no_of_times_reactivated > 0 ? element.no_of_times_reactivated - 1 : 0;

      // Update the offer's end date and reactivation count in the database
      await updateOfferEndDate(element.id, offerStartDate, newEndDate, element.no_of_times_reactivated);
    }

    if (user_id == '') {
      var whereClause = "";
      if (
        product_id.length > 0 &&
        product_id !== null &&
        product_id !== undefined
      ) {
        whereClause = `WHERE product_id IN (${product_id}) and offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`; //updated code 26-07-2024
      } else {
        whereClause = ` where offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`;
      }

      const offset = (parseInt(page) - 1) * parseInt(page_size);
      var offers = await getOffersByWhereClause(whereClause, user_id, page_size, offset);
    } else {
      var whereClause = "";
      if (
        product_id.length > 0 &&
        product_id !== null &&
        product_id !== undefined
      ) {
        whereClause = `WHERE offers_created.product_id IN (${product_id}) and offers_created.offfer_buy_status != '1' and TIMESTAMP(offers_created.end_date) >= '${currDate}'`; //updated code 26-07-2024
      } else {
        whereClause = ` where offers_created.offfer_buy_status != '1' and TIMESTAMP(offers_created.end_date) >= '${currDate}'`;
      }

      const offset = (parseInt(page) - 1) * parseInt(page_size);
      var offers = await getOffersByWhereClause(whereClause, user_id, page_size, offset);
    }

    for (element of offers) {
      var startDateTime = element.start_date.toString();
      element.start_date = startDateTime;
      var time = element.remaining_time;
      var timeArray = time.split(":");
      var hours = Number(timeArray[0]) % 24;
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      element.remaining_time = time;
      if (element.product_id != 0) {
        const countR = await getNoOfBids(element.id);
        //const maxBidR = await getMaxBidF(element.product_id);
        if (countR.length > 0) {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        } else {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        }

        const categoryRes = await getCategoryIdByProductId(element.product_id);
        if (categoryRes.length > 0) {
          element.product_name = categoryRes[0].name;
          var categoryId = categoryRes[0].category_id;
          const categoryNameRes = await getCategorybyId(categoryId);
          if (categoryNameRes.length > 0) {
            element.category_name = categoryNameRes[0].cat_name;
          }
        }
      }
      if (element.images_id > 0) {
        const imageR = await getMainImage(element.images_id);
        if (imageR.length > 0) {
          element.main_image_link = imageR[0].main_image;
        }
      }
    }
    const categoryRes = await getCategoryIdByProductId(product_id);
    let categoryNameRes;
    if (categoryRes.length > 0) {
      categoryNameRes = await getCategorybyId(categoryRes[0].category_id);
    } else {
      categoryNameRes = []
    }
    if (offers.length > 0) {

      // Separate the offers based on boost_plan_id
      const notNullOffers = offers.filter(offer => offer.boost_plan_id !== null);
      const nullOffers = offers.filter(offer => offer.boost_plan_id === null);

      // Result array to store the organized offers
      const organizedOffers = [];
      let i = 0, j = 0;

      // Alternating logic
      while (i < notNullOffers.length || j < nullOffers.length) {
        // Add one from notNullOffers if available
        if (i < notNullOffers.length) {
          organizedOffers.push(notNullOffers[i]);
          i++;
        }

        // Add up to three from nullOffers if available
        let nullCount = 0;
        while (j < nullOffers.length && nullCount < 3) {
          organizedOffers.push(nullOffers[j]);
          j++;
          nullCount++;
        }
      }

      return res.json({
        success: true,
        message: "Offer Sorted by time",
        categoryName: organizedOffers[0].category_name,
        productName: organizedOffers[0].product_name,
        offers: organizedOffers,
        status: 200,
      });
    } else if (categoryRes.length > 0 || categoryNameRes.length > 0) {
      return res.json({
        success: false,
        message: "Offer Sorted by time only category name and product name find",
        categoryName: categoryNameRes.length > 0 ? categoryNameRes[0].cat_name : null,
        productName: categoryRes.length > 0 ? categoryRes[0].name : null,
        offers: null,
        status: 400,
      });
    }
    else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.getOffersByUserId = async (req, res) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader != undefined ? authHeader.replace("Bearer ", "") : '';
    const decoded = jwt.decode(token);
    const user_id = decoded != null ? decoded["user_id"] : '';
    const { userProfileId, product_id, page, page_size } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().optional().allow("").allow(null),
        userProfileId: Joi.number().required().empty(),
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
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

    var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');

    var whereClause = "";
    if (
      product_id.length > 0 &&
      product_id !== null &&
      product_id !== undefined
    ) {
      whereClause = `WHERE product_id IN (${product_id}) and offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`; //updated code 26-07-2024
    } else {
      whereClause = ` where user_id = ${userProfileId} AND offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`;
    }

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByUSerId(whereClause, page_size, offset);
    if (offers.length > 0) {

      for (element of offers) {
        var startDateTime = element.start_date.toString();
        element.start_date = startDateTime;
        var time = element.remaining_time;
        var timeArray = time.split(":");
        var hours = Number(timeArray[0]) % 24;
        time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
        element.remaining_time = time;
        if (element.product_id != 0) {
          const countR = await getNoOfBids(element.id);
          //const maxBidR = await getMaxBidF(element.product_id);
          if (countR.length > 0) {
            element.user_bid = {
              user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
              max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
              count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
            }
          } else {
            element.user_bid = {
              user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
              max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
              count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
            }
          }

          const categoryRes = await getCategoryIdByProductId(element.product_id);
          if (categoryRes.length > 0) {
            element.product_name = categoryRes[0].name;
            var categoryId = categoryRes[0].category_id;
            const categoryNameRes = await getCategorybyId(categoryId);
            if (categoryNameRes.length > 0) {
              element.category_name = categoryNameRes[0].cat_name;
            }
          }
        }
        if (element.images_id > 0) {
          const imageR = await getMainImage(element.images_id);
          if (imageR.length > 0) {
            element.main_image_link = imageR[0].main_image;
          }
        }
      }
      const categoryRes = await getCategoryIdByProductId(product_id);
      let categoryNameRes;
      if (categoryRes.length > 0) {
        categoryNameRes = await getCategorybyId(categoryRes[0].category_id);
      } else {
        categoryNameRes = []
      }
      if (offers.length > 0) {
        return res.json({
          success: true,
          message: "Offer Sorted by time",
          categoryName: offers[0].category_name,
          productName: offers[0].product_name,
          offers: offers,
          status: 200,
        });
      } else if (categoryRes.length > 0 || categoryNameRes.length > 0) {
        return res.json({
          success: false,
          message: "Offer Sorted by time only category name and product name find",
          categoryName: categoryNameRes.length > 0 ? categoryNameRes[0].cat_name : null,
          productName: categoryRes.length > 0 ? categoryRes[0].name : null,
          offers: null,
          status: 400,
        });
      }
      else {
        return res.json({
          success: false,
          message: "No Offers Found",
          status: 400,
        });
      }
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.getOffersCountDown = async (req, res) => {
  try {
    const { offerIds } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        offerIds: Joi.string().required().empty(),
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
    const itemsJson = JSON.parse(offerIds);
    var countDownandBids = [];
    for (element of itemsJson) {
      var tempObj = {};
      const result = await getCountDownByOfferId(element.offer_id);
      tempObj.remaining_days = result[0].remaining_days;
      tempObj.offer_id = element.offer_id;
      tempObj.product_id = element.product_id;
      var time = result[0].remaining_time;
      var timeArray = time.split(":");
      var hours = Number(timeArray[0]) % 24;
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      tempObj.remaining_time = time;

      const countR = await getNoOfBids(element.offer_id);
      if (countR.length > 0) {
        tempObj.bid_count = countR[0].count;
        tempObj.max_bid = countR[0].max_bid;
      }

      countDownandBids.push(tempObj);
    }
    if (countDownandBids.length > 0) {
      return res.json({
        success: true,
        message: "Offer Sorted by time",
        countDownandBids: countDownandBids,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.createUserBids = async (req, res) => {
  try {
    const user_id = req.user.id;
    const user_name = req.user.user_name
    const { bid, offer_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        bid: Joi.number().required().empty(),
        offer_id: Joi.number().required().empty(),
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
    const bid_created = {
      bid: bid,
      offer_id: offer_id,
      user_id: user_id,
      created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
    };
    const resultInserted = await insertBidByUser(bid_created);
    const getSellerID = await getSelectedColumn(`offers_created`, `where id = ${offer_id}`, 'user_id');
    const getUserWhoBid = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${user_id}`, `users.user_name, tbl_user_notifications.bid_received`);
    const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.bid_received');

    if (getFCM[0].bid_received == 1) {
      const message = {
        notification: {
          title: 'New Bid on Your Product',
          body: `You have received a bid from ${getUserWhoBid[0].user_name} on your product.`
        },
        token: getFCM[0].fcm_token
      };
      const data = {
        user_id: user_id,
        notification_type: 'Alert',
        title: 'New Bid on Your Product',
        message: `You have received a bid from ${getUserWhoBid[0].user_name} on your product.`
      }
      await insertData('tbl_notification_messages', '', data);
      await send_notification(message, getSellerID[0].user_id);
    }
    if (resultInserted.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Bid Successfully Created",
        status: 200,
        insertId: resultInserted.insertId,
      });
    } else {
      return res.json({
        success: false,
        message: "Bid Not Created",
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

exports.getOffer = async (req, res) => {
  try {
    const { offerId } = req.query;
    var offerRes = await getOfferDetailsByID(offerId);
    if (offerRes.length > 0) {
      var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');
      if (offerRes[0].offfer_buy_status != 1 && offerRes[0].is_reactivable == 1 && moment(offerRes[0].end_date).format('YYYY-MM-DD HH:mm:ss') <= currDate && offerRes[0].no_of_times_reactivated != 0) {
        const newEndDate = moment(offerRes[0].end_date)
          .add(Number(offerRes[0].length_oftime), 'days').format('YYYY-MM-DD HH:mm:ss'); // Add length of time (in days)

        const offerStartDate = moment(offerRes[0].offerStart)
          .add(Number(offerRes[0].length_oftime), 'days').format('YYYY-MM-DD HH:mm:ss');

        // Update the number of times the offer has been reactivated, but ensure it doesn't go below zero
        offerRes[0].no_of_times_reactivated = offerRes[0].no_of_times_reactivated > 0 ? offerRes[0].no_of_times_reactivated - 1 : 0;

        // Update the offer's end date and reactivation count in the database
        await updateOfferEndDate(offerRes[0].id, offerStartDate, newEndDate, offerRes[0].no_of_times_reactivated);
      }

      var startDateTime = offerRes[0].start_date.toString();
      offerRes[0].start_date = startDateTime;
      var EndDateTime = offerRes[0].end_date.toString();
      offerRes[0].end_date = EndDateTime;
      var productId = offerRes[0].product_id;
      const productDetails = await getProductDetailsByID(productId);
      var categoryId = productDetails[0].category_id;
      const categoryDetails = await getCategorybyId(categoryId);
      const attributeDetails = await getOfferAttributesDetailsByID(offerId);

      // Get offer conditions if needed (you can remove this if not used later).
      const conditions = await getOfferConditionsByID(offerId);

      const attributes = await Promise.all(attributeDetails.map(async (elem) => {
        const attributesValues = await getProductAttributeTypeMappingByIDP(productId, elem.attribute_id);

        // Check if attributesValues is empty and skip processing if it is
        if (attributesValues.length === 0) {
          return null; // Return null for filtering later
        }

        const {
          attribute_id: attributeId,
          attribute_value_name: attributeName,
          sub_attribute_heading: subAttributesHeading,
        } = attributesValues[0];

        const tempDetails = await getProductTypeAttribute(productId, attributeId);

        // Initialize subAttributeName
        let subAttributeName = "";
        const { subattribute_id: subAttributeId } = elem;

        // Only fetch sub attributes if subAttributeId is greater than 0
        if (subAttributeId > 0) {
          const result = await getSubAttributesByIID(subAttributeId);
          if (result.length > 0) {
            subAttributeName = result[0].value;
          }
        }

        // Return the constructed object for this attribute
        return {
          ...elem,
          ...tempDetails[0],
          attributeName,
          subAttributesHeading,
          subAttributeName,
        };
      }));

      // Filter out any null values that were returned
      const filteredAttributes = attributes.filter(attribute => attribute !== null);
      const bidRes = await getMaxBidbyOfferID(offerId);
      const offerImages = await getOfferImages(offerRes[0].images_id);
      const sellerDetails = await getSellerDetails(offerRes[0].user_id);
      return res.json({
        success: true,
        message: "Offer Details are as followed",
        offerRes: offerRes,
        productDetails: productDetails,
        categoryDetails: categoryDetails,
        attributes: filteredAttributes,
        offerImages: offerImages,
        conditions: conditions,
        seller: sellerDetails,
        user_bid: {
          user_id: (bidRes.length > 0 && bidRes[0]?.user_id != null) ? bidRes[0]?.user_id : 0,
          max_bid: (bidRes.length > 0 && bidRes[0]?.max_bid != null) ? bidRes[0]?.max_bid : 0,
          count: (bidRes.length > 0 && bidRes[0]?.count != null) ? bidRes[0]?.count : 0
        },
        status: 200,
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Internal server error",
      error: err,
      status: 500,
    });
  }
};

exports.createBuyTransaction = async (req, res) => {
  try {
    const { seller_id, offer_id, amount, is_buy_now, is_max_bid } =
      req.body;
    const schema = Joi.alternatives(
      Joi.object({
        seller_id: Joi.number().required().empty(),
        offer_id: Joi.number().required().empty(),
        amount: Joi.number().required().empty(),
        is_buy_now: Joi.number().required().empty(),
        is_max_bid: Joi.number().required().empty(),
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
    const user_id = req.user.id;
    var transactionId = "";
    var doContinue = 1;
    do {
      transactionId = randomstring.generate({
        length: 12,
        charset: "alphanumeric",
      });
      const found = await checkTransactionID(transactionId);
      if (found.length > 0) {
        doContinue = 0;
      }
    } while (doContinue);

    const transactionDetails = {
      transaction_id: transactionId,
      buyer_id: user_id,
      seller_id: seller_id,
      // product_id: product_id,
      offer_id: offer_id,
      amount: amount,
      is_buy_now: is_buy_now,
      is_max_bid: is_max_bid,
      created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
    };
    const resultInserted = await insertTransaction(transactionDetails);
    if (resultInserted.affectedRows > 0) {
      const resultSetting = await findSetting();
      const userFessPayDetails = {
        transaction_id: transactionId,
        buyer_id: user_id,
        seller_id: seller_id,
        offer_id: offer_id,
        amount: amount,
        commissin_percent: resultSetting[0].commission,
        pay_amount: (amount * resultSetting[0].commission) / 100 <= 200 ? (amount * resultSetting[0].commission) / 100 : 200,
        is_buy_now: is_buy_now,
        is_max_bid: is_max_bid,
        created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
      };
      const addUserFeesPayDetails = await insertUserFeesPay(userFessPayDetails);
      const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id WHERE offers_created.id = ${offer_id}`, 'offers_created.user_id, product.name');
      const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.bid_received');
      if (getFCM[0].item_sold == 1) {
        const message = {
          notification: {
            title: 'Your Item Has Been Sold!',
            body: `Congratulations! Your product "${getSellerID[0].name}" has been sold. Thank you for using our platform!`
          },
          token: getFCM[0].fcm_token
        };
        const data = {
          user_id: getSellerID[0].user_id,
          notification_type: 'Alert',
          title: 'Your Item Has Been Sold!',
          message: `Congratulations! Your product "${getSellerID[0].name}" has been sold. Thank you for using our platform!`
        }
        await insertData('tbl_notification_messages', '', data);
        await send_notification(message, getSellerID[0].user_id);
      }
      const transactionDetail = {
        offer_id: offer_id,
        transaction_id: transactionId,
        buyer_id: user_id,
        seller_id: seller_id,
        buyer_message: 'Congratulations, you have purchased this item!',
        seller_message: 'Congratulations, you have sold this item!',
        buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
        seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
      };
      const paymenytFlowInsert = await insertPaymentFlowInsert(transactionDetail);
      const offerupdate = await updateOfferBuyStatus("1", offer_id);

      return res.json({
        success: true,
        message: "Bid Created",
        status: 200,
        insertId: resultInserted.insertId,
      });
    } else {
      return res.json({
        success: false,
        message: "No Data Found",
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

exports.getOffersFilter = async (req, res) => {
  try {
    const { product_name, page, page_size } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_name: Joi.string().required().empty(),
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
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

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    const productIds = await getProductIdsByName(product_name);
    const offerData = await getffersByName(product_name);

    var product_id = "";
    if (productIds.length > 0 && offerData.length > 0) {
      const allProductIds = [
        ...productIds.map(p => p.id),
        ...offerData.map(offer => offer.product_id)
      ];

      // Remove duplicates by converting to a Set and back to an array
      const uniqueProductIds = [...new Set(allProductIds)];

      for (i = 0; i < uniqueProductIds.length; i++) {
        if (i === uniqueProductIds.length - 1)
          product_id = product_id + "'" + uniqueProductIds[i] + "'";
        else product_id = product_id + "'" + uniqueProductIds[i] + "'" + ",";
      }
    } else if (productIds.length > 0) {
      for (i = 0; i < productIds.length; i++) {
        if (i === productIds.length - 1)
          product_id = product_id + "'" + productIds[i].id + "'";
        else product_id = product_id + "'" + productIds[i].id + "'" + ",";
      }
    } else if (offerData.length > 0) {
      for (i = 0; i < offerData.length; i++) {
        if (i === offerData.length - 1)
          product_id = product_id + "'" + offerData[i].product_id + "'";
        else product_id = product_id + "'" + offerData[i].product_id + "'" + ",";
      }
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
        status: 400,
      });
    }
    var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');
    var whereClause = "";
    if (
      product_name.length > 0 &&
      product_name !== null &&
      product_name !== undefined
    ) {
      whereClause = `WHERE product_id IN (${product_id}) and offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`; //updated code 26-07-2024
    } else {
      whereClause = ` where offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`;
    }
    const user_id = ''
    var offers = await getOffersByWhereClause(whereClause, user_id, page_size, offset);

    for (element of offers) {
      var startDateTime = element.start_date.toString();
      element.start_date = startDateTime;
      var time = element.remaining_time;
      var timeArray = time.split(":");

      var hours = Number(timeArray[0]) % 24;
      console.log(hours);
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      element.remaining_time = time;
      if (element.product_id != 0) {
        const countR = await getNoOfBids(element.id);
        //const maxBidR = await getMaxBidF(element.product_id);
        if (countR.length > 0) {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        } else {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        }

        const categoryRes = await getCategoryIdByProductId(element.product_id);
        if (categoryRes.length > 0) {
          element.product_name = categoryRes[0].name;
          var categoryId = categoryRes[0].category_id;
          const categoryNameRes = await getCategorybyId(categoryId);
          if (categoryNameRes.length > 0) {
            element.category_name = categoryNameRes[0].cat_name;
          }
        }
      }
      if (element.images_id > 0) {
        const imageR = await getMainImage(element.images_id);
        if (imageR.length > 0) {
          element.main_image_link = imageR[0].main_image;
        }
      }
    }
    const categoryRes = await getCategoryIdByProductId(product_id);
    let categoryNameRes;
    if (categoryRes.length > 0) {
      categoryNameRes = await getCategorybyId(categoryRes[0].category_id);
    } else {
      categoryNameRes = []
    }
    if (offers.length > 0) {

      // Separate the offers based on boost_plan_id
      const notNullOffers = offers.filter(offer => offer.boost_plan_id !== null);
      const nullOffers = offers.filter(offer => offer.boost_plan_id === null);

      // Result array to store the organized offers
      const organizedOffers = [];
      let i = 0, j = 0;

      // Alternating logic
      while (i < notNullOffers.length || j < nullOffers.length) {
        // Add one from notNullOffers if available
        if (i < notNullOffers.length) {
          organizedOffers.push(notNullOffers[i]);
          i++;
        }

        // Add up to three from nullOffers if available
        let nullCount = 0;
        while (j < nullOffers.length && nullCount < 3) {
          organizedOffers.push(nullOffers[j]);
          j++;
          nullCount++;
        }
      }

      return res.json({
        success: true,
        message: "Offer Sorted by time",
        categoryName: organizedOffers[0].category_name,
        productName: organizedOffers[0].product_name,
        offers: organizedOffers,
        status: 200,
      });
    } else if (categoryRes.length > 0 || categoryNameRes.length > 0) {
      return res.json({
        success: false,
        message: "Offer Sorted by time only category name and product name find",
        categoryName: categoryNameRes.length > 0 ? categoryNameRes[0].cat_name : null,
        productName: categoryRes.length > 0 ? categoryRes[0].name : null,
        offers: null,
        status: 400,
      });
    }
    else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.transactionHistoryUser = async (req, res) => {
  try {
    const user_id = req.user.id;
    //updated code  26-07-2024 added getTransactionsHistoryUpdated model
    const transactionRes = await getTransactionsHistoryUpdated(user_id);
    if (transactionRes.length > 0) {
      await Promise.all(
        transactionRes.map(async (item) => {
          if (item.images_id) {
            const offer_image = await getoffer_images(item.images_id);
            item.offer_image =
              offer_image.length > 0 ? offer_image[0].main_image : "";
          } else {
            item.offer_image = "";
          }
        })
      );

      return res.json({
        success: true,
        message: "Transaction History Fetched",
        transactionRes: transactionRes,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No History Found",
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

exports.createOfferFavourites = async (req, res) => {
  try {
    const { offer_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        offer_id: Joi.number().required().empty(),
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
    const user_id = req.user.id;
    const offerFavourites = {
      offer_id: offer_id,
      user_id: user_id,
    };
    const resultInserted = await insertOfferFavourites(offerFavourites);
    if (resultInserted.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Favourite Offers created",
        status: 200,
        insertId: resultInserted.insertId,
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

exports.getFavouriteOffers = async (req, res) => {
  try {
    const { page, page_size } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
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
    const user_id = req.user.id;

    const offerIds = await getFavouriteOffersByUserId(user_id);
    var offer_id = "";
    if (offerIds.length > 0) {
      for (i = 0; i < offerIds.length; i++) {
        if (i === offerIds.length - 1)
          offer_id = offer_id + "'" + offerIds[i].offer_id + "'";
        else offer_id = offer_id + "'" + offerIds[i].offer_id + "'" + ",";
      }
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
        status: 400,
      });
    }

    var whereClause = "";
    if (offer_id.length > 0 && offer_id !== null && offer_id !== undefined) {
      whereClause = ` where id in  (${offer_id})  and offfer_buy_status != '1'`; //updated code 26-07-2024
    } else {
      whereClause = ` where offfer_buy_status != '1'`;
    }

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByWhereClause(whereClause, user_id, page_size, offset);
    for (element of offers) {
      var startDateTime = element.start_date.toString();
      element.start_date = startDateTime;
      var time = element.remaining_time;
      var timeArray = time.split(":");
      var hours = Number(timeArray[0]) % 24;
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      element.remaining_time = time;
      if (element.product_id != 0) {
        const countR = await getNoOfBids(element.product_id, element.id);
        //const maxBidR = await getMaxBidF(element.product_id);
        if (countR.length > 0) {
          element.count = countR[0].count;
          element.max_bid = countR[0].max_bid;
        }

        const categoryRes = await getCategoryIdByProductId(element.product_id);
        if (categoryRes.length > 0) {
          var categoryId = categoryRes[0].category_id;
          const categoryNameRes = await getCategorybyId(categoryId);
          if (categoryNameRes.length > 0) {
            element.category_name = categoryNameRes[0].cat_name;
          }
        }
      }
      const sellerDetails = await getSellerDetails(element.user_id);
      element.sellername = sellerDetails[0].first_name + ' ' + sellerDetails[0].last_name;
      element.sellerId = sellerDetails[0].id;
      if (element.images_id > 0) {
        const imageR = await getMainImage(element.images_id);
        if (imageR.length > 0) {
          element.main_image_link = imageR[0].main_image;
        }
      }
    }
    if (offers.length > 0) {
      return res.json({
        success: true,
        message: "Offer Sorted by time",
        offers: offers,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.getSubAttributes = async (req, res) => {
  try {
    const { id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        id: Joi.number().optional().allow("").allow(null),
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

    var offers = await getSubAttributesByID(id);
    if (offers.length > 0) {
      return res.json({
        success: true,
        message: "Subattributes fetched successfully",
        subAttributes: offers,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Subattributes Found",
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

exports.getAttributesMapping = async (req, res) => {
  try {
    const { attributes } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        attributes: Joi.string().empty(),
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
    var attributesMapping = [];
    const itemsJson = JSON.parse(attributes);
    if (itemsJson.length > 0) {
      for (element of itemsJson) {
        var attributeId = Number(element.attribute_id);
        var attributeValue = element.attribute_value;
        var tempObj = {};
        const result = await getSubAttributesHeadingByIDValue(
          attributeId,
          attributeValue
        );
        if (result.length > 0) {
          tempObj.attribute_id = attributeId;
          tempObj.attribute_value = attributeValue;
          tempObj.sub_attribute_heading = result[0].sub_attribute_heading;
        }
        attributesMapping.push(tempObj);
      }
    }
    if (attributesMapping.length > 0) {
      return res.json({
        success: true,
        message: "Subattributes fetched successfully",
        subattributes: attributesMapping,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Subattributes Found",
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

exports.getCategories = async (req, res) => {
  try {
    const result = await getCategoriesAll();
    var categoryWithProducts = [];
    if (result.length > 0) {
      for (elem of result) {
        var categoryId = elem.id;
        tempObj = {
          category_id: elem.id,
          category_name: elem.cat_name,
        };
        const productDetailRes = await getProductNameByID(categoryId);
        if (productDetailRes.length) {
          tempObj.productDetails = productDetailRes;
        }
        categoryWithProducts.push(tempObj);
      }
      return res.json({
        success: true,
        message: "Categories found with Products",
        categoryWithProducts: categoryWithProducts,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Subattributes Found",
        status: 400,
      });
    }
  } catch (error) {
    console.log(error, "<==error");
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};

exports.getOffersAdvancedFilter = async (req, res) => {
  try {
    const { product_id, page, page_size, conditions, price } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().optional().allow("").allow(null),
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
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

    var whereClause = "";
    if (
      product_id.length > 0 &&
      product_id !== null &&
      product_id !== undefined
    ) {
      whereClause = ` where product_id in  (${product_id})  and offfer_buy_status != '1'`; //updated code 26-07-2024
    } else {
      whereClause = ` where offfer_buy_status != '1'`;
    }
    const user_id = '';
    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByWhereClause(whereClause, user_id, page_size, offset);
    for (element of offers) {
      var startDateTime = element.start_date.toString();
      element.start_date = startDateTime;
      var time = element.remaining_time;
      var timeArray = time.split(":");
      var hours = Number(timeArray[0]) % 24;
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      element.remaining_time = time;
      if (element.product_id != 0) {
        const countR = await getNoOfBids(element.product_id, element.id);
        //const maxBidR = await getMaxBidF(element.product_id);
        if (countR.length > 0) {
          element.count = countR[0].count;
          element.max_bid = countR[0].max_bid;
        }

        const categoryRes = await getCategoryIdByProductId(element.product_id);
        if (categoryRes.length > 0) {
          var categoryId = categoryRes[0].category_id;
          const categoryNameRes = await getCategorybyId(categoryId);
          if (categoryNameRes.length > 0) {
            element.category_name = categoryNameRes[0].cat_name;
          }
        }
      }
      if (element.images_id > 0) {
        const imageR = await getMainImage(element.images_id);
        if (imageR.length > 0) {
          element.main_image_link = imageR[0].main_image;
        }
      }
    }
    if (offers.length > 0) {
      return res.json({
        success: true,
        message: "Offer Sorted by time",
        offers: offers,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

// exports.getOfferAdvancedFilter = async (req, res) => {
//   try {
//     const { condition, auctionType, brand, brand_length, product_id, page, page_size } =
//       req.body;
//     const schema = Joi.alternatives(
//       Joi.object({
//         product_id: Joi.number().optional().allow("").allow(null),
//         page: Joi.number().required().empty(),
//         page_size: Joi.number().required().empty(),
//         condition: Joi.string().optional().allow("").allow(null),
//         brand: Joi.string().optional().allow("").allow(null),
//         brand_length: Joi.number().optional().allow("").allow(null),
//         auctionType: Joi.string().optional().allow("").allow(null),
//         attributes: Joi.string().optional().allow("").allow(null),
//         price: Joi.string().optional().allow("").allow(null)
//       })
//     );
//     const result = schema.validate(req.body);
//     if (result.error) {
//       const message = result.error.details.map((i) => i.message).join(",");
//       return res.json({
//         message: result.error.details[0].message,
//         error: message,
//         missingParams: result.error.details[0].message,
//         status: 200,
//         success: false,
//       });
//     }

//     var whereClause = "";
//     var from = "from offers_created oc";
//     if (
//       product_id.length > 0 &&
//       product_id !== null &&
//       product_id !== undefined
//     ) {
//       whereClause = ` where oc.product_id in  (${product_id})  and oc.offfer_buy_status != '1'`; //updated code 26-07-2024
//     } else {
//       whereClause = ` where oc.offfer_buy_status != '1'`;
//     }

//     if (
//       (Number(auctionType) === 1 || Number(auctionType) === 0) &&
//       auctionType !== null &&
//       auctionType !== undefined &&
//       auctionType !== ''
//     ) {
//       whereClause = whereClause + ` and  oc.is_bid_or_fixed = '${auctionType}' `;
//     }

//     if (condition.length > 0 && condition !== null && condition !== undefined) {
//       from = from + " ,  offer_condition_mapping ocm ";
//       whereClause =
//         whereClause +
//         ` and oc.product_id = ocm.product_id and oc.id = ocm.offer_id and ocm.condition_id in (${condition}) `;
//     }

//     if (
//       brand.length > 0 &&
//       brand !== null &&
//       brand !== undefined
//     ) {
//       var brandLength = Number(brand_length)

//       whereClause =
//         whereClause +
//         ` and oc.id in (SELECT offer_id FROM offer_proattr_mapping WHERE attribute_id in (${brand}) and product_id = 1 GROUP BY offer_id HAVING count(*) = ${brandLength})`;
//     }

//     const offset = (parseInt(page) - 1) * parseInt(page_size);
//     var offers = await getOffersBDynamically(
//       from,
//       whereClause,
//       page_size,
//       offset
//     );
//     for (element of offers) {
//       var startDateTime = element.start_date.toString();
//       element.start_date = startDateTime;
//       var time = element.remaining_time;
//       var timeArray = time.split(":");
//       var hours = Number(timeArray[0]) % 24;
//       time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
//       element.remaining_time = time;
//       if (element.product_id != 0) {
//         const countR = await getNoOfBids(element.product_id, element.id);
//         //const maxBidR = await getMaxBidF(element.product_id);
//         if (countR.length > 0) {
//           element.count = countR[0].count;
//           element.max_bid = countR[0].max_bid;
//         }

//         const categoryRes = await getCategoryIdByProductId(element.product_id);
//         if (categoryRes.length > 0) {
//           var categoryId = categoryRes[0].category_id;
//           const categoryNameRes = await getCategorybyId(categoryId);
//           if (categoryNameRes.length > 0) {
//             element.category_name = categoryNameRes[0].cat_name;
//           }
//         }
//       }
//       if (element.images_id > 0) {
//         const imageR = await getMainImage(element.images_id);
//         if (imageR.length > 0) {
//           element.main_image_link = imageR[0].main_image;
//         }
//       }
//     }
//     if (offers.length > 0) {
//       return res.json({
//         success: true,
//         message: "Offer Sorted by time",
//         offers: offers,
//         status: 200,
//       });
//     } else {
//       return res.json({
//         success: false,
//         message: "No Offers Found",
//         status: 400,
//       });
//     }
//   } catch (err) {
//     console.log(err);

//     return res.json({
//       success: false,
//       message: "Internal server error",
//       error: err,
//       status: 500,
//     });
//   }
// };

exports.getOfferAdvancedFilter = async (req, res) => {
  try {
    const { condition, auctionType, attributes, product_id, price, page, page_size } = req.body;

    const schema = Joi.alternatives(
      Joi.object({
        condition: Joi.string().optional().allow("").allow(null),
        attributes: Joi.string().optional().allow("").allow(null),
        auctionType: Joi.string().optional().allow("").allow(null),
        product_id: Joi.number().optional().allow("").allow(null),
        price: Joi.string().optional().allow("").allow(null),
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
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

    // Function to safely parse JSON strings
    const safeParseJSON = (str, fallback) => {
      try {
        return str && JSON.parse(str);
      } catch (e) {
        return fallback;
      }
    };

    // const attributesArray = JSON.parse(attributes);
    // Parse attributes, condition, and auctionType safely
    const parsedAttributes = safeParseJSON(attributes, []);
    const parsedCondition = safeParseJSON(condition, []);
    const parsedAuctionType = safeParseJSON(auctionType, []);
    const parsePrice = safeParseJSON(price, []);

    // Function to get offer IDs for attributes
    const getOfferIdsForAttributes = async (product_id, attributes) => {

      if (!attributes || attributes.length === 0) return [];
      const allOfferIds = [];
      for (const { key, ids } of attributes) {
        const result = await getOfferIdByAttributes(product_id, ids);

        const offerIds = result.map(row => row.offer_id);
        allOfferIds.push(offerIds);
      }
      // Find the intersection of all offer ID arrays for attributes
      return allOfferIds.reduce((acc, curr) => acc.filter(id => curr.includes(id)), allOfferIds[0] || []);
    };

    // Function to get offer IDs for a given filter type
    const getOfferIds = async (product_id, ids, queryFunc) => {
      if (!ids || ids.length === 0) return [];
      const result = await queryFunc(product_id, ids);
      if (queryFunc == getOfferIdByAuctionType) {
        return result.map(row => row.id);
      } else {
        return result.map(row => row.offer_id);
      }
    };

    // Get offer IDs for attributes if attributes are provided
    const attributeOfferIds = parsedAttributes.length > 0
      ? await getOfferIdsForAttributes(product_id, parsedAttributes)
      : null;

    // Get offer IDs for conditions if condition is provided
    const conditionOfferIds = parsedCondition.length > 0
      ? await getOfferIds(product_id, parsedCondition, getOfferIdByConditions)
      : null;

    // Get offer IDs for auctionType if auctionType is provided
    const auctionTypeOfferIds = parsedAuctionType.length > 0
      ? await getOfferIds(product_id, parsedAuctionType, getOfferIdByAuctionType)
      : null;

    // Check if any filter is provided but has no results
    // if (
    //   (parsedCondition.length > 0 && (conditionOfferIds === null || conditionOfferIds.length === 0)) ||
    //   (parsedAttributes.length > 0 && (attributeOfferIds === null || attributeOfferIds.length === 0)) ||
    //   (parsedAuctionType.length > 0 && (auctionTypeOfferIds === null || auctionTypeOfferIds.length === 0))
    // ) {
    //   return res.json({
    //     success: false,
    //     offer_ids: [],
    //   });
    // }

    // Combine all non-null offer ID arrays
    const allOfferIds = [
      attributeOfferIds,
      conditionOfferIds,
      auctionTypeOfferIds
    ].filter(ids => ids !== null);

    // // If no filters are provided, return an empty array
    // if (allOfferIds.length === 0) {
    //   return res.json({
    //     success: false,
    //     offer_ids: [],
    //   });
    // }

    // Find the intersection of all non-null offer ID arrays
    const commonOfferIds = allOfferIds.reduce((acc, curr) => acc.filter(id => curr.includes(id)), allOfferIds[0]);

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByIDsWhereClause(
      commonOfferIds,
      product_id,
      parsePrice,
      page_size,
      offset
    );

    for (element of offers) {
      var startDateTime = element.start_date.toString();
      element.start_date = startDateTime;
      var time = element.remaining_time;
      var timeArray = time.split(":");
      var hours = Number(timeArray[0]) % 24;
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      element.remaining_time = time;
      if (element.product_id != 0) {
        const countR = await getNoOfBids(element.product_id, element.id);

        //const maxBidR = await getMaxBidF(element.product_id);
        if (countR.length > 0) {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        } else {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        }

        const categoryRes = await getCategoryIdByProductId(element.product_id);
        if (categoryRes.length > 0) {
          var categoryId = categoryRes[0].category_id;
          const categoryNameRes = await getCategorybyId(categoryId);
          if (categoryNameRes.length > 0) {
            element.category_name = categoryNameRes[0].cat_name;
          }
        }
      }
      if (element.images_id > 0) {
        const imageR = await getMainImage(element.images_id);
        if (imageR.length > 0) {
          element.main_image_link = imageR[0].main_image;
        }
      }
    }
    if (offers.length > 0) {
      return res.json({
        success: true,
        message: "Offer Sorted by time",
        offers: offers,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.getProductBySearch = async (req, res) => {
  try {
    const { search } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        search: Joi.string().optional().allow("").allow(null),
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

    var products = await getSearchByProduct(search);
    if (products.category.length > 0 || products.product.length > 0) {
      return res.json({
        success: true,
        message: "Product fetched successfully",
        subAttributes: products,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Product Found",
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

exports.getOffersByCategoryId = async (req, res) => {
  try {
    const { category_id, page, page_size } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        category_id: Joi.number().optional().allow("").allow(null),
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
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

    var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');

    var whereClause = "";
    if (
      category_id.length > 0 &&
      category_id !== null &&
      category_id !== undefined
    ) {
      whereClause = `WHERE product.category_id IN (${category_id}) and offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`; //updated code 26-07-2024
    } else {
      whereClause = ` where offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`;
    }

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByCategoryWhereClause(whereClause, page_size, offset);

    for (element of offers) {
      var startDateTime = element.start_date.toString();
      element.start_date = startDateTime;
      var time = element.remaining_time;
      var timeArray = time.split(":");
      var hours = Number(timeArray[0]) % 24;
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      element.remaining_time = time;
      if (element.product_id != 0) {
        const countR = await getNoOfBids(element.id);
        //const maxBidR = await getMaxBidF(element.product_id);
        if (countR.length > 0) {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        } else {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        }

        const categoryRes = await getCategoryIdByProductId(element.product_id);
        if (categoryRes.length > 0) {
          var categoryId = categoryRes[0].category_id;
          const categoryNameRes = await getCategorybyId(categoryId);
          if (categoryNameRes.length > 0) {
            element.category_name = categoryNameRes[0].cat_name;
          }
        }
      }
      if (element.images_id > 0) {
        const imageR = await getMainImage(element.images_id);
        if (imageR.length > 0) {
          element.main_image_link = imageR[0].main_image;
        }
      }
    }
    const categoryNameRes = await getCategorybyId(category_id);
    if (offers.length > 0) {

      // Separate the offers based on boost_plan_id
      const notNullOffers = offers.filter(offer => offer.boost_plan_id !== null);
      const nullOffers = offers.filter(offer => offer.boost_plan_id === null);

      // Result array to store the organized offers
      const organizedOffers = [];
      let i = 0, j = 0;

      // Alternating logic
      while (i < notNullOffers.length || j < nullOffers.length) {
        // Add one from notNullOffers if available
        if (i < notNullOffers.length) {
          organizedOffers.push(notNullOffers[i]);
          i++;
        }

        // Add up to three from nullOffers if available
        let nullCount = 0;
        while (j < nullOffers.length && nullCount < 3) {
          organizedOffers.push(nullOffers[j]);
          j++;
          nullCount++;
        }
      }

      return res.json({
        success: true,
        message: "Offer Sorted by time",
        categoryName: organizedOffers[0].category_name,
        offers: organizedOffers,
        status: 200,
      });
    } else if (categoryNameRes.length > 0) {
      return res.json({
        success: false,
        message: "Offer Sorted by time only category name find",
        categoryName: categoryNameRes[0].cat_name,
        offers: null,
        status: 400,
      });
    }
    else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.createNewBid = async (data) => {
  try {
    const { bid, offer_id, user_id } = data;
    const schema = Joi.alternatives(
      Joi.object({
        bid: Joi.number().required().empty(),
        offer_id: Joi.number().required().empty(),
        user_id: Joi.number().required().empty(),
      })
    );
    const result = schema.validate(data);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
    } else {
      const bid_created = {
        bid: bid,
        offer_id: offer_id,
        user_id: user_id,
        created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
      };
      const resultInserted = await insertBidByUser(bid_created);
      const getSellerID = await getSelectedColumn(`offers_created`, `where id = ${offer_id}`, 'user_id');
      const getUserWhoBid = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${user_id}`, `users.user_name, tbl_user_notifications.bid_received`);
      const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.bid_received');

      if (getFCM[0].bid_received == 1) {
        const message = {
          notification: {
            title: 'New Bid on Your Product',
            body: `You have received a bid from ${getUserWhoBid[0].user_name} on your product.`
          },
          token: getFCM[0].fcm_token
        };
        const data = {
          user_id: user_id,
          notification_type: 'Alert',
          title: 'New Bid on Your Product',
          message: `You have received a bid from ${getUserWhoBid[0].user_name} on your product.`
        }
        await insertData('tbl_notification_messages', '', data);
        await send_notification(message, getSellerID[0].user_id);
      }
    }
  } catch (err) {
    console.log("Internal Seerver Error =>", err);
  }
};

exports.getBitCountByOfferId = async (data) => {
  try {
    const { offer_id } = data;
    const bidCount = await findBidCountUserId(offer_id);
    if (bidCount.length > 0) {
      console.log("Successfully Get Bid Count =>", bidCount);
    } else {
      console.log("Successfully Not Get Bid Count");
    }
    return bidCount; // Return the bid count
  } catch (err) {
    console.log("Internal Seerver Error =>", err);
    return null;
  }
};

exports.getOffersByProductId = async (req, res) => {
  try {
    const { product_id } = req.query;
    const page_size = req.query.page_size && req.query.page_size !== '' ? parseInt(req.query.page_size, 100000) : 1000000;
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

    var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');

    var whereClause = "";
    if (
      product_id.length > 0 &&
      product_id !== null &&
      product_id !== undefined
    ) {
      whereClause = `WHERE product_id IN (${product_id}) and offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`; //updated code 26-07-2024
    } else {
      whereClause = ` where offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`;
    }

    const offset = 0;
    const user_id = ''
    var offers = await getOffersByWhereClause(whereClause, user_id, page_size, offset);

    for (element of offers) {
      var startDateTime = element.start_date.toString();
      element.start_date = startDateTime;
      var time = element.remaining_time;
      var timeArray = time.split(":");
      var hours = Number(timeArray[0]) % 24;
      time = hours.toString() + ":" + timeArray[1] + ":" + timeArray[1];
      element.remaining_time = time;
      if (element.product_id != 0) {
        const countR = await getNoOfBids(element.id);
        //const maxBidR = await getMaxBidF(element.product_id);
        if (countR.length > 0) {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        } else {
          element.user_bid = {
            user_id: (countR.length > 0 && countR[0]?.user_id != null) ? countR[0]?.user_id : 0,
            max_bid: (countR.length > 0 && countR[0]?.max_bid != null) ? countR[0]?.max_bid : 0,
            count: (countR.length > 0 && countR[0]?.count != null) ? countR[0]?.count : 0
          }
        }

        const categoryRes = await getCategoryIdByProductId(element.product_id);
        if (categoryRes.length > 0) {
          var categoryId = categoryRes[0].category_id;
          const categoryNameRes = await getCategorybyId(categoryId);
          if (categoryNameRes.length > 0) {
            element.category_name = categoryNameRes[0].cat_name;
          }
        }
      }
      if (element.images_id > 0) {
        const imageR = await getMainImage(element.images_id);
        if (imageR.length > 0) {
          element.main_image_link = imageR[0].main_image;
        }
      }
    }

    if (offers.length > 0) {
      return res.json({
        success: true,
        message: "Successfully Offers find By Product Id",
        offers: offers,
        status: 200,
      });
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
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

exports.updateOfferExpired = async (req, res) => {
  try {
    var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');
    var offerResult = await getOffersAutoUpdate(currDate);
    if (offerResult.length > 0) {
      for (item of offerResult) {
        var offerId = item.id;
        var doContinue = 1;
        var transactionId = 0;
        var seller = item.user_id;
        var productId = item.product_id
        var buyer = 0;
        var max_bid = 0;
        const result = await getMaxBidOnOffer(offerId);
        if (result.length > 0) {
          buyer = result[0].user_id;
          max_bid = result[0].bid
        }
        do {
          transactionId = randomstring.generate({
            length: 12,
            charset: "alphanumeric",
          });
          const found = await checkTransactionID(transactionId);
          if (found.length > 0) {
            doContinue = 0;
          }
        } while (doContinue);
        const transactionDetails = {
          transaction_id: transactionId,
          buyer_id: buyer,
          seller_id: seller,
          // product_id: productId,
          offer_id: offerId,
          amount: max_bid,
          is_buy_now: 0,
          is_max_bid: 1,
          created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
        };
        const resultInserted = await insertTransaction(transactionDetails);
        if (resultInserted.affectedRows > 0) {
          const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id WHERE offers_created.id = ${offerId}`, 'offers_created.user_id, product.name');
          const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.bid_received');

          if (getFCM[0].item_sold == 1) {
            const message = {
              notification: {
                title: 'Your Item Has Been Sold!',
                body: `Congratulations! Your product "${getSellerID[0].name}" has been sold. Thank you for using our platform!`
              },
              token: getFCM[0].fcm_token
            };
            const data = {
              user_id: getSellerID[0].user_id,
              notification_type: 'Alert',
              title: 'Your Item Has Been Sold!',
              message: `Congratulations! Your product "${getSellerID[0].name}" has been sold. Thank you for using our platform!`
            }
            await insertData('tbl_notification_messages', '', data);
            await send_notification(message, getSellerID[0].user_id);
          }
          const resultSetting = await findSetting();
          const userFessPayDetails = {
            transaction_id: transactionId,
            buyer_id: buyer,
            seller_id: seller,
            offer_id: offerId,
            amount: max_bid,
            commissin_percent: resultSetting[0].commission,
            pay_amount: (max_bid * resultSetting[0].commission) / 100 <= 200 ? (max_bid * resultSetting[0].commission) / 100 : 200,
            is_buy_now: 0,
            is_max_bid: 1,
            created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          };
          const addUserFeesPayDetails = await insertUserFeesPay(userFessPayDetails);
          const transactionDetail = {
            offer_id: offerId,
            transaction_id: transactionId,
            buyer_id: buyer,
            seller_id: seller,
            buyer_message: 'Congratulations, you have purchased this item!',
            seller_message: 'Congratulations, you have sold this item!',
            buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
            seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          };
          const paymenytFlowInsert = await insertPaymentFlowInsert(transactionDetail);
          const offerupdate = await updateOfferBuyStatus("1", offerId);
          if (offerupdate.affectedRows > 0) {
            return res.json({
              success: true,
              message: "Offer Successfully Update",
              status: 200,
              error: false,
              updateData: offerupdate
            });
          } else {
            return res.json({
              success: false,
              message: "Offer Not Update",
              status: 200,
              error: true
            });
          }
        }
      }
    } else {
      return res.json({
        success: true,
        message: "Offer Already Updated",
        status: 200,
        error: false
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: "Internal server error" + ':' + error.message,
      error: true,
      status: 500,
    });
  }
};