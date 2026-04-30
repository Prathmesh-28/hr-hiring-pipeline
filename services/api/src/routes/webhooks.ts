import { Router } from "express";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/automation", async (req, res) => {
  const { event, payload, targetUrl } = req.body;
  if (!targetUrl) {
    return res.status(400).json({ error: "targetUrl is required" });
  }

  try {
    const response = await axios.post(targetUrl, { event, payload });
    res.json({ status: "sent", forwardedStatus: response.status });
  } catch (error) {
    res.status(502).json({ error: "Failed to forward webhook", details: error.toString() });
  }
});

router.post("/zoom", async (req, res) => {
  console.log("Zoom webhook payload", req.body);
  res.json({ status: "received" });
});

router.post("/docusign", async (req, res) => {
  const event = req.body;
  console.log("DocuSign webhook payload", event);

  const signature = req.headers["x-docusign-signature"] as string | undefined;
  const secret = process.env.DOCUSIGN_WEBHOOK_SECRET;
  if (secret && signature !== secret) {
    return res.status(401).json({ error: "Invalid webhook signature" });
  }

  const envelopeStatus = event?.envelopeStatus?.status;
  const envelopeId = event?.envelopeStatus?.envelopeId;
  if (!envelopeId) {
    return res.status(400).json({ error: "Missing envelopeId" });
  }

  const offer = await prisma.offer.findUnique({ where: { docusignEnvelopeId: envelopeId } });
  if (!offer) {
    return res.json({ status: "ignored", message: "No matching offer found" });
  }

  const statusUpdate: { status?: string; acceptedAt?: Date | null; declinedAt?: Date | null } = {};
  let eventType = "OFFER_GENERATED";
  if (envelopeStatus === "completed") {
    statusUpdate.status = "ACCEPTED";
    statusUpdate.acceptedAt = new Date();
    eventType = "OFFER_ACCEPTED";
  } else if (envelopeStatus === "declined") {
    statusUpdate.status = "DECLINED";
    statusUpdate.declinedAt = new Date();
    eventType = "OFFER_GENERATED";
  }

  await prisma.offer.update({ where: { id: offer.id }, data: statusUpdate });
  await prisma.event.create({
    data: {
      applicationId: offer.applicationId,
      type: eventType,
      payload: event,
    },
  });

  res.json({ status: "received", envelopeStatus });
});

export default router;
