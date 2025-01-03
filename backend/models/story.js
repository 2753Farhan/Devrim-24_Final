import mongoose from "mongoose";

const StorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export the model using a named export
export const Story = mongoose.model("Story", StorySchema);
