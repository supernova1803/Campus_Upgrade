import React, { useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useNavigate, useLocation, useParams } from "react-router-dom";

// Demo data. Replace with an events API when one is available.
const MOCK_EVENTS = [
  { id: "e1", title: "Intro to AI Workshop", description: "Build a foundation in machine learning and try practical AI tools in a hands-on session.", tags: ["ai", "workshop", "ml", "cs"], startAt: "2026-10-02T15:00:00", endAt: "2026-10-02T17:00:00", location: "Auditorium A", host: "CS Club", type: "Workshop", howToRegister: "Register here, then check your student email for confirmation." },
  { id: "e2", title: "Campus Clean-up Drive", description: "Spend a morning outdoors with fellow students and help make our campus greener.", tags: ["environment", "volunteer", "outdoors"], startAt: "2026-10-03T09:00:00", endAt: "2026-10-03T12:00:00", location: "Main Gate", host: "Eco Club", type: "Volunteer", howToRegister: "Complete the campus event registration form. Gloves and bags will be provided." },
  { id: "e3", title: "Coffee & Code — Weekly Meetup", description: "Bring a project, get feedback, and meet other students who love building things.", tags: ["coding", "social", "networking", "cs"], startAt: "2026-10-01T18:00:00", endAt: "2026-10-01T20:00:00", location: "Cafeteria Lounge", host: "Programming Society", type: "Social", howToRegister: "Register online to reserve a seat. Walk-ins are welcome if space allows." },
  { id: "e4", title: "Photography Basics", description: "Learn composition, lighting, and editing tips for budding photographers.", tags: ["photography", "workshop", "art"], startAt: "2026-10-06T14:00:00", endAt: "2026-10-06T16:00:00", location: "Studio 2", host: "Photo Club", type: "Workshop", howToRegister: "Register online and bring a phone or camera if you have one." },
  { id: "e5", title: "Dance Night: Bollywood Beats", description: "An evening of music and dance. Join in for freestyle or cheer on the performances.", tags: ["dance", "social", "culture"], startAt: "2026-10-05T19:00:00", endAt: "2026-10-05T22:00:00", location: "Auditorium B", host: "Cultural Club", type: "Social", howToRegister: "Register online. Your campus ID is required at the entrance." },
  { id: "e6", title: "Data Science Fundamentals", description: "Explore data workflows, pandas, and visualization in this beginner-friendly session.", tags: ["data science", "ds", "workshop", "ml"], startAt: "2026-10-04T16:00:00", endAt: "2026-10-04T18:00:00", location: "Lab 3", host: "Data Club", type: "Workshop", howToRegister: "Register online; seats are limited to 30 students." },
  { id: "e7", title: "Startup Pitch Sprint", description: "Form a team, shape an idea, and pitch it to a panel of campus founders.", tags: ["startup", "business", "innovation"], startAt: "2026-10-08T13:00:00", endAt: "2026-10-08T16:00:00", location: "Innovation Hub", host: "Campus Entrepreneurship Cell", type: "Competition", howToRegister: "Register as an individual or team of up to four. Add your team name on the form." },
  { id: "e8", title: "Open Mic on the Lawn", description: "Share a song, poem, or story at a relaxed outdoor evening hosted by students.", tags: ["music", "arts", "social"], startAt: "2026-10-09T17:30:00", endAt: "2026-10-09T20:00:00", location: "Central Lawn", host: "Literary & Music Society", type: "Social", howToRegister: "Register for a performer slot, or register as an attendee." },
  { id: "e9", title: "Robotics Build Day", description: "Prototype a small robot, learn basic sensors, and collaborate with the robotics team.", tags: ["robotics", "engineering", "workshop"], startAt: "2026-10-10T10:00:00", endAt: "2026-10-10T15:00:00", location: "Engineering Block, Lab 1", host: "Robotics Club", type: "Workshop", howToRegister: "Register online. No prior robotics experience is needed." },
  { id: "e10", title: "Tree Planting Morning", description: "Help plant native saplings around campus with the sustainability team.", tags: ["environment", "volunteer", "outdoors"], startAt: "2026-10-11T08:30:00", endAt: "2026-10-11T11:30:00", location: "North Garden", host: "Green Campus Initiative", type: "Volunteer", howToRegister: "Register online by the previous evening so the team can prepare materials." },
];

