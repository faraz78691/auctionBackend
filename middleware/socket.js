const db = require("../utils/database");
const { Server } = require("socket.io");
const { createNewBid, getBitCountByOfferId } = require("../controller/productController");
const { required } = require("joi");
const { updateOnlineStatus } = require("../controller/userController");
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
    let onlineUsers = {};

    // Set up a connection event listener for incoming sockets
    io.on("connection", (socket) => {
        console.log("A user connected =>", socket.id);
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
        socket.on('userOnline', (userId) => {
            onlineUsers[userId] = socket.id;
            updateOnlineStatus(userId, 'online');
            io.emit('onlineUsers', onlineUsers); // Broadcast the list of online users
        });

        // Send previous chat history
        db.query('SELECT * FROM tbl_messages ORDER BY created_at ASC', (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                socket.emit('error', 'Could not load chat history');
                return;
            }
            socket.emit('chatHistory', results);
        });

        // Listen for a new chat message
        socket.on('sendMessage', (msg) => {
            const { user_id, admin_id, message, sender_id } = msg;

            // Insert the message into the database
            const insertMessageQuery = `
            INSERT INTO tbl_messages (user_id, admin_id, message, sender_id, is_read)
            VALUES (?, ?, ?, ?, FALSE)`;
            db.query(insertMessageQuery, [user_id, admin_id, message, sender_id], (err, result) => {
                if (err) {
                    console.error('Error inserting chat message:', err);
                    socket.emit('error', 'Message could not be sent');
                    return;
                }

                const messageId = result.insertId;

                // Update conversation_session with the latest message and unread count
                const updateSessionQuery = `
                INSERT INTO conversation_session (user_id, admin_id, last_message_id, unread_count)
                VALUES (?, ?, ?, 1)
                ON DUPLICATE KEY UPDATE
                last_message_id = ?, unread_count = unread_count + 1
            `;

                db.query(updateSessionQuery, [user_id, admin_id, messageId, messageId], (err) => {
                    if (err) throw err;
                });

                // Broadcast the message to the admin or user
                io.to(admin_id).emit('new_message', {
                    user_id,
                    admin_id,
                    message,
                    sender_role,
                    sent_at: new Date(),
                });
            });
        });

        // User goes offline
        socket.on('disconnect', () => {
            for (let userId in onlineUsers) {
                if (onlineUsers[userId] === socket.id) {
                    updateOnlineStatus(userId, 'offline');
                    delete onlineUsers[userId];
                    break;
                }
            }
            io.emit('onlineUsers', onlineUsers); // Update online users list
            console.log('Client disconnected', socket.id);
        });
    });
    return io; // Return the io instance for use in other files if needed
};