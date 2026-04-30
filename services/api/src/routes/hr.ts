import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "../middleware/auth";

const prisma = new PrismaClient();
const router = Router();

router.get("/candidates", requireRole("HR"), async (req, res) => {
  const candidates = await prisma.application.findMany({
    include: {
      candidate: true,
      feedback: true,
      offer: true,
    },
    orderBy: { submittedAt: "desc" },
  });
  res.json(candidates);
});

router.patch("/applications/:id/stage", requireRole("HR"), async (req, res) => {
  const { id } = req.params;
  const { stage } = req.body;
  const updated = await prisma.application.update({
    where: { id },
    data: { stage },
  });
  res.json(updated);
});

export default router;