const EMPTY_USER = { name: "", email: "", interests: ["ai", "coding", "ml"], rsvps: {} };
const formatDate = (iso, options = { weekday: "short", month: "short", day: "numeric" }) => new Date(iso).toLocaleDateString(undefined, options);
const formatTime = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
const overlapScore = (interests = [], tags = []) => {
  const selected = new Set(interests.map((interest) => interest.toLowerCase()));
  return tags.filter((tag) => selected.has(tag.toLowerCase())).length;
};
const initials = (name = "") => name.split(" ").filter(Boolean).map((part) => part[0]).join("");
async function requestJson(url, options = {}) {
  const response = await fetch(url, { credentials: "include", ...options, headers: { ...(options.headers || {}), ...(options.body ? { "Content-Type": "application/json" } : {}) } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status}).`);
  return payload;
}

function Topbar({ user, onSignOut, theme, onToggleTheme }) {
  const navClass = ({ isActive }) => `topbar-link${isActive ? " active" : ""}`;
  return <header className="topbar">
    <Link className="brand" to="/home"><span className="brand-mark">C</span><span>Campus<span className="brand-light">Connect</span></span></Link>
    <nav className="topbar-nav" aria-label="Main navigation">
      <NavLink to="/home" end className={navClass}>Discover</NavLink><NavLink to="/events" className={navClass}>Events</NavLink><NavLink to="/profile" className={navClass}>My profile</NavLink>
    </nav>
    <div className="account-actions"><button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}><span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span></button>{user.email ? <><Link className="user-pill" to="/profile"><span className="avatar">{initials(user.name)}</span><span>{user.name}</span></Link><button className="sign-out-button" onClick={onSignOut}>Sign out</button></> : <div className="auth-nav"><Link className="login-nav" to="/login">Log in</Link><Link className="signup-nav" to="/signup">Sign up</Link></div>}</div>
  </header>;
}

function LandingPage() {
  const navigate = useNavigate();
  return <main className="landing"><div className="landing-card"><span className="eyebrow">YOUR CAMPUS, YOUR COMMUNITY</span><h1>Make campus life<br /><span>unforgettable.</span></h1><p>Find your people, discover what’s happening, and make more of every week.</p><div className="landing-actions"><button className="button button-primary" onClick={() => navigate("/home")}>Explore events <span aria-hidden="true">→</span></button><div className="landing-auth-links"><Link className="landing-login-link" to="/login">Log in</Link><Link className="landing-login-link" to="/signup">Sign up</Link></div></div></div></main>;
}

function LoginPage({ onLogin, onToggleRSVP }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const { user } = await requestJson("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      await onLogin({ ...user, rsvps: {} });
    } catch (requestError) { setError(requestError.message); return; }
    if (location.state?.rsvpEventId) onToggleRSVP(location.state.rsvpEventId);
    navigate("/home", { replace: true });
  }
  return <main className="login-page"><Link className="brand login-brand" to="/"><span className="brand-mark">C</span><span>Campus<span className="brand-light">Connect</span></span></Link><section className="login-card"><span className="eyebrow">WELCOME BACK</span><h1>Log in to your campus</h1><p className="login-intro">Use your student email to pick up where you left off.</p><form className="login-form" onSubmit={handleSubmit}><label>Email address<input type="email" autoComplete="email" placeholder="you@university.edu" value={email} onChange={(event) => setEmail(event.target.value)} required /></label><label>Password<div className="password-field"><input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required /><button type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? "Hide" : "Show"}</button></div></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary login-submit" type="submit">Log in</button></form><p className="login-note">You must create an account before you can log in.</p><p className="auth-switch">New here? <Link to="/signup" state={location.state}>Create an account</Link></p></section><Link className="login-back-link" to="/">← Back to CampusConnect</Link></main>;
}

function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [captcha, setCaptcha] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const captchaRequested = useRef(false);
  async function refreshCaptcha() {
    setCaptchaLoading(true);
    try { const { captcha: nextCaptcha } = await requestJson("/api/auth/captcha"); setCaptcha(nextCaptcha); setCaptchaInput(""); setError(""); }
    catch (requestError) { setCaptcha(""); setError(requestError.message || "Start the backend to load a CAPTCHA."); }
    finally { setCaptchaLoading(false); }
  }
  useEffect(() => { if (!captchaRequested.current) { captchaRequested.current = true; refreshCaptcha(); } }, []);
  async function submit(event) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (captchaInput.trim().toUpperCase() !== captcha) { await refreshCaptcha(); setError("The CAPTCHA does not match. Try the new code."); return; }
    setError("");
    try {
      await requestJson("/api/auth/signup", { method: "POST", body: JSON.stringify({ name: form.name, email: form.email, password: form.password, captcha: captchaInput }) });
      navigate("/login", { replace: true, state: { email: form.email.trim(), returnTo: location.state?.returnTo, rsvpEventId: location.state?.rsvpEventId } });
    } catch (requestError) { if (requestError.message.toLowerCase().includes("captcha")) await refreshCaptcha(); setError(requestError.message); }
  }
  return <main className="login-page"><Link className="brand login-brand" to="/"><span className="brand-mark">C</span><span>Campus<span className="brand-light">Connect</span></span></Link><section className="login-card signup-card"><span className="eyebrow">JOIN YOUR CAMPUS COMMUNITY</span><h1>Create your account</h1><p className="login-intro">Add your details to get started.</p><form className="login-form" onSubmit={submit}><label>Full name<input autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required /></label><label>Email address<input type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@university.edu" required /></label><label>Create password<input type="password" autoComplete="new-password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="At least 8 characters" required /></label><label>Confirm password<input type="password" autoComplete="new-password" minLength={8} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Enter your password again" required /></label><div className="captcha-block"><div className="captcha-heading"><span>Enter the letters shown</span><button type="button" className="captcha-refresh" onClick={refreshCaptcha} disabled={captchaLoading}>New code ↻</button></div><div className="captcha-challenge" aria-label={captcha ? `CAPTCHA code ${captcha}` : "Loading CAPTCHA"}>{captcha ? captcha.split("").map((letter, i) => <span key={`${letter}-${i}`} style={{ "--letter-tilt": `${(i % 2 ? 1 : -1) * (4 + i % 3)}deg` }}>{letter}</span>) : "Loading…"}</div><input className="captcha-input" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Type the letters above" autoComplete="off" required /></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary login-submit" type="submit" disabled={captchaLoading || !captcha}>Create account</button></form><p className="login-note">Passwords are stored as a secure hash by the backend. Your account and event registrations are saved locally by the demo server.</p><p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p></section><Link className="login-back-link" to="/">← Back to CampusConnect</Link></main>;
}

function EventDetails({ event, isLoggedIn, onRSVP, onRegister, onClose }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={(click) => { if (click.target === click.currentTarget) onClose(); }}><section className="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-modal-title"><button className="modal-close" onClick={onClose} aria-label="Close event details">×</button><span className="type-label">{event.type}</span><h2 id="event-modal-title">{event.title}</h2><p>{event.description}</p><dl className="event-detail-list"><div><dt>Conducted by</dt><dd>{event.host}</dd></div><div><dt>Date &amp; time</dt><dd>{formatDate(event.startAt, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}, {formatTime(event.startAt)}–{formatTime(event.endAt)}</dd></div><div><dt>Location</dt><dd>{event.location}</dd></div><div><dt>How to register</dt><dd>{event.howToRegister}</dd></div></dl><div className="modal-actions"><button className="button button-secondary" onClick={onRSVP}>{isLoggedIn ? "RSVP" : "Log in to RSVP"}</button><button className="button button-primary" onClick={onRegister}>{isLoggedIn ? "Register now" : "Log in to register"}</button></div></section></div>;
}

function EventCard({ event, score, rsvped, registered, isLoggedIn, onRSVP, onRegister, layout = "grid" }) {
  const [showDetails, setShowDetails] = useState(false);
  const date = new Date(event.startAt);
  return <>
    <article className={`event-card ${layout === "list" ? "event-card-list" : ""}`}>
      <div className="event-card-top"><div className="date-tile"><span>{date.toLocaleDateString(undefined, { month: "short" })}</span><strong>{date.getDate()}</strong></div><div className="event-heading"><span className="type-label">{event.type}</span><button className="event-title" onClick={() => setShowDetails(true)}>{event.title}</button></div>{score > 0 && <span className="match-badge">✦ For you</span>}</div>
      <p className="event-description">{event.description}</p>
      <div className="event-meta"><span aria-hidden="true">◷</span>{formatDate(event.startAt, { weekday: "long", month: "long", day: "numeric" })} · {formatTime(event.startAt)}–{formatTime(event.endAt)}</div>
      <div className="event-meta"><span aria-hidden="true">⌖</span>{event.location}<span className="meta-divider">·</span>{event.host}</div>
      <div className="event-tags">{event.tags.slice(0, 3).map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
      <div className="event-card-actions"><button className="button button-secondary details-button" onClick={() => setShowDetails(true)}>Event details</button><button className={`button ${rsvped ? "button-going" : "button-primary"}`} onClick={onRSVP}>{rsvped ? "✓ Going" : isLoggedIn ? "RSVP" : "Log in to RSVP"}</button><button className={`button ${registered ? "button-going" : "button-register"}`} onClick={onRegister}>{registered ? "Registered" : "Register now"}</button></div>
    </article>
    {showDetails && <EventDetails event={event} isLoggedIn={isLoggedIn} onRSVP={() => { setShowDetails(false); onRSVP(); }} onRegister={() => { setShowDetails(false); onRegister(); }} onClose={() => setShowDetails(false)} />}
  </>;
}

function EventExplorer({ events, user, registrations, onToggleRSVP, onBeginRegistration, layout = "grid", title = "Explore events" }) {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(user.email);
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("any");
  const [eventType, setEventType] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = useMemo(() => [...new Set(events.flatMap((event) => event.tags))].sort(), [events]);
  const rankedEvents = useMemo(() => events.map((event) => ({ ...event, score: isLoggedIn ? overlapScore(user.interests, event.tags) : 0 })).sort((a, b) => isLoggedIn ? b.score - a.score : new Date(a.startAt) - new Date(b.startAt)), [events, user.interests, isLoggedIn]);
  const safeRegistrations = Array.isArray(registrations) ? registrations : [];
  const filtered = rankedEvents.filter((event) => {
    const matchesQuery = `${event.title} ${event.description} ${event.host} ${event.location} ${event.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCategory = activeCategory === "all" || (isLoggedIn && activeCategory === "recommended") || event.tags.includes(activeCategory);
    const eventDate = new Date(event.startAt);
    const now = new Date();
    const matchesDate = dateRange === "any" || (eventDate >= now && eventDate <= new Date(now.getTime() + (dateRange === "week" ? 7 : 30) * 86400000));
    return matchesQuery && matchesCategory && matchesDate && (eventType === "all" || event.type === eventType);
  });
  const rsvpFor = (eventId) => {
    if (!isLoggedIn) { navigate("/login", { state: { returnTo: layout === "list" ? "/events" : "/home", rsvpEventId: eventId } }); return; }
    onToggleRSVP(eventId);
  };
  const registerFor = (eventId) => {
    if (!isLoggedIn) { navigate("/login", { state: { returnTo: `/register/${eventId}` } }); return; }
    onBeginRegistration(eventId);
  };
  return <main className="page-content"><section className="section-heading"><div><span className="eyebrow">{layout === "list" ? "WHAT’S HAPPENING ON CAMPUS" : "FIND YOUR THING"}</span><h1>{title}</h1></div><span className="result-count">{filtered.length} {filtered.length === 1 ? "event" : "events"}</span></section><div className="filter-panel"><label className="search-box"><span aria-hidden="true">⌕</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, clubs, or places" aria-label="Search events, clubs, or places" /></label><label className="select-label"><span className="sr-only">Filter by date</span><select value={dateRange} onChange={(event) => setDateRange(event.target.value)}><option value="any">Any date</option><option value="week">Next 7 days</option><option value="month">Next 30 days</option></select></label><label className="select-label"><span className="sr-only">Filter by event type</span><select value={eventType} onChange={(event) => setEventType(event.target.value)}><option value="all">All types</option>{[...new Set(events.map((event) => event.type))].map((type) => <option key={type}>{type}</option>)}</select></label></div><div className="category-row" aria-label="Filter by category">{isLoggedIn && <button className={`category-chip ${activeCategory === "recommended" ? "selected" : ""}`} onClick={() => setActiveCategory("recommended")}>For you</button>}<button className={`category-chip ${activeCategory === "all" ? "selected" : ""}`} onClick={() => setActiveCategory("all")}>All events</button>{categories.map((category) => <button key={category} className={`category-chip ${activeCategory === category ? "selected" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>{filtered.length ? <div className={layout === "list" ? "event-list" : "event-grid"}>{filtered.map((event) => <EventCard key={event.id} event={event} score={event.score} rsvped={!!user.rsvps[event.id]} registered={safeRegistrations.some((registration) => registration.eventId === event.id)} isLoggedIn={isLoggedIn} onRSVP={() => rsvpFor(event.id)} onRegister={() => registerFor(event.id)} layout={layout} />)}</div> : <div className="empty-state"><span className="empty-icon">⌕</span><h3>No events found</h3><p>Try another search or clear a filter.</p><button className="button button-secondary" onClick={() => { setQuery(""); setDateRange("any"); setEventType("all"); setActiveCategory("all"); }}>Clear all filters</button></div>}</main>;
}

