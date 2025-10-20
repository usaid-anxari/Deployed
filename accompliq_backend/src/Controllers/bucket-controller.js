import BucketList from "../Modals/bucket-model.js";
import s3Upload from "../utils/s3Upload.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../utils/s3Upload.js";

const bucketListController = {
  // ✅ Create a Bucket List
  createBucketList: async (req, res) => {
    try {
      const { title, description, dueDate } = req.body;
      const userId = req.user.id;

      const createData = {
        userId,
        title,
        description,
        dueDate: dueDate || null,
        imageUrl: null,
        imageKey: null,
      };

      if (req.file) {
        try {
          const uploadResults = await s3Upload([req.file]);

          if (uploadResults.images.length > 0) {
            createData.imageUrl = uploadResults.images[0].url;
            createData.imageKey = uploadResults.images[0].key;
          }
        } catch (uploadError) {
          console.error(
            "Upload failed, continuing without image:",
            uploadError
          );
          // Continue without image rather than failing the entire operation
        }
      }

      const newBucket = await BucketList.create(createData);

      res.status(201).json({
        message: "Bucket list item created successfully",
        bucket: newBucket,
      });
    } catch (error) {
      console.error("Create error:", error);
      res.status(500).json({
        message: "Server Error",
        error: error.message,
      });
    }
  },

  // ✅ Edit a Bucket List
  editBucketList: async (req, res) => {
    const { bucketId } = req.params;
    const { title, description, dueDate } = req.body;
    const userId = req.user.id;

    try {
      const bucket = await BucketList.findByPk(bucketId);

      if (!bucket) {
        return res.status(404).json({ message: "Bucket list item not found" });
      }

      if (bucket.userId !== userId) {
        return res.status(403).json({
          message: "Unauthorized to edit this bucket list item",
        });
      }

      const updateData = {
        title: title || bucket.title,
        description: description || bucket.description,
        dueDate: dueDate || bucket.dueDate,
      };

      if (req.file) {
        try {
          // Delete old image if exists
          if (bucket.imageKey) {
            try {
              await s3.send(
                new DeleteObjectCommand({
                  Bucket: process.env.AWS_S3_BUCKET,
                  Key: bucket.imageKey, // Fixed: 'key' should be 'Key'
                })
              );
            } catch (deleteError) {
              console.error("Error deleting old image:", deleteError);
            }
          }

          const uploadResults = await s3Upload([req.file]);
          if (uploadResults.images.length > 0) {
            updateData.imageUrl = uploadResults.images[0].url;
            updateData.imageKey = uploadResults.images[0].key;
          }
        } catch (uploadError) {
          console.error("Upload failed, keeping existing image:", uploadError);
          // Keep existing image if upload fails
        }
      }

      await bucket.update(updateData);

      res.json({
        message: "Bucket list updated successfully",
        bucket,
      });
    } catch (error) {
      console.error("Edit Bucket Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // ✅ Delete a Bucket List
  deleteBucketList: async (req, res) => {
    const { bucketId } = req.params;
    const userId = req.user.id;

    try {
      const bucket = await BucketList.findByPk(bucketId);

      if (!bucket) {
        return res.status(404).json({ message: "Bucket list item not found" });
      }

      // ✅ Authorization Check
      if (bucket.userId !== userId) {
        return res.status(403).json({
          message: "Unauthorized to delete this bucket list item",
        });
      }

      if (bucket.imageKey) {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET,
              key: bucket.imageKey,
            })
          );
        } catch (deleteError) {
          console.error("Error deleting image:", deleteError);
        }
      }

      await bucket.destroy();
      res.json({ message: "Bucket list deleted successfully" });
    } catch (error) {
      console.error("Delete Bucket Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // ✅ Mark Bucket List as Completed
  completeBucketList: async (req, res) => {
    const { bucketId } = req.params;
    const userId = req.user.id;

    try {
      const bucket = await BucketList.findByPk(bucketId);

      if (!bucket) {
        return res.status(404).json({ message: "Bucket list item not found" });
      }

      // ✅ Authorization Check
      if (bucket.userId !== userId) {
        return res.status(403).json({
          message: "Unauthorized to complete this bucket list item",
        });
      }

      await bucket.update({
        isCompleted: true,
        completedAt: new Date(),
      });

      res.json({ message: "Bucket list marked as completed", bucket });
    } catch (error) {
      console.error("Complete Bucket Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  // ✅ Get All Bucket Lists for a User
  getBucketLists: async (req, res) => {
    const userId = req.user.id;

    try {
      const buckets = await BucketList.findAll({
        where: { userId },
        order: [["dueDate", "ASC"]],
      });

      res.json({
        message: "Bucket lists retrieved successfully",
        buckets,
      });
    } catch (error) {
      console.error("Get Bucket Lists Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },

  getBucketList: async (req, res) => {
    const { bucketId } = req.params;
    const userId = req.user.id;

    try {
      const bucket = await BucketList.findByPk(bucketId);

      if (!bucket) {
        return res.status(404).json({ message: "Bucket list item not found" });
      }

      if (bucket.userId !== userId) {
        return res.status(403).json({
          message: "Unauthorized to view this bucket list item",
        });
      }
      res.json({
        message: "Bucket list retrieved successfully",
        bucket,
      });
    } catch (error) {
      console.error("Get Bucket Error:", error);
      res.status(500).json({ message: "Server Error", error: error.message });
    }
  },
};

export default bucketListController;
