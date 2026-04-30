import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { scheduleZoomMeeting, createGoogleCalendarEvent } from "../services/calendar";
import { sendInterviewInvite } from "../services/notifications";

const prisma = new PrismaClient();
const router = Router();

router.post("/schedule", async (req, res) => {
  const { applicationId, startTime, durationMinutes, topic } = req.body;
  if (!applicationId || !startTime || !durationMinutes || !topic) {
    return res.status(400).json({ error: "applicationId, startTime, durationMinutes, and topic are required" });
  }

  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { candidate: true },
  });
  if (!application) return res.status(404).json({ error: "Application not found" });

  const zoomMeeting = await scheduleZoomMeeting({
    topic,
    candidateEmail: application.candidate.email,
    startTime,
    durationMinutes,
  });

  const eventLink = await createGoogleCalendarEvent({
    summary: topic,
    description: `Interview for ${application.candidate.firstName} ${application.candidate.lastName}`,
    start: startTime,
    end: new Date(new Date(startTime).getTime() + durationMinutes * 60000).toISOString(),
    attendees: [application.candidate.email],
  });

  await prisma.event.create({
    data: {
      applicationId,
      type: "INTERVIEW_SCHEDULED",
      payload: {
        zoomMeeting,
        calendarLink: eventLink.calendarLink,
      },
    },
  });

  await prisma.application.update({
    where: { id: applicationId },
    data: { stage: "INTERVIEW" },
  });

  await sendInterviewInvite({
    to: application.candidate.email,
    candidateName: `${application.candidate.firstName} ${application.candidate.lastName}`,
    meetingUrl: zoomMeeting.join_url,
    when: new Date(startTime).toLocaleString("en-US", { timeZone: process.env.TIMEZONE || "UTC" }),
  });

  res.json({ zoomMeeting, calendarLink: eventLink.calendarLink });
});

export default router;
