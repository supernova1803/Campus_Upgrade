// src/App.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

/* ---------------- Mock data ---------------- */
const MOCK_EVENTS = [
  {
    id: "e1",
    title: "Intro to AI Workshop",
    description: "Hands-on workshop covering basics of machine learning and AI tools.",
    tags: ["ai", "workshop", "ml", "cs"],
    startAt: "2025-11-20T15:00:00",
    endAt: "2025-11-20T17:00:00",
    location: "Auditorium A",
    host: "CS Club",
  },
  {
    id: "e2",
    title: "Campus Clean-up Drive",
    description: "Join fellow students in making our campus greener.",
    tags: ["environment", "volunteer", "outdoors"],
    startAt: "2025-11-22T09:00:00",
    endAt: "2025-11-22T12:00:00",
    location: "Main Gate",
    host: "Eco Club",
  },
  {
    id: "e3",
    title: "Coffee & Code — Weekly Meetup",
    description: "Casual get-together for coding, project feedback, and networking.",
    tags: ["coding", "social", "networking", "cs"],
    startAt: "2025-11-18T18:00:00",
    endAt: "2025-11-18T20:00:00",
    location: "Cafeteria Lounge",
    host: "Programming Society",
  },
  {
    id: "e4",
    title: "Photography Basics",
    description: "Learn composition, lighting, and editing tips for budding photographers.",
    tags: ["photography", "workshop", "art"],
    startAt: "2025-11-25T14:00:00",
    endAt: "2025-11-25T16:00:00",
    location: "Studio 2",
    host: "Photo Club",
  },
  {
    id: "e5",
    title: "Dance Night: Bollywood Beats",
    description: "An evening of fun — freestyle and choreographed performances welcome.",
    tags: ["dance", "social", "culture"],
    startAt: "2025-11-23T19:00:00",
    endAt: "2025-11-23T22:00:00",
    location: "Auditorium B",
    host: "Cultural Club",
  },
  {
    id: "e6",
    title: "Data Science Fundamentals",
    description: "Intro session to data science workflows, pandas, and visualization.",
    tags: ["data science", "ds", "workshop", "ml"],
    startAt: "2025-11-21T16:00:00",
    endAt: "2025-11-21T18:00:00",
    location: "Lab 3",
    host: "Data Club",
  },
];

const EXTRA_CATEGORIES = [
  "ai",
  "ml",
  "cs",
  "ds",
  "dance",
  "photography",
  "environment",
  "coding",
];

const MOCK_USER = {
  id: "u1",
  name: "Rahul Raj",
  email: "rahul@example.edu",
  interests: ["ai", "coding", "ml"],
  rsvps: {},
};

/* ---------------- Utilities ---------------- */
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

function overlapScore(interests = [], tags = []) {
  const s = new Set(interests.map((i) => i.toLowerCase()));
  let score = 0;
  for (const t of tags) if (s.has(t.toLowerCase())) score++;
  return score;
}

/* ---------------- Reusable Components ---------------- */
function Topbar({ user }) {
  return (
    <header style={styles.topbar}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Campus Upgrade</div>
        <nav style={{ display: "flex", gap: 10 }}>
          <Link to="/home" style={styles.navLink}>
            Home
          </Link>
          <Link to="/events" style={styles.navLink}>
            Events
          </Link>
          <Link to="/profile" style={styles.navLink}>
            Profile
          </Link>
        </nav>
      </div>
      <div style={{ fontSize: 14 }}>
        Logged in as <strong>{user.name}</strong>
      </div>
    </header>
  );
}

