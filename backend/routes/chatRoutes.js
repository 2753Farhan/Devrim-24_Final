import express from "express";
import { chatWithNotes, handleVoiceChat } from "../controllers/chatController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Route for text-based chat
router.post("/text", chatWithNotes);

// Route for voice-based chat
router.post("/voice", upload.single("audio"), handleVoiceChat);

export default router;
