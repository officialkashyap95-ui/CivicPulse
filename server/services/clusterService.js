import Complaint from "../models/Complaint.js";
import IssueCluster from "../models/IssueCluster.js";
import {
  calculateImpactScore,
} from "./impactScore.js";


// ==========================================
// DISTANCE BETWEEN TWO GPS POINTS
// Returns distance in meters
// ==========================================

const calculateDistance = (
  lat1,
  lon1,
  lat2,
  lon2
) => {
  const R = 6371000;

  const toRadians = (degree) =>
    (degree * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};


// ==========================================
// TEXT SIMILARITY
// Simple keyword based similarity
// ==========================================

const calculateTextSimilarity = (text1, text2) => {
  if (!text1 || !text2) {
    return 0;
  }

  const words1 = new Set(
    text1
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
  );

  const words2 = new Set(
    text2
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)
  );

  if (!words1.size || !words2.size) {
    return 0;
  }

  const intersection = [...words1].filter((word) =>
    words2.has(word)
  );

  const union = new Set([
    ...words1,
    ...words2,
  ]);

  return intersection.length / union.size;
};


// ==========================================
// CATEGORY SIMILARITY
// ==========================================

const categoriesMatch = (category1, category2) => {
  if (!category1 || !category2) {
    return false;
  }

  return (
    category1.toLowerCase() ===
    category2.toLowerCase()
  );
};


// ==========================================
// FIND POSSIBLE EXISTING CLUSTER
// ==========================================

const findMatchingCluster = async (complaint) => {
  const clusters = await IssueCluster.find({
    category: complaint.category,
    status: {
      $ne: "resolved",
    },
  }).populate("complaintIds");

  let bestCluster = null;
  let bestScore = 0;

  for (const cluster of clusters) {
    const distance = calculateDistance(
      complaint.latitude,
      complaint.longitude,
      cluster.latitude,
      cluster.longitude
    );

    // Ignore complaints farther than 100 meters.
    if (distance > 100) {
      continue;
    }

    const nearbyScore = Math.max(
      0,
      1 - distance / 100
    );

    let textScore = 0;

    /*
     * Compare with complaints already inside
     * this cluster.
     */
    for (const existingComplaint of cluster.complaintIds) {
      const similarity = calculateTextSimilarity(
        complaint.description,
        existingComplaint.description
      );

      textScore = Math.max(
        textScore,
        similarity
      );
    }

    /*
     * Location is the strongest signal.
     * Text similarity helps distinguish
     * two different problems in the same area.
     */
    const finalScore =
      nearbyScore * 0.65 +
      textScore * 0.35;

    if (finalScore > bestScore) {
      bestScore = finalScore;
      bestCluster = cluster;
    }
  }

  /*
   * 0.55 is intentionally moderate for
   * the hackathon demo.
   */
  if (bestScore >= 0.55) {
    return bestCluster;
  }

  return null;
};


// ==========================================
// CREATE OR UPDATE CLUSTER
// ==========================================

export const processComplaintCluster = async (
  complaint
) => {
  try {
    const existingCluster =
      await findMatchingCluster(complaint);

    // ========================================
    // EXISTING CLUSTER
    // ========================================

    if (existingCluster) {
      existingCluster.complaintIds.push(
        complaint._id
      );

      existingCluster.reportCount =
        existingCluster.complaintIds.length;

      /*
       * Update location using average coordinates.
       */
      existingCluster.latitude =
        (
          existingCluster.latitude *
            (existingCluster.reportCount - 1) +
          complaint.latitude
        ) / existingCluster.reportCount;

      existingCluster.longitude =
        (
          existingCluster.longitude *
            (existingCluster.reportCount - 1) +
          complaint.longitude
        ) / existingCluster.reportCount;

      /*
       * Keep latest image if cluster
       * didn't previously have one.
       */
      if (
        !existingCluster.imageUrl &&
        complaint.imageUrl
      ) {
        existingCluster.imageUrl =
          complaint.imageUrl;
      }

      /*
       * Increase public impact with
       * additional reports.
       */
      existingCluster.publicImpact =
        Math.min(
          5 +
            Math.log10(
              existingCluster.reportCount + 1
            ) *
              2,
          10
        );

      /*
       * If complaint contains severity/risk,
       * keep the strongest value.
       */
      existingCluster.severity =
        Math.max(
          existingCluster.severity,
          complaint.severity || 0
        );

      existingCluster.infrastructureRisk =
        Math.max(
          existingCluster.infrastructureRisk,
          complaint.infrastructureRisk || 0
        );

      /*
       * Urgency grows with number of reports.
       */
      existingCluster.urgency =
        Math.min(
          4 +
            Math.log10(
              existingCluster.reportCount + 1
            ) *
              3,
          10
        );

      existingCluster.priorityScore =
        calculateImpactScore({
          severity: existingCluster.severity,
          publicImpact:
            existingCluster.publicImpact,
          urgency:
            existingCluster.urgency,
          infrastructureRisk:
            existingCluster.infrastructureRisk,
          reportCount:
            existingCluster.reportCount,
        });

      existingCluster.lastUpdated =
        new Date();

      await existingCluster.save();

      return {
        cluster: existingCluster,
        created: false,
      };
    }


    // ========================================
    // NEW CLUSTER
    // ========================================

    const title =
      complaint.description.length > 80
        ? `${complaint.description.substring(
            0,
            80
          )}...`
        : complaint.description;

    const reportCount = 1;

    const newCluster =
      await IssueCluster.create({
        title,

        category:
          complaint.category || "other",

        complaintIds: [
          complaint._id,
        ],

        reportCount,

        latitude:
          complaint.latitude,

        longitude:
          complaint.longitude,

        severity:
          complaint.severity || 0,

        publicImpact: 2,

        urgency: 3,

        infrastructureRisk:
          complaint.infrastructureRisk || 0,

        priorityScore:
          calculateImpactScore({
            severity:
              complaint.severity || 0,

            publicImpact: 2,

            urgency: 3,

            infrastructureRisk:
              complaint.infrastructureRisk || 0,

            reportCount,
          }),

        status:
          complaint.status || "submitted",

        imageUrl:
          complaint.imageUrl || null,

        lastUpdated:
          new Date(),
      });

    return {
      cluster: newCluster,
      created: true,
    };

  } catch (error) {
    console.error(
      "Cluster processing error:",
      error
    );

    throw error;
  }
};


// ==========================================
// GET PRIORITY QUEUE
// ==========================================

export const getPriorityQueue = async () => {
  return IssueCluster.find({
    status: {
      $ne: "resolved",
    },
  })
    .populate("complaintIds")
    .sort({
      priorityScore: -1,
      reportCount: -1,
      createdAt: -1,
    });
};