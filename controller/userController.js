const {
  addUser,
  fetchUserByEmail,
  updateLoginStatusByEmail,
  tokenUpdate,
  fetchUserToken,
  updateVerifyUser,
  addUserNotificartion,
  fetchUserById,
  updateStripeCustomerId,
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
  updateMessageCount,
  getAllMessageByUserId,
  updateUserCommissinFees,
  getNotificationsByUserId,
  addSearch,
  getSearchById,
  addFollowUpByUser,
  getFollowupById,
  deleteFollowupById,
  getUserById,
  updateAccountDetails
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
const { initializeApp } = require("firebase/app");
const { getMessaging, getToken, isSupported } = require("firebase/messaging");
const { hashPassword } = require('../helper/hashPassword');
const twilio = require('twilio');
const client = ''
var moment = require('moment-timezone');
const { error } = require("console");
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRERT_KEY);

function randomStringAsBase64Url(size) {
  return base64url(crypto.randomBytes(size));
}

function betweenRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const saltRounds = 10;

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
    const {
      email,
      password,
      first_name,
      last_name,
      user_name,
      company,
      street,
      street_number,
      state,
      country,
      role_id,
      country_code,
      phone_number,
      company_reg_no,
      signing_authority,
      city,
      postal_code
    } = req.body;
    const actToken = betweenRandomNumber(10000000, 99999999);
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string()
          .min(5)
          .max(255)
          .email({ tlds: { allow: false } })
          .lowercase()
          .required(),
        password: Joi.string().min(8).required().messages({
          "any.required": "Password is required!!",
          "string.empty": "Password can't be empty!!",
          "string.min": "Password minimum 8 value required",
        }),
        first_name: Joi.string().empty().required().messages({
          "string.empty": "can't be empty",
          "string.required": "first_name is required",
        }),
        last_name: Joi.string().empty().required().messages({
          "string.empty": "last_name can't be empty",
          "string.required": "last_name is required",
        }),
        user_name: Joi.string().empty().required(),
        company: Joi.string().empty().required(),
        street: Joi.string().empty().required(),
        street_number: Joi.string().empty().required(),
        state: Joi.string().empty().required(),
        country: Joi.string().empty().required(),
        role_id: Joi.number().required(),
        country_code: Joi.string().empty().required(),
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
      if (result1.length === 0) {
        bcrypt.genSalt(saltRounds, async function (err, salt) {
          bcrypt.hash(password, salt, async function (err, hash) {
            if (err) throw err;
            let user = {
              email: email,
              password: hash,
              first_name: first_name,
              last_name: last_name,
              user_name: user_name,
              company: company,
              act_token: actToken,
              status: 1,
              login_status: 1,
              street: street,
              street_number: street_number,
              state: state,
              country: country,
              role_id: role_id,
              country_code: country_code,
              phone_number: phone_number,
              company_reg_no: company_reg_no,
              signing_authority: signing_authority,
              city: city,
              postal_code: postal_code
            };
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
                  msg: "Your account has been successfully created and is ready to use.",
                },
              };

              transporter.sendMail(mailOptions, async function (error, info) {
                if (error) {
                  return res.status(200).json({
                    success: false,
                    message: "Email delivery failed. Please try again.",
                    status: 400,
                    userInfo: [],
                    error: true
                  });
                } else {
                  await addUserNotificartion(result.insertId)
                  const results = await fetchUserById(result.insertId);
                  return res.status(200).json({
                    success: true,
                    message: "Your account has been successfully created. A confirmation email with activation instructions has been sent to you.",
                    userinfo: results[0],
                    status: 200,
                  });
                }
              });
            } else {
              return res.status(200).json({
                message: "User registration failed. Please try again.",
                status: 400,
                success: false,
                userinfo: [],
                error: true
              });
            }
          });
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Email already exists. Please use a different email address.",
          status: 200,
          userInfo: [],
          error: true
        });;
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, fcm_token } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        email: Joi.string()
          .min(5)
          .max(255)
          .email({ tlds: { allow: false } })
          .lowercase()
          .required()
          .messages({
            "string.empty": "Email can't be empty",
            "string.min": "Email must be at least 5 characters long",
            "string.max": "Email can't be more than 255 characters",
            "string.email": "Please provide a valid email address",
          }),

        password: Joi.string()
          .min(5)
          .max(20)
          .required()
          .messages({
            "any.required": "Password is required!",
            "string.empty": "Password can't be empty!",
            "string.min": "Password must have at least 5 characters",
            "string.max": "Password can't exceed 20 characters",
          }),

        fcm_token: Joi.string()
          .allow(null)
          .empty('')
          .optional() // If it's not required, you can make it optional
          .messages({
            "string.base": "FCM token must be a string",
          })
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
    } else {
      const result = await fetchUserByEmail(email);
      if (result.length > 0) {
        const match = bcrypt.compareSync(password, result[0].password);
        if (match) {
          if (result[0].act_token !== "") {
            return res.json({
              message: "Please verify your account first",
              success: false,
              status: 200,
              token: "",
              userinfo: {},
            });
          } else {
            await updateLoginStatusByEmail(email);
            const token = jwt.sign(
              {
                user_id: result[0].id,
              },
              "SecretKey"
            );

            await tokenUpdate(token, fcm_token, result[0].id);
            const result1 = await fetchUserByEmail(email);
            delete result1[0].token;
            delete result1[0].password;
            return res.status(200).json({
              error: false,
              success: true,
              message: "Login successful.",
              status: 200,
              token: token,
              userinfo: result1[0],
            });
          }
        } else {
          return res.status(200).json({ error: true, message: 'Incorrect password. Please enter a valid password.', success: false, status: 200, userinfo: {} });
        }
      } else {
        return res.status(200).json({ error: true, message: 'Invalid email address. Please enter a valid email.', success: false, status: 200, userinfo: {} });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
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
        if (resultUpdate.affectedRows > 0) {
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
            href_url: `http://${process.env.BASEURL_APP}/verifyPassword/${token}`,
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
    const user_id = req.user.id;
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
    const user_id = req.user.id;
    var userRoles = {};
    if (user_id === undefined || user_id === null) {
      return (
        res.
          json({
            success: false,
            status: 500,
            msg: "The token is expired or incorrect, Please login again",
          })
      );
    }
    const userDetails = await fetchUserById(user_id);
    if (userDetails.length > 0) {

      res.json({
        success: true,
        status: 200,
        msg: "Role Found for User",
        userRoles: userDetails,
      });

    } else {
      return res.json({
        success: false,
        status: 500,
        msg: "No roles assigned to User",
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
    const user_id = req.user.id;

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
        userRoles: userDetails,
      });
    } else {
      return res.json({
        success: false,
        status: 500,
        msg: "User profile not found",
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
    const updateStatus = await updateData('users', `WHERE id = ${userId}`, userstatus);
    console.log(updateStatus);

  } catch (err) {
    console.log("Internal Server Error =>", err);
  }
};

exports.getChatMessage = async (req, res) => {
  try {
    const { user_id } = req.body;
    const schema = Joi.alternatives(
      Joi.object({
        user_id: Joi.number().required().empty(),
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
    const updateMessageCountResult = await updateMessageCount(user_id);
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
        success: false,
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
      status: 500,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userInfo = req.user;
    const { password, current_password, first_name, last_name, user_name, phone_number, country, postal_code, street,
      street_number, country_code, city, state } = req.body;
    const schema = Joi.object({
      first_name: Joi.string().required().allow('').messages({
        'string.base': 'First Name must be a string',
        'string.empty': 'First Name is required',
        'any.required': 'First Name is required',
      }),
      last_name: Joi.string().required().allow('').messages({
        'string.base': 'Last Name must be a string',
        'string.empty': 'Last Name is required',
        'any.required': 'Last Name is required',
      }),
      user_name: Joi.string().required().allow('').messages({
        'string.base': 'User Name must be a string',
        'string.empty': 'User Name is required',
        'any.required': 'User Name is required',
      }),
      country_code: Joi.string().required().allow('').messages({
        'string.base': 'Country code must be a string',
        'string.empty': 'Country code is required',
        'any.required': 'Country code is required',
      }),
      phone_number: Joi.string().required().allow('').messages({
        'string.base': 'Phone Number must be a string',
        'string.empty': 'Phone Number is required',
        'any.required': 'Phone Number is required',
      }),
      current_password: Joi.string().min(6).required().allow('').messages({
        'string.base': 'Current Password must be a string',
        'string.empty': 'Current Password is required',
        'string.min': 'Current Password must be at least 6 characters long',
        'any.required': 'Current Password is required',
      }),
      password: Joi.string().min(6).required().allow('').messages({
        'string.base': 'Password must be a string',
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
      }),
      street: Joi.string().required().allow('').messages({
        'string.base': 'Street must be a string',
        'string.empty': 'Street is required',
        'any.required': 'Street is required',
      }),
      street_number: Joi.string().required().allow('').messages({
        'string.base': 'Street Number must be a string',
        'string.empty': 'Street Number is required',
        'any.required': 'Street Number is required',
      }),
      city: Joi.string().required().allow('').messages({
        'string.base': 'City must be a string',
        'string.empty': 'City is required',
        'any.required': 'City is required',
      }),
      postal_code: Joi.string().required().allow('').messages({
        'string.base': 'Postal Code must be a string',
        'string.empty': 'Postal Code is required',
        'any.required': 'Postal Code is required',
      }),
      state: Joi.string().required().allow('').messages({
        'string.base': 'State must be a string',
        'string.empty': 'State is required',
        'any.required': 'State is required',
      }),
      country: Joi.string().required().allow('').messages({
        'string.base': 'Country must be a string',
        'string.empty': 'Country is required',
        'any.required': 'Country is required',
      }),
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
      if (current_password && current_password !== 'undefined' && current_password !== '') {
        var match = bcrypt.compareSync(current_password, userInfo.password);
      } else {
        var match = true; // Skip password check if current_password is not provided
      }
      if (match) {
        const userHashPassword =
          password && password !== 'undefined' && password !== '' ? await hashPassword(password) : userInfo.password;
        let user = {
          first_name: first_name != 'undefined' ? first_name : userInfo.first_name,
          last_name: last_name != 'undefined' ? last_name : userInfo.last_name,
          user_name: user_name != 'user_name' ? user_name : userInfo.user_name,
          country_code: country_code != 'undefined' ? country_code : userInfo.country_code,
          phone_number: phone_number != 'undefined' ? phone_number : userInfo.phone_number,
          password: userHashPassword,
          street: street != 'undefined' ? street : userInfo.street,
          street_number: street_number != 'undefined' ? street_number : userInfo.street_number,
          city: city != 'undefined' ? city : userInfo.city,
          postal_code: postal_code != 'undefined' ? postal_code : userInfo.postal_code,
          state: state != 'undefined' ? state : userInfo.state,
          country: country != 'undefined' ? country : userInfo.country,
        };
        const updateResult = await updateUserById(user, userInfo.id);
        if (updateResult.affectedRows > 0) {
          return res.json({
            errors: false,
            message: "Profile successfully update",
            updateData: updateResult,
            status: 200,
            success: true,
          });
        } else {
          return res.json({
            error: true,
            message: "Profile not update",
            status: 200,
            success: false,
          });
        }
      } else {
        return res.status(200).json({ error: true, message: "Current password is incorrect. Please try again.", status: 200, success: false });
      }
    }
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.orderUpdateStatus = async (req, res) => {
  try {
    const { offer_id, buyer_id, seller_id, buyer_status, seller_status } = req.body;
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
      buyer_status: Joi.number().allow('').messages({
        'number.base': 'Buyer status must be a number',
        'number.empty': 'Buyer status is required',
        'any.required': 'Buyer status is required',
      }),
      seller_status: Joi.number().allow('').messages({
        'number.base': 'Seller status must be a number',
        'number.empty': 'Seller status is required',
        'any.required': 'Seller status is required',
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
      if (seller_status == '' || seller_status == null) {
        const result = await findOfferOrderDetailsById(offer_id, buyer_id, seller_id);
        if (result.length > 0) {
          const resultOrderSummary = await findOrderSummaryDeatils(result[0].offer_id, buyer_id, seller_id);
          const data = {
            result: result,
            resultOrderSummary: resultOrderSummary
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
      } else if (buyer_status == '' || buyer_status == null) {

      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.sendOtp = async (req, res) => {
  try {
    const { phone_number } = req.body

    // Check and format phone number
    if (!phone_number) {
      return res.status(400).json({ error: true, message: 'Phone number is required', status: 400, success: false });
    }

    const formattedPhoneNumber = phone_number.startsWith('+') ? phone_number : `+91${phone_number}`; // Adjust the country code as needed

    const Otp = Math.floor(100000 + Math.random() * 900000);
    const message = await client.messages.create({
      body: `Your verification code is: ${Otp}`,
      from: '+14697891146', // e.g., +123456789
      to: formattedPhoneNumber
    });
    return Otp; // Return OTP for further verification
  } catch (error) {
    if (error.code === 21608) { // Twilio error code for unverified numbers in trial mode
      return res.status(400).json({
        error: true,
        message: "The number is unverified. Verify it in your Twilio Console or upgrade your account to send messages to any number.",
        status: 400,
        success: false
      });
    }
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.createCheckoutSession = async (req, res) => {
  const userId = req.user.id;
  const { offer_id, amount, currency, payment_method_types, id } = req.body;

  try {
    // Retrieve or create a Stripe customer
    const user = await fetchUserById(userId);

    if (user.length > 0) {
      let customerId = user[0].stripe_customer_id;

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user[0].email,
          name: user[0].user_name
        });
        customerId = customer.id;
        await updateStripeCustomerId(customerId, userId)
      }
      const payment_method = payment_method_types == '1' ? ['card'] : ['twint']

      const amountInCents = Math.round(amount * 100);

      // Create Checkout session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: payment_method_types == '1' ? ['card'] : ['twint'],
        mode: 'payment',
        customer: customerId,
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: { name: 'Order Payment' },
              unit_amount: amountInCents // amount in cents
            },
            quantity: 1
          }
        ],
        success_url: `${process.env.baseUrl}amount_add_successfull?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}&amount=${amount}&totalAmount=${amount}&payment_method=${payment_method}&offer_id=${offer_id}&id=${id}`,
        cancel_url: `${process.env.baseUrl}amount_add_cancelled?session_id={CHECKOUT_SESSION_ID}`,
        saved_payment_method_options: {
          payment_method_save: 'enabled',
        },
      });

      res.json({ url: session.url });
    } else {
      return res.status(404).json({
        error: true,
        message: "User not found. Please provide a correct ID.",
        status: 404,
        success: false,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getSavedCards = async (req, res) => {
  try {
    const userId = req.user.id;
    // Retrieve or create a Stripe customer
    const user = await fetchUserById(userId);
    const customerId = user[0].stripe_customer_id;

    if (!customerId) {
      return res.status(200).json({
        error: true,
        message: 'No Stripe customer found for the given user.',
        status: 404,
        success: false
      });
    }

    // Fetch saved cards from Stripe
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });

    // Respond with the list of saved cards
    res.json(paymentMethods.data);
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.payWithSavedCard = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethodId, amount, currency, offerId, id } = req.body;
    // Retrieve Stripe customer ID from your database
    const user = await fetchUserById(userId);
    const customerId = user[0].stripe_customer_id;

    if (!customerId) {
      return res.status(404).json({
        error: true,
        message: 'No Stripe customer found for the given user.',
        status: 404,
        success: false
      });
    }

    const amountInCents = Math.round(amount * 100);

    // Create a PaymentIntent with the saved payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, // amount in cents
      currency: currency,
      customer: customerId,
      payment_method: paymentMethodId,
      off_session: true, // to charge without requiring card details again
      confirm: true,     // confirms and attempts to complete the payment
      metadata: { offerId } // Pass the offer ID as metadata
    });

    // Update offer status in database as 'paid' after successful payment
    if (paymentIntent.status === 'succeeded') {
      const status = '1'
      const payment_date = moment().tz('Europe/Zurich').format('YYYY-MM-DD HH:mm:ss')
      const payment_method = 'card'
      await updateUserCommissinFees(userId, offerId, status, payment_method, paymentMethodId, payment_date, currency, id)
      res.json({ success: true, message: 'Payment successful' });
    } else {
      res.json({ success: false, message: 'Payment requires further action' });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getnotificationByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await getNotificationsByUserId(userId);
    if (notifications.length > 0) {
      return res.json({
        message: "fetch user all notification",
        status: 200,
        success: true,
        data: notifications,
      });
    } else {
      return res.json({
        error: true,
        message: "Notification not found",
        status: 200,
        success: false,
        data: []
      });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.updatenotificationByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateNotificaton = await updateData('tbl_user_notifications', `WHERE user_id = ${userId}`, req.body);
    if (updateNotificaton.affectedRows > 0) {
      return res.json({
        message: "Update successfully",
        status: 200,
        success: true,
        data: updateNotificaton,
      });
    } else {
      return res.json({
        error: true,
        message: "Update failed",
        status: 200,
        success: false,
        data: []
      });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.addCrad = async (req, res) => {
  try {
    const user = req.user;
    const { paymentMethodId } = req.body;

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.user_name
      });
      customerId = customer.id;
      await updateStripeCustomerId(customerId, user.id)
    }

    // Attach the payment method to the customer
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });

    // Update the default payment method for the customer
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethod.id },
    });

    res.status(200).json({ message: 'Card added successfully', paymentMethod });
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.deleteCard = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    // Detach the card from the customer
    const detachedPaymentMethod = await stripe.paymentMethods.detach(paymentMethodId);

    res.status(200).json({
      message: 'Card deleted successfully',
      paymentMethod: detachedPaymentMethod,
      error: false,
      success: true
    });
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.addSearch = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search } = req.body;
    const schema = Joi.object({
      search: Joi.string().required().messages({
        'string.base': 'Search must be a string',
        'string.empty': 'Search is required',
        'any.required': 'Search is required',
      }),
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
      const add = {
        user_id: userId,
        search: search
      }
      const insertResult = await addSearch(add);
      if (insertResult.affectedRows > 0) {
        return res.status(200).json({ error: false, message: "Successfully add", status: 200, success: true });
      } else {
        return res.status(200).json({ error: true, message: "Not add", status: 200, success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getSearch = async (req, res) => {
  try {
    const userId = req.user.id;
    const findResult = await getSearchById(userId);
    if (findResult.length > 0) {
      return res.json({
        message: "fetch user all search",
        status: 200,
        success: true,
        data: findResult,
      });
    } else {
      return res.json({
        error: true,
        message: "Search not found",
        status: 200,
        success: false,
        data: []
      });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.addFollowUp = async (req, res) => {
  try {
    const userId = req.user.id;
    const { follow_user_id } = req.body;
    const schema = Joi.object({
      follow_user_id: Joi.number().required().messages({
        'number.base': 'User id must be a number',
        'number.empty': 'User id is required',
        'any.required': 'User id is required',
      }),
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
      const add = {
        user_id: userId,
        follow_user_id: follow_user_id
      }
      const insertResult = await addFollowUpByUser(add);
      if (insertResult.affectedRows > 0) {
        return res.status(200).json({ error: false, message: "Successfully add", status: 200, success: true });
      } else {
        return res.status(200).json({ error: true, message: "Not add", status: 200, success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getFollowUp = async (req, res) => {
  try {
    const userId = req.user.id;
    const findResult = await getFollowupById(userId);
    if (findResult.length > 0) {
      return res.json({
        message: "fetch user all followup",
        status: 200,
        success: true,
        data: findResult,
      });
    } else {
      return res.json({
        error: true,
        message: "FollowUp not found",
        status: 200,
        success: false,
        data: []
      });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.deleteFollowup = async (req, res) => {
  try {
    const {id} = req.query;
    const schema = Joi.alternatives(
      Joi.object({
        id: Joi.number().required().empty(),
      })
    );
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
      const deleteResult = await deleteFollowupById(id);      
      if (deleteResult.affectedRows > 0) {
        return res.status(200).json({ error: false, message: "Successfully unfollowed.", status: 200, success: true });
      } else {
        return res.status(200).json({ error: true, message: "Already unfollowed. Please follow again.", status: 200, success: false });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
}

exports.getUserById = async (req, res) => {
  try {
    const { user_id } = req.query;
    const findUser = await getUserById(user_id);
    if (findUser.length > 0) {
      delete findUser[0].password;
      delete findUser[0].token;
      delete findUser[0].fcm_token;
      delete findUser[0].stripe_customer_id;
      return res.status(200).json({ error: false, message: "User data retrieved successfully.", status: 200, success: true, data: findUser[0] });
    } else {
      return res.status(200).json({ error: true, message: "User not found.", status: 200, success: false, data: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.addAccountDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { account_no, holder_name, holder_address, holder_message } = req.body;

    // Validate input using Joi
    const schema = Joi.object({
      account_no: Joi.string().allow('').optional().messages({
        'string.base': 'Account number must be a string',
        'string.empty': 'Account number cannot be empty',
      }),
      holder_name: Joi.string().min(3).allow('').optional().messages({
        'string.base': 'Holder name must be a string',
        'string.min': 'Holder name must be at least 3 characters long',
      }),
      holder_address: Joi.string().allow('').optional().messages({
        'string.base': 'Holder address must be a string',
      }),
      holder_message: Joi.string().allow('').optional().messages({
        'string.base': 'Holder message must be a string',
      }),
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
      const updateResult = await updateAccountDetails(userId, account_no, holder_name, holder_address, holder_message);
      if (updateResult.affectedRows > 0) {
        return res.status(200).json({
          error: false, message: 'Account details add successfully', success: true, status: 200
        });
      } else {
        return res.status(200).json({ error: true, message: 'Failed to add account details. Please check the information provided.', success: false, status: 200 });
      }
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};

exports.getAccountDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const accountResult = await fetchUserById(userId);
    if (accountResult.length > 0) {
      return res.status(200).json({
        error: false, message: "Successfully get account details", status: 200, success: true, data: {
          account_no: accountResult[0].account_no,
          holder_name: accountResult[0].holder_name,
          holder_address: accountResult[0].holder_address,
          holder_message: accountResult[0].holder_message
        }
      });
    } else {
      return res.status(200).json({ error: true, message: "Account details not found", status: 200, success: false, data: [] });
    }
  } catch (error) {
    return res.status(500).json({ error: true, message: `Internal server error + ' ' + ${error}`, status: 500, success: false });
  }
};