# Swagger & OpenAPI Revision Cheatsheet

### 1. OpenAPI vs Swagger
- **OpenAPI**: The open specification standard (YAML/JSON format rules describing REST APIs).
- **Swagger UI**: The web middleware (`swagger-ui-express`) rendering an interactive testing dashboard from that specification.

---

### 2. Our Architecture Flow
`openapi.yaml` (Spec) ➡️ `swagger.js` (Parser) ➡️ `server.js` (Route Mount) ➡️ Browser (`/api-docs`)

1. **`backend/docs/openapi.yaml`**: Standalone, human-readable API definition.
2. **`backend/config/swagger.js`**: Reads YAML using `yaml.parse()`, injects runtime port dynamically.
3. **`backend/server.js`**: Conditionally mounts UI at `/api-docs` and raw spec at `/api-docs.json`.

---

### 3. Why Standalone YAML over JSDoc?
- **Clean Routes**: Keeps route files tiny (e.g., `auth.routes.js` dropped from 219 to 18 lines).
- **Faster Startup**: Zero runtime regex code-scanning; parses a single YAML file in ~1ms.
- **Tooling**: Standard YAML works out of the box with Swagger Editor, Postman, and Redoc.

---

### 4. Anatomy of `openapi.yaml`
- **`info` & `servers`**: Metadata and base server URL.
- **`paths`**: HTTP methods, routes, parameters, request bodies, and status codes.
- **`components/schemas`**: Reusable models (`$ref: '#/components/schemas/User'`).
- **`components/securitySchemes`**: `bearerAuth` (JWT header) & `cookieAuth` (refresh cookie).

---

### 5. Quick Reference
- **UI Dashboard**: `http://localhost:5000/api-docs`
- **Raw JSON Spec**: `http://localhost:5000/api-docs.json`
- **Env Toggle**: `ENABLE_SWAGGER=true` (enabled by default in non-production)
