import PDFDocument from "pdfkit";

// Common PDF setup function
const createPDFDocument = () => {
  const doc = new PDFDocument();
  const buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  return { doc, buffers };
};

// Common footer function
const addCommonFooter = (doc) => {
  doc.moveDown(2);
  doc.fontSize(10).text("Created with Memorial App", { align: "center" });
};

// For finalized accompliq
export const generateAccompliqPDF = (accompliq) => {
  return new Promise((resolve, reject) => {
    try {
      const { doc, buffers } = createPDFDocument();

      // Header
      doc.fontSize(20).text("In Loving Memory", { align: "center" });
      doc.moveDown(0.5);

      // Main Title
      doc
        .fontSize(24)
        .text(accompliq.personalInfo?.fullName || "Untitled Accompliq", {
          align: "center",
          underline: true,
        });
      doc.moveDown();

      // Life Dates
      doc
        .fontSize(14)
        .text(
          `${accompliq.personalInfo?.dob || "Date of Birth"} - ${
            accompliq.personalInfo?.deathDate || "Date of Death"
          }`,
          { align: "center" }
        );
      doc.moveDown(1);

      // Personal Information
      doc.fontSize(16).text("Personal Information", { underline: true });
      doc.moveDown(0.5);

      const personalInfoFields = [
        { label: "Full Name", value: accompliq.personalInfo?.fullName },
        { label: "Date of Birth", value: accompliq.personalInfo?.dob },
        { label: "Date of Death", value: accompliq.personalInfo?.deathDate },
        { label: "Place of Birth", value: accompliq.personalInfo?.birthPlace },
        { label: "Place of Death", value: accompliq.personalInfo?.deathPlace },
        { label: "Age", value: accompliq.personalInfo?.age },
        { label: "Gender", value: accompliq.personalInfo?.gender },
        { label: "Occupation", value: accompliq.personalInfo?.occupation },
      ];

      personalInfoFields.forEach(({ label, value }) => {
        doc.fontSize(12).text(`${label}: ${value || "Not specified"}`);
      });
      doc.moveDown(1);

      // Life Story
      if (accompliq.personalLife?.description) {
        doc.fontSize(16).text("Life Story", { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(accompliq.personalLife.description, {
          align: "justify",
          indent: 20,
          lineGap: 5,
        });
        doc.moveDown(1);
      }

      // Family Members
      if (accompliq.familyMembers?.length > 0) {
        doc.fontSize(16).text("Family Members", { underline: true });
        doc.moveDown(0.5);
        accompliq.familyMembers.forEach((member) => {
          doc
            .fontSize(12)
            .text(`${member.relationship}: ${member.name}`)
            .moveDown(0.3);
        });
        doc.moveDown(1);
      }

      // Funeral Details
      if (accompliq.funeralDetails) {
        doc.fontSize(16).text("Funeral Arrangements", { underline: true });
        doc.moveDown(0.5);

        const funeralFields = [
          {
            label: "Service Date",
            value: accompliq.funeralDetails?.serviceDate,
          },
          {
            label: "Service Time",
            value: accompliq.funeralDetails?.serviceTime,
          },
          { label: "Location", value: accompliq.funeralDetails?.location },
          {
            label: "Additional Details",
            value: accompliq.funeralDetails?.additionalDetails,
          },
        ];

        funeralFields.forEach(({ label, value }) => {
          doc.fontSize(12).text(`${label}: ${value || "Not specified"}`);
        });
        doc.moveDown(1);
      }

      // Tributes
      if (accompliq.tributes?.length > 0) {
        doc.fontSize(16).text("Tributes", { underline: true });
        doc.moveDown(0.5);
        accompliq.tributes.forEach((tribute, index) => {
          doc
            .fontSize(12)
            .text(`Tribute ${index + 1}: ${tribute.message || "No message"}`)
            .text(`- ${tribute.name || "Anonymous"}`)
            .moveDown(0.5);
        });
      }

      addCommonFooter(doc);
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// For AI Drafts
export const generateAIDraftPDF = (draft) => {
  return new Promise((resolve, reject) => {
    try {
      const { doc, buffers } = createPDFDocument();

      // Set up margins and styling
      const margin = 50;
      const contentWidth = 500;
      doc.font("Helvetica");

      // Header with styling similar to frontend
      doc
        .fillColor("#333333")
        .fontSize(20)
        .text("In Loving Memory", {
          align: "center",
          underline: false,
          lineGap: 10,
        })
        .moveDown(0.5);

      // Main title (like frontend preview)
      doc
        .fontSize(24)
        .text(draft.accompliq?.personalInfo?.fullName || "Memorial Draft", {
          align: "center",
          lineGap: 15,
        });

      // Dates (if available)
      if (
        draft.accompliq?.personalInfo?.dob ||
        draft.accompliq?.personalInfo?.deathDate
      ) {
        doc
          .fontSize(14)
          .text(
            `${draft.accompliq?.personalInfo?.dob || "Date of Birth"} - ${
              draft.accompliq?.personalInfo?.deathDate || "Present"
            }`,
            { align: "center", lineGap: 20 }
          );
      }

      // Main content divider
      doc
        .moveTo(margin, doc.y)
        .lineTo(margin + contentWidth, doc.y)
        .lineWidth(1)
        .strokeColor("#cccccc")
        .stroke();

      // Draft content (formatted like frontend)
      doc
        .moveDown(1)
        .fillColor("#444444")
        .fontSize(12)
        .text(draft.draftContent, {
          align: "left",
          width: contentWidth,
          indent: 20,
          lineGap: 8,
          paragraphGap: 10,
        });

      // Footer with generation info
      doc
        .moveDown(2)
        .fillColor("#666666")
        .fontSize(10)
        .text(`Generated ${new Date(draft.createdAt).toLocaleDateString()}`, {
          align: "center",
          lineGap: 5,
        })
        .text("Accompliq", { align: "center" });

      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
// Enhanced PDF generator with form fields for editing
export const generateEditableAIDraftPDF = (draft) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // Set document metadata
      doc.info.Title = `Editable Draft - ${draft.id}`;
      doc.info.Author = "Accompliq";

      // Add header
      doc
        .fontSize(20)
        .text("Edit Your Memorial Draft", { align: "center" })
        .moveDown(0.5);

      // Add draft info
      doc
        .fontSize(12)
        .text(`Draft ID: ${draft.id}`)
        .text(`Created: ${new Date(draft.createdAt).toLocaleString()}`)
        .text(`Last Updated: ${new Date(draft.updatedAt).toLocaleString()}`)
        .moveDown(1);

      // Add editable content area
      doc
        .fontSize(14)
        .text("Edit your content below:", { underline: true })
        .moveDown(0.5);

      // Add form field for content editing
      doc
        .fillColor("#333333")
        .rect(50, doc.y, 500, 300)
        .stroke()
        .text(draft.draftContent, 55, doc.y + 5, {
          width: 490,
          height: 290,
          lineGap: 5,
        });

      // Add footer with instructions
      doc
        .moveDown(3)
        .fontSize(10)
        .text('Make your changes and click "Update" to save', {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Default export for backward compatibility
export default generateAccompliqPDF;