function Home({ events, user, registrations, onToggleRSVP, onBeginRegistration }) {
  const isLoggedIn = Boolean(user.email);
  const featured = [...events].sort((a, b) => overlapScore(user.interests, b.tags) - overlapScore(user.interests, a.tags))[0];
  return <><main className="page-content"><section className="welcome-row"><div><span className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).toUpperCase()}</span><h1>Find your next <span>campus moment.</span></h1><p>Good things happen when you show up. See what’s coming up.</p></div><div className="welcome-stats"><div><strong>{events.length}</strong><span>campus events</span></div><div><strong>{Object.values(user.rsvps).filter(Boolean).length}</strong><span>you’re attending</span></div></div></section>{isLoggedIn && featured && <section className="featured-event"><div className="featured-copy"><span className="featured-kicker">✦ TOP PICK FOR YOU</span><h2>{featured.title}</h2><p>{featured.description}</p><div className="featured-details"><span>◷ {formatDate(featured.startAt, { weekday: "long", month: "long", day: "numeric" })} · {formatTime(featured.startAt)}</span><span>⌖ {featured.location}</span></div><button className="button button-white" onClick={() => onToggleRSVP(featured.id)}>{user.rsvps[featured.id] ? "✓ You’re going" : "Save your spot"} <span aria-hidden="true">→</span></button></div><div className="featured-art" aria-hidden="true"><span className="art-orbit orbit-one" /><span className="art-orbit orbit-two" /><span className="art-star">✳</span><span className="art-caption">MEET · LEARN · EXPLORE</span></div></section>}</main><EventExplorer events={events.slice(0, 6)} user={user} registrations={registrations} onToggleRSVP={onToggleRSVP} onBeginRegistration={onBeginRegistration} title="Explore events" /></>;
}

