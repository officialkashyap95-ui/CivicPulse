import { useEffect, useState } from 'react'
import { UserButton, useUser } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import './CitizenDashboard.css'

import {
  Activity,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  FileText,
  MapPin,
  Menu,
  MessageSquare,
  ScanSearch,
  Sparkles,
  X,
} from 'lucide-react'


function Logo() {
  return (
    <a href="#top" className="citizen-brand">
      <span className="citizen-logo">
        <Activity />
      </span>

      <span>
        Civic<span>Pulse</span>
      </span>
    </a>
  )
}


function MapPreview() {
  return (
    <div
      className="map-preview"
      aria-label="Map showing nearby civic issues"
    >
      <div className="map-road road-a" />
      <div className="map-road road-b" />
      <div className="map-road road-c" />
      <div className="map-road road-d" />

      <span className="map-marker marker-one" />
      <span className="map-marker marker-two" />
      <span className="map-marker marker-three" />

      <div className="map-label map-label-one">
        <CircleAlert />
        Water pipeline
      </div>

      <div className="map-label map-label-two">
        <MapPin />
        Market Road
      </div>

      <div className="map-you">
        <span />
        You are here
      </div>
    </div>
  )
}


export default function CitizenDashboard() {

  // ----------------------------------------
  // CLERK
  // ----------------------------------------

  const { user } = useUser()
  const navigate = useNavigate()


  // ----------------------------------------
  // UI STATE
  // ----------------------------------------

  const [menuOpen, setMenuOpen] = useState(false)
  const [confirmed, setConfirmed] = useState(false)


  // ----------------------------------------
  // COMPLAINT STATE
  // ----------------------------------------

  const [complaints, setComplaints] = useState([])
  const [loadingComplaints, setLoadingComplaints] = useState(true)
  const [complaintError, setComplaintError] = useState("")


  // ----------------------------------------
  // FETCH USER COMPLAINTS
  // ----------------------------------------

  useEffect(() => {

    if (!user?.id) {
      setLoadingComplaints(false)
      return
    }

    const fetchComplaints = async () => {

      try {

        setLoadingComplaints(true)
        setComplaintError("")

        const response = await fetch(
          `http://localhost:5001/api/complaints?userId=${encodeURIComponent(
            user.id
          )}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load complaints"
          )
        }

        setComplaints(data.complaints || [])

      } catch (error) {

        console.error(
          "Failed to fetch complaints:",
          error
        )

        setComplaintError(
          error.message ||
          "Unable to load complaint history."
        )

      } finally {

        setLoadingComplaints(false)

      }
    }

    fetchComplaints()

  }, [user?.id])


  // ----------------------------------------
  // NAVIGATION
  // ----------------------------------------

  const handleReportIssue = () => {
    setMenuOpen(false)
    navigate('/citizen/report')
  }


  // ----------------------------------------
  // HELPERS
  // ----------------------------------------

  const getStatusLabel = (status) => {

    const labels = {
      submitted: "Submitted",
      under_review: "Under Review",
      assigned: "Assigned",
      in_progress: "In Progress",
      resolved: "Resolved",
    }

    return labels[status] || "Submitted"
  }


  const getStatusTone = (status) => {

    const tones = {
      submitted: "blue",
      under_review: "amber",
      assigned: "blue",
      in_progress: "blue",
      resolved: "teal",
    }

    return tones[status] || "blue"
  }


  const getCategoryLabel = (category) => {

    const labels = {
      road_damage: "Road Damage",
      water_leakage: "Water Leakage",
      garbage: "Garbage",
      streetlight: "Streetlight",
      drainage: "Drainage",
      other: "Other",
    }

    return labels[category] || "Other"
  }


  // ----------------------------------------
  // DYNAMIC SUMMARY
  // ----------------------------------------

  const totalReports = complaints.length

  const inProgressCount = complaints.filter(
    (complaint) =>
      complaint.status === "in_progress" ||
      complaint.status === "assigned" ||
      complaint.status === "under_review"
  ).length

  const resolvedCount = complaints.filter(
    (complaint) =>
      complaint.status === "resolved"
  ).length


  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (

    <main
      className="citizen-shell"
      id="top"
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="citizen-header">

        <Logo />

        <nav
          className={
            menuOpen
              ? 'citizen-nav open'
              : 'citizen-nav'
          }
        >

          <a
            className="active"
            href="#dashboard"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </a>


          <button
            type="button"
            className="nav-link-button"
            onClick={handleReportIssue}
          >
            Report Issue
          </button>


          <a
            href="#nearby"
            onClick={() => setMenuOpen(false)}
          >
            Issues Nearby
          </a>


          <a
            href="#complaints"
            onClick={() => setMenuOpen(false)}
          >
            My Complaints
          </a>

        </nav>


        <div className="citizen-actions">

          <button
            type="button"
            className="icon-action"
            aria-label="Notifications"
          >
            <Bell />
          </button>

          <UserButton afterSignOutUrl="/" />

        </div>


        <button
          type="button"
          className="mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen(!menuOpen)}
        >

          {menuOpen ? (
            <X />
          ) : (
            <Menu />
          )}

        </button>

      </header>


      {/* ======================================
          WELCOME
      ====================================== */}

      <section
        className="welcome-section"
        id="dashboard"
      >

        <div>

          <p className="dashboard-eyebrow">
            CITIZEN DASHBOARD
          </p>


          <h1>
            Good morning,{" "}
            {user?.firstName || "Citizen"}.
          </h1>


          <p className="welcome-copy">
            Help make your neighborhood work better,
            one report at a time.
          </p>

        </div>


        <button
          type="button"
          className="report-button"
          onClick={handleReportIssue}
        >
          Report an issue
          <ArrowRight />
        </button>

      </section>


      {/* ======================================
          SUMMARY
      ====================================== */}

      <section
        className="summary-grid"
        aria-label="Your report summary"
      >

        {[
          [
            FileText,
            "Reports submitted",
            totalReports,
            "All time",
            "",
          ],

          [
            Clock3,
            "In progress",
            inProgressCount,
            "Currently active",
            "",
          ],

          [
            CheckCircle2,
            "Resolved",
            resolvedCount,
            "All time",
            "",
          ],

          [
            CircleAlert,
            "Critical nearby",
            "3",
            "Needs attention",
            "critical",
          ],

        ].map(
          ([
            Icon,
            label,
            value,
            detail,
            tone,
          ]) => (

            <div
              className={`summary-card ${tone}`}
              key={label}
            >

              <div className="summary-icon">
                <Icon />
              </div>


              <div>

                <p>{label}</p>

                <strong>
                  {value}
                </strong>

                <span>
                  {detail}
                </span>

              </div>

            </div>

          )
        )}

      </section>


      {/* ======================================
          MAIN DASHBOARD
      ====================================== */}

      <section className="dashboard-columns">


        {/* ====================================
            MY COMPLAINTS
        ==================================== */}

        <div
          className="complaints-card"
          id="complaints"
        >

          <div className="card-heading">

            <div>

              <p className="card-kicker">
                YOUR ACTIVITY
              </p>

              <h2>
                Your recent complaints
              </h2>

            </div>


            <a href="#complaints">
              View all
              <ArrowRight />
            </a>

          </div>


          <div className="complaint-list">


            {/* LOADING */}

            {loadingComplaints && (

              <div className="history-message">
                Loading your reports...
              </div>

            )}


            {/* ERROR */}

            {!loadingComplaints &&
              complaintError && (

                <div className="history-message error">
                  {complaintError}
                </div>

              )}


            {/* EMPTY */}

            {!loadingComplaints &&
              !complaintError &&
              complaints.length === 0 && (

                <div className="history-empty">

                  <FileText />

                  <strong>
                    No reports yet
                  </strong>

                  <p>
                    When you report a civic issue,
                    it will appear here.
                  </p>

                  <button
                    type="button"
                    onClick={handleReportIssue}
                  >
                    Report your first issue
                    <ArrowRight />
                  </button>

                </div>

              )}


            {/* COMPLAINT LIST */}

            {!loadingComplaints &&
              !complaintError &&
              complaints.length > 0 &&
              complaints.map((complaint) => {

                const statusTone =
                  getStatusTone(
                    complaint.status
                  )

                return (

                  <button
                    className="complaint-row"
                    key={complaint._id}
                    type="button"
                  >

                    <span
                      className={`complaint-icon ${statusTone}`}
                    >

                      {complaint.status ===
                        "resolved" ? (
                        <CheckCircle2 />
                      ) : (
                        <CircleAlert />
                      )}

                    </span>


                    <span className="complaint-main">

                      <strong>
                        {getCategoryLabel(
                          complaint.category
                        )}
                      </strong>


                      <small>

                        <MapPin />

                        {typeof complaint.latitude ===
                          "number"
                          ? complaint.latitude.toFixed(
                            4
                          )
                          : "--"}

                        {", "}

                        {typeof complaint.longitude ===
                          "number"
                          ? complaint.longitude.toFixed(
                            4
                          )
                          : "--"}

                        <i />

                        {complaint.createdAt
                          ? new Date(
                            complaint.createdAt
                          ).toLocaleDateString()
                          : "Unknown date"}

                      </small>


                      <small className="complaint-description">

                        {complaint.description}

                      </small>

                    </span>


                    <span
                      className={`status-badge ${statusTone}`}
                    >
                      {getStatusLabel(
                        complaint.status
                      )}
                    </span>


                    <ChevronRight
                      className="row-chevron"
                    />

                  </button>

                )

              })}

          </div>


          <div className="card-footer-note">

            <Sparkles />

            CivicPulse keeps you updated as your
            reports move forward.

          </div>

        </div>


        {/* ====================================
            NEARBY
        ==================================== */}

        <div
          className="nearby-card"
          id="nearby"
        >

          <div className="card-heading">

            <div>

              <p className="card-kicker">
                NEARBY NOW
              </p>

              <h2>
                Issues around you
              </h2>

            </div>


            <button
              type="button"
              className="small-link"
            >
              Map view
              <ArrowRight />
            </button>

          </div>


          <MapPreview />


          <div className="nearby-detail">

            <div className="detail-title">

              <span className="detail-icon">
                <CircleAlert />
              </span>


              <div>

                <strong>
                  Water Pipeline Failure
                </strong>

                <small>

                  <MapPin />

                  250m away

                </small>

              </div>


              <span className="priority-badge critical">
                CRITICAL
              </span>

            </div>


            <div className="detail-stats">

              <div>

                <strong>
                  128
                </strong>

                <span>
                  reports
                </span>

              </div>


              <div>

                <strong>
                  2,400
                </strong>

                <span>
                  people affected
                </span>

              </div>


              <div>

                <strong>
                  94
                </strong>

                <span>
                  impact score
                </span>

              </div>

            </div>


            <button
              type="button"
              className={
                confirmed
                  ? "confirm-button confirmed"
                  : "confirm-button"
              }
              onClick={() =>
                setConfirmed(true)
              }
            >

              {confirmed ? (

                <>
                  <Check />
                  Confirmed
                </>

              ) : (

                "Confirm this issue"

              )}

            </button>


            <p className="confirm-note">

              Your confirmation helps authorities
              understand the real impact.

            </p>

          </div>

        </div>

      </section>


      {/* ======================================
          WORKFLOW
      ====================================== */}

      <section className="workflow-strip">

        <div>

          <p className="dashboard-eyebrow">
            THE CIVICPULSE LOOP
          </p>

          <h2>
            How CivicPulse creates action
          </h2>

        </div>


        <div className="citizen-steps">


          <div>

            <span>
              <MessageSquare />
            </span>

            <strong>
              Report
            </strong>

            <small>
              Share what you see.
            </small>

          </div>


          <ArrowRight
            className="step-arrow"
          />


          <div>

            <span>
              <ScanSearch />
            </span>

            <strong>
              Understand
            </strong>

            <small>
              AI extracts the important signals.
            </small>

          </div>


          <ArrowRight
            className="step-arrow"
          />


          <div>

            <span>
              <Check />
            </span>

            <strong>
              Act
            </strong>

            <small>
              Authorities respond to what matters most.
            </small>

          </div>

        </div>

      </section>

    </main>
  )
}