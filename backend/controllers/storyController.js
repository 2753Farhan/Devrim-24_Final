import { imageToText, textToVoice } from "../utils/huggingFaceUtils.js";
import { generateStory } from "../utils/storyGenerator.js";
import fs from "fs";

/**
 * Process image to generate a story and convert it to voice.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export async function processImage(req, res) {
  try {
    const filePath = req.file.path;
    const apiKey = process.env.HUGGING_FACE_API_KEY;

    // Convert image to text
    const imageBuffer = fs.readFileSync(filePath);
    const extractedText = await imageToText(imageBuffer, apiKey);

    // Generate a story from the extracted text
    const story = await generateStory(extractedText);

    // Convert story to voice
    const audioBuffer = await textToVoice(story, apiKey);

    // Send the audio file as a response
    res.set("Content-Type", "audio/mpeg");
    res.send(audioBuffer);
  } catch (error) {
    console.error("Error processing image:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
