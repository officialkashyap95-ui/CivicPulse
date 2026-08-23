import Complaint from "../models/Complaint.js";
import cloudinary from "../config/cloudinary.js";

// ==========================================
// CREATE COMPLAINT
// ==========================================

export const createComplaint = async (req, res, next) => {
  try {
    const {
      userId,
      description,
      category,
      latitude,
      longitude,
    } = req.body;

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (
      !description ||
      latitude === undefined ||
      longitude === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Description, latitude and longitude are required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ----------------------------------------
    // IMAGE UPLOAD
    // ----------------------------------------

    let imageUrl = null;

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "civicpulse/complaints",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // ----------------------------------------
    // SAVE TO MONGODB
    // ----------------------------------------

    const complaint = await Complaint.create({
      userId,
      description,
      category: category || "other",
      imageUrl,
      latitude: Number(latitude),
      longitude: Number(longitude),
      status: "submitted",
    });

    // ----------------------------------------
    // RESPONSE
    // ----------------------------------------

    res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaintId: complaint._id,
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);
    next(error);
  }
};


// ==========================================
// GET ALL COMPLAINTS
// AUTHORITY DASHBOARD
// ==========================================

export const getComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find()
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get all complaints error:", error);
    next(error);
  }
};


// ==========================================
// GET USER COMPLAINTS
// CITIZEN DASHBOARD
// ==========================================

export const getUserComplaints = async (req, res, next) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const complaints = await Complaint.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    console.error("Get user complaints error:", error);
    next(error);
  }
};