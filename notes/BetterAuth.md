# Better Auth Cheatsheet & Integration Guide

### 1. What is Better Auth & Why Use It?
- **All-in-One Modern Auth**: Replaces hundreds of lines of fragile boilerplate (manual JWT signing, refresh token rotation, bcrypt password hashing, session cleanup, CSRF cookies).
- **ESM-First**: Built from the ground up for modern JavaScript ECMAScript modules (`"type": "module"`).
- **Session-Based & Multi-Provider**: Provides battle-tested session management, cookie security, email/password, username support, and OAuth (Google, GitHub, etc.) with unified database adapters.

---

### 2. MongoDB Adapter Architecture
- **Automatic Schema Mapping**: Better Auth manages collections for authentication:
  - `user`: User profiles (name, email, emailVerified, image, username).
  - `session`: Active login sessions with expiration and tokens.
  - `account`: Provider credentials (passwords, OAuth tokens).
  - `verification`: Email verification and password reset tokens.
- **Connection Sharing**: Passes the native MongoDB driver database instance (`client.db()`) directly to `mongodbAdapter(db, { client })`, allowing Mongoose and Better Auth to share the same database without collision.
- **Implementation**: [backend/config/auth.js](file:///c:/Users/srusti/OneDrive/Desktop/JournalApp/backend/config/auth.js).

---

### 3. Express Integration & Critical Handler Order
- **`toNodeHandler`**: Bridges Web Standard Request/Response objects used by Better Auth to standard Node/Express `(req, res)` handlers.
- **Catch-All Auth Route**: `app.all('/api/auth/*', toNodeHandler(auth))` handles all incoming authentication actions (`/sign-in/email`, `/sign-up/email`, `/sign-out`, `/get-session`, `/sign-in/social`, etc.).
- **Order Matters (Stream Consumption)**: The Better Auth handler **must be mounted BEFORE `express.json()`**. Body-parsing middleware consumes the incoming request stream; if placed earlier, Better Auth's internal parsers hang or receive an empty payload.
- **Implementation**: [backend/server.js](file:///c:/Users/srusti/OneDrive/Desktop/JournalApp/backend/server.js).

---

### 4. Route Protection (`getSession` & `fromNodeHeaders`)
- **Web Headers Conversion**: Express uses Node's standard headers object (`req.headers`), while Better Auth's API expects Web Standard `Headers`. `fromNodeHeaders(req.headers)` bridges this seamlessly.
- **Dual-Mode Protection**: In `auth.middleware.js`, we verify the Better Auth session first (`auth.api.getSession`), and fallback to legacy JWT if present.
- **ID Normalization**: Better Auth exposes `session.user.id`. Setting `req.user = { ...session.user, _id: session.user.id }` allows all existing note queries (`{ user: req.user._id }`) to continue working with zero breaking changes.
- **Implementation**: [backend/middleware/auth.middleware.js](file:///c:/Users/srusti/OneDrive/Desktop/JournalApp/backend/middleware/auth.middleware.js).

---

### 5. Frontend Client Integration (`@better-auth/react`)
- **Client Factory**: `createAuthClient({ baseURL, plugins: [usernameClient()] })` configures the reactive client SDK.
- **Reactive State (`useSession`)**: Automatically tracks active user session and pending states without manual `localStorage` token parsing.
- **Credential Transport**: Every browser request uses `credentials: 'include'`, automatically transmitting the secure HTTP-only session cookie to the backend.
- **Implementation**: [src/services/authClient.js](file:///c:/Users/srusti/OneDrive/Desktop/JournalApp/src/services/authClient.js) and [src/hooks/useAuth.jsx](file:///c:/Users/srusti/OneDrive/Desktop/JournalApp/src/hooks/useAuth.jsx).
