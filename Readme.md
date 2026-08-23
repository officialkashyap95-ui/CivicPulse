# CivicPulse 🚦

### AI-Powered Civic Issue Reporting & Priority Management Platform

> **CivicPulse doesn't just collect complaints — it identifies the issues that matter most and tells authorities what to act on first.**

CivicPulse is a smart civic issue reporting platform that connects **citizens and local authorities** through a single digital system.

Citizens can report problems such as **garbage accumulation, drainage issues, damaged roads, streetlight failures, water leakage, and other infrastructure problems** using a description, photograph, and location.

Instead of treating every report as a separate issue, CivicPulse can **cluster similar reports from the same area**, calculate their impact, and create a **priority queue** for authorities.

---

## 🎯 Problem

Citizens in many cities face problems such as:

* Difficulty reporting local civic issues.
* No proper way to track submitted complaints.
* Multiple citizens reporting the same problem separately.
* Authorities receiving large numbers of complaints without clear prioritization.
* Critical issues potentially getting buried under less important complaints.
* Lack of location-based information about civic problems.
* Poor communication between citizens and authorities.

Traditional complaint systems mainly **collect complaints**, but they don't always help authorities understand **which problem should be solved first**.

---

## 💡 Our Solution

CivicPulse creates a complete:

**Citizen → Report → AI Analysis → Clustering → Priority Queue → Authority Action → Resolution**

workflow.

### For Citizens

Citizens can:

* Create an account.
* Report a civic issue.
* Capture/upload a photograph.
* Add a description.
* Select an issue category.
* Share their current location.
* Submit the complaint.
* View their complaint history.
* Track complaint status.

### For Authorities

Authorities can:

* View reported civic issues.
* See issues on a dashboard.
* Search and filter incidents.
* View issue details.
* See the number of affected citizens.
* Identify critical problems.
* View AI-generated priority information.
* Assign issues to departments.
* Update issue status.
* Mark issues as resolved.

---

# ⭐ Key Features

## 1. 📸 Smart Issue Reporting

Citizens can report an issue with:

* Photo
* Description
* Category
* GPS coordinates
* User ID
* Submission timestamp

Example:

```text
Issue: Garbage accumulation
Location: Near college gate
Category: Garbage
Photo: Attached
GPS: Automatically captured
```

---

## 2. 📍 Location-Based Reporting

Every complaint stores:

```text
Latitude
Longitude
```

This allows CivicPulse to understand **where civic problems are happening**.

Location data can also be used for:

* Nearby issue detection
* Issue clustering
* City maps
* Impact analysis
* Authority decision-making

---

## 3. 🔗 Duplicate Issue Clustering

Multiple citizens may report the same problem.

For example:

```text
Citizen 1 → Water leakage → Location A
Citizen 2 → Water leakage → Location A
Citizen 3 → Water leakage → Location A
Citizen 4 → Water leakage → Location A
```

Instead of showing four completely separate problems, CivicPulse can identify them as one common issue:

```text
Water Pipeline Failure

Reports: 4
Location: Location A
```

This reduces duplicate information and helps authorities understand the **actual scale of the problem**.

---

## 4. 🧠 AI-Based Priority Scoring

CivicPulse uses multiple factors to determine how important an issue is.

The priority system considers factors such as:

* Severity
* Public impact
* Urgency
* Infrastructure risk
* Number of reports
* Location
* Number of affected people

The system produces a **Priority Score** that helps authorities decide what needs attention first.

Example:

| Issue                  | Priority |
| ---------------------- | -------: |
| Water Pipeline Failure |      9.8 |
| Electrical Hazard      |      9.6 |
| Major Road Damage      |      9.4 |
| Garbage Accumulation   |      8.7 |

---

## 5. 🚨 Priority Queue

Instead of showing complaints only by submission time, CivicPulse can organize them according to their importance.

Example:

```text
🔴 Critical
Electrical Hazard             9.8
Water Pipeline Failure        9.6

🟠 High
Major Road Damage             9.4
Garbage Accumulation          8.7

🟢 Normal
Streetlight Complaint         6.2
```

This allows authorities to focus on the **most important problems first**.

---

## 6. 👨‍💼 Authority Dashboard

The Authority Dashboard provides a centralized view of civic problems.

It includes:

* Critical issues
* High-priority issues
* Pending issues
* Resolved issues
* Priority queue
* AI insights
* City impact
* Department response
* Recent activity

Authorities can also search and filter reported incidents.

---

## 7. 📊 AI Insight

For important incidents, CivicPulse can explain why an issue received a high priority.

Example:

```text
AI Priority Score: 9.8 / 10

Severity:        10/10
Public Impact:    9/10
Urgency:         10/10
Location Risk:   10/10
```

Possible reasons:

* Large number of reports
* High number of affected citizens
* Rapid increase in reports
* Important location nearby
* Infrastructure risk

This makes the priority score easier for authorities to understand.

---

## 8. ☁️ Cloud Image Storage

Complaint photographs are uploaded to **Cloudinary** rather than being stored directly inside MongoDB.

MongoDB stores the image URL.

Example:

