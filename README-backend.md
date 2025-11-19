# Backend (Express) for CampusUpgradeApp

This small backend provides a few demo API endpoints for the frontend to consume.

Quick start (Windows PowerShell):

```powershell
cd c:\Users\castl\Downloads\CampusUpgradeApp\backend
npm install
npm run dev
```

Available endpoints:

- GET /api/status -> { status: 'ok', time: '...' }
- GET /api/items -> list of demo items
- POST /api/items -> add an item (json body: { "name": "..." })

The frontend's Vite dev server is configured to proxy `/api` to `http://localhost:5000` so you can call `/api/*` from the React app.
