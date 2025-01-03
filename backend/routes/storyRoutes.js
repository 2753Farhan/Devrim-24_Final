import { Router } from "express";
import multer from "multer";
import { processImage } from "../controllers/storyController.js";

// Multer setup for file uploads
const upload = multer({ dest: "uploads/" });

const router = Router();

// Route to process image and generate audio story
router.post("/process-image", upload.single("file"), processImage);

export default router;