/* ---------------- Landing Page ---------------- */
function LandingPage() {
  const navigate = useNavigate();
  return (
    <div style={styles.landingContainer}>
      <div style={styles.overlay}>
        <h1 style={styles.heading}>
          Welcome to <span style={{ color: "#4f46e5" }}>Campus Upgrade</span>
        </h1>
        <p style={styles.subtitle}>
          Discover new <strong>friends</strong>, explore <strong>events</strong>,
          and experience much more!
        </p>
        <button style={styles.startButton} onClick={() => navigate("/home")}>
          Get Started
        </button>
      </div>
    </div>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar({ categories, activeCategory, setActiveCategory }) {
  return (
    <aside style={styles.sidebar}>
      <h4 style={{ marginBottom: 10 }}>Categories</h4>
      <button
        style={styles.sideBtn(activeCategory === "all")}
        onClick={() => setActiveCategory("all")}
      >
        All
      </button>
      <button
        style={styles.sideBtn(activeCategory === "recommended")}
        onClick={() => setActiveCategory("recommended")}
      >
        Recommended
      </button>
      {categories.map((c) => (
        <button
          key={c}
          style={styles.sideBtn(activeCategory === c)}
          onClick={() => setActiveCategory(c)}
        >
          {c.toUpperCase()}
        </button>
      ))}
    </aside>
  );
}

/* ---------------- Event Card ---------------- */
function EventCard({ event, score, rsvped, onToggleRSVP }) {
  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3 style={{ margin: 0 }}>{event.title}</h3>
          <div style={{ fontSize: 13, color: "#666" }}>
            {event.host} • {formatDate(event.startAt)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "#666" }}>Match score</div>
          <div style={{ fontWeight: 700, color: "#4f46e5" }}>{score}</div>
        </div>
      </div>

      <p style={{ color: "#444" }}>{event.description}</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {event.tags.map((t) => (
          <span key={t} style={styles.tag}>
            {t}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button
          onClick={() => onToggleRSVP(event.id)}
          style={rsvped ? styles.primaryBtn : styles.outlineBtn}
        >
          {rsvped ? "Going" : "RSVP"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Main Home ---------------- */
function Home({ events, user, onToggleRSVP, activeCategory }) {
  const recommended = useMemo(() => {
    return [...events]
      .map((e) => ({ ...e, score: overlapScore(user.interests, e.tags) }))
      .sort((a, b) => b.score - a.score);
  }, [events, user.interests]);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return recommended;
    if (activeCategory === "recommended") return recommended;
    return recommended.filter((e) =>
      e.tags.map((t) => t.toLowerCase()).includes(activeCategory.toLowerCase())
    );
  }, [recommended, activeCategory]);

  return (
    <main style={{ padding: 20, width: "100%" }}>
      <h2>
        {activeCategory === "recommended"
          ? "Recommended for You"
          : activeCategory === "all"
          ? "All Events"
          : `Category: ${activeCategory.toUpperCase()}`}
      </h2>
      <div style={styles.grid}>
        {filtered.map((ev) => (
          <EventCard
            key={ev.id}
            event={ev}
            score={ev.score}
            rsvped={!!user.rsvps[ev.id]}
            onToggleRSVP={onToggleRSVP}
          />
        ))}
      </div>
    </main>
  );
}

/* ---------------- Profile ---------------- */
function Profile({ user }) {
  return (
    <main style={{ padding: 20 }}>
      <h2>Profile</h2>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Interests:</strong> {user.interests.join(", ")}
      </p>
    </main>
  );
}

/* ---------------- API Panel (example wiring) ---------------- */
function ApiPanel() {
  const [status, setStatus] = useState(null);
  const [items, setItems] = useState([]);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/status");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const j = await res.json();
      setStatus(j);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchItems() {
    try {
      const res = await fetch("/api/items");
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const j = await res.json();
      setItems(j);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStatus(), fetchItems()])
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
    // poll status every 10s while mounted
    const t = setInterval(fetchStatus, 10000);
    return () => clearInterval(t);
  }, []);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const created = await res.json();
      setItems((s) => [...s, created]);
      setNewName("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section style={{ padding: 20, borderTop: "1px solid #eee", background: "#fafafa" }}>
      <h3>Backend (example)</h3>
      {loading && <div>Loading backend status...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {status && (
        <div style={{ marginBottom: 8 }}>
          Backend status: <strong>{status.status}</strong> — {new Date(status.time).toLocaleString()}
        </div>
      )}

      <div style={{ marginBottom: 8 }}>
        <strong>Items from backend</strong>
        <div style={{ marginTop: 8 }}>
          {items.length === 0 ? (
            <div style={{ color: "#666" }}>no items</div>
          ) : (
            <ul>
              {items.map((it) => (
                <li key={it.id}>{it.name} (#{it.id})</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <form onSubmit={handleAdd} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New item name"
          style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
        />
        <button style={styles.primaryBtn}>Add</button>
      </form>
    </section>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  const [events] = useState(MOCK_EVENTS);
  const [user, setUser] = useState(MOCK_USER);
  const [activeCategory, setActiveCategory] = useState("recommended");

  const categories = useMemo(() => {
    const fromEvents = new Set();
    for (const e of events) for (const t of e.tags) fromEvents.add(t.toLowerCase());
    for (const ex of EXTRA_CATEGORIES) fromEvents.add(ex.toLowerCase());
    return Array.from(fromEvents).sort();
  }, [events]);

  const toggleRSVP = (eventId) => {
    setUser((u) => {
      const r = { ...u.rsvps };
      if (r[eventId]) delete r[eventId];
      else r[eventId] = true;
      return { ...u, rsvps: r };
    });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <>
              <Topbar user={user} />
              <div style={{ display: "flex" }}>
                <Sidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
                <div style={{ width: "100%" }}>
                  <Home
                    events={events}
                    user={user}
                    onToggleRSVP={toggleRSVP}
                    activeCategory={activeCategory}
                  />
                  <ApiPanel />
                </div>
              </div>
            </>
          }
        />
        <Route
          path="/events"
          element={
            <>
              <Topbar user={user} />
              <div style={{ display: "flex" }}>
                <Sidebar
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
                <div style={{ width: "100%" }}>
                  <Home
                    events={events}
                    user={user}
                    onToggleRSVP={toggleRSVP}
                    activeCategory={activeCategory}
                  />
                  <ApiPanel />
                </div>
              </div>
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Topbar user={user} />
              <Profile user={user} />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

/* ---------------- Styles ---------------- */
const styles = {
  topbar: {
    width: "100%",
    padding: "12px 20px",
    background: "#0f172a",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontSize: 14,
  },
  landingContainer: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #dbeafe, #e0e7ff)",
  },
  overlay: {
    background: "#fff",
    padding: "40px 60px",
    borderRadius: 16,
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  heading: { fontSize: "2.5rem", marginBottom: 10 },
  subtitle: { fontSize: "1.2rem", color: "#555", marginBottom: 25 },
  startButton: {
    padding: "12px 30px",
    fontSize: "1rem",
    borderRadius: 8,
    border: "none",
    background: "#4f46e5",
    color: "white",
    cursor: "pointer",
  },
  sidebar: {
    width: 200,
    padding: 20,
    background: "#fff",
    borderRight: "1px solid #ddd",
  },
  sideBtn: (active) => ({
    width: "100%",
    padding: "8px 10px",
    marginBottom: 6,
    textAlign: "left",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    background: active ? "#eef2ff" : "transparent",
  }),
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 14,
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 14,
    background: "#fff",
  },
  tag: {
    fontSize: 12,
    border: "1px solid #ddd",
    borderRadius: 999,
    padding: "3px 8px",
  },
  primaryBtn: {
    padding: "6px 12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  outlineBtn: {
    padding: "6px 12px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 6,
    cursor: "pointer",
  },
};
