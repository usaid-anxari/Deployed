import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import mime from "mime-types";
import crypto from "crypto";

// Validate required environment variables
const requiredEnvVars = [
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Configure S3 client with additional options
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  // Recommended additional configuration
  maxAttempts: 3, // Retry failed requests
  retryMode: "standard",
});

/**
 * Enhanced S3 file upload with better error handling and reliability
 */
export const s3Upload = async (files) => {
  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new Error("No files provided for upload");
  }

  const uploadResults = {
    images: [],
    videos: [],
    errors: [],
  };

  for (const file of files) {
    try {
      // Skip file existence check for memory storage
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const contentType =
        mime.lookup(fileExtension) || "application/octet-stream";
      const uniqueFileName = `${crypto.randomUUID()}${fileExtension}`;
      const s3Key = `uploads/${uniqueFileName}`;

      // Use file.buffer directly instead of file stream
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: s3Key,
        Body: file.buffer, // Use buffer directly
        ContentType: contentType,
        // ACL: "public-read",
        CacheControl: "max-age=31536000",
        Metadata: {
          originalName: encodeURIComponent(file.originalname),
          uploadedAt: new Date().toISOString(),
        },
      };

      await s3.send(new PutObjectCommand(params));

      const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`;

      if (contentType.startsWith("image/")) {
        uploadResults.images.push({
          url: fileUrl,
          key: s3Key,
          originalName: file.originalname,
          size: file.size,
          type: "image",
        });
      }
    } catch (error) {
      console.error(`Failed to upload ${file.originalname}:`, error);
      uploadResults.errors.push({
        fileName: file.originalname,
        error: error.message,
      });
    }
  }

  if (uploadResults.images.length === 0 && uploadResults.errors.length > 0) {
    throw new Error(
      `All file uploads failed: ${uploadResults.errors
        .map((e) => e.error)
        .join(", ")}`
    );
  }

  return uploadResults;
};

export const deleteFromS3 = async (key) => {
  if (!key) return;

  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        key: key,
      })
    );
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    throw new Error("Failed to delete file from S3");
  }
};

export default s3Upload;
