const {
  addUser,
  fetchUserByEmail,
  updateLoginStatusByEmail,
  tokenUpdate,
  fetchUserToken,
  updateVerifyUser,
  fetchUserById,
  updateUserbyPass,
  updateUserById,
  updateUser,
  fetchTokenOfUser,
  updPasswdByToken,
  insertRoleId,
  getRoleID,
  getUserRole,
  insertUserProfileM,
  updateUserProfile,
  updateUserM,
  getuserProfileDetails,
  fetchAllUsers,
  fetchAllUsersOffers,
  getAllMessageByUserId
} = require("../models/users");
const { updateData } = require("../models/common");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const path = require("path");
const hbs = require("nodemailer-express-handlebars");
var base64url = require('base64url');
var crypto = require('crypto');
var admin = require("firebase-admin");
const serviceAccount = require('../config/firebase_serviceacoount.json');
const { initializeApp } = require("firebase/app");
const { getMessaging, getToken, isSupported } = require("firebase/messaging");
require('dotenv').config();

function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

function betweenRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const saltRounds = 10;
const base_url = "localhost:4000";

var transporter = nodemailer.createTransport({
  // service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  // secure: true,
  auth: {
    user: "chandni.ctinfotech@gmail.com",
    pass: "eabouuuhtpnsknsn",
  },
});

const handlebarOptions = {
  viewEngine: {
    partialsDir: path.resolve(path.join(__dirname, "../view/")),
    defaultLayout: false,
  },
  viewPath: path.resolve(path.join(__dirname, "../view/")),
};

transporter.use("compile", hbs(handlebarOptions));

