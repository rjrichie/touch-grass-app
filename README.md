# Touch Grass - Event Planning App

A full-stack event planning application that helps users find and join community events based on their interests.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: JWT tokens

## Project Structure

```
│   ├── db.js         # Database connection
│   ├── schema.sql    # Database schema
# Touch Grass — Community Event Planner

Touch Grass is a full-stack app for discovering, planning, and joining community events tailored to users' interests. It includes an AI-driven event planner on the backend that can generate event suggestions, a PostgreSQL-backed API, and a React + TypeScript frontend.

## What this app does
- Let users create a profile containing interests and community preferences.
- Generate curated event suggestions using an AI planner and store them in PostgreSQL.
- Serve personalized event feeds via an Express API.
- Provide RSVP, calendar integration, and in-app chat for events.

## Why Touch Grass?

Meeting new people shouldn't be so hard. Two common barriers stand in the way: discovering the right groups, and actually breaking into them. Touch Grass tackles both. Tell the app what you care about and, when enough nearby people share that interest, an AI agent will automatically create and schedule a real-world event (for example, a sports watch party at a nearby bar). Users receive notifications for events that match their interests and can RSVP with a single tap — no awkward group-searching, no lengthy planning. The result is a low-friction path from interest to community: more spontaneous meetups, easier local connections, and a smoother way to turn strangers into acquaintances and, eventually, friends.

## Architecture
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL

## Repo layout
```
touch-grass-app/
├── backend/          # Node.js/Express API and seed scripts
├── frontend/         # React + Vite app
├── Dockerfile        # Optional containerization
└── README.md         # (this file)
```

## Quickstart (local development)
Prerequisites:
- Node.js (>= 18)
- PostgreSQL
- npm or yarn

1) Install dependencies (from repo root):

```bash
# from repository root
npm run install:all
```

2) Create and configure the database
- Create a PostgreSQL database for the app.
- Run the schema SQL in `backend/schema.sql` to create tables.
- Create a `.env` file inside `backend/` with at least:

```
DATABASE_URL=postgresql://username:password@localhost:5432/your_db_name
PORT=4000
```

3) Seed example data (optional)
- There are two seed helpers in `backend/`:
  - `populate-events.js` — static sample events
  - `populate-with-creator.js` — uses the app's event planner to generate events per interest and insert them into the DB

To run the AI-driven seeder (recommended when you want realistic events):

```bash
cd backend
node populate-with-creator.js
```

You should see the script finish and insert events into your DB. (In this workspace it's been run already: exit code 0.)

4) Run the app in development mode (root scripts available)

```bash
# runs frontend and backend concurrently (if configured)
- User authentication and registration

# or run services individually
- Profile setup with interests
- Community selection
```

- Backend default: http://localhost:4000
- Frontend default: http://localhost:5173

## How to verify the Dashboard shows DB events
- Ensure the backend is running and the database has events (see step 3).
- Open the app in your browser and navigate to the Dashboard.
- If you don't have an app profile yet, create one or set a demo profile in `localStorage` for quick testing:

```js
// in browser console (on app root page)
localStorage.setItem('touchGrassUserProfile', JSON.stringify({ name: 'Demo User', userId: '1', interests: ['Sports', 'Music'] }));
location.reload();
```

- Open DevTools → Network → filter by `GET /events` to inspect the API response.
- The frontend also logs a brief message when fetching events (check the Console for `[EventFeed] fetched events from API:`).

## API (selected endpoints)
- POST /auth/register — register a new user
- POST /auth/login — login
- GET /interests — list available interests
- GET /tags — list available tags
- GET /events?uid=USER_ID — get events (optionally personalized if `uid` provided)
- GET /events/:eid — get event details
- PUT /profile — update user profile

## Development notes
- The backend includes an `eventCreator.js` module used by the `populate-with-creator.js` script to generate plausible events.
- The frontend expects events to include a `datetimeISO` field where possible; the feed will prefer that value for sorting and display.

## Troubleshooting
- If you see hardcoded/fallback events in the UI:
  - Confirm the backend `/events` API returns rows (Network tab).
  - Confirm your Dashboard is mounted (the app requires a `userProfile` to render Dashboard in the normal flow).
  - Use the demo `localStorage` snippet above to test quickly.

## Contributing
- Make changes in `frontend/` or `backend/`.
- Run `npm run dev` locally and test.
- Keep commits small and add tests where appropriate.

## License
MIT
- Event discovery based on user interests
- Calendar integration
- Group chat functionality
- RSVP management

## Contributing

1. Make changes in the appropriate directory (`frontend/` or `backend/`)
2. Test your changes using `npm run dev`
3. Build and test production build before committing

## License

MIT