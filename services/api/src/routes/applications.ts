import { Router } from "express";
import { PrismaClient, Stage } from "@prisma/client";
import multer from "multer";
import { analyzeResume } from "../services/ai";
import { uploadResumeToS3 } from "../services/storage";

const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/submit", upload.single("resume"), async (req, res) => {
  const { email, firstName, lastName, phone, source, currentCompany, currentTitle, location, jobId, answers } = req.body;
  if (!req.file) return res.status(400).json({ error: "Resume upload required" });

  const resumeUrl = await uploadResumeToS3(req.file);
  const candidate = await prisma.candidate.create({
    data: {
      email,
      firstName,
      lastName,
      phone,
      source,
      currentCompany,
      currentTitle,
      location,
      resumeUrl,
      profileText: answers,
      applications: {
        create: {
          jobId,
          stage: Stage.APPLIED,
          source,
        },
      },
    },
    include: { applications: true },
  });

  const application = candidate.applications[0];
  const resumeParsedText = await analyzeResume(req.file.buffer);
  const fitScore = await analyzeResume(req.file.buffer, jobId);

  await prisma.application.update({
    where: { id: application.id },
    data: { resumeParsedText, fitScore, score: fitScore ?? undefined },
  });

  res.json({ candidate, application });
});

router.get("/jobs", async (req, res) => {
  const jobs = [
    { id: "job-frontend", title: "Frontend Engineer", location: "Remote" },
    { id: "job-product", title: "Product Manager", location: "Hybrid" },
  ];
  res.json(jobs);
});

export default router;
