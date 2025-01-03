// Import required modules
import { ChatGroq } from "@langchain/groq";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Instantiate the Groq model
const model = new ChatGroq({
  model: "mixtral-8x7b-32768", // Groq model name
  temperature: 0,              // Control creativity (0 for deterministic)
  groqApiKey: process.env.GROQ_API_KEY, // Your Groq API key
});

// Define messages for the chat
const messages = [
  new SystemMessage("Translate the following from English into Bangla"), // System instruction
  new HumanMessage("Hello, how are you?"), // User input
];

// Main function to invoke the model
async function runChat() {
  try {
    const response = await model.invoke(messages);
    console.log("Response from Groq Model:");
    console.log(response.content);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Execute the function
runChat();
