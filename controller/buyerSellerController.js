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
  getQuestionAnsForBuyer,
  findOfferOrderDetailsById,
  findOrderSummaryDeatils,
  findOfferByOfferBuyerSellerId,
  updateOfferBuyerStatus,
  addPaymenetFlowStatus,
  getAllCommissionFeesPayByUserId,
  getAllAdminCommissionFees,
  getAllBidsByOfferId,
  checkUserNameExist,
  getBoostPlan,
  addRatingReview,
  getRatingReview,
  getRatingReviewByUserId
} = require("../models/buyer_seller");

const {
  getOfferDetailsByID,
  checkTransactionID,
  insertUserFeesPay,
  insertTransaction,
  insertPaymentFlowInsert,
  getMainImage,
  getUserBidByOfferId,
  updateOfferBuyStatus,
} = require("../models/product");

const { send_notification } = require("../helper/sendNotification");
const {
  getData, insertData, updateData, getSelectedColumn
} = require("../models/common");

const { getUserNamebyId, fetchUserById } = require("../models/users");
const { findSetting } = require("../models/admin");


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
      const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
      const getUserWhoBid = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${buyer_id}`, `users.user_name, tbl_user_notifications.price_suggestion_from_buyer`);
      const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.price_suggestion_from_buyer');
      if (getFCM[0].price_suggestion_from_buyer == 1) {
        const message = {
          notification: {
            title: 'New Price Suggestion for Your Product!',
            body: `${getUserWhoBid[0].user_name} has suggested a price for your product, ${getSellerID[0].title}. Please review their offer.`
          },
          token: getFCM[0].fcm_token
        };
        const data = {
          user_id: getSellerID[0].user_id,
          notification_type: 'Alert',
          title: 'New Price Suggestion for Your Product!',
          message: `${getUserWhoBid[0].user_name} has suggested a price for your product, ${getSellerID[0].title}. Please review their offer.`,
          created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
        }
        await insertData('tbl_notification_messages', '', data);
        await send_notification(message, getSellerID[0].user_id);
      }
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
    const user_id = ''
    const length = await getOfferDetailsByID(offer_id, user_id);

    if (length[0].offfer_buy_status == '0') {
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
        created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
      };
      const resultInserted = await insertTransaction(transactionDetails);
      if (resultInserted.affectedRows > 0) {
        const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
        const getUserWhoBid = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${buyer}`, `users.user_name, tbl_user_notifications.item_sold`);
        const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.item_sold');
        if (getFCM[0].item_sold == 1) {
          const message = {
            notification: {
              title: 'Congratulations! Your Item Has Been Sold!',
              body: `${getUserWhoBid[0].user_name} has successfully purchased your item: ${getSellerID[0].title}.`
            },
            token: getFCM[0].fcm_token
          };
          const data = {
            user_id: getSellerID[0].user_id,
            notification_type: 'Alert',
            title: 'Congratulations! Your Item Has Been Sold!',
            message: `${getUserWhoBid[0].user_name} has successfully purchased your item: ${getSellerID[0].title}.`,
            created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          }
          await insertData('tbl_notification_messages', '', data);
          await send_notification(message, getSellerID[0].user_id);
        }
        const userBidsResult = await getUserBidByOfferId(offer_id);
        if (userBidsResult.length > 0) {
          for (let elem of userBidsResult) {
            const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
            const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${elem.user_id}`, 'users.id, users.fcm_token, tbl_user_notifications.item_sold');
            if (getFCM[0].auction_not_won == 1) {
              const message = {
                notification: {
                  title: 'Better Luck Next Time!',
                  body: `Unfortunately, you didn't win the auction for: ${getSellerID[0].title}. Stay tuned for more exciting offers!`
                },
                token: getFCM[0].fcm_token
              };
              const data = {
                user_id: getFCM[0].id,
                notification_type: 'Alert',
                title: 'Better Luck Next Time!',
                message: `Unfortunately, you didn't win the auction for: ${getSellerID[0].title}. Stay tuned for more exciting offers!`,
                created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
              }
              await insertData('tbl_notification_messages', '', data);
              await send_notification(message, getFCM[0].id);
            }
          }
        }
        await updateOfferBuyStatus("1", offer_id);
        const resultSetting = await findSetting();
        const userFessPayDetails = {
          transaction_id: transactionId,
          buyer_id: buyer,
          seller_id: seller,
          offer_id: offer_id,
          amount: price,
          commissin_percent: resultSetting[0].commission,
          pay_amount: (price * resultSetting[0].commission) / 100 <= 200 ? (price * resultSetting[0].commission) / 100 : 200,
          is_buy_now: 1,
          is_max_bid: 0,
          created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
        };
        const addUserFeesPayDetails = await insertUserFeesPay(userFessPayDetails);
        const transactionDetail = {
          offer_id: offer_id,
          transaction_id: transactionId,
          buyer_id: buyer,
          seller_id: seller,
          buyer_message: 'Congratulations, you have purchased this item!',
          seller_message: 'Congratulations, you have sold this item!',
          buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
          seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
        };
        const paymenytFlowInsert = await insertPaymentFlowInsert(transactionDetail);
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
    } else {
      return res.json({
        success: false,
        message: "Offer already placed",
        error: true,
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
    const user_id = ''
    const length = await getOfferDetailsByID(offer_id, user_id);
    if (length[0].offfer_buy_status == '0') {
      const updateResult = await rejectStatus(offer_id, buyer, seller);
      if (updateResult.affectedRows > 0) {
        return res.json({
          success: true,
          message: "Offer Rejected by Seller",
          status: 200,
        });
      } else {
        return res.json({
          success: true,
          message: "Offer already rejected",
          status: 200,
        });
      }
    } else {
      return res.json({
        success: false,
        message: "Offer already placed",
        error: true,
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

        var offerDetails = await getOfferDetailsByID(offerId, user_id);
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
          tempObj.seller_profile_image = sellerNameArr[0]?.profile_image;
        }
        var buyerNameArr = await getUserNamebyId(buyerId);
        if (buyerNameArr.length > 0) {
          tempObj.buyer_name = buyerNameArr[0]?.name;
          tempObj.buyer_profile_image = buyerNameArr[0]?.profile_image;
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

        var offerDetails = await getOfferDetailsByID(offerId, user_id);
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
          tempObj.seller_profile_image = sellerNameArr[0]?.profile_image;
        }
        var buyerNameArr = await getUserNamebyId(buyerId);
        if (buyerNameArr.length > 0) {
          tempObj.buyer_name = buyerNameArr[0]?.name;
          tempObj.buyer_profile_image = buyerNameArr[0]?.profile_image;
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

        if (buyer_id != 0) {
          var buyerNameArr = await getUserNamebyId(buyer_id);
          if (buyerNameArr.length > 0) {
            tempObj.buyer_name = buyerNameArr[0]?.name;
          }
        }

        var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');
        const endDate = moment(tempObj.end_date).format('YYYY-MM-DD HH:mm:ss');

        if (moment(currDate).isBefore(endDate)) {
          tempObj.status = 'Open';
        } else {
          tempObj.status = 'Not Sold';
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
        message: "Offer not found",
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
          tempObj.buyer_profile_image = buyerNameArr[0]?.profile_image;
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
          tempObj.buyer_profile_image = buyerNameArr[0]?.profile_image;
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

exports.productOfferOrderDetail = async (req, res) => {
  try {
    const { offer_id, buyer_id, seller_id } = req.body;
    const schema = Joi.object({
      offer_id: Joi.number().required().messages({
        'number.base': 'Offer Id must be a number',
        'number.empty': 'Offer Id is required',
        'any.required': 'Offer Id is required',
      }),
      buyer_id: Joi.number().allow('').messages({
        'number.base': 'Buyer Id must be a number',
        'number.empty': 'Buyer Id is required',
        'any.required': 'Buyer Id is required',
      }),
      seller_id: Joi.number().allow('').messages({
        'number.base': 'Seller Id must be a number',
        'number.empty': 'Seller Id is required',
        'any.required': 'Seller Id is required',
      })
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        errors: true,
        message: error.details[0].message,
        status: 400,
        success: false
      });
    } else {
      const result = await findOfferOrderDetailsById(offer_id, buyer_id, seller_id);
      if (result.length > 0) {
        const resultOrderSummary = await findOrderSummaryDeatils(result[0].offer_id, buyer_id, seller_id);
        const findUser = await fetchUserById(seller_id);
        const data = {
          result: result,
          resultOrderSummary: resultOrderSummary,
          user: {
            account_no: findUser[0].account_no,
            holder_name: findUser[0].holder_name,
            holder_addressL: findUser[0].holder_address,
            holder_message: findUser[0].holder_message
          }
        }
        return res.json({
          error: false,
          message: "Offer Details Found",
          status: 200,
          data: data,
          success: true,
        });
      } else {
        return res.json({
          error: true,
          message: "Offer Details Not Found",
          status: 200,
          success: false,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  try {
    const { offer_id, buyer_id, seller_id, buyer_status, seller_status, buyer_message, seller_message } = req.body;
    const schema = Joi.object({
      offer_id: Joi.number().required().messages({
        'number.base': 'Offer Id must be a number',
        'number.empty': 'Offer Id is required',
        'any.required': 'Offer Id is required',
      }),
      buyer_id: Joi.number().required().messages({
        'number.base': 'Buyer Id must be a number',
        'number.empty': 'Buyer Id is required',
        'any.required': 'Buyer Id is required',
      }),
      seller_id: Joi.number().required().messages({
        'number.base': 'Seller Id must be a number',
        'number.empty': 'Seller Id is required',
        'any.required': 'Seller Id is required',
      }),
      buyer_status: Joi.string().allow(null).messages({
        'string.base': 'Buyer status must be a string',
        'string.empty': 'Seller status is required',
        'any.required': 'Seller status is required',
      }),
      seller_status: Joi.string().allow(null).messages({
        'string.base': 'Seller status must be a string',
        'string.empty': 'Seller status is required',
        'any.required': 'Seller status is required',
      }),
      buyer_message: Joi.string().required().allow(null).messages({
        'string.base': 'Buyer message must be a string',
        'string.empty': 'Seller message is required',
        'any.required': 'Seller message is required',
      }),
      seller_message: Joi.string().required().allow(null).messages({
        'string.base': 'Seller message must be a string',
        'string.empty': 'Seller message is required',
        'any.required': 'Seller message is required',
      })
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        errors: true,
        message: error.details[0].message,
        status: 400,
        success: false
      });
    } else {
      const offerResult = await findOfferByOfferBuyerSellerId(offer_id, buyer_id, seller_id);
      if (offerResult.length > 0) {
        if (seller_status == 'null') {
          const updateBuuer = await updateOfferBuyerStatus(offer_id, buyer_id, seller_id, buyer_status, buyer_status == '3' ? (offerResult[0].seller_status < 3 ? '3' : offerResult[0].seller_status) : offerResult[0].seller_status)
          const addPaymenetFlow = {
            offer_id: offer_id,
            transaction_id: offerResult[0].transaction_id,
            buyer_id: buyer_id,
            seller_id: seller_id,
            buyer_status: buyer_status,
            seller_status: buyer_status == '3' ? (offerResult[0].seller_status < 3 ? '3' : offerResult[0].seller_status) : offerResult[0].seller_status,
            buyer_message: buyer_message,
            seller_message: seller_message,
            buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
            seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          }
          const insertPaymentFlow = await addPaymenetFlowStatus(addPaymenetFlow);
          if (insertPaymentFlow.affectedRows > 0) {
            const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
            const getUserWhoBid = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${buyer_id}`, `users.user_name, tbl_user_notifications.buyer_paid_for_item`);
            const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.buyer_paid_for_item');
            if (getFCM[0].buyer_paid_for_item == 1 && buyer_status == '2') {
              const message = {
                notification: {
                  title: 'Payment Received for Your Product!',
                  body: `${getUserWhoBid[0].user_name} has successfully paid for your product, ${getSellerID[0].title}.`
                },
                token: getFCM[0].fcm_token
              };
              const data = {
                user_id: getSellerID[0].user_id,
                notification_type: 'Alert',
                title: 'Payment Received for Your Product!',
                message: `${getUserWhoBid[0].user_name} has successfully paid for your product, ${getSellerID[0].title}.`,
                created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
              }
              await insertData('tbl_notification_messages', '', data);
              await send_notification(message, getSellerID[0].user_id);
            }
            if (buyer_status == '3' || seller_status == '3') {
              const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
              const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${buyer_id}`, 'users.fcm_token, tbl_user_notifications.The_seller_has_shipped_the_item');
              if (getFCM[0].The_seller_has_shipped_the_item == 1) {
                const message = {
                  notification: {
                    title: 'Your Item Has Been Shipped!',
                    body: `The seller has shipped your item, ${getSellerID[0].title}. It will be delivered to you soon.`
                  },
                  token: getFCM[0].fcm_token
                };
                const data = {
                  user_id: buyer_id,
                  notification_type: 'Alert',
                  title: 'Your Item Has Been Shipped!',
                  message: `The seller has shipped your item, ${getSellerID[0].title}. It will be delivered to you soon.`,
                  created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
                }
                await insertData('tbl_notification_messages', '', data);
                await send_notification(message, buyer_id);
              }
            }
            return res.status(200).json({ error: false, message: "Status update successfully", status: 200, success: true })
          } else {
            return res.status(400).json({ error: true, message: "Status not update", status: 400, success: false })
          }
        } else {
          const updateBuuer = await updateOfferBuyerStatus(offer_id, buyer_id, seller_id, offerResult[0].buyer_status, seller_status);
          const addPaymenetFlow = {
            offer_id: offer_id,
            transaction_id: offerResult[0].transaction_id,
            buyer_id: buyer_id,
            seller_id: seller_id,
            buyer_status: offerResult[0].buyer_status,
            seller_status: seller_status,
            buyer_message: buyer_message,
            seller_message: seller_message,
            buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
            seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          }
          const insertPaymentFlow = await addPaymenetFlowStatus(addPaymenetFlow);
          if (insertPaymentFlow.affectedRows > 0) {
            const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
            const getUserWhoBid = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${buyer_id}`, `users.user_name, tbl_user_notifications.buyer_paid_for_item`);
            const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${getSellerID[0].user_id}`, 'users.fcm_token, tbl_user_notifications.buyer_paid_for_item');
            if (getFCM[0].buyer_paid_for_item == 1 && buyer_status == '2') {
              const message = {
                notification: {
                  title: 'Payment Received for Your Product!',
                  body: `${getUserWhoBid[0].user_name} has successfully paid for your product, ${getSellerID[0].title}.`
                },
                token: getFCM[0].fcm_token
              };
              const data = {
                user_id: getSellerID[0].user_id,
                notification_type: 'Alert',
                title: 'Payment Received for Your Product!',
                message: `${getUserWhoBid[0].user_name} has successfully paid for your product, ${getSellerID[0].title}.`,
                created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
              }
              await insertData('tbl_notification_messages', '', data);
              await send_notification(message, getSellerID[0].user_id);
            }
            if (buyer_status == '3' || seller_status == '3') {
              const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
              const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${buyer_id}`, 'users.fcm_token, tbl_user_notifications.The_seller_has_shipped_the_item');
              if (getFCM[0].The_seller_has_shipped_the_item == 1) {
                const message = {
                  notification: {
                    title: 'Your Item Has Been Shipped!',
                    body: `The seller has shipped your item, ${getSellerID[0].title}. It will be delivered to you soon.`
                  },
                  token: getFCM[0].fcm_token
                };
                const data = {
                  user_id: buyer_id,
                  notification_type: 'Alert',
                  title: 'Your Item Has Been Shipped!',
                  message: `The seller has shipped your item, ${getSellerID[0].title}. It will be delivered to you soon.`,
                  created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
                }
                await insertData('tbl_notification_messages', '', data);
                await send_notification(message, buyer_id);
              }
            }
            return res.status(200).json({ error: false, message: "Status update successfully", status: 200, success: true })
          } else {
            return res.status(400).json({ error: true, message: "Status not update", status: 400, success: false })
          }
        }
      } else {
        return res.status(400).json({
          errors: true,
          message: "Offer not found",
          status: 400,
          success: false
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getFeesPayUserId = async (req, res) => {
  try {
    const seller_id = req.user.id;
    const findFeesPayData = await getAllCommissionFeesPayByUserId(seller_id);
    if (findFeesPayData.length > 0) {
      return res.status(200).json({ error: false, message: "User commission fees fetched successfully", status: 200, success: true, data: findFeesPayData })
    } else {
      return res.status(200).json({ error: true, message: "User commission fess not fetched", status: 200, success: false, data: [] })
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.checkUserNameExist = async (req, res) => {
  try {
    const username = req.params.username;
    const userExist = await checkUserNameExist(username);
    if (userExist.length > 0) {
      return res.status(200).json({ error: false, message: "Username already exist", status: 200, success: false, data: [] })
    } else {
      return res.status(200).json({ error: true, message: "Proceed", status: 200, success: true, data: [] })
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getAllBidsByOfferId = async (req, res) => {
  try {
    const { offer_id } = req.query;
    const schema = Joi.object({
      offer_id: Joi.number().required().messages({
        'number.base': 'Offer Id must be a number',
        'number.empty': 'Offer Id is required',
        'any.required': 'Offer Id is required',
      })
    });

    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        errors: true,
        message: error.details[0].message,
        status: 400,
        success: false
      });
    } else {
      const findBids = await getAllBidsByOfferId(offer_id);
      if (findBids.length > 0) {
        return res.status(200).json({ error: false, message: "Bids fetched successfully", status: 200, success: true, data: findBids })
      } else {
        return res.status(200).json({ error: true, message: "Bids not fetched", status: 200, success: false, data: [] })
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getAllAdminCommissionFees = async (req, res) => {
  try {
    const findAllCommissionFees = await getAllAdminCommissionFees();
    if (findAllCommissionFees.length > 0) {
      return res.status(200).json({ error: false, message: "Commission fees fetched successfully", status: 200, success: true, data: findAllCommissionFees })
    } else {
      return res.status(200).json({ error: true, message: "Commission fees not fetched", status: 200, success: false, data: [] })
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
  }
};

exports.getBoostPlan = async (req, res) => {
  try {
    const findAllBoostPlan = await getBoostPlan();
    if (findAllBoostPlan.length > 0) {
      return res.status(200).json({ error: false, message: "Boost plan fetched successfully", status: 200, success: true, data: findAllBoostPlan })
    } else {
      return res.status(200).json({ error: true, message: "Boost plan not fetched", status: 200, success: false, data: [] })
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false })
  }
};

exports.addRatingReview = async (req, res) => {
  try {
    const { offer_id, buyer_id, seller_id, sender_id, receiving_id, rating, review, buyer_status, seller_status, buyer_message, seller_message } = req.body
    const schema = Joi.object({
      offer_id: Joi.number().required().messages({
        'any.required': 'Offer ID is required.',
        'number.base': 'Offer ID must be a valid number.',
      }),
      buyer_id: Joi.number().required().messages({
        'any.required': 'Buyer ID is required.',
        'number.base': 'Buyer ID must be a valid number.',
      }),
      seller_id: Joi.number().required().messages({
        'any.required': 'Seller ID is required.',
        'number.base': 'Seller ID must be a valid number.',
      }),
      sender_id: Joi.number().required().messages({
        'any.required': 'Sender ID is required.',
        'number.base': 'Sender ID must be a valid number.',
      }),
      receiving_id: Joi.number().required().messages({
        'any.required': 'Receiving ID is required.',
        'number.base': 'Receiving ID must be a valid number.',
      }),
      rating: Joi.string().required().messages({
        'any.required': 'Rating is required.',
        'string.base': 'Rating must be a valid string.',
      }),
      review: Joi.string().required().messages({
        'any.required': 'Review is required.',
        'string.base': 'Review must be a valid string.',
      }),
      buyer_status: Joi.string().allow(null).messages({
        'string.base': 'Buyer status must be a string',
        'string.empty': 'Seller status is required',
        'any.required': 'Seller status is required',
      }),
      seller_status: Joi.string().allow(null).messages({
        'string.base': 'Seller status must be a string',
        'string.empty': 'Seller status is required',
        'any.required': 'Seller status is required',
      }),
      buyer_message: Joi.string().allow(null).messages({
        'string.base': 'Buyer message must be a string',
        'string.empty': 'Buyer message is required',
        'any.required': 'Buyer message is required',
      }),
      seller_message: Joi.string().allow(null).messages({
        'string.base': 'Seller message must be a string',
        'string.empty': 'Seller message is required',
        'any.required': 'Seller message is required',
      })
    });
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
    } else {
      const offerResult = await findOfferByOfferBuyerSellerId(offer_id, buyer_id, seller_id);
      if (offerResult.length > 0) {
        if (seller_status == 'null') {
          const updateBuuer = await updateOfferBuyerStatus(offer_id, buyer_id, seller_id, buyer_status, offerResult[0].seller_status)
          const addPaymenetFlow = {
            offer_id: offer_id,
            transaction_id: offerResult[0].transaction_id,
            buyer_id: buyer_id,
            seller_id: seller_id,
            buyer_status: buyer_status,
            seller_status: offerResult[0].seller_status,
            buyer_message: buyer_message,
            seller_message: seller_message,
            buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
            seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          }
          const insertPaymentFlow = await addPaymenetFlowStatus(addPaymenetFlow);
        } else {
          const updateBuuer = await updateOfferBuyerStatus(offer_id, buyer_id, seller_id, offerResult[0].buyer_status, seller_status);
          const addPaymenetFlow = {
            offer_id: offer_id,
            transaction_id: offerResult[0].transaction_id,
            buyer_id: buyer_id,
            seller_id: seller_id,
            buyer_status: offerResult[0].buyer_status,
            seller_status: seller_status,
            buyer_message: buyer_message,
            seller_message: seller_message,
            buyer_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss'),
            seller_created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
          }
          const insertPaymentFlow = await addPaymenetFlowStatus(addPaymenetFlow);
        }
      }
      const data = {
        offer_id: offer_id,
        buyer_id: buyer_id,
        seller_id: seller_id,
        sender_id: sender_id,
        receiving_id: receiving_id,
        rating: rating,
        review: review,
        created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
      }
      const insertReviewResult = await addRatingReview(data);
      if (insertReviewResult.affectedRows > 0) {
        return res.status(200).json({ error: false, message: "Successfully added rating and review.", status: 200, success: true });
      } else {
        return res.status(200).json({ error: true, message: "Failed to add rating and review. Please try again.", status: 200, success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false });
  }
};

exports.getRatingReview = async (req, res) => {
  try {
    const { offer_id } = req.query;
    const schema = Joi.object({
      offer_id: Joi.number().required().messages({
        'any.required': 'Offer ID is required.',
        'number.base': 'Offer ID must be a valid number.',
      }),
    })
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
    } else {
      const findRatingResult = await getRatingReview(offer_id);
      if (findRatingResult.length > 0) {
        return res.status(200).json({
          error: false, message: 'find rating abd review', status: 200, success: true, data: {
            count: {
              positive_ratings_count: findRatingResult[0].positive_ratings_count,
              neutral_ratings_count: findRatingResult[0].neutral_ratings_count,
              negative_ratings_count: findRatingResult[0].negative_ratings_count
            },
            findRatingResult
          }
        });
      } else {
        return res.status(200).json({ error: true, message: 'failed rating and review', status: 200, success: false, data: [] });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false });
  }
};

exports.getRatingReviewByReceivingId = async (req, res) => {
  try {
    const { receiving_id } = req.query;
    const schema = Joi.object({
      receiving_id: Joi.number().required().allow('').messages({
        'any.required': 'Receiving ID is required.',
        'number.base': 'Receiving ID must be a valid number.',
      })
    })
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
    } else {
      const findRatingResult = await getRatingReviewByUserId(receiving_id);
      if (findRatingResult.length > 0) {
        return res.status(200).json({
          error: false, message: 'find rating abd review', status: 200, success: true, data: {
            count: {
              positive_ratings_count: findRatingResult[0].positive_ratings_count,
              neutral_ratings_count: findRatingResult[0].neutral_ratings_count,
              negative_ratings_count: findRatingResult[0].negative_ratings_count
            },
            findRatingResult
          }
        });
      } else {
        return res.status(200).json({ error: true, message: 'failed rating and review', status: 200, success: false, data: [] });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: 'Internal Server Error' + ' ' + error, status: 500, success: false });
  }
};