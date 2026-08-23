import React, { useEffect, useMemo, useState } from "react";
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

const API_URL = "http://localhost:5001/api";

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
  const normalized = (status || "SUBMITTED").toUpperCase();

  return (
    <span className={`status-badge ${normalized.toLowerCase()}`}>
      {normalized.replace("_", " ")}
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

/*
  Convert backend complaint into the structure
  expected by the existing Authority Dashboard UI.
*/
function formatComplaint(complaint, index) {
  const status = (complaint.status || "submitted").toUpperCase();

  const severity = Number(complaint.severity || 0);
  const infrastructureRisk = Number(
    complaint.infrastructureRisk || 0
  );

  /*
    Your backend currently stores severity and
    infrastructureRisk.

    Until the complete AI impact score is connected,
    we calculate a temporary authority priority score.
  */
  let priority = Math.max(
    severity,
    infrastructureRisk
  );

  if (priority <= 0) {
    priority = 5;
  }

  // Convert 0-100 score to 0-10
  const priorityOutOf10 =
    priority > 10 ? priority / 10 : priority;

  let priorityStatus = "MEDIUM";

  if (priorityOutOf10 >= 9) {
    priorityStatus = "CRITICAL";
  } else if (priorityOutOf10 >= 7) {
    priorityStatus = "HIGH";
  } else if (priorityOutOf10 >= 4) {
    priorityStatus = "MEDIUM";
  } else {
    priorityStatus = "LOW";
  }

  return {
    id:
      complaint._id ||
      `INC-${1000 + index}`,

    title:
      complaint.title ||
      getCategoryTitle(complaint.category),

    category:
      formatCategory(complaint.category),

    location:
      complaint.locationName ||
      "Reported Location",

    time: formatTime(complaint.createdAt),

    reports:
      complaint.reportCount ||
      1,

    affected:
      complaint.peopleAffected ||
      "—",

    priority:
      Number(priorityOutOf10.toFixed(1)),

    status:
      priorityStatus,

    complaintStatus:
      status,

    color:
      priorityStatus === "CRITICAL"
        ? "critical"
        : priorityStatus === "HIGH"
        ? "high"
        : priorityStatus === "LOW"
        ? "resolved"
        : "medium",

    description:
      complaint.description || "",

    imageUrl:
      complaint.imageUrl || null,

    latitude:
      complaint.latitude,

    longitude:
      complaint.longitude,

    severity,

    infrastructureRisk,
  };
}

function getCategoryTitle(category) {
  const titles = {
    water_leakage: "Water Leakage",
    road_damage: "Road Damage",
    garbage: "Garbage Accumulation",
    streetlight: "Streetlight Outage",
    electrical: "Electrical Hazard",
    drainage: "Drainage Problem",
    other: "Civic Issue",
  };

  return titles[category] || "Civic Issue";
}

function formatCategory(category) {
  if (!category) return "Other";

  return category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatTime(dateString) {
  if (!dateString) return "Recently";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  const now = new Date();

  const diff =
    Math.floor(
      (now.getTime() - date.getTime()) / 60000
    );

  if (diff < 1) return "Just now";

  if (diff < 60) {
    return `${diff} min ago`;
  }

  const hours = Math.floor(diff / 60);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days === 1) return "Yesterday";

  return `${days} days ago`;
}

export default function AuthorityDashboard() {
  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [selectedIncident, setSelectedIncident] =
    useState(null);

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  /*
    ================================
    FETCH COMPLAINTS
    ================================
  */

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/complaints`
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Failed to load complaints"
        );
      }

      setComplaints(
        Array.isArray(data.complaints)
          ? data.complaints
          : []
      );
    } catch (err) {
      console.error(
        "Authority dashboard error:",
        err
      );

      setError(
        "Unable to load complaints. Make sure the CivicPulse server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  /*
    Convert backend complaints into
    dashboard incidents.
  */

  const incidents = useMemo(() => {
    return complaints
      .map(formatComplaint)
      .sort(
        (a, b) =>
          b.priority - a.priority
      );
  }, [complaints]);

  /*
    ACTIVE INCIDENT
  */

  const activeIncident =
    selectedIncident ||
    incidents[0] ||
    null;

  /*
    FILTER
  */

  const filteredIncidents =
    incidents.filter((incident) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        incident.title
          .toLowerCase()
          .includes(searchText) ||
        incident.location
          .toLowerCase()
          .includes(searchText) ||
        incident.category
          .toLowerCase()
          .includes(searchText);

      const matchesFilter =
        filter === "All" ||
        incident.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    });

  /*
    ================================
    METRICS
    ================================
  */

  const criticalCount =
    incidents.filter(
      (item) =>
        item.status === "CRITICAL"
    ).length;

  const highCount =
    incidents.filter(
      (item) =>
        item.status === "HIGH"
    ).length;

  const pendingCount =
    complaints.filter(
      (item) =>
        !["resolved", "closed"].includes(
          (item.status || "")
            .toLowerCase()
        )
    ).length;

  const resolvedCount =
    complaints.filter(
      (item) =>
        ["resolved", "closed"].includes(
          (item.status || "")
            .toLowerCase()
        )
    ).length;

  return (
    <div className="authority-page">

      {/* ================= NAVBAR ================= */}

      <header className="top-nav">

        <Logo />

        <nav
          className={`main-nav ${
            mobileMenu
              ? "mobile-open"
              : ""
          }`}
        >
          <a
            className="active"
            href="#overview"
          >
            Overview
          </a>

          <a href="#priority">
            Priority Queue
          </a>

          <a href="#issues">
            All Issues
          </a>

          <a href="#map">
            City Map
          </a>

          <a href="#analytics">
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
              AU
            </div>

            <div className="profile-info">
              <strong>
                Authority
              </strong>

              <span>
                Municipal Officer
              </span>
            </div>

          </div>

          <button
            className="mobile-menu-button"
            onClick={() =>
              setMobileMenu(
                (prev) => !prev
              )
            }
            aria-label="Toggle menu"
          >
            {mobileMenu ? (
              <X />
            ) : (
              <Menu />
            )}
          </button>

        </div>

      </header>

      {/* ================= MAIN ================= */}

      <main
        className="dashboard-container"
        id="overview"
      >

        {/* ================= WELCOME ================= */}

        <section className="welcome-section">

          <div>

            <p className="eyebrow">
              MUNICIPAL OPERATIONS
            </p>

            <h1>
              Good morning, Authority.
            </h1>

            <p className="welcome-text">
              Monitor civic issues, prioritize
              urgent incidents, and coordinate
              faster responses.
            </p>

          </div>

          <div className="welcome-actions">

            <button
              className="primary-button"
              onClick={() =>
                document
                  .getElementById(
                    "priority"
                  )
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              View priority queue

              <ArrowRight size={17} />
            </button>

            <button
              className="secondary-button"
              onClick={() =>
                document
                  .getElementById("map")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
            >
              <MapPin size={17} />

              Open city map
            </button>

          </div>

        </section>

        {/* ================= ERROR ================= */}

        {error && (
          <div className="empty-state">
            <CircleAlert size={25} />

            <strong>
              {error}
            </strong>

            <button
              className="primary-button"
              onClick={fetchComplaints}
            >
              Retry
            </button>
          </div>
        )}

        {/* ================= METRICS ================= */}

        <section className="metrics-grid">

          <MetricCard
            type="critical-card"
            icon={
              <CircleAlert size={20} />
            }
            title="Critical issues"
            value={
              loading
                ? "—"
                : criticalCount
            }
            text="Needs immediate attention"
          />

          <MetricCard
            icon={
              <TriangleAlert size={20} />
            }
            title="High priority"
            value={
              loading
                ? "—"
                : highCount
            }
            text="Currently active"
          />

          <MetricCard
            icon={
              <Clock3 size={20} />
            }
            title="Pending"
            value={
              loading
                ? "—"
                : pendingCount
            }
            text="Awaiting action"
          />

          <MetricCard
            icon={
              <CheckCircle2 size={20} />
            }
            title="Resolved"
            value={
              loading
                ? "—"
                : resolvedCount
            }
            text="All recorded"
          />

        </section>

        {/* ================= MAIN GRID ================= */}

        <section className="main-grid">

          {/* ================= LEFT COLUMN ================= */}

          <div className="left-column">

            {/* ===== PRIORITY QUEUE ===== */}

            <div
              className="dashboard-card"
              id="priority"
            >

              <div className="card-header">

                <div>

                  <p className="eyebrow">
                    AI PRIORITY
                  </p>

                  <h2>
                    Incidents requiring
                    attention
                  </h2>

                </div>

                <button
                  className="text-button"
                  onClick={() => {
                    setSearch("");
                    setFilter("All");
                  }}
                >
                  View all

                  <ArrowRight
                    size={15}
                  />
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
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search incidents..."
                  />

                </div>

                <div className="filter-select">

                  <Filter size={16} />

                  <select
                    value={filter}
                    onChange={(event) =>
                      setFilter(
                        event.target.value
                      )
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

                    <option value="MEDIUM">
                      Medium
                    </option>

                    <option value="LOW">
                      Low
                    </option>

                  </select>

                </div>

              </div>

              {/* INCIDENT LIST */}

              <div
                className="incident-list"
                id="issues"
              >

                {loading ? (
                  <div className="empty-state">

                    <Clock3 size={25} />

                    <strong>
                      Loading civic issues...
                    </strong>

                    <span>
                      Fetching reports from
                      MongoDB.
                    </span>

                  </div>
                ) : filteredIncidents.length >
                  0 ? (

                  filteredIncidents.map(
                    (incident) => (

                      <div
                        className={`incident-row ${
                          activeIncident?.id ===
                          incident.id
                            ? "selected"
                            : ""
                        }`}
                        key={incident.id}
                        onClick={() =>
                          setSelectedIncident(
                            incident
                          )
                        }
                      >

                        <div
                          className={`incident-icon ${incident.color}`}
                        >

                          {incident.status ===
                          "CRITICAL" ? (
                            <CircleAlert
                              size={19}
                            />
                          ) : (
                            <TriangleAlert
                              size={19}
                            />
                          )}

                        </div>

                        <div className="incident-main">

                          <div className="incident-title-row">

                            <h3>
                              {incident.title}
                            </h3>

                            <StatusBadge
                              status={
                                incident.status
                              }
                            />

                          </div>

                          <p>
                            {
                              incident.category
                            }{" "}
                            ·{" "}
                            {
                              incident.location
                            }
                          </p>

                          <div className="incident-meta">

                            <span>
                              <Clock3
                                size={13}
                              />

                              {
                                incident.time
                              }
                            </span>

                            <span>
                              <FileText
                                size={13}
                              />

                              {
                                incident.reports
                              }{" "}
                              reports
                            </span>

                            <span>
                              <Users
                                size={13}
                              />

                              {
                                incident.affected
                              }{" "}
                              affected
                            </span>

                          </div>

                        </div>

                        <div className="priority-score">

                          <span>
                            Priority
                          </span>

                          <strong>
                            {
                              incident.priority
                            }
                          </strong>

                        </div>

                        <ChevronRight
                          className="incident-arrow"
                          size={19}
                        />

                      </div>
                    )
                  )

                ) : (

                  <div className="empty-state">

                    <Search size={25} />

                    <strong>
                      No incidents found
                    </strong>

                    <span>
                      No complaints match
                      your current filter.
                    </span>

                  </div>

                )}

              </div>

            </div>

            {/* ===== AI INSIGHT ===== */}

            {activeIncident && (
              <div className="ai-insight">

                <div className="ai-header">

                  <div className="ai-icon">
                    <Sparkles
                      size={19}
                    />
                  </div>

                  <div>

                    <p className="eyebrow">
                      AI INSIGHT
                    </p>

                    <h2>
                      Why{" "}
                      {
                        activeIncident.title
                      }{" "}
                      needs attention
                    </h2>

                  </div>

                </div>

                <div className="ai-score">

                  <div>

                    <span>
                      AI Priority Score
                    </span>

                    <strong>
                      {
                        activeIncident.priority
                      }{" "}
                      / 10
                    </strong>

                  </div>

                  <div className="score-bar">

                    <div
                      style={{
                        width: `${Math.min(
                          activeIncident.priority *
                            10,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

                <div className="ai-metrics">

                  <div>
                    <span>
                      Severity
                    </span>

                    <strong>
                      {Math.min(
                        activeIncident
                          .severity,
                        100
                      ) / 10}
                      /10
                    </strong>
                  </div>

                  <div>
                    <span>
                      Infrastructure Risk
                    </span>

                    <strong>
                      {Math.min(
                        activeIncident
                          .infrastructureRisk,
                        100
                      ) / 10}
                      /10
                    </strong>
                  </div>

                  <div>
                    <span>
                      Reports
                    </span>

                    <strong>
                      {
                        activeIncident.reports
                      }
                    </strong>
                  </div>

                  <div>
                    <span>
                      Priority
                    </span>

                    <strong>
                      {
                        activeIncident.priority
                      }
                      /10
                    </strong>
                  </div>

                </div>

                <div className="ai-detected">

                  <strong>
                    Report details
                  </strong>

                  <ul>

                    <li>
                      Category:{" "}
                      {
                        activeIncident.category
                      }
                    </li>

                    <li>
                      Reported{" "}
                      {
                        activeIncident.time
                      }
                    </li>

                    <li>
                      Location:
                      {" "}
                      {
                        activeIncident.location
                      }
                    </li>

                    {activeIncident
                      .description && (
                      <li>
                        {
                          activeIncident.description
                        }
                      </li>
                    )}

                  </ul>

                </div>

                <div className="recommendation">

                  <span>
                    Recommended action
                  </span>

                  <p>
                    Review this incident
                    and assign the
                    appropriate municipal
                    department.
                  </p>

                </div>

                <div className="ai-actions">

                  <button
                    className="primary-button"
                    onClick={() =>
                      setSelectedIncident(
                        activeIncident
                      )
                    }
                  >
                    View incident

                    <ArrowRight
                      size={16}
                    />
                  </button>

                </div>

              </div>
            )}

          </div>

          {/* ================= RIGHT COLUMN ================= */}

          <div className="right-column">

            {/* ===== CITY MAP ===== */}

            <div
              className="dashboard-card map-card"
              id="map"
            >

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

                {incidents
                  .slice(0, 5)
                  .map(
                    (incident, index) => (
                      <span
                        key={incident.id}
                        className={`map-marker ${
                          incident.status ===
                          "CRITICAL"
                            ? "critical"
                            : incident.status ===
                              "HIGH"
                            ? "high"
                            : "resolved"
                        } m${
                          index + 1
                        }`}
                      />
                    )
                  )}

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
                  Other
                </span>

              </div>

              {activeIncident && (
                <div className="map-incident">

                  <div>

                    <div className="map-incident-title">

                      <h3>
                        {
                          activeIncident.title
                        }
                      </h3>

                      <StatusBadge
                        status={
                          activeIncident.status
                        }
                      />

                    </div>

                    <p>
                      <MapPin size={14} />

                      {
                        activeIncident
                          .location
                      }
                    </p>

                  </div>

                  <div className="impact-grid">

                    <div>
                      <strong>
                        {
                          activeIncident
                            .reports
                        }
                      </strong>

                      <span>
                        Reports
                      </span>
                    </div>

                    <div>
                      <strong>
                        {
                          activeIncident
                            .affected
                        }
                      </strong>

                      <span>
                        Affected
                      </span>
                    </div>

                    <div>
                      <strong>
                        {
                          activeIncident
                            .priority
                        }
                      </strong>

                      <span>
                        Priority
                      </span>
                    </div>

                  </div>

                  <button
                    className="primary-button full-width"
                    onClick={() =>
                      setSelectedIncident(
                        activeIncident
                      )
                    }
                  >
                    View incident

                    <ArrowRight
                      size={16}
                    />
                  </button>

                </div>
              )}

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

                <button
                  onClick={() =>
                    setFilter(
                      "CRITICAL"
                    )
                  }
                >
                  <CircleAlert
                    size={18}
                  />

                  Review critical issues

                  <ChevronRight
                    size={16}
                  />
                </button>

                <button
                  onClick={() =>
                    activeIncident &&
                    setSelectedIncident(
                      activeIncident
                    )
                  }
                >
                  <Building2
                    size={18}
                  />

                  Review top issue

                  <ChevronRight
                    size={16}
                  />
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById(
                        "map"
                      )
                      ?.scrollIntoView({
                        behavior:
                          "smooth",
                      })
                  }
                >
                  <MapPin size={18} />

                  Open city map

                  <ChevronRight
                    size={16}
                  />
                </button>

                <button
                  onClick={() => {
                    setFilter("All");
                    setSearch("");
                  }}
                >
                  <FileText
                    size={18}
                  />

                  View all issues

                  <ChevronRight
                    size={16}
                  />
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

                  <Building2
                    size={18}
                  />

                  <strong>
                    {dept[0]}
                  </strong>

                </div>

                <div className="department-stat">
                  <strong>
                    {dept[1]}
                  </strong>

                  <span>
                    Open
                  </span>
                </div>

                <div className="department-stat">
                  <strong>
                    {dept[2]}
                  </strong>

                  <span>
                    In progress
                  </span>
                </div>

                <div className="department-stat">
                  <strong>
                    {dept[3]}
                  </strong>

                  <span>
                    Resolved
                  </span>
                </div>

                <div className="response-time">

                  <span>
                    Avg. response
                  </span>

                  <strong>
                    {dept[4]}
                  </strong>

                </div>

              </div>
            ))}

          </div>

        </section>

        {/* ================= RECENT ACTIVITY ================= */}

        <section
          className="dashboard-card activity-card"
          id="analytics"
        >

          <div className="card-header">

            <div>

              <p className="eyebrow">
                RECENT ACTIVITY
              </p>

              <h2>
                Latest reports
              </h2>

            </div>

            <button
              className="icon-button"
              aria-label="More actions"
            >
              <MoreHorizontal
                size={19}
              />
            </button>

          </div>

          <div className="activity-list">

            {incidents
              .slice(0, 5)
              .map((incident) => (

                <div
                  className="activity-row"
                  key={incident.id}
                >

                  <div
                    className={`activity-dot ${
                      incident.status ===
                      "CRITICAL"
                        ? "red"
                        : incident.status ===
                          "HIGH"
                        ? "amber"
                        : "blue"
                    }`}
                  />

                  <div>

                    <strong>
                      {incident.title}
                    </strong>

                    <p>
                      New citizen report
                    </p>

                  </div>

                  <span>
                    {incident.time}
                  </span>

                </div>

              ))}

            {!loading &&
              incidents.length === 0 && (
                <div className="empty-state">
                  No recent activity.
                </div>
              )}

          </div>

        </section>

      </main>

      {/* ================= INCIDENT MODAL ================= */}

      {selectedIncident !== null && (

        <div
          className="modal-overlay"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedIncident(
                null
              );
            }

          }}
        >

          <div className="incident-modal">

            <button
              className="modal-close"
              onClick={() =>
                setSelectedIncident(
                  null
                )
              }
              aria-label="Close incident"
            >
              <X size={20} />
            </button>

            <p className="eyebrow">
              INCIDENT #
              {
                selectedIncident.id
              }
            </p>

            <h2>
              {
                selectedIncident.title
              }
            </h2>

            <div className="modal-status-row">

              <StatusBadge
                status={
                  selectedIncident.status
                }
              />

              <strong>
                Priority{" "}
                {
                  selectedIncident.priority
                }
                /10
              </strong>

            </div>

            {/* IMAGE */}

            {selectedIncident.imageUrl && (
              <div
                style={{
                  marginTop: "20px",
                  borderRadius: "14px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={
                    selectedIncident.imageUrl
                  }
                  alt={
                    selectedIncident.title
                  }
                  style={{
                    width: "100%",
                    maxHeight: "280px",
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(event) => {
                    event.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}

            <div className="modal-info-grid">

              <div>
                <span>
                  Location
                </span>

                <strong>
                  {
                    selectedIncident
                      .location
                  }
                </strong>
              </div>

              <div>
                <span>
                  Reports
                </span>

                <strong>
                  {
                    selectedIncident
                      .reports
                  }
                </strong>
              </div>

              <div>
                <span>
                  Affected
                </span>

                <strong>
                  {
                    selectedIncident
                      .affected
                  }
                </strong>
              </div>

              <div>
                <span>
                  Category
                </span>

                <strong>
                  {
                    selectedIncident
                      .category
                  }
                </strong>
              </div>

            </div>

            {selectedIncident.description && (
              <div className="modal-section">

                <p className="eyebrow">
                  CITIZEN REPORT
                </p>

                <p>
                  {
                    selectedIncident
                      .description
                  }
                </p>

              </div>
            )}

            <div className="modal-section">

              <p className="eyebrow">
                AI ANALYSIS
              </p>

              <div className="modal-analysis">

                <div>
                  <span>
                    Severity
                  </span>

                  <strong>
                    {Math.min(
                      selectedIncident
                        .severity,
                      100
                    ) / 10}
                    /10
                  </strong>
                </div>

                <div>
                  <span>
                    Infrastructure Risk
                  </span>

                  <strong>
                    {Math.min(
                      selectedIncident
                        .infrastructureRisk,
                      100
                    ) / 10}
                    /10
                  </strong>
                </div>

                <div>
                  <span>
                    Priority
                  </span>

                  <strong>
                    {
                      selectedIncident
                        .priority
                    }
                    /10
                  </strong>
                </div>

                <div>
                  <span>
                    Status
                  </span>

                  <strong>
                    {
                      selectedIncident
                        .complaintStatus
                    }
                  </strong>
                </div>

              </div>

            </div>

            <div className="modal-recommendation">

              <Sparkles size={18} />

              <div>

                <strong>
                  Authority Recommendation
                </strong>

                <p>
                  Review the report and
                  assign it to the
                  appropriate municipal
                  department.
                </p>

              </div>

            </div>

            <div className="modal-actions">

              <button
                className="primary-button"
                onClick={() =>
                  alert(
                    "Department assignment will be connected next."
                  )
                }
              >
                Assign Department
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  alert(
                    "Status update will be connected next."
                  )
                }
              >
                Update Status
              </button>

              <button
                className="success-button"
                onClick={() =>
                  alert(
                    "Resolve action will be connected next."
                  )
                }
              >
                Mark Resolved
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}