import { Schema, model } from "mongoose";

const NoteSchema = new Schema({
  userId: { type: String, required: true },
  fileName: String,
  fileUrl: String,
  extractedText: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default model("Note", NoteSchema);
