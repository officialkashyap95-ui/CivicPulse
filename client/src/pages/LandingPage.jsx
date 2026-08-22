'use client'

import { useState } from 'react'
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/react'
import { Link } from 'react-router-dom'
import {
    Activity,
    ArrowRight,
    BarChart3,
    Check,
    ChevronDown,
    CircleAlert,
    Clock3,
    Droplets,
    FileText,
    MapPin,
    Menu,
    MessageSquare,
    Network,
    ScanSearch,
    ShieldCheck,
    Sparkles,
    Target,
    X,
    Zap,
} from 'lucide-react'

const issues = [
    { title: 'Water Pipeline Failure', place: 'North Ward · 2,400 affected', level: 'CRITICAL', score: 94, icon: Droplets },
    { title: 'Road Damage Near School', place: 'East District · 680 affected', level: 'HIGH', score: 82, icon: MapPin },
    { title: 'Streetlight Outage', place: 'Market Road · 340 affected', level: 'HIGH', score: 76, icon: Zap },
    { title: 'Garbage Accumulation', place: 'Central Ward · 210 affected', level: 'MEDIUM', score: 61, icon: Activity },
]

const workflow = [
    ['REPORT', 'Citizens share what they see.', MessageSquare],
    ['UNDERSTAND', 'AI reads the signal and context.', ScanSearch],
    ['CLUSTER', 'Similar reports become one issue.', Network],
    ['SCORE', 'Impact is measured in real time.', BarChart3],
    ['PRIORITIZE', 'The right work rises to the top.', Target],
    ['ACT', 'Teams respond with confidence.', Check],
]

