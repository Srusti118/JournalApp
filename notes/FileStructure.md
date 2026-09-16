# Backend Architecture Overview

Here is a quick tour of the backend architecture and concepts:

**1. `server.js` (The Entry Point)**
- **Concept:** Initializes the app, applies global settings (like CORS), connects to the DB, and mounts the routes.
- **Analogy:** The front door of the application.

**2. `routes/` (The Traffic Cops)**
- **Concept:** Maps incoming URLs (e.g., `POST /api/auth/login`) to the correct controller. It contains almost no logic.
- **Files:** `auth.routes.js`, `note.routes.js`.

**3. `controllers/` (The Organizers)**
- **Concept:** Handles the HTTP layer. It extracts data from the request (`req.body`), calls a service to do the heavy lifting, formats the response (`res.json`), and sets cookies. 
- **Files:** `auth.controller.js`, `note.controller.js`.

**4. `services/` (The Brains / Business Logic)**
- **Concept:** Holds all the complex rules, database queries, and token generation. It does **not** know about HTTP (no `req`/`res`). It just takes data, processes it, and returns results.
- **Files:** `auth.service.js`, `note.service.js`, `token.service.js`.

**5. `models/` (The Blueprints)**
- **Concept:** Defines exactly how data looks in the MongoDB database using Mongoose schemas.
- **Files:** `user.model.js`, `note.model.js`.

**6. `middleware/` (The Bouncers)**
- **Concept:** Functions that intercept the request *before* it hits the controller. They check if a user is logged in, validate data, or catch errors.
- **Files:** `auth.middleware.js` (checks tokens), `validation.js` (checks inputs), `errorHandler.js` (catches crashes).

**7. `db/` & `config/` (The Infrastructure)**
- **Concept:** Setup files for connecting to MongoDB (`db.js`) and validating `.env` variables so the app crashes early if a secret is missing (`constants.js`).

### The Data Flow:
Request ➡️ **Route** ➡️ **Middleware** (Validation/Auth) ➡️ **Controller** ➡️ **Service** ➡️ **Model** (Database) ➡️ **Controller** (Sends Response) ➡️ Client.

---
**Main Takeaway:** 
A strictly layered architecture keeps concerns isolated—routes direct traffic, controllers manage HTTP state, services execute business rules, and models define data—making the application scalable, testable, and deeply organized.
