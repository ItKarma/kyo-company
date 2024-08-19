import userRepo from "../repository/userRepo.js";


export default async function changebalance(user, valor) {
    
    let newBalance = user.balance - valor
    await userRepo.changebalance(user.idUser, newBalance);
}