function DashboardMockup() {
    return (
        <div className="dashboard-shell">
            <div className="dashboard-topbar">
                <div className="flex items-center gap-2"><div className="logo-mark small"><Activity data-icon="inline-start" /></div><span className="font-semibold tracking-tight">CivicPulse <span className="text-muted-foreground">/ Authority</span></span></div>
                <div className="flex items-center gap-3"><span className="status-dot" /> <span className="text-xs text-muted-foreground">Live operations</span><div className="avatar">AM</div></div>
            </div>
            <div className="dashboard-body">
                <aside className="dashboard-nav">
                    <div className="nav-item active"><BarChart3 data-icon="inline-start" /> Overview</div>
                    <div className="nav-item"><CircleAlert data-icon="inline-start" /> Priority Queue</div>
                    <div className="nav-item"><MapPin data-icon="inline-start" /> Issue Map</div>
                    <div className="nav-item"><FileText data-icon="inline-start" /> Reports</div>
                    <div className="nav-item"><ShieldCheck data-icon="inline-start" /> Response teams</div>
                </aside>
                <div className="dashboard-content">
                    <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Monday, 18 November 2024</p><h3 className="mt-1 text-xl font-semibold tracking-tight">Good morning, Ananya</h3></div><button className="export-button">Export view <ArrowRight data-icon="inline-end" /></button></div>
                    <div className="metric-grid">
                        <div className="metric-card metric-feature"><div className="flex items-center justify-between"><span className="metric-label">Impact Score</span><Sparkles className="text-primary" /></div><div className="flex items-end gap-3"><strong>94</strong><span className="score-change">+12.4%</span></div><div className="score-bar"><span /></div><p>Highest priority issue · water access</p></div>
                        <div className="metric-card"><span className="metric-label">Open reports</span><strong className="small-stat">128</strong><p><span className="teal-text">+18</span> this week</p></div>
                        <div className="metric-card"><span className="metric-label">People affected</span><strong className="small-stat">2,400</strong><p>Across 12 wards</p></div>
                    </div>
                    <div className="queue-card"><div className="queue-heading"><div><span className="eyebrow">AI-ranked live feed</span><h4>Priority Queue</h4></div><button className="filter-button">All issues <ChevronDown data-icon="inline-end" /></button></div>
                        <div className="queue-list">{issues.map((issue) => { const Icon = issue.icon; return <div className="queue-row" key={issue.title}><div className="issue-icon"><Icon /></div><div className="issue-copy"><strong>{issue.title}</strong><span>{issue.place}</span></div><span className={`priority ${issue.level.toLowerCase()}`}>{issue.level}</span><span className="issue-score">{issue.score}</span></div> })}</div>
                    </div>
                    <div className="recommendation"><div className="recommendation-icon"><Sparkles /></div><div><span className="eyebrow">AI Recommendation</span><p>Dispatch the North Ward water team first. This issue affects 3.5× more people than the next highest report.</p></div><ArrowRight className="ml-auto text-primary" /></div>
                </div>
            </div>
        </div>
    )
}

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false)
    return <main className="site-shell">
        <header className="site-header">
            <a href="#top" className="brand"><span className="logo-mark"><Activity /></span><span>Civic<span>Pulse</span></span></a>
            <nav className={menuOpen ? 'mobile-open' : ''}><a href="#how">How it works</a><a href="#impact">Impact scoring</a><a href="#platform">Platform</a><a href="#contact">For authorities</a></nav>
            <div className="header-actions">
                <Show when="signed-out">
                    <SignInButton mode="modal"><button className="sign-in">Sign in</button></SignInButton>
                    <SignUpButton mode="modal" forceRedirectUrl="/citizen"><button className="header-cta">Get started <ArrowRight data-icon="inline-end" /></button></SignUpButton>
                </Show>
                <Show when="signed-in">
                    <Link to="/citizen" className="sign-in">My reports</Link>
                    <Link to="/authority" className="header-cta">Authority view <ArrowRight data-icon="inline-end" /></Link>
                    <UserButton afterSignOutUrl="/" />
                </Show>
            </div>
            <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </header>
        <section id="top" className="hero-section"><div className="hero-copy"><div className="announcement"><span><span className="status-dot" /> Built for cities that listen</span><ArrowRight data-icon="inline-end" /></div><h1>Report problems.<br /><span>We prioritize</span> what matters most.</h1><p className="hero-lede">CivicPulse turns scattered citizen reports into clear, impact-driven action for the people who keep cities moving.</p><div className="hero-buttons">
                <Show when="signed-out">
                    <SignUpButton mode="modal" forceRedirectUrl="/citizen"><button className="primary-button">Report an issue <ArrowRight data-icon="inline-end" /></button></SignUpButton>
                </Show>
                <Show when="signed-in">
                    <Link to="/citizen" className="primary-button">Report an issue <ArrowRight data-icon="inline-end" /></Link>
                </Show>
                <a href="#how" className="text-button">Explore the platform <ArrowRight data-icon="inline-end" /></a>
            </div><div className="trust-row"><div className="trust-avatars"><span>RK</span><span>PM</span><span>AS</span><span>+</span></div><p>Trusted by teams building<br /><strong>more responsive cities</strong></p></div></div><div className="hero-visual"><div className="visual-label"><span className="status-dot" /> AUTHORITY VIEW <span>•</span> LIVE</div><DashboardMockup /></div></section>
        <section className="proof-strip"><div><strong>One signal</strong><span>from every neighborhood</span></div><div className="proof-line" /><div><strong>Less noise</strong><span>more meaningful action</span></div><div className="proof-line" /><div><strong>Real impact</strong><span>you can measure</span></div></section>
        <section id="how" className="workflow-section"><div className="section-intro"><span className="kicker">THE CIVICPULSE METHOD</span><h2>From a report to a<br /><span>response that matters.</span></h2><p>Every signal deserves to be understood. Our workflow turns the complexity of civic life into a shared, actionable picture.</p></div><div className="workflow-grid">{workflow.map(([title, copy, Icon], index) => <div className="workflow-step" key={title}><div className="workflow-icon"><Icon /></div><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{copy}</p>{index < workflow.length - 1 && <ArrowRight className="workflow-arrow" />}</div>)}</div></section>
        <section id="impact" className="impact-section"><div className="impact-copy"><span className="kicker">THE IMPACT SCORE</span><h2>Priority based on impact,<br /><span>not just ticket volume.</span></h2><p>A hundred duplicate reports are not always more urgent than one report from a school, a hospital, or a neighborhood without clean water. CivicPulse makes that distinction visible.</p><div className="impact-points"><div><Check /><p><strong>Reach</strong> How many people are affected?</p></div><div><Check /><p><strong>Vulnerability</strong> Who is most at risk?</p></div><div><Check /><p><strong>Urgency</strong> What happens if we wait?</p></div></div></div><div className="impact-card"><div className="impact-orbit"><div className="impact-score">94<small>/100</small></div><span className="orbit-label one">Reach <b>2,400</b></span><span className="orbit-label two">Urgency <b>High</b></span><span className="orbit-label three">Vulnerability <b>Critical</b></span></div><div className="impact-card-footer"><div><span className="eyebrow">Current highest impact</span><strong>Water Pipeline Failure</strong><span><MapPin data-icon="inline-start" /> Near Government School</span></div><span className="priority critical">CRITICAL</span></div></div></section>
        <section id="platform" className="platform-section"><div><span className="kicker">BUILT FOR THE REAL WORLD</span><h2>Clarity for the people<br />who make <span>change happen.</span></h2></div><div className="platform-grid"><div><Target /><h3>Impact, made visible</h3><p>See the issues that matter most at a glance, across every ward and neighborhood.</p></div><div><ShieldCheck /><h3>Decisions you can defend</h3><p>Transparent scoring helps teams align on why something comes first.</p></div><div><Zap /><h3>Action without delay</h3><p>Move from insight to response with the context your teams need.</p></div></div></section>
        <section id="contact" className="cta-section"><span className="kicker">MAKE EVERY REPORT COUNT</span><h2>Build the city<br /><span>people believe in.</span></h2><button className="primary-button">Request a demo <ArrowRight data-icon="inline-end" /></button></section>
        <footer><a href="#top" className="brand"><span className="logo-mark"><Activity /></span><span>Civic<span>Pulse</span></span></a><p>Turning civic signals into shared momentum.</p><span>© 2024 CivicPulse</span></footer>
    </main>
}