```text
MongoDB
   ↓
imageUrl
   ↓
Cloudinary
   ↓
Complaint Image
```

This keeps the database lightweight while allowing images to be accessed when needed.

---

## 9. 📋 Complaint History

Citizens can view their previously submitted complaints.

Each complaint can show:

* Issue title/description
* Category
* Image
* Location
* Submission date
* Current status
* Priority
* Resolution state

---

## 10. 🔄 Complaint Lifecycle

A complaint can move through different stages:

```text
Submitted
    ↓
Under Review
    ↓
Assigned
    ↓
In Progress
    ↓
Resolved
```

This provides a clear workflow between citizens and authorities.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────┐
                    │     Citizen      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  React Frontend  │
                    └────────┬─────────┘
                             │
                       REST API
                             │
                             ▼
                    ┌──────────────────┐
                    │ Node.js/Express  │
                    │     Backend      │
                    └───────┬──────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
        ┌──────────┐  ┌────────────┐  ┌────────────┐
        │ MongoDB  │  │ Cloudinary │  │ AI/Scoring │
        └──────────┘  └────────────┘  └────────────┘
                            │
                            ▼
                    ┌──────────────────┐
                    │ Authority Portal │
                    └──────────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Vite
* React Router
* Clerk Authentication
* Lucide React
* CSS

## Backend

* Node.js
* Express.js
* REST API
* Multer
* Cloudinary

## Database

* MongoDB
* Mongoose

## Authentication

* Clerk

## Cloud Storage

* Cloudinary

## Development Tools

* VS Code
* Git
* GitHub
* npm

---

# 📁 Project Structure

```text
civicpulse/
│
├── client/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── CitizenDashboard.jsx
│   │   │   ├── AuthorityDashboard.jsx
│   │   │   ├── ReportIssue.jsx
│   │   │   └── ...
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── complaintController.js
│   │   └── clusterController.js
│   │
│   ├── middleware/
│   │   └── upload.js
│   │
│   ├── models/
│   │   ├── Complaint.js
│   │   └── IssueCluster.js
│   │
│   ├── routes/
│   │   ├── complaintRoutes.js
│   │   └── clusterRoutes.js
│   │
│   ├── services/
│   │   ├── clusterService.js
│   │   └── impactScore.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd civicpulse
```

---

## 2. Install frontend dependencies

```bash
cd client
npm install
```

---

## 3. Install backend dependencies

```bash
cd ../server
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

For Clerk, configure the required Clerk keys in the frontend environment according to your Clerk setup.

**Never commit real API keys or secrets to GitHub.**

---

# ▶️ Running the Project

## Start Backend

From the `server` directory:

```bash
node server.js
```

Expected output:

```text
CivicPulse server running on port 5001
MongoDB Connected
```

---

## Start Frontend

Open another terminal:

```bash
cd client
npm run dev
```

Vite will provide the local development URL.

Usually:

```text
http://localhost:5173
```

---

# 🔌 API Endpoints

## Create Complaint

```http
POST /api/complaints
```

Accepts complaint information and an optional image.

Example fields:

```text
userId
description
category
latitude
longitude
image
```

---

## Get All Complaints

```http
GET /api/complaints
```

Used by the authority dashboard to retrieve all reported complaints.

---

## Get User Complaints

```http
GET /api/complaints/user?userId=<USER_ID>
```

Used by the citizen dashboard to retrieve a particular user's complaint history.

---

# 🗃️ Complaint Data Model

A complaint contains information such as:

```text
userId
description
category
imageUrl
latitude
longitude
status
severity
infrastructureRisk
createdAt
updatedAt
```

---

# 🔗 Issue Cluster Data Model

An issue cluster represents multiple complaints that refer to the same or closely related civic issue.

It contains:

```text
title
category
complaintIds
reportCount
latitude
longitude
clusterRadius
severity
publicImpact
urgency
infrastructureRisk
priorityScore
status
assignedDepartment
assignedOfficer
imageUrl
uniqueReporters
clusteringMethod
lastUpdated
```

---

# 🧮 Priority Logic

The final priority score is designed to combine multiple factors rather than relying on a single value.

Conceptually:

```text
Priority =
    Severity
  + Public Impact
  + Urgency
  + Infrastructure Risk
  + Report/Cluster Impact
```

The score is normalized to a scale of:

```text
0 → 10
```

A higher score means the authority should consider the issue more urgent.

> The exact weighting can be adjusted as the system is tested with real civic data.

---

# 🔄 Example Workflow

### Step 1 — Citizen reports an issue

```text
Water leakage
↓
Photo captured
↓
GPS location obtained
↓
Complaint submitted
```

### Step 2 — Backend stores the complaint

```text
React
 ↓
Express API
 ↓
MongoDB
```

Image:

```text
React
 ↓
Express
 ↓
Cloudinary
 ↓
Image URL stored in MongoDB
```

### Step 3 — Similar reports are identified

```text
Report 1 ─┐
Report 2 ─┼──► Water Pipeline Cluster
Report 3 ─┘
```

### Step 4 — Impact is calculated

```text
Reports            → 128
Affected citizens  → 2,400
Severity           → High
Location risk      → High
```

### Step 5 — Priority queue is updated

```text
Water Pipeline Failure
Priority: 9.8 / 10
Status: Critical
```

### Step 6 — Authority takes action

```text
Assign Department
        ↓
