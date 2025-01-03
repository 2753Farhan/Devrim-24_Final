import Note from "../models/Note.js"; // Default export
import { ChatOpenAI } from "@langchain/openai";

export async function chatWithNotes(req, res) {
  try {
    const { notesId, query } = req.body;
    const note = await Note.findById(notesId); // Use Note model directly
    if (!note) return res.status(404).json({ message: "Note not found" });

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const response = await model.invoke([
      { role: "user", content: `Using the following notes:\n${note.extractedText}\nAnswer this question: ${query}` },
    ]);

    res.json({ success: true, response: response.content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
