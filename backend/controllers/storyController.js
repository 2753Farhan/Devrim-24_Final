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
