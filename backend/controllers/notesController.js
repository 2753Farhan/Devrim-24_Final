import Note from "../models/Note.js"; // Correct import
import tesseract from "tesseract.js"; // Correct Tesseract import
import cloudinary from "../config/cloudinaryConfig.js"; // Cloudinary uploader
import pdfParse from "pdf-parse"; // For PDF text extraction
import mime from "mime-types"; // To detect file MIME type
import fs from "fs";
import path from "path";

export async function uploadNotes(req, res) {
  try {
    const filePath = req.file.path;
    const fileExtension = path.extname(filePath).toLowerCase();
    const mimeType = mime.lookup(filePath);

    console.log("Received file path:", filePath);
    console.log("File extension:", fileExtension);
    console.log("Detected MIME type:", mimeType);

    let extractedText = "";

    // Handle PDF files
    if (fileExtension === ".pdf" || mimeType === "application/pdf") {
      console.log("Processing PDF file...");

      // Extract text using pdf-parse
      const pdfBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text;

      console.log("Extracted text from PDF:", extractedText);
    } else if (mimeType.startsWith("image/")) {
      console.log("Processing image file...");

      // Extract text using Tesseract
      const { data: { text } } = await tesseract.recognize(filePath, "eng");
      extractedText = text;

      console.log("Extracted text from image:", extractedText);
    } else {
      throw new Error("Unsupported file type. Only PDFs and images are supported.");
    }

    // Upload the file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(filePath, {
      resource_type: "raw",
    });

    // Save to MongoDB
    const note = await Note.create({
      userId: "defaultUser",
      fileName: req.file.originalname,
      fileUrl: cloudinaryResponse.url,
      extractedText,
    });

    res.json({ success: true, note });
  } catch (error) {
    console.error("Error occurred during note upload:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
