# Node.js Backend Todo

Use this file to track progress topic by topic.

## 1. Express Basics

- [ ☑️ ] Understand route params clearly
- [ ☑️ ] Understand query params clearly
- [ ☑️ ] Understand request body clearly
- [ ☑️ ] Practice response status codes
- [ ☑️ ] Understand middleware basics
- [ ☑️ ] Add global error handler
- [ ☑️ ] Add 404 route not found handler

## 2. Route, Controller, Service Architecture

- [ ☑️ ] Understand route, controller, and service
- [ ☑️ ] Move route logic into controller files
- [ ☑️ ] Keep routes focused only on URL mapping
- [ ☑️ ] Keep controllers focused on request/response
- [ ☑️ ] Keep services focused on business logic
- [ ☑️ ] Understand model concept

## 3. Project Structure

- [ ☑️ ] Create `controllers` folder
- [ ☑️ ] Create `middleware` folder
- [ ☑️ ] Create `models` folder
- [ ☑️ ] Create `config` folder
- [ ☑️ ] Create `db` folder
- [ ☑️ ] Split server logic into modules (routes, controllers, services, middleware)

## 4. Node.js Module System

- [ ☑️ ] Understand `require(...)`
- [ ☑️ ] Understand `module.exports`
- [ ☑️ ] Understand `./` relative path
- [ ☑️ ] Understand `../` relative path
- [ ☑️ ] Understand path patterns
- [ ☑️ ] Understand CommonJS modules

## 5. Async/Await

- [ ☑️ ] Learn async/await
- [ ☑️ ] Use async/await in controllers
- [ ☑️ ] Use async/await in services
- [ ☑️ ] Handle async errors with try-catch

## 7. Environment Variables

- [ ☑️ ] Create `.env`
- [ ☑️ ] Use `dotenv`
- [ ☑️ ] Move `PORT` to `.env`
- [ ☑️ ] Add `JWT_SECRET`
- [ ☑️ ] Add database URL

## 8. MongoDB + Mongoose

- [ ☑️ ] Learn MongoDB basics
- [ ☑️ ] Learn Mongoose basics
- [ ☑️ ] Create `User` model
- [ ☑️ ] Create `Note` model
- [ ☑️ ] Connect database using `.env`

## 9. Database Design Basics

- [ ☑️ ] Understand one-to-many relationships
- [ ☑️ ] Understand User -> Notes relationship
- [ ☑️ ] Understand referencing IDs

## 10. Cookies vs JWT

- [ ☑️ ] Understand token-based auth
- [ ☑️ ] Understand where JWT can be stored
- [ ☑️ ] Use httpOnly cookies for refresh tokens
- [ ☑️ ] Use localStorage for access tokens with CSRF protection

## 11. Authentication

- [ ☑️ ] Learn password hashing with bcrypt
- [ ☑️ ] Hash password during signup
- [ ☑️ ] Compare hashed password during login
- [ ☑️ ] Learn JWT basics
- [ ☑️ ] Return JWT after login
- [ ☑️ ] Create auth middleware
- [ ☑️ ] Protect journal/note routes
- [ ☑️ ] Stop trusting `userId` from frontend

## 12. Social Authentication (OAuth 2.0)

- [ ☑️ ] Learn OAuth 2.0 and OpenID Connect (OIDC) protocols
- [ ☑️ ] Understand Authorization Code flow
- [ ☑️ ] Implement Google OAuth 2.0 initiation endpoint (`GET /api/auth/google`)
- [ ☑️ ] Implement Google OAuth callback & token exchange (`GET /api/auth/google/callback`)
- [ ☑️ ] Adapt User model for OAuth (optional password, googleId, avatar)
- [ ☑️ ] Issue JWT + refresh/CSRF cookies on OAuth success
- [ ☑️ ] Add "Continue with Google" button & frontend callback route (`/auth/callback`)

## 13. Validation