function RegistrationPage({ events, onSubmitRegistration, user }) {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = events.find((item) => item.id === eventId);
  const [form, setForm] = useState({ name: user.name || "", department: "", semester: "", usn: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  if (!event) return <main className="page-content"><h1>Event not found</h1><Link to="/events">Back to events</Link></main>;
  async function submit(eventSubmit) {
    eventSubmit.preventDefault();
    setError("");
    try { await onSubmitRegistration({ eventId, ...form }); setSubmitted(true); }
    catch (requestError) { setError(requestError.message); }
  }
  return <main className="page-content registration-page"><Link className="back-link" to="/events">← Back to events</Link><section className="registration-card">{submitted ? <><span className="registration-success">✓</span><h1>You’re registered</h1><p>Your registration for <strong>{event.title}</strong> has been saved.</p><button className="button button-primary" onClick={() => navigate("/profile")}>View my registered events</button></> : <><span className="eyebrow">EVENT REGISTRATION</span><h1>{event.title}</h1><p className="registration-subtitle">{formatDate(event.startAt, { weekday: "long", month: "long", day: "numeric" })} · {formatTime(event.startAt)} · {event.location}</p><form className="registration-form" onSubmit={submit}><label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" /></label><label>Department<input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Computer Science" /></label><label>Semester<select required value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })}><option value="">Select semester</option>{Array.from({ length: 8 }, (_, i) => <option key={i + 1} value={`${i + 1}`}>{i + 1}{["st", "nd", "rd"][i] || "th"} semester</option>)}</select></label><label>USN<input required value={form.usn} onChange={(e) => setForm({ ...form, usn: e.target.value })} placeholder="Enter your university seat number" /></label>{error && <p className="form-error registration-submit" role="alert">{error}</p>}<button className="button button-primary registration-submit">Submit registration</button></form><p className="registration-note">Your details are saved with your account.</p></>}</section></main>;
}

