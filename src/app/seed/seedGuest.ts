import config from "../config/config";
import { USER_ROLE } from "../interfaces/app.types";
import { TUser } from "../modules/user/user.interfaces";
import { UserModel } from "../modules/user/user.model";

const guest: TUser = {
  userId: "guest123",
  email: "guest123@gmail.com",
  mobile: "01779137133",
  password: config.guest_pass as string,
};

export const seedGuest = async () => {
  const isGuestExist = await UserModel.findOne({
    role: USER_ROLE.guest,
  });
  if (!isGuestExist) {
    await UserModel.create([guest]);
  }
};
