import express from "express";
import { updateProfileSettings } from "../Controllers/profile-controller.js";
import { upload } from "../utils/uploadFiles.js";
import authenticateUser from "../middleware/auth-middleware.js";

const profileRouter = express.Router();

// Auth middleware should attach req.user (user id, etc)
profileRouter.put(
  "/profile-settings",
  authenticateUser,
  upload.single("profilePicture"),
  updateProfileSettings
);

export default profileRouter;
