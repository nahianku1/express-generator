import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { flowerRouter } from "../modules/flower/flower.routes";

export const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },

  {
    path: "/flower",
    route: flowerRouter,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
