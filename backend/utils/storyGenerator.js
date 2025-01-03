import { ChatGroq } from "@langchain/groq";

/**
 * Generate a story from extracted text using LangChain and Groq.
 * @param {string} text - The extracted text.
 * @return {Promise<string>} - Generated story.
 */
export async function generateStory(text) {
  const model = new ChatGroq({
    model: "mixtral-8x7b-32768",
    groqApiKey: process.env.GROQ_API_KEY,
  });

  const prompt = `Create a story based on the following input:\n\n${text}`;

  const response = await model.invoke([{ role: "user", content: prompt }]);
  return response.content || "No story generated.";
}
