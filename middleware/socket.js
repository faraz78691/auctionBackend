const { createNewBid } = require("../controller/productController");

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

    // Set up a connection event listener for incoming sockets
    io.on("connection", (socket) => {
        console.log("A user connected");

        // Listen for 'newBid' events from the client
        socket.on("newBid", (data) => {
            createNewBid(data);
            // Broadcast the message to all connected clients
            io.emit("updateBid", data);
        });

        // Handle user disconnection
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });

    return io; // Return the io instance for use in other files if needed
};
