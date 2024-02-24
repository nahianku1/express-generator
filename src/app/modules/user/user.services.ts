import { TUser } from "./user.interfaces";
import { UserModel } from "./user.model";

const createUserIntoDB = async (payload: TUser) => {
  const result = UserModel.create([payload]);
  return result;
};

const getMeFromDB = async (userId: string, role: string) => {
  let result = null;
  if (role === "admin") {
    result = await UserModel.findById(userId);
  } else if (role === "guest") {
    result = await UserModel.findById(userId);
  }
  return result;
};

const updateUserIntoDB = async (id: string, payload: Partial<TUser>) => {
  const result = await UserModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteUserIntoDB = async (id: string) => {
  const result = await UserModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const UserServices = {
  createUserIntoDB,
  getMeFromDB,
  updateUserIntoDB,
  deleteUserIntoDB,
};
