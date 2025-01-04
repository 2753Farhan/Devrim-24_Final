import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import storyRoutes from "./routes/storyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import converterRoutes from "./routes/convertRoutes.js"
import cookieParser from "cookie-parser";
import pdfRoutes from "./routes/pdfRoutes.js"
import chatRouter from "./routes/chatRouter.js"
config();
connectDB();

const app = express();
app.use(
    cors({
      origin: [process.env.FRONTEND_URL],
      method: ["GET", "POST", "DELETE", "PUT"],
      credentials: true,
    })
  );
app.use(json());
app.use(cookieParser());


// app.use("/api/notes", notesRoutes);
app.use("/api/story", storyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/converter", converterRoutes);
app.use("/api/pdf",pdfRoutes)
app.use("/api/chat", chatRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//completed
