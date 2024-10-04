const {
  getProductDetails,
  getProductAttributesByID,
  getProductTypeAttributeByID,
  insertOfferImages,
  getProductAttributeTypeMapping,
  insertOfferCreated,
  getOffersByWhereClause,
  getNoOfBids,
  getMainImage,
  insertAttributOffers,
  insertConditionOffers,
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
  getOfferImages,
  getProductTypeAttribute,
  getProductAttributeTypeMappingByIDP,
  checkTransactionID,
  insertTransaction,
  getProductIdsByName,
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
  getSearchByProduct
} = require("../models/product");

const Joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();
var randomstring = require("randomstring");
var moment = require('moment-timezone');

exports.getProducts = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;

    if (user_id === undefined || user_id === null) {
      return res.json({
        success: false,
        status: 500,
        msg: "The token is expired or incorrect, Please login again",
      });
    }
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
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;

    if (user_id === undefined || user_id === null) {
      return res.json({
        success: false,
        status: 500,
        msg: "The token is expired or incorrect, Please login again",
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
    console.log(err);
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
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;

    if (user_id === undefined || user_id === null) {
      return res.json({
        success: false,
        status: 500,
        msg: "The token is expired or incorrect, Please login again",
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
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];

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
    const {
      product_id,
      title,
      product_type,
      condition_desc,
      offerStart,
      reference_no,
      is_bid_or_fixed,
      start_price,
      start_date,
      increase_step,
      buyto_price,
      fixed_offer_price,
      duration,
      length_oftime,
      images_id,
      attributes,
      conditions,
      is_reactivable,
      is_psuggestion_enable
    } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().required().empty(),
        title: Joi.string().required().empty(),
        product_type: Joi.string().required().empty(),
        offerStart: Joi.string().required().empty(),
        condition_desc: Joi.string().required().empty(),
        reference_no: Joi.string().optional().allow(null).allow(""),
        is_bid_or_fixed: Joi.string().required().empty(),
        start_price: Joi.number().optional().allow(null).allow(""),
        increase_step: Joi.number().optional().allow(null).allow(""),
        start_date: Joi.string().required().empty(),
        buyto_price: Joi.number().optional().allow(null).allow(""),
        fixed_offer_price: Joi.number().optional().allow(null).allow(""),
        duration: Joi.number().required().empty(),
        length_oftime: Joi.number().required().empty(),
        images_id: Joi.number().required().empty(),
        attributes: Joi.string().empty().required(),
        conditions: Joi.string().empty().required(),
        is_reactivable: Joi.number().required().empty(),
        is_psuggestion_enable: Joi.number().required().empty(),
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

    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;

    const itemsJson = JSON.parse(attributes);
    console.log(itemsJson);
    const condJson = JSON.parse(conditions);
    const startDate = new Date(start_date); //date -- YYYY-MM-DD
    let hour = startDate.getHours();
    let minutes = startDate.getMinutes();
    let seconds = startDate.getSeconds();
    let ms = startDate.getMilliseconds();

    endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate() + Number(length_oftime)
    );
    endDate.setHours(hour);
    endDate.setMinutes(minutes);
    endDate.setSeconds(seconds);
    endDate.setMilliseconds(ms);

    // code for adding actual end time as it is
    // const newDateStr = moment(offerStart).add(length_oftime, 'days').format('YYYY-MM-DD HH:mm:ss');



    const offer_created = {
      product_id: product_id,
      title: title,
      product_type: product_type,
      condition_desc: condition_desc,
      reference_no: reference_no,
      offerStart: offerStart,
      is_bid_or_fixed: is_bid_or_fixed,
      start_price: start_price,
      increase_step: increase_step,
      buyto_price: buyto_price,
      fixed_offer_price: fixed_offer_price,
      duration: duration,
      length_oftime: length_oftime,
      images_id: images_id,
      start_date: startDate,
      end_date: endDate,
      // actual_end_time:newDateStr,
      user_id: user_id,
      is_reactivable: is_reactivable,
      is_psuggestion_enable: is_psuggestion_enable
    };
    var offerId = 0;
    var attributesInserted = 0;
    var condInserted = 0;
    const resultInserted = await insertOfferCreated(offer_created);
    if (resultInserted.affectedRows > 0) {
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

exports.getOffers = async (req, res) => {
  try {


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


    var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
 


    var whereClause = "";
    if (
      product_id.length > 0 &&
      product_id !== null &&
      product_id !== undefined
    ) {

     whereClause = ` where product_id in  (${product_id})  and offfer_buy_status != '1' and TIMESTAMP(end_date) <= '${currDate}'`; //updated code 26-07-2024
    } else {

      whereClause = ` where offfer_buy_status != '1' and TIMESTAMP(end_date) >= '${currDate}'`;
    }

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByWhereClause(whereClause, page_size, offset);

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
    const { bid, product_id, offer_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().required().empty(),
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
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];
    var buyToPrice = 0;
    const offerRes = await getOfferRecord(offer_id);
    if (offerRes.length > 0) {
      buyToPrice = offerRes[0].buyto_price;
    }

    const bidRows = await selectBidbyUser(offer_id, product_id, user_id);
    if (bidRows.length > 0) {
      var lastBid = bidRows[0].bid;
      const updatedRows = await updateBidsByUser(
        offer_id,
        user_id,
        product_id,
        bid,
        lastBid
      );
      if (updatedRows.affectedRows > 0) {
        return res.json({
          success: true,
          message: "Bid Created",
          status: 200,
          insertId: updatedRows.affectedRows,
        });
      } else {
        return res.json({
          success: false,
          message: "No Data Found",
          status: 400,
        });
      }
    } else {
      const bid_created = {
        product_id: product_id,
        bid: bid,
        max_price: buyToPrice,
        offer_id: offer_id,
        user_id: user_id,
      };
      const resultInserted = await insertBidByUser(bid_created);
      if (resultInserted.affectedRows > 0) {
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

exports.getOffer = async (req, res) => {
  try {
    const { offerId } = req.query;
    
    var offerRes = await getOfferDetailsByID(offerId);
    if (offerRes.length > 0) {
      var startDateTime = offerRes[0].start_date.toString();
      offerRes[0].start_date = startDateTime;
      var EndDateTime = offerRes[0].end_date.toString();
      offerRes[0].end_date = EndDateTime;
      var productId = offerRes[0].product_id;
      const productDetails = await getProductDetailsByID(productId);
      var categoryId = productDetails[0].category_id;
      const categoryDetails = await getCategorybyId(categoryId);
      
      
      // var attributeDetails = await getOfferAttributesDetailsByID(offerId);
      
      // // adding code for getting offer conditions;
      // var conditions = await getOfferConditionsByID(offerId);
      // var attributes = [];
      // for (elem of attributeDetails) {
      //   const attributesValues = await getProductAttributeTypeMappingByIDP(
      //     productId,
      //     elem.attribute_id
      //   );
      //   if (attributesValues.length > 0) {
      //     var attributeId = attributesValues[0].attribute_id;
      //     var attributeName = attributesValues[0].attribute_value_name;
          
      //     var subAttributesHeading = attributesValues[0].sub_attribute_heading;
      //     const tempDetails = await getProductTypeAttribute(
      //       productId,
      //       attributeId
      //     );

      //     var subAttributeId = elem.subattribute_id;
      //     var subAttributeName = "";
      //     if (subAttributeId > 0) {
      //       const result = await getSubAttributesByIID(subAttributeId);
      //       if (result.length > 0) {
      //         subAttributeName = result[0].value;
      //       }
      //     }
      //     const tempObj = {
      //       ...elem,
      //       ...tempDetails[0],
      //       attributeName,
      //       subAttributesHeading,
      //       subAttributeName,
      //     };

      //     attributes.push(tempObj);
      //   }
      // }      

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
        seller:sellerDetails,
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

exports.createBuyTransaction = async (req, res) => {
  try {
    const { seller_id, product_id, offer_id, amount, is_buy_now, is_max_bid } =
      req.body;
    const schema = Joi.alternatives(
      Joi.object({
        seller_id: Joi.number().required().empty(),
        product_id: Joi.number().required().empty(),
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
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];
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
      product_id: product_id,
      offer_id: offer_id,
      amount: amount,
      is_buy_now: is_buy_now,
      is_max_bid: is_max_bid,
    };
    const resultInserted = await insertTransaction(transactionDetails);
    if (resultInserted.affectedRows > 0) {
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
    var product_id = "";
    if (productIds.length > 0) {
      for (i = 0; i < productIds.length; i++) {
        if (i === productIds.length - 1)
          product_id = product_id + "'" + productIds[i].id + "'";
        else product_id = product_id + "'" + productIds[i].id + "'" + ",";
      }
    } else {
      return res.json({
        success: false,
        message: "No Offers Found",
        status: 400,
      });
    }

    var whereClause = "";
    if (
      product_name.length > 0 &&
      product_name !== null &&
      product_name !== undefined
    ) {
      whereClause = ` where product_id in (${product_id}) and  offfer_buy_status != '1' `;
    }

    var offers = await getOffersByWhereClause(whereClause, page_size, offset);
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

exports.transactionHistoryUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];

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
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];
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
    const authHeader = req.headers.authorization;
    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(token);
    const user_id = decoded["user_id"];

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
    var offers = await getOffersByWhereClause(whereClause, page_size, offset);
    console.log(offers);
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
      element.sellername = sellerDetails[0].first_name + ' '+ sellerDetails[0].last_name;
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

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByWhereClause(whereClause, page_size, offset);
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
//     const { condition, auctionType, brand, brand_length,product_id, page, page_size } =
//       req.body;
//     const schema = Joi.alternatives(
//       Joi.object({
//         product_id: Joi.number().optional().allow("").allow(null),
//         page: Joi.number().required().empty(),
//         page_size: Joi.number().required().empty(),
//         condition: Joi.string().optional().allow("").allow(null),
//         brand: Joi.string().optional().allow("").allow(null),
//         brand_length:Joi.number().optional().allow("").allow(null),
//         auctionType: Joi.number().optional().allow("").allow(null),
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
//        var brandLength = Number(brand_length)

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
    const { condition, auctionType, attributes, product_id, page, page_size } =
      req.body;

    const schema = Joi.alternatives(
      Joi.object({
        product_id: Joi.number().optional().allow("").allow(null),
        page: Joi.number().required().empty(),
        page_size: Joi.number().required().empty(),
        attributes: Joi.string().optional().allow("").allow(null),
        condition: Joi.string().optional().allow("").allow(null),
        auctionType: Joi.string().optional().allow("").allow(null),
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


    // Parse attributes, condition, and auctionType if they're JSON strings;

    // Function to safely parse JSON strings
    const safeParseJSON = (str, fallback) => {
      try {
        return str && JSON.parse(str);
      } catch (e) {
        return fallback;
      }
    };

    // Parse attributes, condition, and auctionType safely
    const parsedAttributes = safeParseJSON(attributes, []);
    const parsedCondition = safeParseJSON(condition, []);
    const parsedAuctionType = safeParseJSON(auctionType, []);

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
    if (
      (parsedCondition.length > 0 && (conditionOfferIds === null || conditionOfferIds.length === 0)) ||
      (parsedAttributes.length > 0 && (attributeOfferIds === null || attributeOfferIds.length === 0)) ||
      (parsedAuctionType.length > 0 && (auctionTypeOfferIds === null || auctionTypeOfferIds.length === 0))
    ) {

      return res.json({
        success: false,
        offer_ids: [],
      });
    }

    // Combine all non-null offer ID arrays
    const allOfferIds = [
      attributeOfferIds,
      conditionOfferIds,
      auctionTypeOfferIds
    ].filter(ids => ids !== null);
    console.log("allOfferIds", allOfferIds);

    // If no filters are provided, return an empty array
    if (allOfferIds.length === 0) {
      return res.json({
        success: false,
        offer_ids: [],
      });
    }

    // Find the intersection of all non-null offer ID arrays
    const commonOfferIds = allOfferIds.reduce((acc, curr) => acc.filter(id => curr.includes(id)), allOfferIds[0]);

    const offset = (parseInt(page) - 1) * parseInt(page_size);
    var offers = await getOffersByIDsWhereClause(
      commonOfferIds,
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