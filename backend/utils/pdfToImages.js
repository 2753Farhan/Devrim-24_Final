import pdf from "pdf-poppler";
import path from "path";
import fs from "fs";

/**
 * Convert PDF to images
 * @param {string} inputPdf - Path to the input PDF file
 * @param {string} outputDir - Directory to save the extracted images
 * @return {Promise<string[]>} - Array of paths to generated image files
 */
export async function pdfToImages(inputPdf, outputDir) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const options = {
    format: "jpeg",
    out_dir: outputDir,
    out_prefix: path.basename(inputPdf, path.extname(inputPdf)),
    page: null, // Convert all pages
  };

  try {
    await pdf.convert(inputPdf, options);
    const imageFiles = fs.readdirSync(outputDir).filter((file) => file.endsWith(".jpg"));
    const imagePaths = imageFiles.map((file) => path.join(outputDir, file));
    return imagePaths;
  } catch (error) {
    throw new Error(`Failed to convert PDF to images: ${error.message}`);
  }
}
