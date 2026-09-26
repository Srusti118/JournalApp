# Security Basics Cheatsheet

### 1. Password Hashing (`bcryptjs`)
- **One-Way vs Two-Way**: Encryption can be decrypted if keys leak; hashing is mathematically irreversible.
- **Salt & Rainbow Tables**: Bcrypt appends a unique random salt per user before hashing, preventing precomputed lookup attacks.
- **Work Factor**: Computational cost (`saltRounds = 10`) intentionally slows down brute-force cracking.
- **Implementation**: Mongoose `pre('save')` hook (`isModified('password')`) in `backend/models/user.model.js`.

---

### 2. Input Validation & Sanitization (`express-validator`)
- **Zero Trust**: Client-side validation is easily bypassed; every request must be validated at the API boundary.
- **Fail Fast**: The centralized `validate` middleware halts processing with `400 Bad Request` before DB queries or controller logic run.
- **Sanitization**: Inputs are cleaned (`trim()`, `normalizeEmail()`) before checking constraints (`isEmail()`, `isLength()`, `isMongoId()`).
- **Implementation**: Schema validation arrays in `backend/middleware/validation.js`.

---

### 3. CORS (Cross-Origin Resource Sharing)
- **Same-Origin Policy (SOP)**: Enforced by the **browser** to prevent unauthorized cross-origin data reads.
- **Preflight (`OPTIONS`)**: Sent automatically by browsers before complex requests (custom headers like `Authorization` or `x-csrf-token`).
- **Credentials & Wildcards**: When `credentials: true` is enabled (for cookies), `Access-Control-Allow-Origin: *` is strictly forbidden by browsers; explicit origins must be whitelisted.
- **Implementation**: `cors({ origin: config.corsOrigins, credentials: true })` in `backend/server.js`.

---

### 4. Cookie Security & `cookie-parser`
- **Parser**: Converts raw HTTP `Cookie` header string into accessible `req.cookies` object.
- **`httpOnly: true`**: Blocks JavaScript (`document.cookie`) access, preventing refresh token theft via XSS.
- **`secure: true`**: Enforces HTTPS transmission in production environments.
- **`sameSite: 'lax'`**: Restricts cookie transmission on cross-origin requests, serving as baseline CSRF defense.
- **Implementation**: `backend/server.js` and cookie options in `backend/services/token.service.js`.

---

### 5. Information Disclosure Prevention (`errorHandler`)
- **Vulnerability**: Unhandled stack traces leak server directory paths, database engines, schema structures, and library versions.
- **Operational vs Programmer**: Translate known errors (`CastError`, `ValidationError`, duplicate key `11000`) into clean HTTP errors.
- **Environment Isolation**: Stack traces are strictly stripped in production (`NODE_ENV === 'production'`).
- **Implementation**: `backend/middleware/errorHandler.js` mounted at bottom of the middleware chain in `server.js`.

---

### 6. CSRF & Double-Submit Cookie Pattern
- **The Threat**: Browsers automatically send cookies on cross-origin requests, allowing malicious sites to forge state-changing actions.
- **Bearer Tokens vs Cookies**: Bearer headers are inherently immune; cookies need explicit CSRF mitigation.
- **Double-Submit Pattern**:
  1. Server sets random `csrfToken` in an accessible cookie (`httpOnly: false`).
  2. Client reads the cookie and sends its value in the custom `x-csrf-token` header.
  3. Server compares `req.cookies.csrfToken === req.headers['x-csrf-token']`.
  4. Attackers on other origins cannot read the cookie due to SOP, so they cannot set the matching header.
- **Implementation**: Middleware `verifyCsrf` in `backend/middleware/auth.middleware.js` applied to `/api/auth/refresh-token` and `/api/auth/logout`.
