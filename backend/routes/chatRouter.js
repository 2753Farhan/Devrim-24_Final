import express from "express";
import { chatWithStory } from "../controllers/chatController.js";

const router = express.Router();

// Route for chatting about a specific story
router.post("/query-story", chatWithStory);

export default router;
