require('../utils/MongooseUtil');
const Models = require('./Models');

const AdminDAO = {
  async selectByUsernameAndPassword(username, password) {
    const query = { username: username, password: password };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async select_token_web_admin(token_web_admin) {
    const query = { $or: [ { token_web_admin: token_web_admin }] };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async update_token_web_admin(adminId,token_web_admin) {
    const newvalues = { token_web_admin: token_web_admin };
    const result = await Models.Admin.findByIdAndUpdate(adminId, newvalues, { new: true });
    return result;
  },
};
module.exports = AdminDAO;