import axios from "axios";
import jwt from "jsonwebtoken";

export async function scheduleZoomMeeting(params: {
  topic: string;
  candidateEmail: string;
  startTime: string;
  durationMinutes: number;
}) {
  const zoomApiKey = process.env.ZOOM_API_KEY;
  const zoomApiSecret = process.env.ZOOM_API_SECRET;
  if (!zoomApiKey || !zoomApiSecret) {
    return {
      join_url: "https://zoom.us/placeholder",
      start_url: "https://zoom.us/host",
      topic: params.topic,
      start_time: params.startTime,
      duration: params.durationMinutes,
    };
  }

  const payload = {
    iss: zoomApiKey,
    exp: Math.floor(Date.now() / 1000) + 60,
  };
  const token = jwt.sign(payload, zoomApiSecret);

  const meetingResponse = await axios.post(
    "https://api.zoom.us/v2/users/me/meetings",
    {
      topic: params.topic,
      type: 2,
      start_time: params.startTime,
      duration: params.durationMinutes,
      timezone: process.env.TIMEZONE || "UTC",
      settings: {
        join_before_host: false,
        approval_type: 0,
        mute_upon_entry: true,
        waiting_room: true,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return {
    join_url: meetingResponse.data.join_url,
    start_url: meetingResponse.data.start_url,
    meeting_id: meetingResponse.data.id,
    topic: meetingResponse.data.topic,
    start_time: meetingResponse.data.start_time,
  };
}

export async function createGoogleCalendarEvent(params: {
  summary: string;
  description: string;
  start: string;
  end: string;
  attendees: string[];
}) {
  const startDate = new Date(params.start);
  const endDate = new Date(params.end);
  const formatDate = (date: Date) =>
    date.toISOString().replace(/-|:|\.\d{3}/g, "").replace(/Z$/, "Z");

  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: params.summary,
    details: params.description,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    add: params.attendees.join(","),
  });

  return {
    calendarLink: `https://calendar.google.com/calendar/render?${query.toString()}`,
  };
}
