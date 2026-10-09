# ⚙️ Journal Backend API

Express & Node.js REST API service for the Journal App, featuring Better Auth, Google OAuth, MongoDB with Mongoose, Web Push notification reminders via `node-cron`, and interactive Swagger documentation.

---

## 📁 Architecture & Directory Structure

```
backend/
├── config/
│   ├── auth.js              # Better Auth configuration & plugins
│   ├── constants.js         # Environment variables & runtime constants
│   └── swagger.js           # Swagger JSDoc & OpenAPI spec options
├── controllers/
│   ├── auth.controller.js   # Authentication controller (fallback/custom)
│   ├── note.controller.js   # Journal entry CRUD controller
│   └── reminder.controller.js # Reminder & push subscription controller
├── db/
│   └── db.js                # MongoDB Mongoose connection handler
├── middleware/
│   ├── auth.middleware.js   # Better Auth session & JWT verification guard
│   ├── errorHandler.js      # Global error handling middleware
│   └── validate.js          # Request payload validation middleware
├── models/
│   ├── note.model.js        # Note schema (title, body, user reference)
│   ├── reminder.model.js    # Reminder schema (time, frequency, push sub)
│   └── user.model.js        # User model definition
├── routes/
│   ├── auth.routes.js       # Custom auth endpoints
│   ├── note.routes.js       # Notes CRUD routes
│   └── reminder.routes.js   # Reminder & subscription routes
├── services/
│   ├── cron.service.js      # node-cron scheduled reminder runner
│   └── webPush.service.js   # VAPID & Web Push notification dispatcher
├── app.js                   # Express app configuration & middleware mounts
├── server.js                # Server entry point & database connection bootstrapper
├── Dockerfile               # Node alpine container definition
├── .env.example             # Environment variable template
└── package.json             # Backend dependencies and scripts
```

---

## 🚀 Setup & Local Execution

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (`.env`)
Copy `.env.example` to `.env` and configure your credentials:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/journal
CLIENT_URL=http://localhost:5173

# JWT & Authentication
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback

# Web Push (VAPID)
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_MAILTO=mailto:admin@sanctuary.app
```

### 3. Run Development Server
```bash
npm run dev
```
For auto-reloading on file edits:
```bash
npm run dev:watch
```

---

## 📖 API Documentation & Swagger UI

When running in development or with `ENABLE_SWAGGER=true`, full interactive documentation is available at:
- **Swagger UI:** `http://localhost:5000/api-docs`
- **OpenAPI JSON:** `http://localhost:5000/api-docs.json`

---

## 📡 API Endpoints Summary

### Health
- `GET /health` - System healthcheck and ISO timestamp

### Better Auth (`/api/auth/*`)
- Handled directly by `better-auth/node` middleware mounted before body parsers.
- Supports email/password, session verification, and Google OAuth 2.0.

### Notes (`/api/notes`)
- `GET /api/notes` - Retrieve all notes for the authenticated user
- `POST /api/notes` - Create a new journal note
- `GET /api/notes/:id` - Fetch single note by ID
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete note by ID

### Reminders & Web Push (`/api/reminders`)
- `GET /api/reminders` - Get configured journaling reminders
- `POST /api/reminders` - Save or update reminder schedule
- `POST /api/reminders/subscribe` - Register browser Web Push subscription
- `DELETE /api/reminders/:id` - Delete a scheduled reminder

---

## 📜 Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs `node --dns-result-order=ipv4first server.js` |
| `npm run dev:watch` | Runs server with `nodemon` auto-reload |
| `npm start` | Production start `node server.js` |
