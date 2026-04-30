import PDFDocument from "pdfkit";

export async function generateOfferPdf(data: {
  candidateName: string;
  position: string;
  salaryRange: string;
  equity?: string;
  startDate?: string;
  employerName: string;
}) {
  return new Promise<Buffer>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const buffers: Buffer[] = [];

    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    doc.fontSize(20).text("Offer Letter", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Dear ${data.candidateName},`);
    doc.moveDown();
    doc.text(`We are pleased to offer you the position of ${data.position} at ${data.employerName}.`);
    doc.text(`Salary: ${data.salaryRange}`);
    if (data.equity) {
      doc.text(`Equity: ${data.equity}`);
    }
    if (data.startDate) {
      doc.text(`Proposed start date: ${data.startDate}`);
    }
    doc.moveDown();
    doc.text("This offer is subject to the satisfactory completion of our standard background check and the submission of required documentation.");
    doc.moveDown();
    doc.text("Please sign and return this letter to confirm your acceptance.");
    doc.moveDown();
    doc.text("Sincerely,");
    doc.text(`${data.employerName} Talent Team`);

    doc.end();
  });
}
