const db = require("../utils/database");
const { Server } = require("socket.io");
const { createNewBid, getBitCountByOfferId } = require("../controller/productController");
const { updateOnlineStatus } = require("../controller/userController");
const { adminUpdateLoginStatus } = require("../controller/adminController");

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
        socket.on("newBid", (data) => {
            createNewBid(data)
                .then(() => getBitCountByOfferId(data))
                .then((count) => {
                    const bidCount = count[0].bidCount
                    io.emit("updateBid", { ...data, bidCount });
                })
                .catch((error) => {
                    console.error("Error handling new bid:", error);
                });
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
                    const messageId = addMessage.insertId;

                    const findLastMessage = await db.query('SELECT * FROM `tbl_chat_sessions` WHERE user_id = ? AND admin_id = ?', [user_id, admin_id]);

                    let session = '';
                    if (findLastMessage.length > 0) {
                        session = await db.query('UPDATE `tbl_chat_sessions` SET `last_message_id`= ?, `unread_count`= ? WHERE user_id = ? AND admin_id = ?', [messageId, findLastMessage[0].unread_count + 1, user_id, admin_id]);
                    } else {
                        // Add conversation_session with the latest message and unread count
                        session = await db.query('INSERT INTO tbl_chat_sessions (user_id, admin_id, last_message_id, unread_count) VALUES (?, ?, ?, ?)', [user_id, admin_id, messageId, 1]);
                    }

                    if (session.affectedRows > 0) {
                        const getLastMessage = `SELECT id, user_id, admin_id, message, image_path, sender_id, is_read, DATE_FORMAT(created_at, '%Y-%m-%dT%h:%i:%s.000Z') AS created_at, updated_at FROM tbl_messages WHERE id = ?`
                        const lastMessage = await db.query(getLastMessage, [messageId]);
                        if (lastMessage.length > 0) {
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
                        }
                    } else {
                        socket.emit('error', 'Failed to update session');
                    }
                } else {
                    socket.emit('error', 'Message could not be sent');
                }
            }
        });

        // User goes offline
        socket.on('disconnect', () => {
            console.log('User disconnected', socket.id);
        });
    });
    return io; // Return the io instance for use in other files if needed
};