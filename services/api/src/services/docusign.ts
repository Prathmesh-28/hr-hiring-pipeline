import axios from "axios";

interface CreateEnvelopeParams {
  accountId: string;
  accessToken: string;
  baseUrl: string;
  recipientName: string;
  recipientEmail: string;
  documentBuffer: Buffer;
  documentName: string;
  emailSubject: string;
  emailBlurb?: string;
}

export async function createDocuSignEnvelope(params: CreateEnvelopeParams) {
  const base64Document = params.documentBuffer.toString("base64");

  const envelopeDefinition = {
    emailSubject: params.emailSubject,
    emailBlurb: params.emailBlurb || "Please review and sign your offer letter.",
    documents: [
      {
        documentBase64: base64Document,
        name: params.documentName,
        fileExtension: "pdf",
        documentId: "1",
      },
    ],
    recipients: {
      signers: [
        {
          email: params.recipientEmail,
          name: params.recipientName,
          recipientId: "1",
          routingOrder: "1",
          tabs: {
            signHereTabs: [
              {
                anchorString: "Sincerely,",
                anchorUnits: "pixels",
                anchorXOffset: "0",
                anchorYOffset: "20",
              },
            ],
          },
        },
      ],
    },
    status: "sent",
  };

  const url = `${params.baseUrl}/accounts/${params.accountId}/envelopes`;
  const response = await axios.post(url, envelopeDefinition, {
    headers: {
      Authorization: `Bearer ${params.accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return response.data;
}
