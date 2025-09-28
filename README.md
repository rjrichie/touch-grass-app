# Touch Grass - Event Planning App

A full-stack event planning application that helps users find and join community events based on their interests.

## Architecture

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Authentication**: JWT tokens

## Project Structure

```
touch-grass-app/
├── backend/          # Node.js/Express API
│   ├── index.js      # Main server file
│   ├── db.js         # Database connection
│   ├── schema.sql    # Database schema
│   └── package.json  # Backend dependencies
├── frontend/         # React/Vite app
│   ├── src/          # React components
│   ├── index.html    # HTML template
│   └── package.json  # Frontend dependencies
└── package.json      # Root package.json with scripts
```

## Getting Started

### Prerequisites

- Node.js (>=18.0.0)
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository and install all dependencies:
   ```bash
   npm run install:all
   ```

2. Set up your database:
   - Create a PostgreSQL database
   - Run the schema from `backend/schema.sql`
   - Create a `.env` file in the `backend` directory with your database credentials:
     ```
     DATABASE_URL=postgresql://username:password@localhost:5432/database_name
     PORT=4000
     ```

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:4000
- Frontend dev server on http://localhost:5173

### Individual Services

- **Backend only**: `npm run dev:backend`
- **Frontend only**: `npm run dev:frontend`

### Production

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /interests` - Get all interests
- `GET /tags` - Get all tags
- `GET /events` - Get personalized events (requires auth)
- `GET /events/:eid` - Get specific event details
- `PUT /profile` - Update user profile (requires auth)

## Features

- User authentication and registration
- Profile setup with interests
- Community selection
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