import express from "express";

import {
  getClusters,
  getPriorityQueueController,
} from "../controllers/clusterController.js";

const router = express.Router();


// GET /api/clusters

router.get(
  "/",
  getClusters
);


// GET /api/clusters/priority

router.get(
  "/priority",
  getPriorityQueueController
);


export default router;