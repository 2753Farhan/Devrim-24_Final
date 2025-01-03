import express from "express";
import { addStory, getTeacherStories } from "../controllers/storyController.js";
import { isAuthenticated } from "../middleware/auth.js";
import { handleVoiceChat } from "../controllers/voiceToTextController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

// Add a story
router.post("/add", isAuthenticated, addStory);

// Get all stories by the logged-in teacher
router.get("/my-stories", isAuthenticated, getTeacherStories);
router.post("/voice", upload.single("audio"), handleVoiceChat);

export default router;
