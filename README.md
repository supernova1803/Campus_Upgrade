<div align="center">

# 🎓 CampusUpgrade (CampusConnect) 🚀

### *The Modern, Vibrant Campus Event Discovery & Registration Platform* 🎪✨

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646C9F?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](CONTRIBUTING.md)

<p align="center">
  <b>Discover campus life • RSVP in seconds • Register seamlessly • Connect with your community</b>
</p>

---

</div>

## 📑 Table of Contents

- [✨ Overview](#-overview)
- [🔥 Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Architecture](#-project-architecture)
- [🚀 Quick Start & Installation](#-quick-start--installation)
  - [📋 Prerequisites](#-prerequisites)
  - [⚡ One-Click Startup Script](#-one-click-startup-script)
  - [🖥️ Manual Setup (Step-by-Step)](#️-manual-setup-step-by-step)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🔌 REST API Documentation](#-rest-api-documentation)
- [🛡️ Security & Authentication Highlights](#️-security--authentication-highlights)
- [🌓 Theme Engine (Dark & Light Mode)](#-theme-engine-dark--light-mode)
- [🗺️ Future Roadmap](#️-future-roadmap)
- [🤝 Contributing](#-contributing)
- [📜 License & Acknowledgments](#-license--acknowledgments)

---

## ✨ Overview

**CampusUpgrade** (branded as **CampusConnect** 🎓) is an interactive, full-stack web application tailored for college and university campuses. It bridges the gap between vibrant campus organizations and students looking to get involved, learn new skills, attend hackathons, join workshops, and build memories. 

With an intuitive React 18 single-page interface powered by a secure Express backend, students can easily explore upcoming workshops, pitch competitions, cultural fests, and clean-up drives, bookmark favorites, RSVP instantly, and manage official registrations with real-time feedback.

---

## 🔥 Key Features

### 🔍 1. Smart Event Discovery & Recommendation Engine
- **🎯 "For You" Personalization:** Dynamically scores and ranks events based on user interests matching event tags.
- **⚡ Real-Time Search:** Instant search filter across event titles, hosts, venues, and descriptions.
- **🏷️ Category & Tag Chips:** One-click filtering by tags (e.g., `ai`, `coding`, `workshop`, `volunteer`, `dance`).
- **📅 Date & Type Filters:** Filter by timeframe (*Any date*, *Next 7 days*, *Next 30 days*) and category (*Workshop*, *Social*, *Competition*, *Volunteer*).

### 🎟️ 2. Seamless RSVP & Official Event Registration
- **⚡ Instant RSVP:** Quick one-click "Going" toggle to save spots directly from cards or modal views.
- **📝 Formal Student Registration:** Complete in-app registration form capturing:
  - 🎓 Full Name
  - 🏫 Academic Department
  - 📚 Current Semester (1st to 8th)
  - 🆔 University Seat Number (USN)
- **📋 Live State Tracking:** Cards update automatically to reflect `Registered` or `Going` status.

### 🔐 3. Rock-Solid Authentication & Security
- **🛡️ Dynamic Alphanumeric CAPTCHA:** Per-session randomized tilted visual CAPTCHA with instant reload to block automated bots.
- **🔑 Cryptographic Scrypt Hashing:** Passwords securely hashed using Node's native `scrypt` algorithm with unique 16-byte random salts.
- **⏱️ Timing-Safe Verification:** Compares password hashes using `crypto.timingSafeEqual` against timing attacks.
- **🍪 Secure Session Management:** Persistent, HTTP-only cookie sessions via `express-session` with atomic JSON writes.

### 👤 4. Personalized Student Profile
- **🎨 Interactive Profile Hub:** View and edit full name, email, and interest tags at any time.
- **🎫 My Registered Events:** Dedicated dashboard displaying all upcoming registrations with complete student submission details and date badges.

### 🌓 5. Adaptive Dark & Light Themes
- **🌓 Instant Theme Toggle:** Seamlessly switch between a sleek modern dark mode and a crisp, clean light mode.
- **💾 LocalStorage Persistence:** Remembers user preference across page reloads and browser sessions.

---

## 🛠️ Tech Stack

### 💻 Frontend
- **Framework:** [React 18](https://react.dev/) (Functional Components, Hooks)
- **Routing:** [React Router v6](https://reactrouter.com/) (Client-side routing with protected route guards)
- **Build Tool:** [Vite 5](https://vitejs.dev/) (Ultra-fast HMR and optimized bundler)
- **Styling:** Custom Vanilla CSS (Modern CSS variables, Glassmorphism, Responsive Grid & Flexbox, smooth transitions)

### ⚙️ Backend
- **Runtime:** [Node.js](https://nodejs.org/) (ES6+ / CommonJS)
- **Server Framework:** [Express 4](https://expressjs.com/)
- **Session Store:** [express-session](https://github.com/expressjs/session) (Cookie-based auth)
- **CORS Support:** [cors](https://github.com/expressjs/cors)
- **Security Primitives:** Native Node.js `crypto` (`scrypt`, `randomBytes`, `timingSafeEqual`, `randomUUID`)

### 💾 Data Persistence
- **Storage:** Atomic JSON storage (`backend/data/users.json`) with safe temporary file write-and-rename mechanics (`.tmp -> .json`) with strict file permissions (`0o600`).

---

## 📂 Project Architecture

```bash
Campus_Upgrade/
├── 📁 backend/
│   ├── 📁 data/                  # Local storage directory (auto-created)
│   │   └── 📄 users.json         # User credentials, interests & event registrations
│   ├── 📄 index.js               # Express API, auth logic, session & route handlers
│   ├── 📄 package.json           # Backend dependencies and scripts
│   └── 📄 package-lock.json
│
├── 📁 frontend/
│   ├── 📁 dist/                  # Production build output
│   ├── 📁 src/
│   │   ├── 📄 App.jsx            # Core SPA views, state, routing, modals & forms
│   │   ├── 📄 index.css          # Design system, theme variables & animations
│   │   └── 📄 main.jsx           # React DOM root entrypoint
│   ├── 📄 index.html             # Application HTML shell
│   ├── 📄 package.json           # Frontend dependencies and Vite configuration
│   └── 📄 vite.config.js         # Vite dev server & backend API proxy (/api)
│
├── 📜 run.sh                     # Convenient bash runner script
├── 📄 .gitignore                 # Ignored files (node_modules, users.json, dist)
└── 📄 README.md                  # Project documentation
```

---

## 🚀 Quick Start & Installation

### 📋 Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended) 👉 [Download Node.js](https://nodejs.org/)
- **npm** (comes packaged with Node.js)
- **Git** 👉 [Download Git](https://git-scm.com/)

---

### ⚡ One-Click Startup Script (Linux / macOS / Git Bash)
You can launch the frontend development environment directly using the included shell script:

```bash
chmod +x run.sh
./run.sh
```

---

### 🖥️ Manual Setup (Step-by-Step)

#### 1️⃣ Clone the Repository
```bash
git clone https://github.com/supernova1803/Campus_Upgrade.git
cd Campus_Upgrade
```

#### 2️⃣ Setup & Run the Backend API
In your first terminal:
```bash
cd backend
npm install
npm run dev
```
> 🟢 **Backend will start listening on:** `http://localhost:5000`

#### 3️⃣ Setup & Run the Frontend Client
In a second terminal:
```bash
cd frontend
npm install
npm run dev
```
> 🌐 **Frontend will open at:** `http://localhost:5173` (Vite dev server)

Vite is pre-configured with a reverse proxy: any calls to `/api/*` are automatically forwarded to `http://localhost:5000`.

---

### 📦 Building for Production

To create an optimized production build of the frontend:
```bash
cd frontend
npm run build
```
Static production files will be generated in `frontend/dist/`. You can preview the build using:
```bash
npm run preview
```

---

## ⚙️ Environment Configuration

The backend supports configurable environment variables. You can set them in your environment or via a `.env` file:

| Variable | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `PORT` | `Number` | `5000` | Port number on which the Express server listens. |
| `FRONTEND_URL` | `String` | `http://localhost:5173` | Allowed origin for CORS credentialed requests. |
| `SESSION_SECRET` | `String` | *(Auto-generated random hex)* | Secret key used to sign session cookies. |
| `NODE_ENV` | `String` | `development` | Set to `production` for secure cookie transmission & proxy trust. |

---

## 🔌 REST API Documentation

All API endpoints are served under `/api` with JSON request/response payloads:

| Method | Endpoint | Auth Required | Description |
| :---: | :--- | :---: | :--- |
| `GET` | `/api/status` | ❌ No | Healthcheck endpoint returning server status and timestamp. |
| `GET` | `/api/auth/captcha` | ❌ No | Generates a 6-letter dynamic CAPTCHA challenge in the user's session. |
| `POST` | `/api/auth/signup` | ❌ No | Register a new user account with name, email, password, and CAPTCHA. |
| `POST` | `/api/auth/login` | ❌ No | Authenticate user credentials and establish a session. |
| `GET` | `/api/auth/me` | ❌ No | Returns public profile data for the currently authenticated session. |
| `PATCH` | `/api/auth/profile` | ✅ Yes | Update name, email, and interests list for the logged-in student. |
| `POST` | `/api/auth/logout` | ✅ Yes | Invalidate user session and clear `campusconnect.sid` cookie. |
| `GET` | `/api/registrations` | ✅ Yes | Retrieve list of registered events for the current user. |
| `POST` | `/api/registrations` | ✅ Yes | Submit an event registration (`eventId`, `name`, `department`, `semester`, `usn`). |
| `GET` | `/api/items` | ❌ No | Sample catalog items route. |
| `POST` | `/api/items` | ❌ No | Create a new sample catalog item. |

---

## 🛡️ Security & Authentication Highlights

- **🔒 Password Protection:** Passwords are never saved in plain text. They are hashed using Node.js built-in `crypto.scrypt` with individual salt vectors.
- **🛡️ Anti-Brute Force CAPTCHA:** Registration requires solving a dynamically generated letter challenge that is invalidated immediately upon submission.
- **🍪 Secure Cookie Specs:** Session cookie uses `httpOnly: true`, `sameSite: 'lax'`, and automatically enforces `secure: true` when running in `production`.
- **🛡️ Input Sanitization & Normalization:** Emails are normalized to lowercase and trimmed, inputs are validated on both client and server before persistence.
- **📂 Atomic File Writes:** Writes to an intermediate `.tmp` file and renames it atomically to eliminate data corruption risks during concurrent operations.

---

## 🌓 Theme Engine (Dark & Light Mode)

The UI features a full-spectrum custom theme engine with smooth transitions:

- 🌞 **Light Mode:** High contrast, crisp typography, clean slate card borders, and warm accent highlights.
- 🌙 **Dark Mode:** Deep obsidian backgrounds, neon purple/indigo gradients, subtle frosted borders, and comfortable contrast for night browsing.
- 🔄 **One-Touch Toggle:** Easily switch from the header navigation bar at any time.

---

## 🗺️ Future Roadmap

- [ ] 📱 **Mobile Responsive Progressive Web App (PWA)** with offline caching.
- [ ] 🎫 **QR Code Ticket Pass Generator** for rapid check-in at event doors.
- [ ] 📬 **Email & Push Notifications** for event reminders and schedule updates.
- [ ] 📅 **Google Calendar & iCal Export** (`.ics` file generation).
- [ ] 👑 **Event Organizer Portal** to allow club heads to create and edit campus events directly.
- [ ] 🗄️ **Database Migration:** Support for PostgreSQL / MongoDB for enterprise-scale deployments.

---

## 🤝 Contributing

Contributions make the open-source community a vibrant place to learn, inspire, and create! Any contributions you make are **greatly appreciated**.

1. 🍴 **Fork the Project**
2. 🌿 **Create your Feature Branch** (`git checkout -b feature/AmazingFeature`)
3. 💾 **Commit your Changes** (`git commit -m '✨ Add some AmazingFeature'`)
4. 🚀 **Push to the Branch** (`git push origin feature/AmazingFeature`)
5. 📬 **Open a Pull Request**

---

## 📜 License & Acknowledgments

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">

Made with ❤️ for students everywhere 🎓

⭐ **Star this repository if you find it helpful!** ⭐

</div>
