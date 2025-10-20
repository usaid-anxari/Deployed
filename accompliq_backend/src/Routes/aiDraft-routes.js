import express from "express";
import aiDraftController from "../Controllers/aiDraft-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";

const aiDraftRouter = express.Router();

aiDraftRouter.post(
  "/generate/:accompliqId",
  authMiddleware,
  aiDraftController.generateAIDraft
);

aiDraftRouter.get(
  "/selected/:draftId",
  authMiddleware,
  aiDraftController.getDrafts
);

aiDraftRouter.put(
  "/selected/:draftId",
  authMiddleware,
  aiDraftController.updateDraft
);

aiDraftRouter.delete(
  "/:draftId",
  authMiddleware,
  aiDraftController.deleteDraft
);
aiDraftRouter.get("/all", authMiddleware, aiDraftController.getAllAIDrafts);

aiDraftRouter.get(
  "/download/:draftId",
  authMiddleware,
  aiDraftController.downloadAIDraftPDF
);
aiDraftRouter.get(
  "/edit/:draftId",
  authMiddleware,
  aiDraftController.getDraftForEdit
);

aiDraftRouter.put(
  "/edit/:draftId",
  authMiddleware,
  aiDraftController.editDraft
);

export default aiDraftRouter;