function Profile({ user, events, registrations, onSaveProfile }) {
  const registeredEvents = registrations.map((registration) => ({ ...registration, event: events.find((event) => event.id === registration.eventId) })).filter((registration) => registration.event);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: user.name, email: user.email, interests: user.interests.join(", ") });
  useEffect(() => setForm({ name: user.name, email: user.email, interests: user.interests.join(", ") }), [user]);
  async function save(event) {
    event.preventDefault(); setSaving(true); setError("");
    try {
      await onSaveProfile({ name: form.name, email: form.email, interests: form.interests.split(",").map((item) => item.trim()).filter(Boolean) });
      setEditing(false);
    } catch (saveError) { setError(saveError.message); }
    finally { setSaving(false); }
  }
  return <main className="page-content profile-page"><div className="profile-title-row"><div><span className="eyebrow">YOUR CAMPUS ACCOUNT</span><h1>My profile</h1></div><button className={`button ${editing ? "button-secondary" : "button-primary"} edit-profile-button`} onClick={() => { setEditing((active) => !active); setError(""); }} aria-label={editing ? "Cancel profile editing" : "Edit your profile"} title={editing ? "Cancel editing" : "Edit profile"}>{editing ? "Cancel" : <><span aria-hidden="true">✎</span> Edit profile</>}</button></div><section className="profile-card"><div className="avatar avatar-large">{initials(user.name)}</div>{editing ? <form className="profile-edit-form" onSubmit={save}><label>Full name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label>Email address<input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label><label>Interests <span className="field-hint">(comma separated)</span><input value={form.interests} onChange={(e) => setForm({ ...form, interests: e.target.value })} placeholder="ai, coding, design" /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-primary" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></form> : <><h2>{user.name}</h2><p>{user.email}</p><h3>Your interests</h3><div className="event-tags">{user.interests.length ? user.interests.map((interest) => <span className="tag" key={interest}>{interest}</span>) : <span className="profile-hint">Add your interests to get event recommendations.</span>}</div></>}</section><section className="registered-section"><div className="section-heading"><div><span className="eyebrow">YOUR EVENT PLANS</span><h2>My registered events</h2></div><span className="result-count">{registeredEvents.length} registered</span></div>{registeredEvents.length ? <div className="registered-list">{registeredEvents.map(({ event, name, department, semester, usn }) => <article className="registered-event" key={event.id}><div className="date-tile"><span>{new Date(event.startAt).toLocaleDateString(undefined, { month: "short" })}</span><strong>{new Date(event.startAt).getDate()}</strong></div><div><h3>{event.title}</h3><p>{formatDate(event.startAt, { weekday: "long", month: "long", day: "numeric" })} · {formatTime(event.startAt)} · {event.location}</p><small>{name} · {department} · Sem {semester} · {usn}</small></div></article>)}</div> : <div className="empty-state registered-empty"><h3>No registered events yet</h3><p>Open an event and choose Register now to add it here.</p><Link className="button button-primary" to="/events">Browse events</Link></div>}</section></main>;
}

