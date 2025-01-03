import { Story } from "../models/story.js";

export const createStory = async (req, res) => {
  try {
    console.log("Request body:", req.body); // Log the incoming request
    const { content } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Content is required" });
    }

    const story = new Story({ content });
    await story.save();

    res.status(201).json({ message: "Story saved successfully", story });
  } catch (error) {
    console.error("Error saving story:", error); // Log any errors
    res.status(500).json({ error: "Internal server error" });
  }
};