# Journal Backend API

## Structure

```
backend/
├── db/
│   └── db.js              # MongoDB connection
├── models/
│   └── note.model.js      # Note schema (title, body, timestamps)
├── routes/
│   └── note.routes.js     # API route definitions
├── controllers/
│   └── note.controller.js # Business logic for CRUD operations
├── server.js              # Express app entry point
├── .env                   # Environment variables (MongoDB URI, PORT)
├── .gitignore             # Ignore node_modules and .env
└── package.json           # Dependencies

```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

## API Endpoints

- `GET /api/notes` - Get all notes
- `POST /api/notes` - Create a new note
  ```json
  {
    "title": "My Day",
    "body": "Today was amazing..."
  }
  ```
- `DELETE /api/notes/:id` - Delete a note by ID

## How It Works

1. **server.js** - Starts Express, connects to MongoDB, registers routes
2. **routes/** - Maps URLs to controller functions
3. **controllers/** - Contains business logic (fetch, create, delete)
4. **models/** - Defines MongoDB schema (what fields a note has)
5. **db/** - Handles MongoDB connection
