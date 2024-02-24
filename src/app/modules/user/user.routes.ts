import express from "express";
import { UserControllers } from "./user.controllers";
import { validateRequest } from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { ZodValidations } from "./user.validation";

export const userRouter = express.Router();

userRouter.post(
  "/create-user",
  auth("admin"),
  validateRequest(ZodValidations.createUserValidation),
  UserControllers.createUser
);

userRouter.put(
  "/update-user/:id",
  auth("admin"),
  [validateRequest(ZodValidations.updateUserValidation)],
  UserControllers.updateUser
);

userRouter.put("/delete-user/:id", auth("admin"), UserControllers.deleteUser);

userRouter.get("/me", auth("admin", "guest"), UserControllers.getMe);
