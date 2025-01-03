import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for the story"],
  },
  content: {
    type: String,
    required: [true, "Please provide the story content"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Story = mongoose.model("Story", storySchema);