Water & Sanitation
        ↓
In Progress
        ↓
Resolved
```

---

# 🏆 USP

### **From scattered complaints to prioritized civic action.**

Most complaint platforms primarily focus on collecting and displaying complaints.

CivicPulse goes one step further by:

1. **Collecting complaints**
2. **Using location information**
3. **Identifying duplicate/similar reports**
4. **Clustering them into common incidents**
5. **Calculating their impact**
6. **Generating a priority score**
7. **Creating an authority priority queue**
8. **Helping authorities act on the most important problems first**

### One-line USP

> **CivicPulse doesn't just collect complaints — it tells authorities what problem to solve first, where it is, and how many people are affected.**

---

# 📈 Feasibility

CivicPulse is highly feasible because it is built using widely available technologies:

* React for the user interface
* Node.js and Express for APIs
* MongoDB for scalable data storage
* Cloudinary for image storage
* GPS for location information
* AI-based scoring for prioritization
* Clustering algorithms for duplicate issue detection

The system can initially be deployed for:

```text
College Campus
      ↓
Local Area
      ↓
Ward
      ↓
City
```

This allows the platform to scale gradually.

---

# 🌍 Future Scope

CivicPulse can be extended with:

* Real-time city maps
* Advanced AI image analysis
* Automatic issue category detection
* Computer vision for infrastructure damage
* Predictive civic issue detection
* Real-time authority notifications
* SMS/WhatsApp notifications
* Department-specific dashboards
* Heatmaps of civic problems
* Advanced analytics
* Government API integration
* IoT sensor integration
* Multilingual citizen reporting
* Offline/low-connectivity reporting
* Mobile application
* Automatic department assignment
* SLA monitoring
* Resolution-time prediction

---

# 🔒 Security Considerations

The production version should include:

* Secure authentication
* Role-based authorization
* API validation
* Rate limiting
* Secure environment variables
* File upload validation
* Image size/type restrictions
* HTTPS
* Database access controls
* Protection against unauthorized complaint modification

---

# 🧪 Testing

The backend APIs can be tested using:

```bash
curl http://localhost:5001/
```

Expected response:

```json
{
  "success": true,
  "message": "CivicPulse API is running"
}
```

Get all complaints:

```bash
curl http://localhost:5001/api/complaints
```

Get complaints for a user:

```bash
curl "http://localhost:5001/api/complaints/user?userId=USER_ID"
```

---

# 👥 User Roles

## Citizen

```text
Register/Login
     ↓
Report Issue
     ↓
Add Photo + Location
     ↓
Submit Complaint
     ↓
Track Complaint
     ↓
View Resolution
```

## Authority

```text
Login
 ↓
View Dashboard
 ↓
View Priority Queue
 ↓
Review Issue
 ↓
Assign Department
 ↓
Update Status
 ↓
Resolve Issue
```

---

# 💬 Example Use Case

A citizen notices a major water leakage near a school.

They submit:

```text
Category:
Water Leakage

Description:
Large water pipeline leakage near school entrance.

Location:
GPS coordinates

Photo:
Attached
```

Soon, several nearby citizens report the same problem.

CivicPulse identifies that these reports are related and creates:

```text
Water Pipeline Failure

Reports: 128
Affected: 2,400
Priority: 9.8 / 10
Status: Critical
```

The authority sees this issue at the top of the priority queue and can immediately assign it to the **Water & Sanitation Department**.

This turns many individual complaints into **one actionable civic incident**.

---

# 🚀 Vision

Our vision is to make civic reporting **smarter, faster, and more actionable**.

Instead of:

```text
Citizen complains
       ↓
Complaint stored
       ↓
Wait
```

CivicPulse aims to create:

```text
Citizen Report
      ↓
Location + Image
      ↓
AI Analysis
      ↓
Duplicate Detection
      ↓
Issue Clustering
      ↓
Impact Analysis
      ↓
Priority Queue
      ↓
Authority Action
      ↓
Resolution
```

---

# 📌 Project Status

### Current Development

* [x] Citizen dashboard
* [x] Authority dashboard
* [x] Authentication
* [x] Complaint submission
* [x] Photo capture/upload
* [x] GPS location capture
* [x] MongoDB integration
* [x] Cloudinary image storage
* [x] Complaint history
* [x] Authority complaint listing
* [x] Issue cluster data model
* [x] Priority scoring structure
* [ ] Advanced automatic clustering
* [ ] Production-ready AI analysis
* [ ] Real-time notifications
* [ ] Production deployment

---

# 👨‍💻 Team

**CivicPulse Team**

Built as a smart civic technology solution focused on improving communication between citizens and local authorities.

---

# 📄 License

This project is developed for educational, hackathon, and demonstration purposes.

Add an appropriate open-source license before public production distribution.

---

## ⭐ Final Pitch

> **“CivicPulse transforms scattered citizen complaints into prioritized civic incidents, helping authorities understand what is happening, where it is happening, how many people are affected, and what needs to be solved first.”**
