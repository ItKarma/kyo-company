import userModel from "../models/User.js";
import GiftModel from "../models/GiftModel.js";

class UserRepository {
  /**
   * params for register in db
   * @param {String} name
   * @param {Number} idUser
   * @param {String} userName
   */

  async saveUser(first_name, id, username, balance) {

    try {
      return await userModel.create({ first_name, idUser: id, username, balance });
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * params for find user  in db
   * @param {Number} id
   * @return { Promise<String>}
   */

  async findUser(id) {
    try {
      const user = await userModel.findOne({ idUser: id });
      if (!user) {
        return false
      }
      return user
    } catch (error) {
      console.log(error)
    }
  }

  async blockUserById(idUser) {
    const value = await userModel.findOneAndUpdate(
      { idUser },
      { $set: { bloq: true } },
      { upsert: true }
    );
    return value;
  }

  async unblockUserById(idUser) {
    const value = await userModel.findOneAndUpdate(
      { idUser },
      { $set: { bloq: false } },
      { upsert: true }
    );
    return value;
  }

  async findUserByUsername(username) {
    try {
      const user = await userModel.findOne({ username: username });
      if (null) {
        return false
      }
      return user
    } catch (error) {
      console.log(error)
    }
  }

  async findAllUsers() {
    try {
      const user = await userModel.find();
      if (!user) {
        return false
      }
      return user
    } catch (error) {
      console.log(error)
    }
  }



  /**
   * function for change users balance
   * @param {Number} idUser
   * @param {Number} balance
   */

  async changebalance(idUser, balance) {
    const value = await userModel.findOneAndUpdate(
      { idUser },
      { $set: { balance: balance } },
      { upsert: true }
    );
    return value;
  }

  /**
   * 
   * @param {Number} userId 
   * @param {String} newPlan 
   * @returns 
   */

  
  async upgradeUserSubscription (username, newPlan) {

    const user = await userModel.findOne({ username: username });
    console.log(user)

    if (!user) {
        console.log('Usuário não encontrado');
        return;
    }

    // Atualizar o plano de assinatura
    user.subscription.plan = newPlan;
    user.subscription.startDate = new Date();
    user.subscription.status = 'active';

    // Recalcular a data de término com base no novo plano
    user.calculateEndDate(newPlan);

    // Salvar as alterações no banco de dados
    await user.save();

    console.log('Assinatura do usuário atualizada:', user);

    return user;
};


  /**
 * function for change users adm
 * @param {Number} idUser
 */

  async promoAdm(idUser) {
    const value = await userModel.findOneAndUpdate(
      { idUser },
      { $set: { isAdmin: true } },
      { upsert: true }
    );
    return value;
  }

  async GiftValid(codegift) {
    try {
      const code = await GiftModel.findOne({ code: codegift });
      return code;
    } catch (error) {
      console.log(error)
    }
  }


  async UpdateGift(userId, codeGift) {
    try {
      const updatedGift = await GiftModel.findOneAndUpdate(
        { code: codeGift }, // Encontra o gift pelo código fornecido
        {
          $set: {
            used: true,
            redeemedBy: userId
          }
        }, // Atualiza os campos `used` e `redeemedBy`
        { new: true } // Retorna o documento atualizado
      );

      return updatedGift;
    } catch (error) {
      console.error('Erro ao atualizar o gift:', error);
      throw error; // Lança o erro para ser tratado por quem chamou
    }
  }
}

export default new UserRepository();
