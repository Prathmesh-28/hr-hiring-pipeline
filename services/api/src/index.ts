import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth";
import applicationRoutes from "./routes/applications";
import hrRoutes from "./routes/hr";
import offerRoutes from "./routes/offers";
import docusignRoutes from "./routes/docusign";
import interviewRoutes from "./routes/interviews";
import webhookRoutes from "./routes/webhooks";
import { verifyToken } from "./middleware/auth";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/applications", applicationRoutes);
app.use("/admin", verifyToken, hrRoutes);
app.use("/admin", verifyToken, offerRoutes);
app.use("/admin", verifyToken, docusignRoutes);
app.use("/admin", verifyToken, interviewRoutes);
app.use("/webhooks", webhookRoutes);

app.get("/health", (req, res) => res.json({ status: "ok" }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
