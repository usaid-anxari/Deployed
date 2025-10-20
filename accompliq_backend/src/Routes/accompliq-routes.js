import express from "express";
import accompliqController from "../Controllers/accompliq-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { uploadMultiple } from "../middleware/upload-middleware.js";

const accompliqRouter = express.Router();

accompliqRouter.post(
  "/create",
  authMiddleware,
  accompliqController.createAccompliq
);
accompliqRouter.get(
  "/getAccompliq/:accompliqId",
  authMiddleware,
  accompliqController.getAccompliq
);
accompliqRouter.post(
  "/upload-media/:accompliqId",
  authMiddleware,
  uploadMultiple,
  accompliqController.uploadMedia
);
accompliqRouter.get(
  "/download/:accompliqId",
  authMiddleware,
  accompliqController.downloadAccompliqPDF
);
accompliqRouter.put(
  "/privacy/:accompliqId",
  authMiddleware,
  accompliqController.uploadPrivacySettings
);
accompliqRouter.get(
  "/public-directory",
  accompliqController.getPublicAccompliq
);
accompliqRouter.put(
  "/edit/:accompliqId",
  authMiddleware,
  accompliqController.editAccompliq
);
accompliqRouter.delete(
  "/delete/:accompliqId",
  authMiddleware,
  accompliqController.deleteAccompliq
);
accompliqRouter.get(
  "/get-user-accompliq",
  authMiddleware,
  accompliqController.getUserAccompliq
);

export default accompliqRouter;
