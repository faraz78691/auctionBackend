const db = require("../utils/database");
var moment = require('moment-timezone');
const { Server } = require("socket.io");

const { createNewBid, getBitCountByOfferId } = require("../controller/productController");
const { updateOnlineStatus } = require("../controller/userController");
const { fetchUserById } = require("../models/users");
const { getOfferDetailsByID, updateOfferEndDate } = require("../models/product");
const { adminUpdateLoginStatus } = require("../controller/adminController");
const { getAllChatUsers, getLastMessageAllUser } = require('../models/admin')
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
    const userSockets = {};  // Store userId and socket.id
    const adminSockets = {}; // Store adminId and socket.id

    // Set up a connection event listener for incoming sockets
    io.on("connection", (socket) => {
        console.log("A user connected");

        // Listen for 'newBid' events from the client
        socket.on("newBid", async (data) => {
            try {
                await createNewBid(data);
                const count = await getBitCountByOfferId(data);
                const user = await fetchUserById(data.user_id);  // Wait for the user data to be fetched
                const bidCount = count[0].bidCount;
                data.user_name = `${user[0].first_name} ${user[0].last_name}`;
                var offerRes = await getOfferDetailsByID(data.offer_id);
                var currDate = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss');
                if (offerRes[0].offfer_buy_status != 1 && moment(offerRes[0].end_date).format('YYYY-MM-DD HH:mm:ss') <= currDate && (offerRes[0].is_reactivable == 0 || (offerRes[0].is_reactivable == 1 && offerRes[0].no_of_times_reactivated == 0))) {
                    const newEndDate = moment(offerRes[0].end_date).add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss'); // Add length of time (in days)
                    const offerStartDate = moment(offerRes[0].offerStart).add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');

                    // Update the number of times the offer has been reactivated, but ensure it doesn't go below zero
                    offerRes[0].no_of_times_reactivated = '';

                    // Update the offer's end date and reactivation count in the database
                    await updateOfferEndDate(offerRes[0].id, offerStartDate, newEndDate, offerRes[0].no_of_times_reactivated);

                    const offerById = await await getOfferDetailsByID(data.offer_id);
                    const new_offerstart_date = offerById[0].offerStart
                    io.emit("updateBid", { ...data, bidCount, new_offerstart_date });
                } else {
                    const new_offerstart_date = null
                    io.emit("updateBid", { ...data, bidCount, new_offerstart_date });
                }
            } catch (error) {
                console.error("Error handling new bid:", error);
            }
        });

        // User goes online
        socket.on('user_login', (userId) => {
            if (userId != 'undefined') {
                userSockets[userId] = socket.id;
                console.log("userSockets[userId]", userSockets);
                updateOnlineStatus(userId, 'online');
            }
        });

        // Admin goes online
        socket.on('admin_login', (adminId) => {
            if (adminId != 'undefined') {
                console.log(`Admin ${adminId} has logged in.`);
                adminSockets[adminId] = socket.id;  // Save the admin's socket id
                adminUpdateLoginStatus(adminId, 'online');
            }
        });

        // Listen for a new chat message
        socket.on('sendMessage', async (msg) => {
            const { user_id, admin_id, message, sender_id } = msg;
            if (user_id != 'undefined' && admin_id != 'undefined' && message != 'undefined' && sender_id != 'undefined') {

                // Insert the message into the database
                const insertMessageQuery = `INSERT INTO tbl_messages (user_id, admin_id, message, sender_id) VALUES (?, ?, ?, ?)`;
                const addMessage = await db.query(insertMessageQuery, [user_id, admin_id, message, sender_id])

                if (addMessage.affectedRows > 0) {
                    const updateLatestMessageStatus = `UPDATE tbl_messages SET is_read = "1" WHERE user_id = ${user_id} AND admin_id = ${admin_id} AND is_read = "0"`;
                    const getLastMessage = `SELECT id, user_id, admin_id, message, image_path, sender_id, is_read, DATE_FORMAT(created_at, '%Y-%m-%dT%h:%i:%s.000Z') AS created_at, updated_at FROM tbl_messages WHERE id = ?`
                    const lastMessage = await db.query(getLastMessage, [addMessage.insertId]);
                    if (user_id === sender_id) {
                        const adminSocketId = adminSockets[admin_id];
                        const userSocketId = userSockets[user_id];
                        if (userSocketId) {
                            io.to(adminSocketId).emit("getMessage", lastMessage[0]);
                            io.to(userSocketId).emit("getMessage", lastMessage[0]);
                            console.log(`Sent message from user ${user_id} to admin ${admin_id}`);
                        }
                    } else {
                        const adminSocketId = adminSockets[admin_id];
                        const userSocketId = userSockets[user_id];
                        if (adminSocketId) {
                            io.to(adminSocketId).emit("getMessage", lastMessage[0]);
                            io.to(userSocketId).emit("getMessage", lastMessage[0]);
                            console.log(`Sent message from admin ${admin_id} to user ${user_id}`);
                        }
                    }
                    socket.emit('error', 'Failed to last message get');
                } else {
                    socket.emit('error', 'Message could not be sent');
                }
            }
        });

        // Listen for a new chat message
        socket.on('getAllUserMessageCount', async () => {
            const findChatUser = await getAllChatUsers();
            if (findChatUser.length > 0) {
                for (let user of findChatUser) {
                    const findLastMessage = await getLastMessageAllUser(user.user_id);
                    user.message = findLastMessage[0].message,
                        user.unread_count = findLastMessage[0].unread_count
                }
                socket.emit("getMessages", findChatUser);
            } else {
                socket.emit('error', 'Message could not be sent');
            }
        });

        // User goes offline
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });
    return io; // Return the io instance for use in other files if needed
};