import express from "express";
import { convertBanglishToBangla } from "../controllers/convertController.js";

const router = express.Router();

// Route for Banglish to Bangla conversion
router.post("/convert", convertBanglishToBangla);

export default router;
