const db = require("../utils/database");
const { createNewBid, getBitCountByOfferId } = require("../controller/productController");

// socket.js
module.exports = function (server) {
    const { Server } = require("socket.io");
    // Create a new instance of socket.io by passing in the server
    const io = new Server(server, {
        cors: {
            origin: "*", // Replace with your frontend URL if needed
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Object to keep track of connected users and their socket IDs
    const users = {};

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

        // Send previous chat history
        db.query('SELECT * FROM tbl_customer_support ORDER BY created_at ASC', (err, results) => {
            if (err) {
                console.error("Database query error:", err);
                socket.emit('error', 'Could not load chat history');
                return;
            }
            socket.emit('chatHistory', results);
        });

        // Listen for a new chat message
        socket.on('sendMessage', (msg) => {
            const { sender_id, receiver_id, message } = msg;

            // Insert the message into the database
            const sql = 'INSERT INTO `tbl_customer_support`(`sender_id`, `receiver_id`, `message`) VALUES (?, ?, ?)';
            db.query(sql, [sender_id, receiver_id, message], (err, result) => {
                if (err) {
                    console.error('Error inserting chat message:', err);
                    socket.emit('error', 'Message could not be sent');
                    return;
                }

                // Send the message to the receiver if they are connected
                const receiverSocketId = users[receiver_id];
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('getMessage', msg);
                } else {
                    console.log(`User ${receiver_id} is not online.`);
                }
            });
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log("A user disconnected");
            // Remove the disconnected user from the users object
            for (let userId in users) {
                if (users[userId] === socket.id) {
                    delete users[userId];
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });
    return io; // Return the io instance for use in other files if needed
};