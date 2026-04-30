import sgMail from "@sendgrid/mail";

gridMail();
function gridMail() {
  if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
}

export async function sendEmail(params: { to: string; subject: string; html: string; text?: string }) {
  if (!process.env.SENDGRID_API_KEY) {
    console.warn("SendGrid API key is missing: email not sent", params);
    return;
  }

  await sgMail.send({
    to: params.to,
    from: process.env.SENDGRID_FROM || "no-reply@company.com",
    subject: params.subject,
    html: params.html,
    text: params.text,
  });
}

export async function sendInterviewInvite(params: { to: string; candidateName: string; meetingUrl: string; when: string }) {
  const html = `<p>Hi ${params.candidateName},</p><p>Your interview is scheduled for <strong>${params.when}</strong>.</p><p>Please join using this link: <a href=\"${params.meetingUrl}\">Join interview</a>.</p>`;
  await sendEmail({
    to: params.to,
    subject: "Interview invitation",
    html,
  });
}
