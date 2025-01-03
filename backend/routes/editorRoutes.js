import express from "express";
import { createStory } from "../controllers/editorController.js"; // Import the named export

const router = express.Router();

// Define your routes here
router.post("/stories", createStory);

export default router; // Use default export
