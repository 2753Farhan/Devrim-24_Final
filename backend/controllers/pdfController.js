import { StudentPdf } from "../models/studentPdfSchema.js";
import { Story } from "../models/storySchema.js";
import PDFDocument from "pdfkit";
import cloudinary from "../config/cloudinaryConfig.js";

// Export content as a PDF
export const exportContentAsPdf = async (req, res) => {
  const { storyId, visibility } = req.body;

  try {
    // Validate input
    if (!storyId || !visibility) {
      return res.status(400).json({ success: false, message: "Story ID and visibility are required." });
    }

    // Fetch the story
    const story = await Story.findById(storyId);
    if (!story) {
      console.log("Invalid Story ID:", storyId);
      return res.status(404).json({ success: false, message: "Story not found." });
    }

    // Create the PDF
    const doc = new PDFDocument();
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(chunks);
      console.log("PDF buffer created. Size:", pdfBuffer.length);

      try {
        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: "raw", folder: "student_pdfs", format: "pdf" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                reject(error);
              } else {
                console.log("Cloudinary upload successful:", result);
                resolve(result);
              }
            }
          );
          stream.end(pdfBuffer);
        });

        // Save the metadata in the database
        const studentPdf = new StudentPdf({
          student: req.user._id,
          story: storyId,
          pdfUrl: uploadResponse.secure_url,
          visibility,
        });

        await studentPdf.save();
        res.status(201).json({
          success: true,
          message: "PDF exported successfully.",
          pdf: studentPdf,
        });
      } catch (uploadError) {
        console.error("Failed to upload PDF to Cloudinary:", uploadError);
        res.status(500).json({ success: false, message: "Failed to upload PDF to Cloudinary." });
      }
    });

    // Add content to the PDF
    doc.fontSize(20).text(story.title, { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(story.content, { align: "left" });
    doc.end();
  } catch (error) {
    console.error("Error in exportContentAsPdf:", error);
    res.status(500).json({ success: false, message: "Failed to export content as PDF." });
  }
};

// Fetch public PDFs
export const fetchPublicPdfs = async (req, res) => {
  try {
    const publicPdfs = await StudentPdf.find({ visibility: "Public" })
      .populate("student", "name")
      .populate("story", "title");
    res.status(200).json({ success: true, publicPdfs });
  } catch (error) {
    console.error("Error fetching public PDFs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch public PDFs." });
  }
};

// Fetch PDFs for the logged-in student
export const getStudentPdfs = async (req, res) => {
  try {
    const pdfs = await StudentPdf.find({ student: req.user._id }).populate("story", "title");
    res.status(200).json({ success: true, pdfs });
  } catch (error) {
    console.error("Error fetching student PDFs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch PDFs." });
  }
};

// Update visibility of an exported PDF
export const updatePdfVisibility = async (req, res) => {
  const { pdfId, visibility } = req.body;

  try {
    // Validate input
    if (!pdfId || !visibility) {
      return res.status(400).json({ success: false, message: "PDF ID and visibility are required." });
    }

    // Find the PDF
    const pdf = await StudentPdf.findById(pdfId);
    if (!pdf) {
      return res.status(404).json({ success: false, message: "PDF not found." });
    }

    // Update visibility
    pdf.visibility = visibility;
    await pdf.save();

    res.status(200).json({
      success: true,
      message: "PDF visibility updated successfully.",
      pdf,
    });
  } catch (error) {
    console.error("Error updating PDF visibility:", error);
    res.status(500).json({ success: false, message: "Failed to update PDF visibility." });
  }
};
