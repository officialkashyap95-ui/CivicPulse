import mongoose from "mongoose";

const issueClusterSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC ISSUE INFORMATION
    // ==========================================

    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "other",
      trim: true,
    },

    // ==========================================
    // COMPLAINTS MERGED INTO THIS CLUSTER
    // ==========================================

    complaintIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint",
      },
    ],

    reportCount: {
      type: Number,
      default: 1,
      min: 1,
    },

    // ==========================================
    // LOCATION
    // ==========================================

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    // Approximate radius covered by this cluster
    clusterRadius: {
      type: Number,
      default: 100,
      min: 0,
    },

    // ==========================================
    // AI PRIORITY FACTORS
    // ==========================================

    severity: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    publicImpact: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    urgency: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    infrastructureRisk: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    // Final score used by Authority Priority Queue
    priorityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "resolved",
      ],
      default: "submitted",
    },

    // ==========================================
    // AUTHORITY ASSIGNMENT
    // ==========================================

    assignedDepartment: {
      type: String,
      default: null,
      trim: true,
    },

    assignedOfficer: {
      type: String,
      default: null,
      trim: true,
    },

    // ==========================================
    // REPRESENTATIVE IMAGE
    // ==========================================

    imageUrl: {
      type: String,
      default: null,
    },

    // ==========================================
    // CLUSTER METADATA
    // ==========================================

    // Number of unique citizens reporting this issue
    uniqueReporters: {
      type: Number,
      default: 1,
      min: 1,
    },

    // How the cluster was created
    clusteringMethod: {
      type: String,
      enum: ["automatic", "manual"],
      default: "automatic",
    },

    // ==========================================
    // TIMESTAMPS
    // ==========================================

    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

// Priority Queue
// Highest priority first, while keeping status available
// for filtering active/resolved issues.
issueClusterSchema.index({
  priorityScore: -1,
  status: 1,
});

// Category filtering
issueClusterSchema.index({
  category: 1,
});

// Location lookup
issueClusterSchema.index({
  latitude: 1,
  longitude: 1,
});

// Status filtering
issueClusterSchema.index({
  status: 1,
});

// ==========================================
// AUTOMATIC UPDATE
// ==========================================

issueClusterSchema.pre("save", function (next) {
  this.lastUpdated = new Date();
  next();
});

// ==========================================
// MODEL
// ==========================================

const IssueCluster = mongoose.model(
  "IssueCluster",
  issueClusterSchema
);

export default IssueCluster;