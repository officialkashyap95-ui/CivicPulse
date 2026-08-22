import React, { useState } from "react";
import {
  Activity,
  Bell,
  Menu,
  X,
  Search,
  ChevronRight,
  CircleAlert,
  TriangleAlert,
  Clock3,
  CheckCircle2,
  MapPin,
  Users,
  FileText,
  Sparkles,
  Building2,
  ArrowRight,
  Filter,
  MoreHorizontal,
} from "lucide-react";

import "./AuthorityDashboard.css";

const incidents = [
  {
    id: "INC-1024",
    title: "Water Pipeline Failure",
    category: "Water Infrastructure",
    location: "North Ward",
    time: "2 hours ago",
    reports: 128,
    affected: "2,400",
    priority: 9.8,
    status: "CRITICAL",
    color: "critical",
  },
  {
    id: "INC-1025",
    title: "Electrical Hazard",
    category: "Public Safety",
    location: "Market Road",
    time: "3 hours ago",
    reports: 74,
    affected: "1,200",
    priority: 9.6,
    status: "CRITICAL",
    color: "critical",
  },
  {
    id: "INC-1026",
    title: "Major Road Damage",
    category: "Road Infrastructure",
    location: "East Sector",
    time: "Today",
    reports: 96,
    affected: "3,100",
    priority: 9.4,
    status: "HIGH",
    color: "high",
  },
  {
    id: "INC-1027",
    title: "Garbage Accumulation",
    category: "Waste Management",
    location: "Central Ward",
    time: "Yesterday",
    reports: 42,
    affected: "850",
    priority: 8.7,
    status: "HIGH",
    color: "high",
  },
];

