import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import editorRoutes from "./routes/editorRoutes.js"; // Import the editor routes

// Configure environment variables
config();
connectDB();

const app = express();
app.use(cors());
app.use(json());

// Route configurations
app.use("/api/notes", notesRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/editor", editorRoutes); // Add the editor routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
