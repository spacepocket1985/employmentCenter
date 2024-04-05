import express from "express";
import { userAuthController } from "../controllers/auth.controller";


const router = express.Router();

router.route("/signIn").post(userAuthController.register)



export default router;
