import express from "express";
import {
  exportContentAsPdf,
  fetchPublicPdfs,
  getStudentPdfs,
  updatePdfVisibility,
} from "../controllers/pdfController.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/export", isAuthenticated, exportContentAsPdf);
router.get("/public", fetchPublicPdfs);
router.get("/my-pdfs", isAuthenticated, getStudentPdfs);
router.patch("/update-visibility", isAuthenticated, updatePdfVisibility);

export default router;
