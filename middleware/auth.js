const jwt = require("jsonwebtoken");

const {fetchUserById} = require("../models/users");

const auth = async (req, res, next) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof beareHeader != undefined) {
      const bearer = bearerHeader.split(" ");
      req.token = bearer[1];
      const verifyUser = jwt.verify(req.token,'SecretKey')
      console.log(verifyUser," <= verify user")
      const user = await fetchUserById(verifyUser.data.id );
      console.log(user, "user");
   
      if (user !== null) {
        next();
      } else {
        return res.json({
          message: "Access Forbidden",
          status: 401,
          success: "0",
        });
      }
    } else {
      return res.json({
        message: "Token Not Provided",
        status: 400,
        success: "0",
      });
    }
  } catch (err) {
    return res.json({
      message: "Access forbidden",
      status: 401,
      success: "0",
    });
  }
};
module.exports = auth;