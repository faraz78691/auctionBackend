const jwt = require("jsonwebtoken");

const { fetchUserById } = require("../models/users");
const { findAdminById } = require("../models/admin");

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader != undefined) {
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];      
      const verifyUser = jwt.verify(req.token, 'SecretKey')
      console.log(verifyUser);
      
      const user = await fetchUserById(verifyUser.user_id);
      if (user !== null) {
        req.user = user[0];
        next();
      } else {
        return res.status(401).json({ error: true, message: "Unauthorized access", success: false, status: 401 });
      }
    } else {
      return res.status(400).json({ error: true, message: "Token not provided", success: false, status: 400 });
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Handle token expired error
      return res.status(401).json({
        error: true,
        message: "Session expired, please log in again",
        success: false,
        status: 401
      });
    } else if (err.name === 'JsonWebTokenError') {
      // Handle other JWT errors (e.g., invalid signature)
      return res.status(400).json({
        error: true,
        message: "Invalid or expired token",
        success: false,
        status: 400
      });
    } else {
      // Handle other errors
      return res.status(500).json({
        error: true,
        message: "Internal Server Error" + ': ' + err.message,
        success: false,
        status: 500
      });
    }
  }
};

const adminAuth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (bearerHeader != undefined) {
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];
      const verifyUser = jwt.verify(req.token, 'SecretKey')
      const user = await findAdminById(verifyUser.user_id);
      if (user !== null) {
        next();
      } else {
        return res.status(401).json({ error: true, message: "Unauthorized access", success: false, status: 401 });
      }
    } else {
      return res.status(400).json({ error: true, message: "Token not provided", success: false, status: 400 });
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      // Handle token expired error
      return res.status(401).json({
        error: true,
        message: "Session expired, please log in again",
        success: false,
        status: 401
      });
    } else if (err.name === 'JsonWebTokenError') {
      // Handle other JWT errors (e.g., invalid signature)
      return res.status(400).json({
        error: true,
        message: "Invalid or expired token",
        success: false,
        status: 400
      });
    } else {
      // Handle other errors
      return res.status(500).json({
        error: true,
        message: "Internal Server Error" + ': ' + err.message,
        success: false,
        status: 500
      });
    }
  }
};

module.exports = { auth, adminAuth };