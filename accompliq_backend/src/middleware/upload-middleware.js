import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

// File filter - Only Allow Images & videos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Only images and videos are allowed! Received: ${file.mimetype}`
      ),
      false
    );
  }
};

// Multer upload Config
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5, // Max 5 files
  },
});

// Middleware for Uploading a single file
export const uploadSingle = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Single file upload error:", err);
      return res.status(400).json({
        message: "File upload failed",
        error: err.message,
      });
    }
    next();
  });
};

// Middleware for uploading multiple files
export const uploadMultiple = (req, res, next) => {
  upload.array("files", 5)(req, res, (err) => {
    if (err) {
      console.error("Multiple files upload error:", err);
      return res.status(400).json({
        message: "Files upload failed",
        error: err.message,
      });
    }
    next();
  });
};

export default upload;
