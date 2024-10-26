const Joi = require("joi");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();
var randomstring = require("randomstring");
var moment = require("moment");

const {
  insertPriceSuggestion,
  updateStatus,
  rejectStatus,
  getPriceSuggestionSeller,
  getPriceSuggestionBuyer,
  getOffersDetailsByOfferId,
  getOffersBySeller,
  getMaxBidbyOfferID,
  getSoldOffersBySeller,
  getOffersByBuyerID,
  getBidDetailsByID,
  getOffersByOfferId,
  getOffersDetailsNotBoughtByOfferId,
  getQuestionAnsForSeller,
  getQuestionAnsForBuyer
} = require("../models/buyer_seller");

const {
  getOfferDetailsByID,
  checkTransactionID,
  insertTransaction,
  getMainImage,
} = require("../models/product");

const {
  getData, insertData, updateData
} = require("../models/common");

const { getUserNamebyId } = require("../models/users");

exports.suggestPrice = async (req, res) => {
  try {
    const { seller_id, offer_id, buyer_id, status, price } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        seller_id: Joi.number().required().empty(),
        offer_id: Joi.number().required().empty(),
        buyer_id: Joi.number().required().empty(),
        price: Joi.number().required().empty(),
        status: Joi.string().required().empty(),
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

    const suggestPrice = {
      buyer_id: buyer_id,
      seller_id: seller_id,
      offer_id: offer_id,
      status: status,
      price: price,
    };
    const resultInserted = await insertPriceSuggestion(suggestPrice);
    if (resultInserted.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Price Suggested to Seller",
        status: 200,
        insertId: resultInserted.insertId,
      });
    } else {
      return res.json({
        success: false,
        message: "Some problem ocurred in Database while suggesting price",
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

exports.acceptPrice = async (req, res) => {
  try {
    const { offer_id, seller, buyer, price } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        offer_id: Joi.number().required().empty(),
        seller: Joi.number().required().empty(),
        buyer: Joi.number().required().empty(),
        price: Joi.number().required().empty(),
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

    const length = await getOfferDetailsByID(offer_id);
    if (length.length > 0) var product_id = length[0].product_id;

    const transactionDetails = {
      transaction_id: transactionId,
      buyer_id: buyer,
      seller_id: seller,
      // product_id: product_id,
      offer_id: offer_id,
      amount: price,
      is_buy_now: 1,
      is_max_bid: 0,
      buy_status: 1,
      created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
    };
    const resultInserted = await insertTransaction(transactionDetails);
    if (resultInserted.affectedRows > 0) {
      const updateResult = await updateStatus(offer_id, buyer, seller);
      if (updateResult.affectedRows > 0) {
        return res.json({
          success: true,
          message: "Offer accepted by Seller",
          status: 200,
          insertId: resultInserted.insertId,
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

exports.rejectPrice = async (req, res) => {
  try {
    const { offer_id, seller, buyer } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        offer_id: Joi.number().required().empty(),
        seller: Joi.number().required().empty(),
        buyer: Joi.number().required().empty(),
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

    const updateResult = await rejectStatus(offer_id, buyer, seller);
    if (updateResult.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Offer Rejected by Seller",
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

exports.getPriceSuggestedBySellerStatus = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { status } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        status: Joi.string().required().empty(),
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
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }

    const prices = await getPriceSuggestionSeller(user_id, status);
    if (prices.length > 0) {
      var finalOutput = [];
      for (el of prices) {
        var tempObj = { ...el };
        var offerId = el.offer_id;
        var sellerId = el.seller_id;
        var buyerId = el.buyer_id;

        var offerDetails = await getOfferDetailsByID(offerId);
        if (offerDetails.length > 0) {
          var thumbnail = await getMainImage(offerDetails[0]?.images_id);
          tempObj.offer_unique_id = offerDetails[0]?.offer_unique_id;
          tempObj.name = offerDetails[0]?.title;
          tempObj.end_date = offerDetails[0]?.end_date;
          tempObj.fixed_offer_price = offerDetails[0]?.fixed_offer_price;
          if (thumbnail.length > 0) {
            tempObj.main_image = thumbnail[0]?.main_image;
          }
        }
        var sellerNameArr = await getUserNamebyId(sellerId);
        if (sellerNameArr.length > 0) {
          tempObj.seller_name = sellerNameArr[0]?.name;
        }
        var buyerNameArr = await getUserNamebyId(buyerId);
        if (buyerNameArr.length > 0) {
          tempObj.buyer_name = buyerNameArr[0]?.name;
        }
        finalOutput.push(tempObj);
      }
      return res.json({
        success: true,
        message: "Offer Rejected by Seller",
        status: 200,
        prices: finalOutput,
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

exports.getPriceSuggestedForBuyer = async (req, res) => {
  try {
    const user_id = req.user.id;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }

    const prices = await getPriceSuggestionBuyer(user_id);
    if (prices.length > 0) {
      var finalOutput = [];
      for (el of prices) {
        var tempObj = { ...el };
        var offerId = el.offer_id;
        var sellerId = el.seller_id;
        var buyerId = el.buyer_id;

        var offerDetails = await getOfferDetailsByID(offerId);
        if (offerDetails.length > 0) {
          var thumbnail = await getMainImage(offerDetails[0]?.images_id);
          tempObj.offer_unique_id = offerDetails[0]?.offer_unique_id;
          tempObj.name = offerDetails[0]?.title;
          tempObj.end_date = offerDetails[0]?.end_date;
          tempObj.fixed_offer_price = offerDetails[0]?.fixed_offer_price;
          if (thumbnail.length > 0) {
            tempObj.main_image = thumbnail[0]?.main_image;
          }
        }
        var sellerNameArr = await getUserNamebyId(sellerId);
        if (sellerNameArr.length > 0) {
          tempObj.seller_name = sellerNameArr[0]?.name;
        }
        var buyerNameArr = await getUserNamebyId(buyerId);
        if (buyerNameArr.length > 0) {
          tempObj.buyer_name = buyerNameArr[0]?.name;
        }
        finalOutput.push(tempObj);
      }
      return res.json({
        success: true,
        message: "Offer Rejected by Seller",
        status: 200,
        prices: finalOutput,
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

exports.getSellingSectionForSeller = async (req, res) => {
  try {
    const user_id = req.user.id;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }

    const offersDetails = await getOffersBySeller(user_id);
    if (offersDetails.length > 0) {
      var finalOutput = [];
      for (el of offersDetails) {
        var tempObj = { ...el };
        var offerId = el.offer_id;
        var buyer_id = 0;
        var thumbnail = await getMainImage(el.images_id);
        if (thumbnail.length > 0) {
          tempObj.main_image = thumbnail[0]?.main_image;
        }
        var bidRes = await getMaxBidbyOfferID(offerId);
        if (bidRes.length > 0) {
          tempObj.max_bid = bidRes[0]?.max_bid;
          tempObj.price = bidRes[0]?.price;
          buyer_id = bidRes[0]?.user_id;
        } else if (el?.is_bid_or_fixed === 1) {
          tempObj.max_bid = 0;
          tempObj.price = el.buyto_price;
          tempObj.start_price = el.start_price;
        } else {
          tempObj.max_bid = 0;
          tempObj.price = el.fixed_offer_price;
        }
        tempObj.name = el.title;
        var endDate = el.end_date;

        // if (bidRes.length > 0) {
        var newEndDate = moment(endDate).tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');
        var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');


        if (currDate > newEndDate) {
          tempObj.status = "Not Sold";
        } else {
          tempObj.status = "Open";
        }
        // }
        if (buyer_id != 0) {
          var buyerNameArr = await getUserNamebyId(buyer_id);
          if (buyerNameArr.length > 0) {
            tempObj.buyer_name = buyerNameArr[0]?.name;
          }
        }

        finalOutput.push(tempObj);
      }

      return res.json({
        success: true,
        message: "Offer Rejected by Seller",
        status: 200,
        selling: finalOutput,
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

exports.getSoldSectionForSeller = async (req, res) => {
  try {
    const user_id = req.user.id;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }

    const offersDetails = await getSoldOffersBySeller(user_id);

    if (offersDetails.length > 0) {
      var finalOutput = [];
      for (el of offersDetails) {
        var tempObj = { ...el };
        var offerId = el.offer_id;
        tempObj.boughtAt = moment(el.created_at).format('YYYY-MM-DD HH:mm:ss');
        const OfferDetail = await getOffersDetailsByOfferId(offerId);
        var buyerId =
          el?.buyer_id === null || el?.buyer_id === undefined
            ? 0
            : el?.buyer_id;
        if (OfferDetail.length > 0) {
          tempObj.offer_unique_id = OfferDetail[0].offer_unique_id;
          tempObj.title = OfferDetail[0]?.title;
          tempObj.end_date = OfferDetail[0]?.end_date;
        }
        var thumbnail = await getMainImage(OfferDetail[0]?.images_id);
        if (thumbnail.length > 0) {
          tempObj.main_image = thumbnail[0]?.main_image;
        }
        var bidRes = await getMaxBidbyOfferID(offerId);
        if (bidRes.length > 0) {
          tempObj.price = bidRes[0]?.price;
          buyer_id = bidRes[0]?.user_id;
        }

        var buyerNameArr = await getUserNamebyId(buyerId);
        if (buyerNameArr.length > 0) {
          tempObj.buyer_name = buyerNameArr[0]?.name;
        }

        finalOutput.push(tempObj);
      }

      return res.json({
        success: true,
        message: "Offer bought by Seller",
        status: 200,
        selling: finalOutput,
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

exports.getOffersByBuyer = async (req, res) => {
  try {
    const user_id = req.user.id;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }

    const offersDetails = await getOffersByBuyerID(user_id);
    console.log(offersDetails);
    

    if (offersDetails.length > 0) {
      var finalOutput = [];
      for (el of offersDetails) {
        const userObj = {}
        var tempObj = { ...el, userObj };
        var offerId = el.offer_id;
        const OfferDetail = await getOffersByOfferId(offerId, user_id);
        if (OfferDetail.length > 0) {
          tempObj.offer_unique_id = OfferDetail[0]?.offer_unique_id,
            tempObj.title = OfferDetail[0]?.title;
          tempObj.end_date = OfferDetail[0]?.end_date;
          tempObj.start_price = OfferDetail[0]?.start_price;
          tempObj.offerStart = OfferDetail[0]?.offerStart;
          tempObj.lengthOfTime = OfferDetail[0]?.length_oftime;
          tempObj.is_favorite = OfferDetail[0]?.is_favorite;
          var thumbnail = await getMainImage(OfferDetail[0]?.images_id);
          if (thumbnail.length > 0) {
            tempObj.main_image = thumbnail[0]?.main_image;
          }
        }

        var bidRes = await getMaxBidbyOfferID(offerId);

        if (bidRes.length > 0) {
          userObj.max_bid = bidRes[0]?.max_bid;
          userObj.bid_count = bidRes[0]?.count;
          userObj.user_id = bidRes[0]?.user_id;
        }

        var bidDetail = await getBidDetailsByID(offerId, user_id);
        if (bidDetail.length > 0) {
          tempObj.user_bid = bidDetail[0]?.bid;
        }

        if (OfferDetail.length > 0) {
          var endDate = OfferDetail[0]?.end_date;
          // code changing to set status if user bid in offer and it get bought so changed to Finished
          if (OfferDetail[0].offfer_buy_status == 0) {
            if (bidRes.length > 0) {
              var newEndDate = moment(endDate).format("YYYY-MM-DD");
              var currDate = moment().format("YYYY-MM-DD");


              if (currDate > newEndDate) {
                tempObj.status = "Not Sold";
              } else {
                tempObj.status = "Open";
              }
            }
          } else {
            tempObj.status = "Finished";
          }
        }

        var buyerNameArr = await getUserNamebyId(user_id);
        if (buyerNameArr.length > 0) {
          tempObj.buyer_name = buyerNameArr[0]?.name;
        }
        finalOutput.push(tempObj);
      }

      return res.json({
        success: true,
        message: "Offer bought by Seller",
        status: 200,
        selling: finalOutput
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

exports.getQuestionAnswerForSeller = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { offerId } = req.query;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }

    const questionAnswer = await getQuestionAnsForSeller(offerId, user_id);

    if (questionAnswer.length > 0) {
      return res.json({
        success: true,
        message: "Found",
        data: questionAnswer,
        status: 200,
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

exports.getQuestionAnswerForBuyer = async (req, res) => {
  try {
    const { offer_id, sellerId } = req.body;
    const user_id = req.user.id;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }
    const schema = Joi.alternatives(
      Joi.object({
        sellerId: Joi.number().required().empty(),
        offer_id: Joi.number().required().empty()
      })
    );

    const questionAnswer = await getQuestionAnsForBuyer(offer_id, sellerId, user_id);

    if (questionAnswer.length > 0) {
      return res.json({
        success: true,
        data: questionAnswer,
        message: "No Data Found",
        status: 400,
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

exports.uploadBuyerQuestion = async (req, res) => {
  try {
    const { offer_id, sellerId, question } = req.body;
    const user_id = req.user.id;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }
    const schema = Joi.alternatives(
      Joi.object({
        offer_id: Joi.number().required().empty(),
        question: Joi.string().required().empty(),
        sellerId: Joi.number().required().empty(),
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

    const userData = {
      offer_id: offer_id,
      seller_id: sellerId,
      buyer_id: user_id,
      question: question
    };

    const updateResult = await insertData('question_answer', '', userData);
    if (updateResult.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Submitted successfully",
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

exports.uploadSellerAnswer = async (req, res) => {
  try {
    const { id, offer_id, answer } = req.body;
    const user_id = req.user.id;
    if (user_id === null || user_id === undefined || user_id === "") {
      return res.json({
        success: false,
        message: "user id is Null",
        error: err,
        status: 500,
      });
    }
    const schema = Joi.alternatives(
      Joi.object({
        id: Joi.number().required().empty(),
        offer_id: Joi.number().required().empty(),
        answer: Joi.string().required().empty(),
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

    const userData = {
      answer: answer
    };

    const updateResult = await updateData('question_answer', `where id =${id} and offer_id =${offer_id}`, userData);
    if (updateResult.affectedRows > 0) {
      return res.json({
        success: true,
        message: "Submitted successfully",
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