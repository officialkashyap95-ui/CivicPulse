import { useState } from 'react'
import { UserButton, useUser } from '@clerk/react'
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

const complaints = [
  { title: 'Water Pipeline Failure', location: 'North Ward', date: 'Submitted 2 hours ago', status: 'In Progress', priority: 'HIGH', icon: CircleAlert, tone: 'blue' },
  { title: 'Streetlight Outage', location: 'Market Road', date: 'Submitted yesterday', status: 'Under Review', priority: 'MEDIUM', icon: Activity, tone: 'amber' },
  { title: 'Garbage Accumulation', location: 'Central Ward', date: 'Submitted 4 days ago', status: 'Resolved', priority: 'LOW', icon: CheckCircle2, tone: 'teal' },
]

function Logo() {
  return <a href="#top" className="citizen-brand"><span className="citizen-logo"><Activity /></span><span>Civic<span>Pulse</span></span></a>
}

function MapPreview() {
  return <div className="map-preview" aria-label="Map showing nearby civic issues">
    <div className="map-road road-a" /><div className="map-road road-b" /><div className="map-road road-c" /><div className="map-road road-d" />
    <span className="map-marker marker-one" /><span className="map-marker marker-two" /><span className="map-marker marker-three" />
    <div className="map-label map-label-one"><CircleAlert /> Water pipeline</div>
    <div className="map-label map-label-two"><MapPin /> Market Road</div>
    <div className="map-you"><span /> You are here</div>
  </div>
}

export default function CitizenDashboard() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user } = useUser()
  const [confirmed, setConfirmed] = useState(false)
  return <main className="citizen-shell" id="top">
    <header className="citizen-header">
      <Logo />
      <nav className={menuOpen ? 'citizen-nav open' : 'citizen-nav'}>
        <a className="active" href="#dashboard" onClick={() => setMenuOpen(false)}>Dashboard</a><a href="#report" onClick={() => setMenuOpen(false)}>Report Issue</a><a href="#nearby" onClick={() => setMenuOpen(false)}>Issues Nearby</a><a href="#complaints" onClick={() => setMenuOpen(false)}>My Complaints</a>
      </nav>
      <div className="citizen-actions"><button className="icon-action" aria-label="Notifications"><Bell /></button><UserButton afterSignOutUrl="/" /></div>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section className="welcome-section" id="dashboard"><div><p className="dashboard-eyebrow">CITIZEN DASHBOARD</p><h1>Good morning, {user?.firstName || 'Citizen'}.</h1><p className="welcome-copy">Help make your neighborhood work better, one report at a time.</p></div><button className="report-button" id="report">Report an issue <ArrowRight /></button></section>

    <section className="summary-grid" aria-label="Your report summary">
      {[[FileText, 'Reports submitted', '4', 'All time', ''], [Clock3, 'In progress', '2', 'Currently active', ''], [CheckCircle2, 'Resolved', '1', 'This month', ''], [CircleAlert, 'Critical nearby', '3', 'Needs attention', 'critical']].map(([Icon, label, value, detail, tone]) => <div className={`summary-card ${tone}`} key={label}><div className="summary-icon"><Icon /></div><div><p>{label}</p><strong>{value}</strong><span>{detail}</span></div></div>)}
    </section>

    <section className="dashboard-columns">
      <div className="complaints-card" id="complaints"><div className="card-heading"><div><p className="card-kicker">YOUR ACTIVITY</p><h2>Your recent complaints</h2></div><a href="#complaints">View all <ArrowRight /></a></div><div className="complaint-list">{complaints.map(({ title, location, date, status, priority, icon: Icon, tone }) => <button className="complaint-row" key={title}><span className={`complaint-icon ${tone}`}><Icon /></span><span className="complaint-main"><strong>{title}</strong><small><MapPin /> {location} <i /> {date}</small></span><span className={`status-badge ${tone}`}>{status}</span><span className={`priority-badge ${priority.toLowerCase()}`}>{priority}</span><ChevronRight className="row-chevron" /></button>)}</div><div className="card-footer-note"><Sparkles /> CivicPulse keeps you updated as your reports move forward.</div></div>
      <div className="nearby-card" id="nearby"><div className="card-heading"><div><p className="card-kicker">NEARBY NOW</p><h2>Issues around you</h2></div><button className="small-link">Map view <ArrowRight /></button></div><MapPreview /><div className="nearby-detail"><div className="detail-title"><span className="detail-icon"><CircleAlert /></span><div><strong>Water Pipeline Failure</strong><small><MapPin /> 250m away</small></div><span className="priority-badge critical">CRITICAL</span></div><div className="detail-stats"><div><strong>128</strong><span>reports</span></div><div><strong>2,400</strong><span>people affected</span></div><div><strong>94</strong><span>impact score</span></div></div><button className={confirmed ? 'confirm-button confirmed' : 'confirm-button'} onClick={() => setConfirmed(true)}>{confirmed ? <><Check /> Confirmed</> : 'Confirm this issue'}</button><p className="confirm-note">Your confirmation helps authorities understand the real impact.</p></div></div>
    </section>

    <section className="workflow-strip"><div><p className="dashboard-eyebrow">THE CIVICPULSE LOOP</p><h2>How CivicPulse creates action</h2></div><div className="citizen-steps"><div><span><MessageSquare /></span><strong>Report</strong><small>Share what you see.</small></div><ArrowRight className="step-arrow" /><div><span><ScanSearch /></span><strong>Understand</strong><small>AI extracts the important signals.</small></div><ArrowRight className="step-arrow" /><div><span><Check /></span><strong>Act</strong><small>Authorities respond to what matters most.</small></div></div></section>
  </main>
}