exports.signup = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const {
      email,
      password,
      first_name,
      last_name,
      company,
      street,
      street_number,
      state,
      country,
      role_id,
      phone_number,
      company_reg_no,
      signing_authority,
      city,
      postal_code
    } = req.body;
    const actToken = betweenRandomNumber(10000000, 99999999);
    var status = 1;
    var login_status = 1;
    var country_code = "+91";
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string()
          .min(5)
          .max(255)
          .email({ tlds: { allow: false } })
          .lowercase()
          .required(),
        password: Joi.string().min(5).max(10).required().messages({
          "any.required": "password is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        first_name: Joi.string().empty().required().messages({
          "string.empty": "can't be empty",
          "string.required": "first_name is required",
        }),
        last_name: Joi.string().empty().required().messages({
          "string.empty": "last_name can't be empty",
          "string.required": "last_name is required",
        }),

        company: Joi.string().empty().required(),
        street: Joi.string().empty().required(),
        street_number: Joi.number().empty().required(),
        state: Joi.string().empty().required(),
        country: Joi.string().empty().required(),
        role_id: Joi.number().required(),
        phone_number: Joi.number().required(),
        company_reg_no: Joi.string().empty().required(),
        signing_authority: Joi.string().empty().required(),
        city: Joi.string().empty().required(),
        postal_code: Joi.string().empty().required(),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const result1 = await fetchUserByEmail(email);

      console.log(result1, "result1result1result1")

      if (result1.length === 0) {
        bcrypt.genSalt(saltRounds, async function (err, salt) {
          bcrypt.hash(password, salt, async function (err, hash) {
            if (err) throw err;

            let user = {
              email: email,
              password: hash,
              first_name: first_name,
              last_name: last_name,
              company: company,
              act_token: actToken,
              status: status,
              login_status: login_status,
              street: street,
              street_number: street_number,
              state: state,
              country: country,
              role_id: role_id,
              phone_number: phone_number,
              company_reg_no: company_reg_no,
              signing_authority: signing_authority,
              city: city,
              postal_code: postal_code
            };
            console.log(user);
            const result = await addUser(user);

            if (result.affectedRows > 0) {
              let mailOptions = {
                from: "aarif.ctinfotech@gmail.com",
                to: email,
                subject: "Activate Account with Kimmy",
                template: "signupemail", // the name of the template file i.e email.handlebars
                context: {
                  href_url: `http://${process.env.BASEURL_APP}/user/verifyhomeUser/${actToken}/${result.insertId}`,
                  image_logo: `http://${process.env.FRONT_URL}/assets/img/logo.png`,
                  msg: "Your account has been created successfully and is ready to use.",
                },
              };

              transporter.sendMail(mailOptions, async function (error, info) {
                console.log(error);
                if (error) {
                  return res.json({
                    success: true,
                    message: "Mail Not delivered",
                    status: 200,
                    userInfo: {},
                  });
                } else {
                  if (result.insertId > 0) {
                    results = await fetchUserById(result.insertId);
                  }
                  console.log("mail sent to ");
                  return res.json({
                    success: true,
                    message:
                      "Your account has been successfully created. An email has been sent to you with detailed instructions on how to activate it.",
                    userinfo: results[0],
                    status: 200,
                  });
                }
              });
            } else {
              return res.json({
                message: "user failed to register",
                status: 200,
                success: false,
                userinfo: {},
              });
            }
          });
        });
      } else {
        // console.log(result);
        return res.json({
          success: false,
          message: "Already Exists",
          status: 200,
          userInfo: {},
        });
      }
    }
  } catch (error) {
    console.log(error, "<==error");
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {

    const { email, password } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string()
          .min(5)
          .max(255)
          .email({ tlds: { allow: false } })
          .lowercase()
          .required(),
        password: Joi.string().min(5).max(20).required().messages({
          "any.required": "Password is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
      })
    );
    const result = schema.validate(req.body);
    // console.log(result);

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
      const result = await fetchUserByEmail(email);
      // console.log(result);
      if (result.length !== 0) {
        const match = bcrypt.compareSync(password, result[0].password);
        if (match) {
          if (result[0].act_token !== "") {
            console.log(result[0].act_token);
            return res.json({
              message: "Please verify your account first",
              success: false,
              status: 200,
              token: "",
              userinfo: {},
            });
          }

          await updateLoginStatusByEmail(email);
          const token = jwt.sign(
            {
              user_id: result[0].id,
            },
            "SecretKey",
            { expiresIn: "24h" }
          );

          await tokenUpdate(token, result[0].id);

          const result1 = await fetchUserByEmail(email);

          delete result1[0].token;

          delete result1[0].password;

          return res.json({
            success: true,
            message: "Successfully Login",
            status: 200,
            token: token,
            // "userinfo": result[0]
            userinfo: result1[0],
          });
        } else {
          return res.json({
            message: "Wrong password",
            success: false,
            status: 200,
            userinfo: {},
          });
        }
      } else {
        return res.json({
          message: "User not found",
          status: 200,
          success: false,
          userinfo: {},
        });
      }
    }
  } catch (error) {
    console.log(error, "<==error");
    return res.json({
      message: "Internal server error",
      status: 500,
      success: false,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      country_code,
      phone,
      company_name,
      vat_number,
      area,
      industry,
      features,
      street,
      city,
      zip,
      country,
      user_id,
    } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        email: [Joi.number().empty(), Joi.string().empty()],
        first_name: [Joi.number().empty(), Joi.string().empty()],
        last_name: [Joi.number().empty(), Joi.string().empty()],
        country_code: [Joi.number().empty(), Joi.string().empty()],
        phone: [
          Joi.number().optional().allow(""),
          Joi.string().optional().allow(""),
        ],
        company_name: [Joi.number().empty(), Joi.string().empty()],
        vat_number: [Joi.number().empty(), Joi.string().empty()],
        area: [Joi.number().empty(), Joi.string().empty()],
        industry: [Joi.number().empty(), Joi.string().empty()],
        features: [Joi.number().empty(), Joi.string().empty()],
        street: [Joi.number().empty(), Joi.string().empty()],
        city: [Joi.number().empty(), Joi.string().empty()],
        zip: [Joi.number().empty(), Joi.string().empty()],
        country: [Joi.number().empty(), Joi.string().empty()],
        user_id: [Joi.number().empty(), Joi.string().empty()],
      })
    );
    const result = schema.validate({
      email,
      first_name,
      last_name,
      country_code,
      phone,
      company_name,
      vat_number,
      area,
      industry,
      features,
      street,
      city,
      zip,
      country,
      user_id,
    });

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 200,
        success: true,
      });
    } else {
      // let filename = '';
      // if(req.file) {
      //     const file = req.file
      //     filename = file.filename;
      // }
      // const result = schema.validate({ email, first_name, last_name, country_code, phone, company_name, vat_number, area, industry, features, street, city, zip, country, user_id});

      const userInfo = await fetchUserById(user_id);
      if (userInfo.length !== 0) {
        let user = {
          email: email ? email : userInfo[0].email,
          first_name: first_name ? first_name : userInfo[0].firstname,
          last_name: last_name ? last_name : userInfo[0].lastname,
          country_code: country_code ? country_code : userInfo[0].country_code,
          phone: phone ? phone : userInfo[0].phone,
          vat_number: vat_number ? vat_number : userInfo[0].vat_number,
          area: area ? area : userInfo[0].area,
          industry: industry ? industry : userInfo[0].industry,
          features: features ? features : userInfo[0].features,
          street: street ? street : userInfo[0].street,
          city: city ? city : userInfo[0].city,
          zip: zip ? zip : userInfo[0].zip,
          country: country ? country : userInfo[0].country,
          //   image:filename?filename : userInfo[0].image,
        };
        const result = await updateUserById(user, user_id);
        if (result.affectedRows) {
          return res.json({
            message: "update user successfully",
            status: 200,
            //    file: req.file ? req.file:[],
            success: true,
          });
        } else {
          return res.json({
            message: "update user failed ",
            status: 200,

            success: true,
          });
        }
      } else {
        return res.json({
          messgae: "data not found",
          status: 200,
          success: true,
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

exports.verifyhomeUser = async (req, res) => {
  try {
    const { token, id } = req.params;
    const schema = Joi.alternatives(
      Joi.object({
        token: [Joi.number().empty(), Joi.string().empty()],
        id: [Joi.number().empty(), Joi.string().empty()],
      })
    );

    const result = schema.validate(req.params);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 200,
        success: true,
      });
    } else {
      const result = await fetchUserToken(token);
      if (result.length != 0) {
        let data = {
          act_token: "",
        };

        const resultUpdate = await updateVerifyUser(data, result[0].id);
        console.log("updateVerifyUser Run");
        if (resultUpdate.affectedRows) {
          res.sendFile(path.join(__dirname, '../view/verify.html')); //updated code
          // res.sendFile(__dirname + "../view/verify.html");
        } else {
          res.sendFile(path.join(__dirname, '../view/notverify.html'));//updated code
          //res.sendFile(__dirname + "../view/notverify.html");
        }
      } else {
        res.sendFile(path.join(__dirname, '../view/notverify.html'));//updated code
        //  res.sendFile(__dirname + "../view/notverify.html");
        // console.log("this file");
      }
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

exports.resetPassword = async (req, res) => {
  const { user_id, password } = req.body;
  try {
    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(5).max(10).required().messages({
          "any.required": "password is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id  is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,

        success: false,
      });
    } else {
      const result = await fetchUserById(user_id);
      if (result.length != 0) {
        const hash = await bcrypt.hash(password, saltRounds);
        const result2 = await updateUserbyPass(hash, user_id);

        if (result2) {
          return res.json({
            success: true,
            status: 200,
            message: "Password Changed Successfully",
          });
        } else {
          return res.json({
            success: true,
            status: 200,
            message: "Some error occured. Please try again",
          });
        }
      } else {
        return res.json({
          success: true,
          status: 200,
          message: "User Not Found",
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.userProfile = async (req, res) => {
  try {
    const { user_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().empty().required().messages({
          "number.empty": "id can't be empty",
          "number.required": "id  is required",
        }),
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
    } else {
      const results = await fetchUserById(user_id);
      if (results.length !== 0) {
        return res.json({
          message: "fetch user details success",
          status: 200,
          success: true,
          data: results[0],
        });
      } else {
        return res.json({
          message: "fetch details failed",
          status: 200,
          success: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string().empty().required().messages({
          "string.empty": "email can't be empty",
          "string.required": "email is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else {
      const result = await fetchUserByEmail(email);

      if (result.length != 0) {
        const genToken = randomStringAsBase64Url(20);
        await updateUser(genToken, email);

        const result = await fetchUserByEmail(email);

        let token = result[0].token;

        let mailOptions = {
          from: "aarif.ctinfotech@gmail.com",
          to: email,
          subject: "forget Password",
          template: "forget_template", // the name of the template file i.e email.handlebars
          context: {
            href_url: `http://${base_url}/verifyPassword/${token}`,
            image_logo: `http://${process.env.FRONT_URL}/assets/img/logo.png`,
            msg: `Please click below link to change password.`,
          },
        };

        transporter.sendMail(mailOptions, async function (error, info) {
          console.log("error", error);
          if (error) {
            return res.json({
              success: false,
              message: "Mail Not delivered",
            });
          } else {
            return res.json({
              success: true,
              message:
                "An email has been sent to you with detailed instructions on how to change password.",
              // userinfo: result,
              status: 200,
            });
          }
        });
      } else {
        return res.json({
          success: true,
          message: "User is not registered with Vanya",
          status: 200,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: "Internal server error",
      status: 500,
    });
  }
};

exports.verifyPassword = async (req, res) => {
  try {
    const token = req.params.token;
    // const user_id = req.params.user_id;

    if (!token) {
      return res.status(400).send("Invalid link");
    } else {
      const result = await fetchTokenOfUser(token);

      if (result.length != 0) {
        //  localStorage.setItem('vertoken', token);

        //  res.render(path.join(__dirname+'/view/forgetPassword.ejs'), {msg : ""});
        res.render(path.join(__dirname, "/../views", "forgetPassword.ejs"), {
          msg: "This is msgg",
          token: token,
        });
      } else {
        res.send(`<div class="container">
                    <p> User not Registered with Vanya </p>
            </div>`);
      }
    }
  } catch (err) {
    console.log(err);
    res.send(`<div class="container">
          <p>404 Error, Page Not Found</p>
          </div> `);
  }
};

exports.updatePassword = async (req, res) => {
  const { token, password, confPassword } = req.body;
  // const token = localStorage.getItem('vertoken');

  //  console.log(password);  console.log(confPassword);    return false ;
  try {
    const schema = Joi.alternatives(
      Joi.object({
        password: Joi.string().min(5).max(10).required().messages({
          "any.required": "{{#label}} is required!!",
          "string.empty": "can't be empty!!",
          "string.min": "minimum 5 value required",
          "string.max": "maximum 10 values allowed",
        }),
        confPassword: Joi.string().empty().required().messages({
          "string.empty": "token can't be empty",
          "string.required": "token is required",
        }),
      })
    );
    const result = schema.validate(req.body);

    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      return res.json({
        message: result.error.details[0].message,
        error: message,
        missingParams: result.error.details[0].message,
        status: 400,
        success: false,
      });
    } else if (password !== confPassword) {
      /*res.send(`<div class="container">
            <p>Password and Confirm Password do not match</p>
            </div> `); 
            res.render(path.join(__dirname+'/view/forgetPassword.html'), {msg : "Password and Confirm Password do not match"});*/
      res.render(path.join(__dirname, "/../views", "forgetPassword.ejs"), {
        msg: "Password and Confirm Password do not match",
      });
    } else {
      //  const token = localStorage.getItem('vertoken');

      const result = await fetchTokenOfUser(token);
      if (result.length != 0) {
        const hash = await bcrypt.hash(password, saltRounds);
        const result2 = await updPasswdByToken(hash, token);
        console.log("update", result2);
        if (result2) {
          await tokenUpdate(result[0].id);
          res.sendFile(path.join(__dirname + "/view/message.html"), {
            msg: "",
          });
        } else {
          //   res.send(`<div class="container">
          //   <p>Internal Error Occured, Please contact Support.</p>
          //   </div> `);
          res.render(path.join(__dirname, "/../views", "forgetPassword.ejs"), {
            msg: "Internal Error Occured, Please contact Support.",
          });
        }
      } else {
        //  res.send(`<div class="container">
        // <p>User is not registered with Exam Simplify.</p>
        // </div> `);
        res.render(path.join(__dirname, "/../views", "forgetPassword.ejs"), {
          msg: "User is not registered with Glistener",
        });
      }
    }
  } catch (error) {
    console.log(error);
    // res.send(`<div class="container">
    //         <p>Internal Server Error.</p>
    //         </div> `);
    res.render(path.join(__dirname, "/../views", "forgetPassword.ejs"), {
      msg: "Internal Server Error.",
    });
  }
};

exports.insertUserRole = async (req, res) => {
  try {
    const { role_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        role_id: [Joi.number().required().empty()],
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
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;

    const userDetails = await fetchUserById(user_id);
    if (userDetails.length > 0) {
      const role_data = {
        user_id: user_id,
        role_id: role_id,
      };
      const resultInserted = await insertRoleId(role_data);
      if (resultInserted.affectedRows > 0) {
        return res.json({
          success: true,
          message: "User role assigned",
          status: 200,
          rowsAffected: resultInserted.affectedRows,
        });
      }
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

exports.getUserRoleDetails = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;
    var userRoles = {};
    if (user_id === undefined || user_id === null) {
      return (
        res /
        json({
          success: false,
          status: 500,
          msg: "The token is expired or incorrect, Please login again",
        })
      );
    }
    const userDetails = await fetchUserById(user_id);
    if (userDetails.length > 0) {
      const roleId = await getRoleID(user_id);
      if (roleId.length > 0) {
        const roleDetails = await getUserRole(roleId[0].role_id);
        if (roleDetails.length > 0) {
          userRoles = { ...userDetails[0], ...roleDetails[0] };
          res.json({
            success: true,
            status: 200,
            msg: "Role Found for User",
            userRoles: userRoles,
          });
        } else {
          return res.json({
            success: false,
            status: 500,
            msg: "No roles assigned to User",
          });
        }
      } else {
        return res.json({
          success: false,
          status: 500,
          msg: "No roles assigned to User",
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

exports.insertUserProfileC = async (req, res) => {
  try {
    const { user_id, profile_name, address, city, state, country } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().required().empty(),
        profile_name: Joi.string().required().empty(),
        address: Joi.string().required().empty(),
        city: Joi.string().required().empty(),
        state: Joi.string().required().empty(),
        country: Joi.string().required().empty(),
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
    /*const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;
    else {
      return res.json({
        success: false,
        message: "No Data Found",
        status: 400,
      });
    }*/

    const role_data = {
      user_id: user_id,
      profile_name: profile_name,
      address: address,
      city: city,
      state: state,
      country: country,
    };
    const resultInserted = await insertUserProfileM(role_data);
    if (resultInserted.affectedRows > 0) {

      const resultUpdate = await updateUserM(role_data);
      return res.json({
        success: true,
        message: "User profile created",
        status: 200,
        rowsAffected: resultInserted.affectedRows,
        resultUpdate: resultUpdate.affectedRows
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

exports.updateUserProfileC = async (req, res) => {
  try {
    const { user_id, profile_name, address, city, state, country } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().required().empty(),
        profile_name: Joi.string().required().empty(),
        address: Joi.string().required().empty(),
        city: Joi.string().required().empty(),
        state: Joi.string().required().empty(),
        country: Joi.string().required().empty(),
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
    /*const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;
    else {
      return res.json({
        success: false,
        message: "No Data Found",
        status: 400,
      });
    }*/

    const role_data = {
      user_id: user_id,
      profile_name: profile_name,
      address: address,
      city: city,
      state: state,
      country: country,
    };
    const resultInserted = await updateUserProfile(role_data);
    if (resultInserted.affectedRows > 0) {
      const resultUpdate = await updateUserM(role_data);
      return res.json({
        success: true,
        message: "User profile updated",
        status: 200,
        rowsAffected: resultInserted.affectedRows,
        updateRows: resultUpdate.affectedRows
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

exports.getUserRoleProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const jwtToken = authHeader.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken);
    const user_id = decoded.user_id;
    var userRoles = {};
    if (user_id === undefined || user_id === null) {
      return (
        res.json({
          success: false,
          status: 500,
          msg: "The token is expired or incorrect, Please login again",
        })
      );
    }
    const userDetails = await getuserProfileDetails(user_id);
    if (userDetails.length > 0) {

      res.json({
        success: true,
        status: 200,
        msg: "Role Found for User",
        userDetails: userDetails,
      });

    } else {
      return res.json({
        success: false,
        status: 500,
        msg: "No roles assigned to User",
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

exports.notification = async (req, res) => {
  try {
    // const { fcm_token, postId, body } = req.body;
    // if (!fcm_token) {
    //   return res.status(400).send({ success: false, message: "FCM token is required" });
    // }
    // admin.initializeApp({
    //   credential: admin.credential.cert(serviceAccount)
    // });

    // var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    //   token: fcm_token,
    //   notification: {
    //     title: 'Feed Notification',
    //     body: `${body}`,
    //   },
    //   data: {  //you can send only notification or only data(or include both)
    //     postId: String(postId),
    //     type: "post"
    //   },
    // };

    // try {
    //   const response = await admin.messaging().send(message);
    //   console.log('Successfully sent message:', response);
    // } catch (error) {
    //   console.error('Error sending message:', error);
    // }
    const firebaseConfig = {
      apiKey: "AIzaSyD7KKEEAPWUdAZyEOx__dxDe1Cnx_dZDS0",
      authDomain: "auction-20700.firebaseapp.com",
      projectId: "auction-20700",
      storageBucket: "auction-20700.appspot.com",
      messagingSenderId: "497684001909",
      appId: "1:497684001909:web:779b838300c94acc6a343c",
      measurementId: "G-9RY08SFF7G"
    };

    const app = initializeApp(firebaseConfig);
    isSupported()
      .then((supported) => {
        if (supported) {
          if (typeof window !== "undefined") {
            const messaging = getMessaging(app);

            // Obtain the FCM token
            getToken(messaging, { vapidKey: "BGyporLd2T-whJdKWWLM2T5zIoou0vkufsVTlQbaRGiFmbYX8U0Z6bpgHiA8gdNdrMFIWudCFqG1EBVZHh4Y46w" })
              .then((currentToken) => {
                if (currentToken) {
                  console.log("FCM Token:", currentToken);
                } else {
                  console.warn("No registration token available.");
                }
              })
              .catch((err) => {
                console.error("An error occurred while retrieving the token. ", err);
              });
          }
        } else {
          console.warn("Firebase Messaging is not supported in this browser/environment.");
        }
      })
      .catch((err) => {
        console.error("Error checking messaging support:", err);
      });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      status: 500,
    });
  }
};

// getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" })
//   .then((currentToken) => {
//     if (currentToken) {
//       console.log("FCM Token:", currentToken);
//       // Send this token to your server to be used for sending notifications
//     } else {
//       console.warn("No registration token available. Request permission to generate one.");
//     }
//   })
//   .catch((error) => {
//     console.error("An error occurred while retrieving the token. ", error);
//   });

exports.updateOnlineStatus = async (userId, status) => {
  try {
    const schema = Joi.alternatives(
      Joi.object({
        userId: Joi.number().required().empty(),
        status: Joi.string().required().empty()
      })
    );
    const result = schema.validate(userId, status);
    if (result.error) {
      const message = result.error.details.map((i) => i.message).join(",");
      console.log("error =>", message);
    }
    const userstatus = {
      online_status: status
    }
    const updateStatus = updateData('users', `WHERE id = ${userId}`, userstatus);
    console.log(updateStatus);

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      status: 500,
    });
  }
};

exports.getChatMessage = async (req, res) => {
  try {
    const user_id = req.user.id;
    console.log(user_id);

    const findAllMessage = await getAllMessageByUserId(user_id);
    if (findAllMessage.length > 0) {
      return res.json({
        message: "fetch user all chat message",
        status: 200,
        success: true,
        data: findAllMessage,
      });
    } else {
      return res.json({
        message: "Fetch user all chat message failed",
        status: 200,
        success: true,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      status: 500,
    });
  }
};