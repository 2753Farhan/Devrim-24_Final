import {Story} from "../models/storySchema.js"; // Default export
import { ChatOpenAI } from "@langchain/openai";

export async function chatWithStory(req, res) {
  try {
    const { storyId, query } = req.body;

    // Validate input
    if (!storyId || !query) {
      return res.status(400).json({ message: "Story ID and query are required." });
    }

    // Fetch the story from the database
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ message: "Story not found" });
    }

    // Initialize OpenAI model
    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare and send the query to OpenAI
    const response = await model.invoke([
      {
        role: "user",
        content: `Using the following story:\nTitle: ${story.title}\nContent: ${story.content}\nAnswer this question  ${query} in bangla language`,
      },
    ]);

    // Respond with OpenAI's answer
    res.json({ success: true, response: response.content });
  } catch (error) {
    console.error("Error occurred in chatWithStory:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