function AppRoutes() {
  const navigate = useNavigate();
  const [events] = useState(MOCK_EVENTS);
  const [user, setUser] = useState(EMPTY_USER);
  const [registrations, setRegistrations] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("campusconnect-theme") === "dark" ? "dark" : "light"; } catch { return "light"; } });
  const location = useLocation();
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem("campusconnect-theme", theme); } catch { /* Theme stays active for this visit. */ } }, [theme]);
  useEffect(() => {
    let active = true;
    requestJson("/api/auth/me").then(async ({ user: sessionUser }) => {
      if (!active || !sessionUser) return;
      setUser((current) => ({ ...current, ...sessionUser, rsvps: current.rsvps }));
      const { registrations: savedRegistrations } = await requestJson("/api/registrations");
      if (active) setRegistrations(Array.isArray(savedRegistrations) ? savedRegistrations : []);
    }).catch(() => {}).finally(() => { if (active) setAuthLoading(false); });
    return () => { active = false; };
  }, []);
  const toggleRSVP = (eventId) => setUser((current) => { const rsvps = { ...current.rsvps }; if (rsvps[eventId]) delete rsvps[eventId]; else rsvps[eventId] = true; return { ...current, rsvps }; });
  const acceptAccount = async (account) => {
    setUser({ ...EMPTY_USER, ...account, rsvps: {} });
    try { const { registrations: savedRegistrations } = await requestJson("/api/registrations"); setRegistrations(Array.isArray(savedRegistrations) ? savedRegistrations : []); }
    catch { setRegistrations([]); }
  };
  const signOut = async () => { setUser(EMPTY_USER); setRegistrations([]); try { await requestJson("/api/auth/logout", { method: "POST" }); } catch { /* Clear the local view even if the server is unavailable. */ } };
  const beginRegistration = (eventId) => navigate(`/register/${eventId}`);
  const submitRegistration = async (registration) => { const { registrations: savedRegistrations } = await requestJson("/api/registrations", { method: "POST", body: JSON.stringify(registration) }); setRegistrations(Array.isArray(savedRegistrations) ? savedRegistrations : []); };
  const saveProfile = async (profile) => { const { user: updatedUser } = await requestJson("/api/auth/profile", { method: "PATCH", body: JSON.stringify(profile) }); setUser((current) => ({ ...current, ...updatedUser })); };
  const onToggleTheme = () => setTheme((current) => current === "dark" ? "light" : "dark");
  const topbar = <Topbar user={user} onSignOut={signOut} theme={theme} onToggleTheme={onToggleTheme} />;
  const protectedView = (element) => authLoading ? <main className="page-content auth-loading">Checking your account…</main> : user.email ? element : <Navigate to="/login" replace />;
  return <Routes><Route path="/" element={<LandingPage />} /><Route path="/login" element={<LoginPage onLogin={acceptAccount} onToggleRSVP={toggleRSVP} />} /><Route path="/signup" element={<SignUpPage />} /><Route path="/home" element={<>{topbar}<Home events={events} user={user} registrations={registrations} onToggleRSVP={toggleRSVP} onBeginRegistration={beginRegistration} /></>} /><Route path="/events" element={<>{topbar}<EventExplorer events={events} user={user} registrations={registrations} onToggleRSVP={toggleRSVP} onBeginRegistration={beginRegistration} layout="list" title="All campus events" /></>} /><Route path="/profile" element={<>{topbar}{protectedView(<Profile user={user} events={events} registrations={registrations} onSaveProfile={saveProfile} />)}</>} /><Route path="/register/:eventId" element={<>{topbar}{protectedView(<RegistrationPage events={events} user={user} onSubmitRegistration={submitRegistration} />)}</>} /><Route path="*" element={<Navigate to="/home" replace />} /></Routes>;
}

export default function App() { return <Router><AppRoutes /></Router>; }
