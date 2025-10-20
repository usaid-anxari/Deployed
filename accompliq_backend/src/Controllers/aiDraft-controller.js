import { Op } from "sequelize";
import AIDraft from "../Modals/aiDraft-model.js";
import generateAIDraft from "../utils/aiService.js";
import { generateAIDraftPDF } from "../utils/pdfGenerator.js";
import Accompliq from "../Modals/accompliq-model.js";

const aiDraftController = {
  generateAIDraft: async (req, res) => {
    try {
      const { accompliqId } = req.params;
      const userId = req.user.id;

      const accompliq = await Accompliq.findByPk(accompliqId);
      if (!accompliq) {
        return res.status(404).json({ message: "accompliq not found" });
      }

      if (accompliq.userId !== userId) {
        return res
          .status(403)
          .json({ message: "Unauthorized to access this accompliq" });
      }

      // Validate required fields
      if (
        !accompliq.personalInfo?.fullName ||
        (!accompliq.personalInfo?.dateOfBirth && !accompliq.personalInfo?.dob)
      ) {
        return res.status(400).json({
          message: "Missing required fields for generation",
          required: ["fullName", "dateOfBirth"],
        });
      }

      // Get the generation result
      const { generatedText, prompt } = await generateAIDraft(accompliq);

      // Extract the accompliq details you want to store
      const accompliqDetails = {
        personalInfo: accompliq.personalInfo,
        familyInfo: accompliq.familyInfo,
        educationCareer: accompliq.educationCareer,
        personalLife: accompliq.personalLife,
        legacyTribute: accompliq.legacyTribute,
        funeralDetail: accompliq.funeralDetail,
      };

      const newDraft = await AIDraft.create({
        accompliqId,
        userId,
        draftContent: generatedText,
        promptUsed: prompt,
        modelUsed: req.body.model || "gpt-3.5-turbo",
        temperature: req.body.temperature || 0.7,
        accompliqDetails: accompliqDetails,
      });

      // If first draft, auto-select it
      const draftCount = await AIDraft.count({ where: { accompliqId } });
      if (draftCount === 1) {
        await newDraft.markAsSelected();
      }

      res.status(201).json({
        message: "AI draft generated successfully",
        draft: newDraft,
      });
    } catch (error) {
      console.error("Generate Draft Error:", error);
      res.status(500).json({
        message: "Failed to generate draft",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  getDrafts: async (req, res) => {
    try {
      const { draftId } = req.params;
      const userId = req.user.id;

      // Verify accompliq exists and belongs to user
      const draft = await AIDraft.findByPk(draftId);
      if (!draft) {
        return res.status(404).json({ message: "Draft not found" });
      }
      if (draft.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const drafts = await AIDraft.findAll({
        where: { accompliqId: draft.accompliqId },
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json({
        message: "Drafts fetched successfully",
        drafts,
      });
    } catch (error) {
      console.error("Get Drafts Error:", error);
      res.status(500).json({
        message: "Failed to get drafts",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  selectDraft: async (req, res) => {
    try {
      const { draftId } = req.params;
      const userId = req.user.id;

      const draft = await AIDraft.findByPk(draftId);
      if (!draft) {
        return res.status(404).json({ message: "Draft not found" });
      }

      if (draft.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const updatedDraft = await draft.markAsSelected();

      res.status(200).json({
        message: "Draft selected successfully",
        draft: updatedDraft,
      });
    } catch (error) {
      console.error("Select Draft Error:", error);
      res.status(500).json({
        message: "Failed to select draft",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  deleteDraft: async (req, res) => {
    try {
      const { draftId } = req.params;
      const userId = req.user.id;

      const draft = await AIDraft.findByPk(draftId);
      if (!draft) {
        return res.status(404).json({ message: "Draft not found" });
      }

      if (draft.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (draft.isSelected) {
        const anotherDraft = await AIDraft.findOne({
          where: {
            accompliqId: draft.accompliqId,
            id: { [Op.ne]: draftId },
          },
          order: [["createdAt", "DESC"]],
        });

        if (anotherDraft) {
          await anotherDraft.markAsSelected();
        }
      }

      await draft.destroy();

      res.status(200).json({
        message: "Draft deleted successfully",
      });
    } catch (error) {
      console.error("Delete Draft Error:", error);
      res.status(500).json({
        message: "Failed to delete draft",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },

  updateDraft: async (req, res) => {
    try {
      const { draftId } = req.params;
      const { content } = req.body;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({ message: "Content is required" });
      }

      const draft = await AIDraft.findByPk(draftId);
      if (!draft) {
        return res.status(404).json({ message: "Draft not found" });
      }

      if (draft.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      draft.draftContent = content;
      await draft.save();

      res.status(200).json({
        message: "Draft updated successfully",
        draft,
      });
    } catch (error) {
      console.error("Update Draft Error:", error);
      res.status(500).json({
        message: "Failed to update draft",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
  // New function to get all drafts for the logged-in user
  getAllAIDrafts: async (req, res) => {
    try {
      const userId = req.user.id;

      // Fetch all drafts created by the logged-in user
      const drafts = await AIDraft.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      if (drafts.length === 0) {
        return res.status(404).json({ message: "No drafts found" });
      }

      res.status(200).json({
        message: "All drafts fetched successfully",
        drafts,
      });
    } catch (error) {
      console.error("Get All Drafts Error:", error);
      res.status(500).json({
        message: "Failed to fetch drafts",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
  // Add this controller method
  downloadAIDraftPDF: async (req, res) => {
    try {
      const { draftId } = req.params;

      if (!draftId) {
        return res.status(400).json({ message: "Draft ID is required" });
      }

      const draft = await AIDraft.findByPk(draftId);
      if (!draft) {
        return res.status(404).json({ message: "Draft not found" });
      }

      // Verify the draft belongs to the requesting user
      if (draft.userId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized to access this draft" });
      }

      const pdfBuffer = await generateAIDraftPDF(draft);

      const filename = `memorial-draft-${draftId.slice(0, 8)}.pdf`;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Download Draft PDF Error:", error);
      res.status(500).json({
        message: "Failed to generate PDF",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  },
  //edit ai draft
  editDraft: async (req, res) => {
    try{
        const {draftId} = req.params;
        const userId = req.user.id;
        const {updateContent} = req.body;

        if (!updatedContent){
            return res.status(400).json({
                message:"Update content is required"
            })
        }

        const draft = await AIDraft.findByPk(draftId);
        if(!draft){
            return res.status(404).json({message:"Draft not found"})
        }

        if(draft.userId !== userId){
            return res.status(404).json({message:"Unauthorized to edit this draft"})
        }

        draft.draftContent = updateContent;
        draft.updatedAt = new Date()
        await draft.save()

        const pdfBuffer = await generateAIDraft(draft);

        res.status(200).json({message:"Draft updated successfully",
            draft:{
                id:draft.id,
                updatedAt: draft.updatedAt,
                contentPreview:draft.draftContent.substring(0, 100) = '...'
            },
            pdfBuffer:pdfBuffer.toString('base64')
        })
    }catch(error){
        console.error("Edit Draft Error:", error)
        res.status(500).json({
            message:"Failed to edit draft",
            error:process.env.NODE_ENV ==="development" ? error.message : undefined
        })
    }
  },

  getDraftForEdit: async (req, res) => {
    try{
        const {draftId} = req.params;
        const userId = req.user.id

        const draft = await AIDraft.findByPk(draftId);
        if(!draft){
            return res.status(404).json({message:"Draft not found"})
        }

        if(draft.userId !== userId){
            return res.status(403).json({
                message:"Unauthorized to access this draft"
            })
        }

        const pdfBuffer = await generateAIDraftPDF(draft)

        res.status(200).json({
            message:"Draft retrieved for editing",
            draft:{
                id:draft.id,
                content:draft.draftContent,
                accompliqDetails: draft.accompliqDetails,
                createdAt:draft.createdAt,
                updatedAt:draft.updatedAt
            },
            pdfBuffer: pdfBuffer.toString('base64')
        })

    }catch(error){
        console.error("Get Draft for edit error", error)
        res.status(500).json({
            message:"Failed to get draft for editing",
            error:process.env.NODE_ENV === "development" ? error.message : undefined,
        })
    }
  }
}

export default aiDraftController;
