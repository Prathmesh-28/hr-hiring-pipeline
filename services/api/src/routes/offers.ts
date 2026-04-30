import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { generateOfferPdf } from "../services/document";
import { uploadFileToS3 } from "../services/storage";
import { sendEmail } from "../services/notifications";

const prisma = new PrismaClient();
const router = Router();

router.post("/offers", async (req, res) => {
  const { applicationId, title, level, salaryRange, equity, startDate, docusignEnvelopeId } = req.body;
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

  const documentUrl = await uploadFileToS3(pdfBuffer, `offers/${applicationId}.pdf`, "application/pdf");

  const offer = await prisma.offer.upsert({
    where: { applicationId },
    create: {
      applicationId,
      title,
      level,
      salaryRange,
      equity,
      docusignEnvelopeId,
      status: "SENT",
      documentUrl,
      sentAt: new Date(),
    },
    update: {
      title,
      level,
      salaryRange,
      equity,
      docusignEnvelopeId,
      status: "SENT",
      documentUrl,
      sentAt: new Date(),
    },
  });

  await sendEmail({
    to: application.candidate.email,
    subject: `Offer for ${title}`,
    html: `<p>Dear ${candidateName},</p><p>We have generated your offer letter. You can review it here: <a href="${documentUrl}">View offer letter</a>.</p>`,
  });

  res.json({ offer, documentUrl });
});

export default router;