function Logo() {
  return (
    <div className="cp-logo">
      <div className="cp-logo-icon">
        <Activity size={20} />
      </div>

      <span className="cp-logo-text">
        Civic<span>Pulse</span>
      </span>

      <span className="authority-label">Authority Portal</span>
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge ${status.toLowerCase()}`}>
      {status}
    </span>
  );
}

function MetricCard({ icon, title, value, text, type = "" }) {
  return (
    <div className={`metric-card ${type}`}>
      <div className="metric-icon">{icon}</div>

      <div>
        <p className="metric-title">{title}</p>
        <h3>{value}</h3>
        <p className="metric-subtitle">{text}</p>
      </div>
    </div>
  );
}

export default function AuthorityDashboard() {
  const [mobileMenu, setMobileMenu] = useState(false);

  // Modal state.
  // null means no incident modal is open.
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Incident used for the permanent AI Insight section.
  const activeIncident = incidents[0];

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredIncidents = incidents.filter((incident) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      incident.title.toLowerCase().includes(searchText) ||
      incident.location.toLowerCase().includes(searchText) ||
      incident.category.toLowerCase().includes(searchText);

    const matchesFilter =
      filter === "All" || incident.status === filter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="authority-page">

      {/* ================= NAVBAR ================= */}

      <header className="top-nav">

        <Logo />

        <nav className={`main-nav ${mobileMenu ? "mobile-open" : ""}`}>

          <a className="active" href="#">
            Overview
          </a>

          <a href="#">
            Priority Queue
          </a>

          <a href="#">
            All Issues
          </a>

          <a href="#">
            City Map
          </a>

          <a href="#">
            Analytics
          </a>

        </nav>

        <div className="nav-right">

          <button
            className="icon-button"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="notification-dot" />
          </button>

          <div className="profile">

            <div className="profile-avatar">
              RS
            </div>

            <div className="profile-info">
              <strong>Rahul Sharma</strong>
              <span>Municipal Officer</span>
            </div>

          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenu((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="dashboard-container">

        {/* ================= WELCOME ================= */}

        <section className="welcome-section">

          <div>

            <p className="eyebrow">
              MUNICIPAL OPERATIONS
            </p>

            <h1>
              Good morning, Rahul.
            </h1>

            <p className="welcome-text">
              Monitor civic issues, prioritize urgent incidents,
              and coordinate faster responses.
            </p>

          </div>

          <div className="welcome-actions">

            <button className="primary-button">
              View priority queue
              <ArrowRight size={17} />
            </button>

            <button className="secondary-button">
              <MapPin size={17} />
              Open city map
            </button>

          </div>

        </section>


        {/* ================= METRICS ================= */}

        <section className="metrics-grid">

          <MetricCard
            type="critical-card"
            icon={<CircleAlert size={20} />}
            title="Critical issues"
            value="12"
            text="Needs immediate attention"
          />

          <MetricCard
            icon={<TriangleAlert size={20} />}
            title="High priority"
            value="37"
            text="Currently active"
          />

          <MetricCard
            icon={<Clock3 size={20} />}
            title="Pending"
            value="284"
            text="Awaiting action"
          />

          <MetricCard
            icon={<CheckCircle2 size={20} />}
            title="Resolved"
            value="892"
            text="This month"
          />

        </section>


        {/* ================= MAIN GRID ================= */}

        <section className="main-grid">

          {/* ================= LEFT COLUMN ================= */}

          <div className="left-column">

            {/* ===== PRIORITY QUEUE ===== */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <p className="eyebrow">
                    AI PRIORITY
                  </p>

                  <h2>
                    Incidents requiring attention
                  </h2>

                </div>

                <button className="text-button">
                  View all
                  <ArrowRight size={15} />
                </button>

              </div>


              {/* SEARCH */}

              <div className="filter-bar">

                <div className="search-box">

                  <Search size={17} />

                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search incidents..."
                  />

                </div>


                <div className="filter-select">

                  <Filter size={16} />

                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(event.target.value)
                    }
                  >

                    <option value="All">
                      All
                    </option>

                    <option value="CRITICAL">
                      Critical
                    </option>

                    <option value="HIGH">
                      High
                    </option>

                  </select>

                </div>

              </div>


              {/* INCIDENT LIST */}

              <div className="incident-list">

                {filteredIncidents.length > 0 ? (

                  filteredIncidents.map((incident) => (

                    <div
                      className={`incident-row ${
                        selectedIncident?.id === incident.id
                          ? "selected"
                          : ""
                      }`}
                      key={incident.id}
                      onClick={() =>
                        setSelectedIncident(incident)
                      }
                    >

                      <div
                        className={`incident-icon ${incident.color}`}
                      >

                        {incident.status === "CRITICAL" ? (
                          <CircleAlert size={19} />
                        ) : (
                          <TriangleAlert size={19} />
                        )}

                      </div>


                      <div className="incident-main">

                        <div className="incident-title-row">

                          <h3>
                            {incident.title}
                          </h3>

                          <StatusBadge
                            status={incident.status}
                          />

                        </div>

                        <p>
                          {incident.category} ·{" "}
                          {incident.location}
                        </p>


                        <div className="incident-meta">

                          <span>
                            <Clock3 size={13} />
                            {incident.time}
                          </span>

                          <span>
                            <FileText size={13} />
                            {incident.reports} reports
                          </span>

                          <span>
                            <Users size={13} />
                            {incident.affected} affected
                          </span>

                        </div>

                      </div>


                      <div className="priority-score">

                        <span>
                          Priority
                        </span>

                        <strong>
                          {incident.priority}
                        </strong>

                      </div>


                      <ChevronRight
                        className="incident-arrow"
                        size={19}
                      />

                    </div>

                  ))

                ) : (

                  <div className="empty-state">

                    <Search size={25} />

                    <strong>
                      No incidents found
                    </strong>

                    <span>
                      Try another search or filter.
                    </span>

                  </div>

                )}

              </div>

            </div>


            {/* ===== AI INSIGHT ===== */}

            <div className="ai-insight">

              <div className="ai-header">

                <div className="ai-icon">
                  <Sparkles size={19} />
                </div>

                <div>

                  <p className="eyebrow">
                    AI INSIGHT
                  </p>

                  <h2>
                    Why {activeIncident.title} is critical
                  </h2>

                </div>

              </div>


              {/* SCORE */}

              <div className="ai-score">

                <div>

                  <span>
                    AI Priority Score
                  </span>

                  <strong>
                    {activeIncident.priority} / 10
                  </strong>

                </div>


                <div className="score-bar">

                  <div
                    style={{
                      width: `${activeIncident.priority * 10}%`,
                    }}
                  />

                </div>

              </div>


              {/* AI METRICS */}

              <div className="ai-metrics">

                <div>
                  <span>Severity</span>
                  <strong>10/10</strong>
                </div>

                <div>
                  <span>Public Impact</span>
                  <strong>9/10</strong>
                </div>

                <div>
                  <span>Urgency</span>
                  <strong>10/10</strong>
                </div>

                <div>
                  <span>Location Risk</span>
                  <strong>10/10</strong>
                </div>

              </div>


              {/* DETECTION */}

              <div className="ai-detected">

                <strong>
                  AI detected
                </strong>

                <ul>

                  <li>
                    128 citizen reports
                  </li>

                  <li>
                    2,400 people potentially affected
                  </li>

                  <li>
                    Reports increasing rapidly
                  </li>

                  <li>
                    Located near a school
                  </li>

                  <li>
                    Main road partially blocked
                  </li>

                </ul>

              </div>


              {/* RECOMMENDATION */}

              <div className="recommendation">

                <span>
                  Recommended action
                </span>

                <p>
                  Dispatch Water &amp; Sanitation
                  immediately.
                </p>

              </div>


              <div className="ai-actions">

                <button className="primary-button">

                  Assign department

                  <ArrowRight size={16} />

                </button>

                <button
                  className="secondary-button"
                  onClick={() =>
                    setSelectedIncident(activeIncident)
                  }
                >
                  View incident
                </button>

              </div>

            </div>

          </div>


          {/* ================= RIGHT COLUMN ================= */}

          <div className="right-column">

            {/* ===== CITY MAP ===== */}

            <div className="dashboard-card map-card">

              <div className="card-header">

                <div>

                  <p className="eyebrow">
                    NEARBY NOW
                  </p>

                  <h2>
                    City impact
                  </h2>

                </div>

                <button className="text-button">
                  Map view →
                </button>

              </div>


              <div className="fake-map">

                <div className="road road-1" />
                <div className="road road-2" />
                <div className="road road-3" />
                <div className="road road-4" />
                <div className="road road-5" />

                <span className="map-marker critical m1" />
                <span className="map-marker high m2" />
                <span className="map-marker critical m3" />
                <span className="map-marker resolved m4" />
                <span className="map-marker selected m5" />

              </div>


              <div className="map-legend">

                <span>
                  <i className="legend-dot critical" />
                  Critical
                </span>

                <span>
                  <i className="legend-dot high" />
                  High
                </span>

                <span>
                  <i className="legend-dot resolved" />
                  Resolved
                </span>

              </div>


              <div className="map-incident">

                <div>

                  <div className="map-incident-title">

                    <h3>
                      Water Pipeline Failure
                    </h3>

                    <StatusBadge status="CRITICAL" />

                  </div>

                  <p>
                    <MapPin size={14} />
                    250m away
                  </p>

                </div>


                <div className="impact-grid">

                  <div>
                    <strong>128</strong>
                    <span>Reports</span>
                  </div>

                  <div>
                    <strong>2,400</strong>
                    <span>Affected</span>
                  </div>

                  <div>
                    <strong>94</strong>
                    <span>Impact score</span>
                  </div>

                </div>


                <button
                  className="primary-button full-width"
                  onClick={() =>
                    setSelectedIncident(activeIncident)
                  }
                >
                  View incident
                  <ArrowRight size={16} />
                </button>

              </div>

            </div>


            {/* ===== QUICK ACTIONS ===== */}

            <div className="dashboard-card">

              <div className="card-header">

                <div>

                  <p className="eyebrow">
                    QUICK ACTIONS
                  </p>

                  <h2>
                    Take action
                  </h2>

                </div>

              </div>


              <div className="quick-actions">

                <button>

                  <CircleAlert size={18} />

                  Review critical issues

                  <ChevronRight size={16} />

                </button>


                <button>

                  <Building2 size={18} />

                  Assign department

                  <ChevronRight size={16} />

                </button>


                <button>

                  <MapPin size={18} />

                  Open city map

                  <ChevronRight size={16} />

                </button>


                <button>

                  <FileText size={18} />

                  View unresolved issues

                  <ChevronRight size={16} />

                </button>

              </div>

            </div>

          </div>

        </section>


        {/* ================= DEPARTMENTS ================= */}

        <section className="dashboard-card department-card">

          <div className="card-header">

            <div>

              <p className="eyebrow">
                OPERATIONS
              </p>

              <h2>
                Department response
              </h2>

            </div>

          </div>


          <div className="department-list">

            {[
              [
                "Water & Sanitation",
                18,
                7,
                82,
                "12 hrs",
              ],
              [
                "Roads & Infrastructure",
                24,
                11,
                96,
                "21 hrs",
              ],
              [
                "Waste Management",
                16,
                8,
                112,
                "8 hrs",
              ],
              [
                "Electricity",
                9,
                5,
                64,
                "15 hrs",
              ],
            ].map((dept) => (

              <div
                className="department-row"
                key={dept[0]}
              >

                <div className="department-name">

                  <Building2 size={18} />

                  <strong>
                    {dept[0]}
                  </strong>

                </div>

                <div className="department-stat">
                  <strong>{dept[1]}</strong>
                  <span>Open</span>
                </div>

                <div className="department-stat">
                  <strong>{dept[2]}</strong>
                  <span>In progress</span>
                </div>

                <div className="department-stat">
                  <strong>{dept[3]}</strong>
                  <span>Resolved</span>
                </div>

                <div className="response-time">
                  <span>Avg. response</span>
                  <strong>{dept[4]}</strong>
                </div>

              </div>

            ))}

          </div>

        </section>


        {/* ================= RECENT ACTIVITY ================= */}

        <section className="dashboard-card activity-card">

          <div className="card-header">

            <div>

              <p className="eyebrow">
                RECENT ACTIVITY
              </p>

              <h2>
                Latest actions
              </h2>

            </div>

            <button
              className="icon-button"
              aria-label="More actions"
            >
              <MoreHorizontal size={19} />
            </button>

          </div>


          <div className="activity-list">

            <div className="activity-row">

              <div className="activity-dot blue" />

              <div>
                <strong>
                  Water Pipeline Failure
                </strong>

                <p>
                  Assigned to Water &amp; Sanitation
                </p>
              </div>

              <span>
                5 min ago
              </span>

            </div>


            <div className="activity-row">

              <div className="activity-dot amber" />

              <div>
                <strong>
                  Streetlight Outage
                </strong>

                <p>
                  Marked In Progress
                </p>
              </div>

              <span>
                18 min ago
              </span>

            </div>


            <div className="activity-row">

              <div className="activity-dot teal" />

              <div>
                <strong>
                  Garbage Accumulation
                </strong>

                <p>
                  Resolved by Sanitation Team
                </p>
              </div>

              <span>
                1 hour ago
              </span>

            </div>


            <div className="activity-row">

              <div className="activity-dot red" />

              <div>
                <strong>
                  Road Damage
                </strong>

                <p>
                  Priority increased from 7.4 → 9.4
                </p>
              </div>

              <span>
                2 hours ago
              </span>

            </div>

          </div>

        </section>

      </main>


      {/* ================= INCIDENT MODAL ================= */}

      {selectedIncident !== null && (

        <div
          className="modal-overlay"
          onClick={(event) => {

            if (event.target === event.currentTarget) {
              setSelectedIncident(null);
            }

          }}
        >

          <div className="incident-modal">

            <button
              className="modal-close"
              onClick={() =>
                setSelectedIncident(null)
              }
              aria-label="Close incident"
            >
              <X size={20} />
            </button>


            <p className="eyebrow">
              INCIDENT #{selectedIncident.id}
            </p>

            <h2>
              {selectedIncident.title}
            </h2>


            <div className="modal-status-row">

              <StatusBadge
                status={selectedIncident.status}
              />

              <strong>
                Priority {selectedIncident.priority}/10
              </strong>

            </div>


            <div className="modal-info-grid">

              <div>
                <span>Location</span>
                <strong>
                  {selectedIncident.location}
                </strong>
              </div>

              <div>
                <span>Reports</span>
                <strong>
                  {selectedIncident.reports}
                </strong>
              </div>

              <div>
                <span>Affected</span>
                <strong>
                  {selectedIncident.affected}
                </strong>
              </div>

              <div>
                <span>Category</span>
                <strong>
                  {selectedIncident.category}
                </strong>
              </div>

            </div>


            <div className="modal-section">

              <p className="eyebrow">
                AI ANALYSIS
              </p>

              <div className="modal-analysis">

                <div>
                  <span>Severity</span>
                  <strong>10/10</strong>
                </div>

                <div>
                  <span>Public Impact</span>
                  <strong>9/10</strong>
                </div>

                <div>
                  <span>Urgency</span>
                  <strong>10/10</strong>
                </div>

                <div>
                  <span>Location Risk</span>
                  <strong>10/10</strong>
                </div>

              </div>

            </div>


            <div className="modal-recommendation">

              <Sparkles size={18} />

              <div>

                <strong>
                  AI Recommendation
                </strong>

                <p>
                  Immediate intervention recommended.
                  Dispatch Water &amp; Sanitation
                  immediately.
                </p>

              </div>

            </div>


            <div className="modal-actions">

              <button className="primary-button">
                Assign Department
              </button>

              <button className="secondary-button">
                Update Status
              </button>

              <button className="success-button">
                Mark Resolved
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}