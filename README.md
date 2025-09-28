# Touch Grass — Community Event Planner

Touch Grass is a full-stack app for discovering, planning, and joining local events based on shared interests. When enough nearby users share the same interest (e.g., hiking, mini golf, watching the Eagles), an AI agent proposes and schedules a real-world event, stores it in PostgreSQL, and notifies users.

---

## Features
- User profiles with interests and tags.
- AI-generated events (Gemini) grounded with venue data.
- PostgreSQL-backed API served via Express.
- React + TypeScript frontend (Vite + Tailwind).
- JWT authentication, RSVP, and event feeds.

---

## Architecture
- **Frontend:** React, TypeScript, Vite, Tailwind CSS  
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL  
- **Auth:** JWT  

---

## Quick Start (Local Development)

### 1. Clone & install
```bash
npm install
# or split repos:
# (frontend) npm install
# (backend)  npm install
```

### 2. Backend environment
Create `backend/.env`:

```env
# Postgres (choose one style)
DATABASE_URL=postgres://postgres:postgres@127.0.0.1:5432/touch_grass

# or discrete fields
PGUSER=postgres
PGPASSWORD=postgres
PGHOST=127.0.0.1
PGPORT=5432
PGDATABASE=touch_grass

# Server
PORT=4000

# AI (optional)
GEMINI_API_KEY=your_key_here
# optional overrides:
# GEMINI_MODEL=gemini-1.5-flash-latest
# SERPAPI_KEY=your_serpapi_key_here
```

> **Windows tip:** prefer `PGHOST=127.0.0.1` to avoid IPv6 (`::1`) issues.

### 3. Start PostgreSQL

**Option A: Docker**
```powershell
docker run --name tg-postgres `
  -e POSTGRES_USER=postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=touch_grass `
  -p 5432:5432 -d postgres:16
```

**Option B: Local install**  
Install PostgreSQL (e.g., v16), create a DB `touch_grass`, and ensure credentials match `.env`.

### 4. Apply schema
```bash
# Docker
docker cp backend/schema.sql tg-postgres:/schema.sql
docker exec -it tg-postgres psql -U postgres -d touch_grass -f /schema.sql

# Local
psql "postgres://postgres:postgres@127.0.0.1:5432/touch_grass" -f backend/schema.sql
```

### 5. (Optional) Seed example events
```bash
cd backend
node populate-with-creator.js
```

Requires `GEMINI_API_KEY` for best results. Without keys, the planner uses fallbacks.

### 6. Run the app
```bash
# from repo root if you have scripts
npm run dev

# or run individually
cd backend && node server.js
cd frontend && npm run dev
```

- Backend: `http://localhost:4000`  
- Frontend: `http://localhost:5173`

---

## API (selected)

- `POST /auth/register`  
- `POST /auth/login`  
- `GET  /interests`  
- `GET  /tags`  
- `GET  /events?uid=USER_ID`  
- `GET  /events/:eid`  
- `PUT  /profile`

### Example request

**Windows cmd.exe**
```cmd
curl -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d "{ \"first\": \"John\", \"last\": \"Doe\", \"email\": \"john.doe@example.com\", \"password\": \"supersecret123\" }"
```

**Windows PowerShell**
```powershell
curl -X POST http://localhost:4000/auth/register -H "Content-Type: application/json" -d '{ "first": "John", "last": "Doe", "email": "john.doe@example.com", "password": "supersecret123" }'
```

---

## AI Event Planner

- **Entry point:** `backend/eventCreator.js`  
- **Input:** interest string (e.g., `"hiking"`), existing events to avoid overlaps.  
- **Process:**
  1. Ideate with Gemini (or fallback).  
  2. Ground with venue data (SerpAPI/Maps).  
  3. Score & select best option.  
  4. Finalize DB row (name, datetime, description, cost, numAttendees).  
     - Always schedules **≥ 7 days out**.  
     - Prefers Thu/Fri 7 pm, Sat late morning/afternoon, Sun early afternoon.  
     - Skips conflicts with existing events.  

- **Output example:**
```json
{
  "name": "Hiking @ Piedmont Park",
  "datetime": "2025-10-05T13:00:00-04:00",
  "description": "Meetup: Hiking at Piedmont Park…",
  "cost": 0,
  "numAttendees": 0
}
```

---

## Frontend: verifying events

1. Ensure `/events` returns rows.  
2. Open the app and check the dashboard.  
3. For demo mode, inject a profile:

```js
localStorage.setItem('touchGrassUserProfile', JSON.stringify({
  name: 'Demo User',
  userId: '1',
  interests: ['Hiking','Sports']
}));
location.reload();
```

---

## Troubleshooting

**Connection issues**
- If port `5432` is already used, map Docker to `5433` and set `PGPORT=5433`.  
- Always prefer `PGHOST=127.0.0.1` over `localhost` on Windows.  
- Verify container: `docker ps` should show `0.0.0.0:5432->5432/tcp`.

**Password auth fails**
```bash
docker exec -it tg-postgres psql -U postgres -d postgres -c "ALTER ROLE postgres WITH PASSWORD 'postgres';"
```

**Gemini model error (404)**
- Set `GEMINI_MODEL=gemini-1.5-flash-latest` in `.env`.  
- Update `@google/generative-ai`.

**curl JSON parse error on Windows**
- In **cmd.exe** escape inner quotes with `\"…\"`.  
- In **PowerShell**, wrap JSON in single quotes.

---

## Contributing
- Work in `frontend/` and `backend/`.  
- Test locally with `npm run dev`.  
- Open PRs with clear descriptions.

---

## License
MIT
