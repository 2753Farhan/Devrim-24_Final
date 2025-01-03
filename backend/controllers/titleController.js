import { ChatOpenAI } from "@langchain/openai";

export const generateTitle = async (req, res) => {
  const { story } = req.body;

  if (!story || !story.trim()) {
    return res.status(400).json({ message: "Story content is required." });
  }

  try {
    // Initialize OpenAI with LangChain
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Generate title using OpenAI
    const response = await model.invoke([
      { role: "user", content: `Generate a suitable title for this story:\n${story}` },
    ]);

    const title = response.content.trim();
    res.status(200).json({ success: true, title });
  } catch (error) {
    console.error("Error generating title:", error);
    res.status(500).json({ success: false, error: "Failed to generate title." });
  }
};
