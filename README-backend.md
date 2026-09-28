# Backend (Express) for CampusUpgradeApp

This Express backend serves the demo API and handles CampusConnect account sign-up, login, profile updates, and event registrations.

Quick start (Windows PowerShell):

```powershell
cd D:\Projects\CampusUpgradeApp\backend
npm install
npm run dev
```

Available endpoints:

- GET /api/status -> { status: 'ok', time: '...' }
- GET /api/items -> list of demo items
- POST /api/items -> add an item (json body: { "name": "..." })
- GET /api/auth/captcha -> create a one-use sign-up CAPTCHA
- POST /api/auth/signup -> create an account after validating the CAPTCHA
- POST /api/auth/login -> sign in an existing account
- GET /api/auth/me -> return the current signed-in account
- PATCH /api/auth/profile -> update name, email, and interests
- POST /api/auth/logout -> sign out
- GET /api/registrations and POST /api/registrations -> list or save the current user's event registrations

The frontend's Vite dev server proxies `/api` to `http://localhost:5000`. User records and registrations are stored in `backend/data/users.json`; passwords are stored as scrypt hashes. That data file is ignored by Git. For deployment, configure a stable `SESSION_SECRET` and replace Express's default in-memory session store with a persistent session store.
