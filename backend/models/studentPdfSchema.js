import mongoose from "mongoose";

const studentPdfSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  story: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Story",
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  visibility: {
    type: String,
    enum: ["Public", "Private"],
    default: "Private",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const StudentPdf = mongoose.model("StudentPdf", studentPdfSchema);
