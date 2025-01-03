import Note from "../models/Note.js"; // Default export
import { ChatOpenAI } from "@langchain/openai";
import fs from "fs";
import fetch from "node-fetch";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg"; // Install via npm

// Configure Multer for handling voice input
const upload = multer({ dest: "uploads/" });

// Hugging Face API Key
const HUGGING_FACE_API_KEY = "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";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";

/**
 * Preprocess the audio file: Convert to WAV format, mono, 16kHz sample rate.
 * @param {string} inputPath - Path to the input audio file
 * @returns {Promise<string>} - Path to the processed audio file
 */
async function preprocessAudio(inputPath) {
  const outputPath = inputPath.replace(/\.[^/.]+$/, "") + "_processed.wav";

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("wav") // Convert to WAV
      .audioFrequency(16000) // Set sample rate to 16kHz
      .audioChannels(1) // Convert to mono
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err))
      .save(outputPath);
  });
}

/**
 * Transcribe audio to text using Hugging Face's Whisper model.
 * @param {string} audioPath - Path to the audio file
 * @returns {Promise<string>} - Transcribed text
 */
async function transcribeAudio(audioPath) {
  try {
    const processedAudioPath = await preprocessAudio(audioPath);
    const audioData = fs.readFileSync(processedAudioPath);

    let retries = 5; // Retry up to 5 times
    let response;
    let result;

    while (retries > 0) {
      console.log("Sending audio to Hugging Face for transcription...");
      response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-base", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
          "Content-Type": "audio/wav",
        },
        body: audioData,
      });

      result = await response.json();

      if (response.ok) {
        // Transcription successful
        console.log("Transcription successful!");
        return result.text || result.predicted_text;
      } else if (result.error && result.error.includes("currently loading")) {
        // Model is still loading; wait and retry
        console.warn(`Model is loading, retrying in 20 seconds... (${retries} retries left)`);
        await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait 20 seconds
        retries--;
      } else {
        // Some other error occurred
        console.error("Full API Response:", result);
        throw new Error(`API Error (${response.status}): ${JSON.stringify(result)}`);
      }
    }

    // If retries are exhausted
    throw new Error("Model failed to load after multiple attempts.");
  } catch (error) {
    console.error("Error during transcription:", error.message);
    throw error;
  }
}


/**
 * Handle text-based chat with notes
 */
export async function chatWithNotes(req, res) {
  try {
    const { notesId, query } = req.body;
    const note = await Note.findById(notesId); // Use Note model directly
    if (!note) return res.status(404).json({ message: "Note not found" });

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      openAIApiKey: OPENAI_API_KEY,
    });

    const response = await model.invoke([
      {
        role: "user",
        content: `Using the following notes:\n${note.extractedText}\nAnswer this question: ${query}`,
      },
    ]);

    res.json({ success: true, response: response.content });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Handle voice input for chat
 */
export async function handleVoiceChat(req, res) {
  try {
    const audioFilePath = req.file.path; // Audio file uploaded via Multer

    // Transcribe audio to text using Hugging Face Whisper API
    const transcribedText = await transcribeAudio(audioFilePath);

    const model = new ChatOpenAI({
      model: "gpt-4o-mini",
      openAIApiKey: OPENAI_API_KEY,
    });

    // Generate chatbot response using transcribed text
    const response = await model.invoke([
      {
        role: "user",
        content: `${transcribedText}`,
      },
    ]);

    res.json({
      success: true,
      transcription: transcribedText,
      response: response.content,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}