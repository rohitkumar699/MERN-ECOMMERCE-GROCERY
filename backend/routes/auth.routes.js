import express from "express";
import {
  checkAuth,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", isAuth, logout);
authRouter.get("/is-auth", isAuth, checkAuth);
export default authRouter;
