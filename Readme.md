# CivicPulse

> Turn community voices into prioritized action.

CivicPulse helps public authorities turn unstructured citizen complaints into explainable, actionable priorities. Rather than sorting tickets by volume alone, it groups related reports into real-world issues and ranks them using a transparent impact score.

## The problem

Cities receive many complaints about the same problem—often with different wording and from different people. This creates noise for authorities and delays response to high-impact issues.

## Our solution

1. A citizen submits an issue with its description, category, location, and optional photo.
2. AI extracts structured signals such as category, severity, infrastructure risk, and a summary.
3. Nearby, related reports are grouped into a single issue cluster.
4. A deterministic scoring model calculates the cluster's impact score and priority.
5. Authorities see an AI-ranked queue, assign a team, and update the resolution status.
6. Citizens can track the status of their submitted complaint.

## Key features

- Citizen issue reporting
- AI-assisted classification and severity extraction
- Duplicate detection and issue clustering
- Explainable impact scoring
- Authority priority queue
- Team assignment and complaint-status tracking

## Impact scoring

AI understands a complaint, but it does not make the final high-stakes priority decision. CivicPulse uses a transparent, weighted model:

```text
Impact Score =
  0.25 × Severity
+ 0.25 × People Affected
+ 0.15 × Report Density
+ 0.15 × Location Sensitivity
+ 0.10 × Duration
+ 0.10 × Infrastructure Risk
```

| Score | Priority |
| --- | --- |
| 80–100 | Critical |
| 60–79 | High |
| 40–59 | Medium |
| 0–39 | Low |

Critical-safety reports are always marked **Critical**.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, React Router, Lucide React
- Backend: Node.js, Express
- Database: MongoDB Atlas with Mongoose
- AI: Gemini API
- Maps: Google Maps
- Image storage: Cloudinary (optional)

## Project structure

```text
civicpulse/
├── client/                 # React + Vite frontend
│   └── src/
│       ├── pages/
│       ├── components/
│       └── api/
└── server/                 # Express API
    ├── models/
    ├── controllers/
    ├── routes/
    └── services/
```

## Run locally

### Client

```bash
cd client
npm install
npm run dev
```

### Server

```bash
cd server
npm install
npm run dev
```

Create `server/.env` with:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

## Demo story

1. Submit a water-leak complaint near a government school.
2. Submit a second related report.
3. Show that both reports are clustered into one issue.
4. Explain the impact score and why it is critical.
5. Show the issue at the top of the authority priority queue.
6. Assign a response team and update the issue to resolved.
7. Show the updated status to the citizen.

## Team

Built for a hackathon by the CivicPulse team.

