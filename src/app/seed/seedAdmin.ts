import config from "../config/config";
import { USER_ROLE } from "../interfaces/app.types";
import { TUser } from "../modules/user/user.interfaces";
import { UserModel } from "../modules/user/user.model";

const admin: TUser = {
  userId: "admin123",
  email: "admin123@gmail.com",
  mobile: "01779137132",
  password: config.admin_pass as string,
  role: "admin",
};

export const seedAdmin = async () => {
  const isAdminExist = await UserModel.findOne({
    role: USER_ROLE.admin,
  });
  if (!isAdminExist) {
    await UserModel.create([admin]);
  }
};
