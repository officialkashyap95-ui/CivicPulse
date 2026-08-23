import express from "express";

import {
  createComplaint,
  getComplaints,
  getUserComplaints,
} from "../controllers/complaintController.js";

import upload from "../middleware/upload.js";

const router = express.Router();


// ==========================================
// CREATE COMPLAINT
// POST /api/complaints
// ==========================================

router.post(
  "/",
  upload.single("image"),
  createComplaint
);


// ==========================================
// AUTHORITY
// GET ALL COMPLAINTS
// GET /api/complaints
// ==========================================

router.get(
  "/",
  getComplaints
);


// ==========================================
// CITIZEN
// GET USER COMPLAINTS
// GET /api/complaints/user?userId=...
// ==========================================

router.get(
  "/user",
  getUserComplaints
);


export default router;