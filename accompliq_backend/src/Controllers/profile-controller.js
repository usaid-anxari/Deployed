import User from "../Modals/user-model.js";
import s3Upload from "../utils/s3Upload.js";
import { s3 } from "../utils/s3Upload.js";

export const updateProfileSettings = async (req, res) => {
  const { fullName, gender, dateOfBirth, phoneNumber } = req.body;
  let profilePicture = req.body.profilePicture;

  if (req.file) {
    if (req.file && req.file.location) {
      // For multer-s3: req.file.location is S3 url
      profilePicture = req.file.location;
    } else if (req.file && req.file.buffer) {
      // If using manual upload (your s3Upload util)
      const uploadResults = await s3Upload([req.file]);
      if (uploadResults.images.length > 0) {
        profilePicture = uploadResults.images[0].url; // S3 url
      }
    }
  }

  try {
    const user = await User.findByPk(req.user.id); // assuming you get user from auth middleware
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await user.update({
      fullName,
      gender,
      dateOfBirth,
      profilePicture,
      phoneNumber,
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};
