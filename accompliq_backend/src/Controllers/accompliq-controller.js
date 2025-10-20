import Accompliq from "../Modals/accompliq-model.js";
// import generateAIDraft from "../utils/aiService.js";
import generatePDF from "../utils/pdfGenerator.js";
import s3Upload from "../utils/s3Upload.js";

const accompliqController = {
  // ✅ Create an Accompliq
  createAccompliq: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user" });
      }

      const userId = req.user.id;
      const accompliqData = req.body;

      const newAccompliq = await Accompliq.create({
        userId,
        ...accompliqData,
      });

      res.status(201).json({
        message: "Accompliq created successfully",
        accompliq: newAccompliq,
      });
    } catch (error) {
      console.error("Create Accompliq Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // ✅ Get a Single Accompliq
  getAccompliq: async (req, res) => {
    try {
      const { accompliqId } = req.params;
      const accompliq = await Accompliq.findByPk(accompliqId);

      if (!accompliq) {
        return res.status(404).json({ message: "Accompliq not found" });
      }

      res.status(200).json({ accompliq });
    } catch (error) {
      console.error("Get Accompliq Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // ✅ Upload Media Files
  uploadMedia: async (req, res) => {
    try {
      const { accompliqId } = req.params;
      const files = req.files;

      if (!files || files.length === 0) {
        console.warn("No files were uploaded");
        return res.status(400).json({ message: "No files uploaded" });
      }

      // Upload to AWS S3
      const uploadFiles = await s3Upload(files);

      // Find the accompliq record
      const accompliq = await Accompliq.findByPk(accompliqId);
      if (!accompliq) {
        console.error(`Accompliq not found with ID: ${accompliqId}`);
        return res.status(404).json({ message: "Accompliq not found" });
      }
      // Append uploaded images/videos
      const updatedMedia = {
        images: [...accompliq.media.images, ...uploadFiles.images],
        videos: [...accompliq.media.videos, ...uploadFiles.videos],
      };

      await accompliq.update({ media: updatedMedia });

      res.status(200).json({
        message: "Media uploaded successfully",
        uploadedFiles: uploadFiles,
        accompliq: {
          id: accompliq.id,
          media: updatedMedia,
        },
      });
    } catch (error) {
      console.error("Upload Media Error:", error);

      // Clean up uploaded files if error occurred
      if (req.files) {
        req.files.forEach((file) => {
          try {
            fs.unlinkSync(file.path);
          } catch (cleanupError) {
            console.error(`Error cleaning up file ${file.path}:`, cleanupError);
          }
        });
      }

      res.status(500).json({
        message: "Server error during media upload",
        error: error.message,
      });
    }
  },
  // ✅ Download Accompliq as PDF
  downloadAccompliqPDF: async (req, res) => {
    try {
      const { accompliqId } = req.params;

      // Add validation for the ID
      if (!accompliqId || typeof accompliqId !== "string") {
        return res.status(400).json({ message: "Invalid accompliq ID" });
      }

      // Log the ID to verify it's correct

      const accompliq = await Accompliq.findByPk(accompliqId);

      if (!accompliq) {
        return res.status(404).json({ message: "Accompliq not found" });
      }

      // Get the PDF buffer from generatePDF
      const pdfBuffer = await generatePDF(accompliq);

      const filename = `${accompliq.personalInfo?.fullName || "accompliq"}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Send the buffer directly
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Download PDF Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // ✅ Update Privacy Settings
  uploadPrivacySettings: async (req, res) => {
    try {
      const { accompliqId } = req.params;
      const { isPublic } = req.body;

      const accompliq = await Accompliq.findByPk(accompliqId);

      if (!accompliq) {
        return res.status(404).json({ message: "Accompliq not found" });
      }

      await accompliq.update({ isPublic });

      res.status(200).json({ message: "Privacy settings updated", accompliq });
    } catch (error) {
      console.error("Update Privacy Settings Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // ✅ Get All Public Accompliq
  getPublicAccompliq: async (req, res) => {
    try {
      const accompliq = await Accompliq.findAll({ where: { isPublic: true } });

      res.status(200).json({
        message: "Public accompliq retrieved successfully",
        accompliq,
      });
    } catch (error) {
      console.error("Get Public Accompliq Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // ✅ Edit an Accompliq
  editAccompliq: async (req, res) => {
    try {
      const { accompliqId } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
      const { mode } = req.query;

      const accompliq = await Accompliq.findByPk(accompliqId);

      if (!accompliq) {
        return res.status(404).json({ message: "Accompliq not found" });
      }

      if (accompliq.userId !== userId) {
        return res.status(403).json({
          message: "Unauthorized to edit this accompliq",
        });
      }

      await accompliq.update(updateData);

      if (mode === "pdf") {
        const pdfBuffer = await generatePDF(accompliq);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `inline; filename=${
            accompliq.personalInfo?.fulName || "Accompliq"
          }.pdf`
        );
        return res.send(pdfBuffer);
      }

      res.status(200).json({
        message: "Accompliq updated successfully",
        accompliq,
      });
    } catch (error) {
      console.error("Edit Accompliq Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // ✅ Delete an Accompliq
  deleteAccompliq: async (req, res) => {
    try {
      const { accompliqId } = req.params;
      const userId = req.user.id;

      const accompliq = await Accompliq.findByPk(accompliqId);

      if (!accompliq) {
        return res.status(404).json({ message: "Accompliq not found" });
      }

      if (accompliq.userId !== userId) {
        return res.status(403).json({
          message: "Unauthorized to delete this accompliq",
        });
      }

      await accompliq.destroy();
      res.status(200).json({ message: "Accompliq deleted successfully" });
    } catch (error) {
      console.error("Delete Accompliq Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // ✅ Get All Accompliq for a User
  getUserAccompliq: async (req, res) => {
    try {
      const userId = req.user.id;
      const accompliq = await Accompliq.findAll({ where: { userId } });

      res.status(200).json({
        message: "User accompliq retrieved successfully",
        accompliq,
      });
    } catch (error) {
      console.error("Get User Accompliq Error:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
};

export default accompliqController;
