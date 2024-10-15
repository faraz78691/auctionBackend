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

  fetchUserById: async (id) => {
    return db.query("select * from users where id = ?", [id]);
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

  tokenUpdate: async (token, id) => {
    return db.query("update users set token=? where id=?", [token, id]);
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
    return db.query("select * from  user_profile where  user_id=?", [
      user_id
    ]);
  },

  getUserNamebyId: async (id) => {
    return db.query(`select concat(first_name, " ", last_name) as name from  users where  id=${id}`);
  },

  getAllMessageByUserId: async (id) => {
    return db.query(`SELECT CONCAT(users.first_name, ' ', users.last_name) AS full_name, users.online_status, tbl_messages.* FROM tbl_messages LEFT JOIN users ON users.id = tbl_messages.user_id WHERE tbl_messages.user_id = ${id} ORDER BY tbl_messages.created_at;`);
  }

};
