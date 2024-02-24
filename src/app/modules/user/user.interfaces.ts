export type TUser = {
  userId: string;
  email: string;
  mobile: string;
  password: string;
  needsPasswordChange?: boolean;
  role?: "admin" | "guest";
  status?: "in-progress" | "blocked";
  isDeleted?: boolean;
  passwordChangedAt?: Date;
};
