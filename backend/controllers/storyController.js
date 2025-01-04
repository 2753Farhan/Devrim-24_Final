import { catchAsyncErrors } from "../middleware/catchAsyncError.js";
import { Story } from "../models/storySchema.js";
import ErrorHandler from "../middleware/error.js";

// Add a new story
export const addStory = catchAsyncErrors(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  const story = await Story.create({
    title,
    content,
    author: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Story created successfully",
    story,
  });
});

// Get stories by a teacher
export const getTeacherStories = catchAsyncErrors(async (req, res, next) => {
  const stories = await Story.find({ author: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    stories,
  });
});


// Fetch all stories
export const getAllStories = async (req, res) => {
  try {
    const stories = await Story.find().select("title content"); // Fetch only required fields
    if (stories.length === 0) {
      return res.status(404).json({ success: false, message: "No stories found." });
    }
    res.status(200).json({ success: true, stories });
  } catch (error) {
    console.error("Error fetching stories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch stories." });
  }
};
