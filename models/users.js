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
    return db.query(`select concat(first_name, ' ', last_name) as name, profile_image from  users where  id=${id}`);
  },

  getAllMessageByUserId: async (id) => {
    return db.query(`SELECT CONCAT(users.first_name, ' ', users.last_name) AS full_name, users.profile_image, users.online_status, tbl_messages.* FROM tbl_messages LEFT JOIN users ON users.id = tbl_messages.user_id WHERE tbl_messages.user_id = ${id} ORDER BY tbl_messages.created_at;`);
  },

  updateMessageCount: async (id) => {
    return await db.query('UPDATE `tbl_messages` SET `is_read` = "1" WHERE user_id = "' + id + '"');
  },

  updateUserCommissinFees: async (userId, offerId, status, payment_method, paymentMethodId, payment_date, currency, id) => {
    return await db.query('UPDATE `tbl_user_commissin_fees` SET `payment_type`= "' + payment_method + '", `payment_id` = "' + paymentMethodId + '", `payment_date` = "' + payment_date + '", `currency` = "' + currency + '", `status` = "' + status + '" WHERE id = "' + id + '"');
  },

  getNotificationsByUserId: async (id) => {
    return await db.query('SELECT * FROM `tbl_user_notifications` WHERE user_id = ?', [id]);
  },

  addSearch: async (data) => {
    return await db.query('INSERT INTO `tbl_search` SET ?', [data]);
  },

  getSearchById: async (id) => {
    return await db.query('SELECT * FROM `tbl_search` WHERE user_id = ? ORDER BY id DESC', [id]);
  },

  addFollowUpByUser: async (data) => {
    return await db.query('INSERT INTO `tbl_followup` SET ?', [data]);
  },

  getFollowupById: async (id) => {
    return await db.query('SELECT tbl_followup.*, users.user_name, users.profile_image AS user_profile_image FROM `tbl_followup` LEFT JOIN users ON users.id = tbl_followup.follow_user_id WHERE user_id = ? ORDER BY tbl_followup.id DESC', [id]);
  },

  deleteFollowupById: async (id) => {
    return await db.query('DELETE FROM `tbl_followup` WHERE id = ?', [id]);
  },

  getUserById: async (id) => {
    return await db.query('SELECT users.*, COUNT(buy_sell_transactions.seller_id) AS seller_count FROM users LEFT JOIN buy_sell_transactions ON buy_sell_transactions.seller_id = users.id WHERE users.id = ?', [id]);
  },

  updateAccountDetails: async (userId, account_no, holder_name, holder_address, holder_message) => {
    const fieldsToUpdate = [];
    const values = [];

    // Add fields to update dynamically
    if (account_no !== undefined && account_no !== '') {
      fieldsToUpdate.push('account_no = ?');
      values.push(account_no);
    }
    if (holder_name !== undefined && holder_name !== '') {
      fieldsToUpdate.push('holder_name = ?');
      values.push(holder_name);
    }
    if (holder_address !== undefined && holder_address !== '') {
      fieldsToUpdate.push('holder_address = ?');
      values.push(holder_address);
    }
    if (holder_message !== undefined && holder_message !== '') {
      fieldsToUpdate.push('holder_message = ?');
      values.push(holder_message === '' ? null : holder_message);
    }

    // Ensure there's something to update
    if (fieldsToUpdate.length === 0) {
      throw new Error('No fields provided for update');
    }

    // Add user ID for the WHERE clause
    values.push(userId);

    const query = `
      UPDATE users
      SET ${fieldsToUpdate.join(', ')}
      WHERE id = ?
    `;

    // Execute the query with parameterized values
    return await db.query(query, values);
  },

  fetchNotificationMessage: async (user_id) => {
    return await db.query('SELECT *, DATE_FORMAT(created_at, "%d %M %Y, %h:%i %p") AS message_date FROM `tbl_notification_messages` WHERE user_id = "' + user_id + '" AND is_read = "0" ORDER BY id DESC;');
  },

  updateNotificationMessageByUserId: async (id, userId) => {
    if (id == '' || id == 'null') {
      return await db.query('UPDATE `tbl_notification_messages` SET is_read = "1" WHERE user_id = "' + userId + '"');
    } else {
      return await db.query('UPDATE `tbl_notification_messages` SET is_read = "1" WHERE id = "' + id + '" AND user_id = "' + userId + '"');
    }
  },

  updateFileById: async (userId, file_name) => {
    return await db.query('UPDATE `users` SET `profile_image`= ? WHERE id = ?', [file_name, userId])
  }

};
