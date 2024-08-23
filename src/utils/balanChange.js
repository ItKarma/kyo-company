import userRepo from "../repository/userRepo.js";


export default async function changebalance(user, valor) {
    if(user.balance == 0){
        return
    }
    let newBalance = user.balance - valor
    await userRepo.changebalance(user.idUser, newBalance);
}