import express from "express";
import { userAuthController } from "../controllers/auth.controller";


const router = express.Router();

router.route("/register").post(userAuthController.register)
router.route("/login").post(userAuthController.login)
router.route("/findUser").get(userAuthController.findUser)



export default router;
