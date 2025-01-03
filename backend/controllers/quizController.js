import Note from "../models/Note.js"; // Correct import
import Quiz from "../models/Quiz.js"; // Correct import
import { ChatGroq } from "@langchain/groq";

export async function generateQuiz(req, res) {
  try {
    const { notesId } = req.body;

    // Find the notes by ID
    const note = await Note.findById(notesId);
    if (!note) return res.status(404).json({ message: "Note not found" });

    // Initialize LangChain with Groq model
    const model = new ChatGroq({
      model: "mixtral-8x7b-32768",
      groqApiKey: process.env.GROQ_API_KEY,
    });

    // Generate quiz content
    const response = await model.invoke([
      { role: "user", content: `Generate a quiz from the following notes:\n${note.extractedText}` },
    ]);

    // Save the generated quiz to MongoDB
    const quiz = await Quiz.create({
      notesId: notesId,
      quiz: response.content, // Assuming the response content is a string
    });

    res.json({ success: true, quiz });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
