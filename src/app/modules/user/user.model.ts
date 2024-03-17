import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { TUser } from "./user.interfaces";
import config from "../../config/config";

export const userSchema = new Schema<TUser>(
  {
    userId: { type: String, required: true, unique: true },

    password: { type: String, maxLength: 20, select: 0 },

    mobile: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      required: true,
    },
    passwordChangedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password!, Number(config.bcrypt_salt));
  next();
});

export const UserModel = model<TUser>("User", userSchema);
