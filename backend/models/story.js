import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Story = mongoose.model("Story", StorySchema);