# CampusUpgrade

CampusConnect is a campus events dashboard where students can discover activities, RSVP, register for events, and manage their account. It includes a React frontend and an Express API for account and registration data.

## Features

- Browse campus events in a dashboard or list view, with search, date, and event type filters.
- View event details such as the host, schedule, location, and registration instructions.
- RSVP and register for events. Login is required for these actions.
- Create an account with a name, email, password, and changing CAPTCHA; sign up returns to the login page.
- Log in with an existing account; successful login opens the dashboard.
- Edit profile name, email, and interests, and view registered events in the profile.
- Switch between light and dark themes; the selected theme is saved in the browser.
- Responsive interface with button and navigation feedback animations.

## Tech stack

- **Frontend:** React 18, React Router, Vite
- **Backend:** Node.js, Express, express-session
- **Account storage:** Local JSON file (`backend/data/users.json`); passwords are stored as scrypt hashes.

## Requirements

- Node.js and npm
- Two terminal windows to run the frontend and backend together

## Run locally

Clone the repository and install dependencies in each app directory:

```bash
git clone https://github.com/supernova1803/CampusUpgradeApp.git
cd CampusUpgradeApp
```

In terminal 1, start the backend:

```bash
cd backend
npm install
npm run dev
```

The API runs at `http://localhost:5000`.

In terminal 2, from the repository root, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (usually `http://localhost:5173`). The Vite development server proxies `/api` requests to the backend on port 5000.

To create a production frontend bundle:

```bash
cd frontend
npm run build
```

The generated static files are written to `frontend/dist`.

## API overview

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/status` | Check that the API is running. |
| `GET` | `/api/auth/captcha` | Create a one-use sign-up CAPTCHA. |
| `POST` | `/api/auth/signup` | Create an account. Accepts `name`, `email`, `password`, and `captcha`. |
| `POST` | `/api/auth/login` | Log in with an existing email and password. |
| `GET` | `/api/auth/me` | Get the current session account. |
| `PATCH` | `/api/auth/profile` | Update the signed-in user's name, email, and interests. |
| `POST` | `/api/auth/logout` | End the current session. |
| `GET` | `/api/registrations` | List the signed-in user's event registrations. |
| `POST` | `/api/registrations` | Register for an event with student details. |

Authenticated endpoints use the session cookie. The frontend sends credentials with API requests.

## Project layout

```text
CampusUpgradeApp/
├── backend/
│   ├── index.js            # Express API and session-based authentication
│   └── package.json
├── frontend/
│   ├── src/App.jsx         # Routes, event views, auth, profile, registrations
│   ├── src/index.css       # Layout, components, responsive styles, themes
│   ├── package.json
│   └── vite.config.js      # Development API proxy
└── README.md
```

## Configuration and data

- `PORT` sets the backend port (defaults to `5000`).
- `FRONTEND_URL` sets the allowed frontend origin for CORS (defaults to `http://localhost:5173`).
- `SESSION_SECRET` sets the Express session signing secret. Set a stable, private value when deploying.
- Accounts and registrations are stored in `backend/data/users.json`. This file is excluded from Git and is created when data is saved. Back it up if you need to preserve local development accounts.
- The event list is currently sample data in `frontend/src/App.jsx`; replace it with an events API when one is available.

## Deployment notes

The current backend is intended for local development and simple demos. Before deploying for real users, use a persistent database and a production session store, set a strong `SESSION_SECRET`, configure `FRONTEND_URL` for the deployed frontend, and serve the app over HTTPS. The in-memory default session store is not suitable for production or multiple backend instances.
