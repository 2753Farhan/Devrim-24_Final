import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cookieParser from "cookie-parser";

config();
connectDB();

const app = express();
app.use(cors());
app.use(json());
app.use(cookieParser());


app.use("/api/notes", notesRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