- [ ☑️ ] Learn schema validation
- [ ☑️ ] Use `express-validator`
- [ ☑️ ] Validate signup input
- [ ☑️ ] Validate login input
- [ ☑️ ] Return clean validation errors

## 14. API Documentation

- [ ☑️ ] Document auth endpoints
- [ ☑️ ] Document note endpoints

## 15. Security Basics

- [ ☑️ ] Never store plain passwords (bcrypt)
- [ ☑️ ] Validate all input (express-validator)
- [ ☑️ ] Learn CORS basics
- [ ☑️ ] Use cookie-parser
- [ ☑️ ] Avoid leaking internal errors (errorHandler middleware)
- [ ☑️ ] CSRF protection implemented

## 16. API Testing

- [ ☑️ ] Test APIs with Postman or Thunder Client
- [ ☑️ ] Test signup
- [ ☑️ ] Test duplicate signup
- [ ☑️ ] Test login
- [ ☑️ ] Test wrong login
- [ ☑️ ] Test create note
- [ ☑️ ] Test update note
- [ ☑️ ] Test delete note

## 17. Logging Basics

- [ ☑️ ] Learn `console.log()`
- [ ☑️ ] Learn `console.error()`
- [ ☑️ ] Understand what to log during development

## 18. Docker

- [ ☑️ ] Learn Docker basics (Images, Containers, Volumes, and Networking)
- [ ☑️ ] Understand the difference between a `Dockerfile` and `docker-compose.yml`
- [ ☑️ ] Create a `Dockerfile` for the Node.js backend
- [ ☑️ ] Create a `Dockerfile` for the React frontend
- [ ☑️ ] Write a `docker-compose.yml` to spin up the frontend, backend, and MongoDB database together locally

## 19. Deployment

- [ ] Learn backend deployment basics
- [ ] Deploy backend
- [ ] Use hosted database
- [ ] Set production environment variables
- [ ] Connect frontend to deployed backend

## 20. Better-Auth Library

- [ ☑️ ] Convert Express backend to ES Modules to natively support Better Auth imports
- [ ☑️ ] Configure Better Auth server instance with MongoDB adapter
- [ ☑️ ] Replace manual JWT generation, token verification, and cookie handling with Better Auth automated sessions
- [ ☑️ ] Replace manual bcrypt hashing & verification with Better Auth's built-in secure credentials system
- [ ☑️ ] Remove custom endpoints for login, signup, logout, and raw Google OAuth redirects, routing all through the catch-all router
- [ ☑️ ] Refactor frontend to use standard email-based login, username signup, and Google social login via the client SDK
- [ ☑️ ] Integrate `authClient.useSession()` React hooks to replace custom local storage session caching and polling

## 22. PWA (Progressive Web App)

- [ ☑️ ] Learn PWA Fundamentals & Architecture (PWA vs Native, Service Worker proxy model)
- [ ☑️ ] Configure Web App Manifest (`manifest.webmanifest`, standalone mode, brand icons, theme colors)
- [ ☑️ ] Service Worker Basics & Registration (`sw.js` lifecycle, registration in entrypoint)
- [ ☑️ ] Asset Caching & Pre-caching (Cache Storage API, precaching HTML/CSS/JS shell)
- [ ☑️ ] Offline Fallback Strategy (detect offline status, graceful offline UI fallback)
- [ ☑️ ] Runtime Caching Strategies (Cache-First for assets, Network-First for API)
- [ ☑️ ] App Installation Experience (`beforeinstallprompt` listener, custom install button)
- [ ☑️ ] Lighthouse PWA Audit & Verification (Score > 90, desktop & mobile installability)
- [ ☑️ ] Web Push Notifications & Cron Reminders (VAPID, Web Push API, Background Service Worker push listener)
- [ ☑️ ] Offline Writes & Background Sync (IndexedDB storage, offline journal creation, automatic online sync)
- [ ] Refer to the detailed checklist in [PWA_todo.md](./PWA_todo.md) for full breakdown.