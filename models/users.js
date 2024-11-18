const db = require("../utils/database");
module.exports = {
  addUser: async (user) => {
    return db.query("insert into users set ?", [user]);
  },
  fetchUserByEmail: async (email) => {
    return db.query("select * from users where  email = ?", [email]);
  },

  fetchUserToken: async (token) => {
    return db.query("select * from users where act_token=?", [token]);
  },

  fetchTokenOfUser: async (token) => {
    return db.query("select * from users where token=?", [token]);
  },

  updateUser: async (token, email) => {
    return db.query("Update users set token=? where email=?", [token, email]);
  },

  updateVerifyUser: async (user, id) => {
    return db.query("update users set ? where id = ?", [user, id]);
  },

  updateUserbyPass: async (password, user_id) => {
    return db.query("Update users set password=? where  id =?", [
      password,
      user_id,
    ]);
  },

  addUserNotificartion: async (id) => {
    return await db.query('INSERT INTO `tbl_user_notifications`(`user_id`) VALUES (?)', [id]);
  },

  fetchUserById: async (id) => {
    return await db.query("select * from users where id = ?", [id]);
  },

  updateStripeCustomerId: async (customerId, userId) => {
    return await db.query('UPDATE users SET stripe_customer_id = ? WHERE id = ?', [customerId, userId])
  },

  fetchAlluser: async () => {
    return db.query("select * from  users");
  },

  deleteUser: async (user_id) => {
    return db.query("Delete  From  users where id = ?", [user_id]);
  },

  updPasswdByToken: async (password, token) => {
    return db.query("Update users set password=? where token=?", [
      password,
      token,
    ]);
  },

  // fetchUserByEmailPassword :(async (loginCred) => {
  //     console.log(loginCred.hashPassword);
  //     return db.query('select * from tbl_users where email = ? and password = ?',[loginCred.email, loginCred.hashPassword])
  // }),

  updateLoginStatusByEmail: async (email) => {
    return db.query('update users set login_status="1" where email = ?', [
      email,
    ]);
  },

  tokenUpdate: async (token, fcm_token, id) => {
    return db.query("update users set token=?,fcm_token = ?  where id=?", [token, fcm_token, id]);
  },

  updateUserById: async (user, id) => {
    return db.query("update users set ? where id = ?", [user, id]);
  },

  insertRoleId: async (data) => {
    return db.query("insert into user_roles set ?", [data]);
  },

  getRoleID: async (user_id) => {
    return db.query("select role_id from user_roles where user_id=?", [
      user_id,
    ]);
  },

  getUserRole: async (role_id) => {
    return db.query(
      "select role_type, role_id from role_types where role_id=?",
      [role_id]
    );
  },

  insertUserProfileM: async (data) => {
    return db.query("insert into user_profile set ?", [data]);
  },

  updateUserProfile: async (data) => {
    return db.query(
      "update user_profile set profile_name=?, address=?,city=?,state=?,country=? where user_id= ?",
      [data.profile_name, data.address, data.city, data.state, data.country, data.user_id]
    );
  },

  updateUserM: async (data) => {
    return db.query("update users set address=?, city=?, state=?, country= ?  where id= ?", [
      data.address,
      data.city,
      data.state,
      data.state,
      data.user_id
    ]);
  },

  getuserProfileDetails: async (user_id) => {
    return await db.query("select * from users where id = ?", [
      user_id
    ]);
  },

  getUserNamebyId: async (id) => {
    return db.query(`select concat(first_name, ' ', last_name) as name from  users where  id=${id}`);
  },

  getAllMessageByUserId: async (id) => {
    return db.query(`SELECT CONCAT(users.first_name, ' ', users.last_name) AS full_name, users.online_status, tbl_messages.* FROM tbl_messages LEFT JOIN users ON users.id = tbl_messages.user_id WHERE tbl_messages.user_id = ${id} ORDER BY tbl_messages.created_at;`);
  },

  updateMessageCount: async (id) => {
    return await db.query('UPDATE `tbl_messages` SET `is_read` = "1" WHERE user_id = "' + id + '"');
  },

  updateUserCommissinFees: async (userId, offerId, status, payment_method, paymentMethodId, payment_date, currency) => {
    return await db.query('UPDATE `tbl_user_commissin_fees` SET `payment_type`= "' + payment_method + '", `payment_id` = "' + paymentMethodId + '", `payment_date` = "' + payment_date + '", `currency` = "' + currency + '", `status` = "' + status + '" WHERE offer_id = "' + offerId + '" AND seller_id = "' + userId + '"');
  },

  getNotificationsByUserId: async (id) => {
    return await db.query('SELECT * FROM `tbl_user_notifications` WHERE user_id = ?', [id]);
  },

  addSearch: async (data) => {
    return await db.query('INSERT INTO `tbl_search` SET ?', [data]);
  },

  getSearchById: async (id) => {
    return await db.query('SELECT * FROM `tbl_search` WHERE user_id = ? ORDER BY id DESC', [id]);
  }

};
