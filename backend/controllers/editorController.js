import { Story } from "../models/story.js"; // Use a named import

// Define and export the createStory function
export const createStory = async (req, res) => {
  try {
    const { title, content } = req.body;
    const story = new Story({ title, content });
    await story.save();
    res.status(201).json({ message: "Story saved successfully", story });
  } catch (error) {
    res.status(500).json({ error: "Failed to save story" });
  }
};
