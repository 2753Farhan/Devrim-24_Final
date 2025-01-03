import axios from "axios";

/**
 * Convert an image to text using Hugging Face API.
 * @param {Buffer} imageBuffer - The image file buffer.
 * @param {string} apiKey - Hugging Face API Key.
 * @return {Promise<string>} - Extracted text.
 */
export async function imageToText(imageBuffer, apiKey) {
  const modelUrl = "https://api-inference.huggingface.co/models/microsoft/layoutlmv3-base";
  try {
    const response = await axios.post(modelUrl, imageBuffer, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/octet-stream",
      },
    });
    return response.data.generated_text || "No text extracted.";
  } catch (error) {
    console.error("Hugging Face API Error:", error.response?.data || error.message);
    throw new Error(`Hugging Face Image-to-Text Error: ${error.response?.data?.error || error.message}`);
  }
}

/**
 * Convert text to voice using Hugging Face API.
 * @param {string} text - The input text.
 * @param {string} apiKey - Hugging Face API Key.
 * @return {Promise<Buffer>} - Audio file buffer.
 */
export async function textToVoice(text, apiKey) {
  const modelUrl = "https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech";
  try {
    const response = await axios.post(
      modelUrl,
      { inputs: text },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        responseType: "arraybuffer",
      }
    );
    return response.data; // Audio buffer
  } catch (error) {
    throw new Error(`Hugging Face Text-to-Voice Error: ${error.message}`);
  }
}
