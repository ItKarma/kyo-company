import userModel from "../models/User.js";

class UserRepository {
  /**
   * params for register in db
   * @param {String} name
   * @param {Number} idUser
   * @param {String} userName
   */

  async saveUser(first_name, id, username,balance) {

    return await userModel.create({ first_name, idUser: id, username, balance });
  }

  /**
   * params for find user  in db
   * @param {Number} idUser
   * @return { Promise<String>}
   */

  async findUser(id) {
    const user =  await userModel.findOne({ idUser: id });
    if(null){
      return false
    }
    return user
  }

  /**
   * function for change users balance
   * @param {Number} idUser
   * @param {Number} balance
   */

  async changebalance(idUser, balance) {
    const value = await userModel.findOneAndUpdate(
      { idUser },
      { $set: { balance : balance } },
      { upsert: true }
    );
    return value;
  }

  async changeVip(idUser) {
    const value = await userModel.findOneAndUpdate(
      { idUser },
      { $set: { isVip : true } },
      { upsert: true }
    );
    return value;
  }

    /**
   * function for change users adm
   * @param {Number} idUser
   */

    async promoAdm(idUser) {
      const value = await userModel.findOneAndUpdate(
        { idUser },
        { $set: { isAdmin : true } },
        { upsert: true }
      );
      return value;
    }
}

export default new UserRepository();
