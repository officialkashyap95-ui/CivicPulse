import IssueCluster from "../models/IssueCluster.js";
import {
  getPriorityQueue,
} from "../services/clusterService.js";


// ==========================================
// GET ALL CLUSTERS
// ==========================================

export const getClusters = async (
  req,
  res,
  next
) => {
  try {
    const clusters = await IssueCluster.find()
      .populate("complaintIds")
      .sort({
        priorityScore: -1,
        reportCount: -1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: clusters.length,
      clusters,
    });

  } catch (error) {
    console.error(
      "Get clusters error:",
      error
    );

    next(error);
  }
};


// ==========================================
// PRIORITY QUEUE
// ==========================================

export const getPriorityQueueController = async (
  req,
  res,
  next
) => {
  try {
    const clusters =
      await getPriorityQueue();

    res.status(200).json({
      success: true,
      count: clusters.length,
      clusters,
    });

  } catch (error) {
    console.error(
      "Get priority queue error:",
      error
    );

    next(error);
  }
};