const db = require("../utils/database");
var moment = require("moment-timezone");
const { Server } = require("socket.io");

const {
  createNewBid,
  getBitCountByOfferId,
} = require("../controller/productController");
const { updateOnlineStatus } = require("../controller/userController");
const { fetchUserById } = require("../models/users");
const {
  getOfferDetailsByID,
  updateOfferEndDate,
} = require("../models/product");
const { adminUpdateLoginStatus } = require("../controller/adminController");
const { getAllChatUsers, getLastMessageAllUser } = require("../models/admin");
const { send_notification } = require("../helper/sendNotification");
const {
  getData, getSelectedColumn, insertData
} = require("../models/common");

// socket.js
module.exports = function (server) {
  // Create a new instance of socket.io by passing in the server
  const io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend URL if needed
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Object to keep track of connected users and their socket IDs
  const userSockets = {}; // Store userId and socket.id
  const adminSockets = {}; // Store adminId and socket.id
  let onlineUsers = new Map();

  // Set up a connection event listener for incoming sockets
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("newBid", async (data) => {
      try {
        const userResult = await fetchUserById(data.user_id);
        if (userResult[0].block_status == '1') {
          io.emit("updateBid", {
            success: false,
            message: userResult[0].block_reason,
            userDetails: {
              block_status: userResult[0].block_status,
              block_reason: userResult[0].block_reason
            },
            error: true,
            status: 200,
          });
        } else {
          await createNewBid(data);
          const count = await getBitCountByOfferId(data);
          if (count.length > 1) {
            if (count[1].user_id != data.user_id) {
              const getSellerID = await getSelectedColumn(`offers_created`, `LEFT JOIN product ON product.id = offers_created.product_id where offers_created.id = ${count[0].offer_id}`, 'offers_created.user_id, offers_created.title, product.name AS product_name');
              const getFCM = await getSelectedColumn(`users`, `LEFT JOIN tbl_user_notifications ON tbl_user_notifications.user_id = users.id WHERE users.id = ${count[1].user_id}`, 'users.fcm_token, tbl_user_notifications.outbid');
              if (getFCM[0].outbid == 1) {
                const message = {
                  notification: {
                    title: 'You’ve Been Outbid!',
                    body: `Your bid on the item, ${getSellerID[0].title} has been surpassed. Place a higher bid to stay in the lead!`
                  },
                  token: getFCM[0].fcm_token
                };
                const data = {
                  user_id: count[1].user_id,
                  notification_type: 'Alert',
                  title: 'You’ve Been Outbid!',
                  message: `Your bid on the item, ${getSellerID[0].title} has been surpassed. Place a higher bid to stay in the lead!`,
                  created_at: moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
                }
                await insertData('tbl_notification_messages', '', data);
                await send_notification(message, count[1].user_id);
              }
            }
          }
          const user = await fetchUserById(data.user_id); // Wait for the user data to be fetched
          const bidCount = count[0].bidCount;
          data.user_name = `${user[0].first_name} ${user[0].last_name}`;
          const user_id = ''
          var offerRes = await getOfferDetailsByID(data.offer_id, user_id);
          const endMoment = moment(offerRes[0].end_date); // Leave as a moment object
          const currTime = moment()
            .tz("Europe/Zurich")
            .format("YYYY-MM-DD HH:mm:ss");
          const currMoment = moment(currTime);
          const differenceInMilliseconds = endMoment.diff(currMoment);
          if (
            offerRes[0].offfer_buy_status != 1 &&
            differenceInMilliseconds <= 180000 &&
            (offerRes[0].is_reactivable == 0 ||
              (offerRes[0].is_reactivable == 1 &&
                offerRes[0].no_of_times_reactivated == 0))
          ) {
            const time = 180000 - differenceInMilliseconds;
            const differenceInMinutes = moment.duration(time).asMinutes();
            const newEndDate = moment(offerRes[0].end_date)
              .add(differenceInMinutes, "minutes")
              .format("YYYY-MM-DD HH:mm:ss"); // Add length of time (in days)
            const offerStartDate = moment(offerRes[0].offerStart)
              .add(differenceInMinutes, "minutes")
              .format("YYYY-MM-DD HH:mm:ss");

            // Update the number of times the offer has been reactivated, but ensure it doesn't go below zero
            offerRes[0].no_of_times_reactivated = "";

            // Update the offer's end date and reactivation count in the database
            const update = await updateOfferEndDate(
              offerRes[0].id,
              offerStartDate,
              newEndDate,
              offerRes[0].no_of_times_reactivated
            );
            if (update.affectedRows > 0) {
              const offerById = await getOfferDetailsByID(data.offer_id, user_id);
              if (offerById.length > 0) {
                const new_offerstart_date = offerById[0].offerStart;
                const length_oftime = offerById[0].length_oftime;
                const new_end_date = offerById[0].end_date
                io.emit("updateBid", {
                  ...data,
                  bidCount,
                  new_offerstart_date,
                  length_oftime,
                  new_end_date
                });
              }
            }
          } else {
            const new_offerstart_date = null;
            const new_end_date = null
            const length_oftime = offerRes[0].length_oftime;
            io.emit("updateBid", {
              ...data,
              bidCount,
              new_offerstart_date,
              length_oftime,
              new_end_date
            });
          }
        }
      } catch (error) {
        console.error("Error handling new bid:", error);
      }
    });

    socket.on("user_connected", (userId) => {
      const user_id = userId
      if (user_id) {
        userSockets[user_id] = socket.id; // Add user socket
      }
      onlineUsers.set(userId, socket.id);
      io.emit("update_online_status", Array.from(onlineUsers.keys()));
    });

    socket.on("admin_connected", (adminId) => {
      const admin_id = adminId;
      if (admin_id) {
        adminSockets[admin_id] = socket.id; // Add user socket
      }
    });

    socket.on('user_disconnected', (userId) => {
      onlineUsers.delete(userId);
      io.emit('update_online_status', Array.from(onlineUsers.keys()));
    });

    // Send online users list to admin when requested
    socket.on('get_online_users', () => {
      console.log("user id ", onlineUsers)
      io.emit('update_online_status', Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      onlineUsers.forEach((value, key) => {
        if (value === socket.id) {
          onlineUsers.delete(key);
        }
      });
      io.emit("update_online_status", Array.from(onlineUsers.keys()));
    });

    // Listen for a new chat message
    socket.on("sendMessage", async (msg) => {

      const { user_id, admin_id, message, image_path, sender_id } = msg;
      if (
        user_id != "undefined" &&
        admin_id != "undefined" &&
        message != "undefined" &&
        image_path != "undefined" &&
        sender_id != "undefined"
      ) {
        const currTime = moment().tz("Europe/Zurich").format("YYYY-MM-DD HH:mm:ss");
        // Insert the message into the database
        const insertMessageQuery = `INSERT INTO tbl_messages (user_id, admin_id, message, image_path, sender_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`;
        const addMessage = await db.query(insertMessageQuery, [
          user_id,
          admin_id,
          message == '' ? null : message,
          image_path == '' ? null : image_path,
          sender_id,
          currTime
        ]);

        if (addMessage.affectedRows > 0) {
          if (admin_id == sender_id) {
            const updateLatestMessageStatus = `UPDATE tbl_messages SET is_read = "1" WHERE user_id = ${user_id} AND admin_id = ${admin_id} AND is_read = "0"`;
            const updateReadCount = await db.query(updateLatestMessageStatus);
          }
          const getLastMessage = `SELECT id, user_id, admin_id, message, image_path, sender_id, is_read, DATE_FORMAT(created_at, '%Y-%m-%dT%h:%i:%s.000Z') AS created_at, updated_at FROM tbl_messages WHERE id = ?`;
          const lastMessage = await db.query(getLastMessage, [
            addMessage.insertId,
          ]);
          if (user_id == sender_id) {
            const adminSocketId = adminSockets[admin_id];
            const userSocketId = userSockets[user_id];
            if (userSocketId) {
              io.to(adminSocketId).emit("getMessage", lastMessage[0]);
              io.to(userSocketId).emit("getMessage", lastMessage[0]);
              console.log(
                `Sent message from user ${user_id} to admin ${admin_id}`
              );
            }
          } else {
            const adminSocketId = adminSockets[admin_id];
            const userSocketId = userSockets[user_id];
            console.log(adminSocketId);
            if (adminSocketId) {
              io.to(adminSocketId).emit("getMessage", lastMessage[0]);
              io.to(userSocketId).emit("getMessage", lastMessage[0]);
              console.log(
                `Sent message from admin ${admin_id} to user ${user_id}`
              );
            }
          }
          socket.emit("error", "Failed to last message get");
        } else {
          socket.emit("error", "Message could not be sent");
        }
      }
    });

    // Listen for a new chat message
    socket.on("getAllUserMessageCount", async () => {
      const findChatUser = await getAllChatUsers();
      if (findChatUser.length > 0) {
        for (let user of findChatUser) {
          const findLastMessage = await getLastMessageAllUser(user.user_id);
          (user.message = findLastMessage[0].message),
            (user.image_path = findLastMessage[0].image_path),
            (user.unread_count = findLastMessage[0].unread_count);
        }
        socket.emit("getMessages", findChatUser);
      } else {
        socket.emit("error", "Message could not be sent");
      }
    });

    // User goes offline
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });

  return io; // Return the io instance for use in other files if needed
};