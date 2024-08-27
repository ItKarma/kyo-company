import UserRepository from "../repository/userRepo.js";

async function checkUserPermission(user) {
  const UserTrue = await UserRepository.findUser(user.id);
  if (UserTrue.bloq) return false;
  return UserTrue;
}

export default checkUserPermission