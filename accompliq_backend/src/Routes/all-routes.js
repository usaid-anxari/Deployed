import express from "express";
import authRouter from "./auth-routes.js";
import bucketRouter from "./bucket-routes.js";
import accompliqRouter from "./accompliq-routes.js";
import aiDraftRouter from "./aiDraft-routes.js";
import stripeRouter from "./stripe-routes.js";
import profileRouter from "./profile-routes.js";
import webhookRouter from "./webhookRouter.js";

const allRoutes = express.Router();

allRoutes.use("/auth", authRouter);
allRoutes.use("/profileUpdate", profileRouter);
allRoutes.use("/bucket", bucketRouter);
allRoutes.use("/accompliq", accompliqRouter);
allRoutes.use("/ai-drafts", aiDraftRouter);
allRoutes.use("/stripe", stripeRouter);
allRoutes.use("/webhook", webhookRouter);

export default allRoutes;
