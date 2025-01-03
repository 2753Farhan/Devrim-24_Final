import express from "express";
import { login, register, logout ,forgot_password, reset_password} from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgot_password);
router.post("/reset-password/:id/:token",reset_password)
router.get("/logout", isAuthenticated, logout);


export default router;
