import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateOfferPdf } from "../services/document";
import { createDocuSignEnvelope } from "../services/docusign";
import { uploadFileToS3 } from "../services/storage";

const prisma = new PrismaClient();
const router = Router();

router.post("/send-docusign", async (req, res) => {
  const { applicationId, title, level, salaryRange, equity, startDate, emailSubject, emailBlurb } = req.body;
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
  const accessToken = process.env.DOCUSIGN_ACCESS_TOKEN;
  const baseUrl = process.env.DOCUSIGN_BASE_URL || "https://demo.docusign.net/restapi";

  if (!accountId || !accessToken) {
    return res.status(400).json({ error: "DocuSign credentials are required" });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { candidate: true },
  });
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  const candidateName = `${application.candidate.firstName} ${application.candidate.lastName}`;
  const pdfBuffer = await generateOfferPdf({
    candidateName,
    position: title,
    salaryRange,
    equity,
    startDate,
    employerName: process.env.COMPANY_NAME || "Our Company",
  });

  const envelope = await createDocuSignEnvelope({
    accountId,
    accessToken,
    baseUrl,
    recipientName: candidateName,
    recipientEmail: application.candidate.email,
    documentBuffer: pdfBuffer,
    documentName: `Offer-${candidateName}`,
    emailSubject: emailSubject || `Offer letter for ${title}`,
    emailBlurb,
  });

  const documentUrl = await uploadFileToS3(pdfBuffer, `offers/${applicationId}-${Date.now()}.pdf`, "application/pdf");
  const offer = await prisma.offer.upsert({
    where: { applicationId },
    create: {
      applicationId,
      title,
      level,
      salaryRange,
      equity,
      docusignEnvelopeId: envelope.envelopeId,
      status: "SENT",
      documentUrl,
      sentAt: new Date(),
    },
    update: {
      title,
      level,
      salaryRange,
      equity,
      docusignEnvelopeId: envelope.envelopeId,
      status: "SENT",
      documentUrl,
      sentAt: new Date(),
    },
  });

  await prisma.event.create({
    data: {
      applicationId,
      type: "OFFER_GENERATED",
      payload: { envelopeId: envelope.envelopeId, status: envelope.status },
    },
  });

  res.json({ offer, envelope, documentUrl });
});

export default router;
