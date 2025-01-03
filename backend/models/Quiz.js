import { Schema, model } from "mongoose";

const QuizSchema = new Schema({
  notesId: { type: Schema.Types.ObjectId, ref: "Note" },
  quiz: [String],
  generatedAt: { type: Date, default: Date.now },
});

export default model("Quiz", QuizSchema);
