import express from "express";
import bucketListController from "../Controllers/bucket-controller.js";
import { validateBucket } from "../middleware/bucketValidation.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { upload } from "../utils/uploadFiles.js";

const bucketRouter = express.Router();

bucketRouter.post(
  "/createList",
  authMiddleware,
  upload.single("image"),
  validateBucket,
  bucketListController.createBucketList
);
bucketRouter.put(
  "/edit/:bucketId",
  authMiddleware,
  upload.single("image"),
  validateBucket,
  bucketListController.editBucketList
);
bucketRouter.delete(
  "/delete/:bucketId",
  authMiddleware,
  bucketListController.deleteBucketList
);
bucketRouter.put(
  "/complete/:bucketId",
  authMiddleware,
  bucketListController.completeBucketList
);
bucketRouter.get("/get", authMiddleware, bucketListController.getBucketLists);
bucketRouter.get(
  "/get/:bucketId",
  authMiddleware,
  bucketListController.getBucketList
);

export default bucketRouter;
