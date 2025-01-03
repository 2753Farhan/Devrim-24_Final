import { ChatOpenAI } from "@langchain/openai";

// Banglish to Bangla Converter Controller
export const convertBanglishToBangla = async (req, res) => {
  const { banglishText } = req.body;

  if (!banglishText || !banglishText.trim()) {
    return res.status(400).json({ message: "Input text is required." });
  }

  try {
    // Initialize ChatGPT with LangChain
    const model = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Ask ChatGPT to convert Banglish to Bangla
    const response = await model.invoke([
      {
        role: "user",
        content: `Convert this Banglish text into proper Bangla without any explanation:\n"${banglishText}"`,
      },
    ]);

    const banglaText = response.content.trim();
    res.status(200).json({ success: true, banglaText });
  } catch (error) {
    console.error("Error converting Banglish to Bangla:", error);
    res.status(500).json({ success: false, message: "Conversion failed." });
  }
};
