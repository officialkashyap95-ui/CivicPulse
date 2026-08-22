import express from "express";

import {
  createComplaint,
  getComplaints,
} from "../controllers/complaintController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  upload.single("image"),
  createComplaint
);

router.get("/", getComplaints);

export default router;