# HelpHive Unified Monorepo

Production-ready full-stack layout for HelpHive with one client group and one server API.

## Project Structure

```text
help-hive-project/
├── client/
├── server/
├── package.json
└── README.md
```

## Routing Contract

- Landing page: `/`
- Admin dashboard: `/admin`
- Volunteer dashboard: `/volunteer`

Flow: `landing -> login/register -> role-selection -> dashboard`

## Frontend Stack

- React + Vite
- TailwindCSS
- Framer Motion

## Backend Stack

- Node.js + Express
- Supabase (replacing MongoDB)
- JWT authentication
- Groq AI integration

## Required Environment Variables

### Backend (`server/.env`)

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
JWT_SECRET=
GROQ_API_KEY=
PORT=10000
CLIENT_URL=http://localhost:5173,http://localhost:5174,http://localhost:5175
```

### Supabase Live Schema Setup

Run [server/supabase-schema.sql](server/supabase-schema.sql) in your Supabase SQL Editor once.

Without schema initialization, the API now uses a safe temporary in-memory fallback so login/register keeps working, but persistent storage requires this SQL setup.

### Client (`client/.env`)

```env
VITE_API_URL=https://your-render-backend-url/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_ROUTER_BASENAME=/admin
```

## Deploy

- Frontend (single full-flow link): Vercel using `client/admin-dashboard`
- Backend API: Render using `server`

## Supabase Tables Expected

- `users`
- `volunteers`
- `events`
- `resources`
- `volunteer_activity`
- `help_requests`
- `notifications`
- `disasters`
- `tasks`
