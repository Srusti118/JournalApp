# Node.js Backend Todo

Use this file to track progress topic by topic.

## 1. Express Basics

- [x] Understand route params clearly
- [x] Understand query params clearly
- [x] Understand request body clearly
- [x] Practice response status codes
- [x] Understand middleware basics
- [x] Add global error handler
- [x] Add 404 route not found handler

## 2. Route, Controller, Service Architecture

- [x] Understand route, controller, and service
- [x] Move route logic into controller files
- [x] Keep routes focused only on URL mapping
- [x] Keep controllers focused on request/response
- [x] Keep services focused on business logic
- [x] Understand model concept

## 3. Project Structure

- [x] Create `controllers` folder
- [x] Create `middleware` folder
- [x] Create `models` folder
- [x] Create `config` folder
- [x] Create `db` folder
- [x] Split server logic into modules (routes, controllers, services, middleware)

## 4. Node.js Module System

- [x] Understand `require(...)`
- [x] Understand `module.exports`
- [x] Understand `./` relative path
- [x] Understand `../` relative path
- [x] Understand path patterns
- [x] Understand CommonJS modules

## 5. Async/Await

- [x] Learn async/await
- [x] Use async/await in controllers
- [x] Use async/await in services
- [x] Handle async errors with try-catch

## 7. Environment Variables

- [x] Create `.env`
- [x] Use `dotenv`
- [x] Move `PORT` to `.env`
- [x] Add `JWT_SECRET`
- [x] Add database URL

## 8. MongoDB + Mongoose

- [x] Learn MongoDB basics
- [x] Learn Mongoose basics
- [x] Create `User` model
- [x] Create `Note` model
- [x] Connect database using `.env`

## 9. Database Design Basics

- [x] Understand one-to-many relationships
- [x] Understand User -> Notes relationship
- [x] Understand referencing IDs

## 10. Cookies vs JWT

- [x] Understand token-based auth
- [x] Understand where JWT can be stored
- [x] Use httpOnly cookies for refresh tokens
- [x] Use localStorage for access tokens with CSRF protection

## 11. Authentication

- [x] Learn password hashing with bcrypt
- [x] Hash password during signup
- [x] Compare hashed password during login
- [x] Learn JWT basics
- [x] Return JWT after login
- [x] Create auth middleware
- [x] Protect journal/note routes
- [x] Stop trusting `userId` from frontend

## 12. Social Authentication (OAuth 2.0)

- [x] Learn OAuth 2.0 and OpenID Connect (OIDC) protocols
- [x] Understand Authorization Code flow

## 13. Validation

- [x] Learn schema validation
- [x] Use `express-validator`
- [x] Validate signup input
- [x] Validate login input
- [x] Return clean validation errors

## 14. API Documentation

- [x] Document auth endpoints
- [x] Document note endpoints

## 15. Security Basics

- [x] Never store plain passwords (bcrypt)
- [x] Validate all input (express-validator)
- [x] Learn CORS basics
- [x] Use cookie-parser
- [x] Avoid leaking internal errors (errorHandler middleware)
- [x] CSRF protection implemented

## 16. API Testing

- [ ] Test APIs with Postman or Thunder Client
- [ ] Test signup
- [ ] Test duplicate signup
- [ ] Test login
- [ ] Test wrong login
- [ ] Test create note
- [ ] Test update note
- [ ] Test delete note

## 17. Logging Basics

- [x] Learn `console.log()`
- [x] Learn `console.error()`
- [x] Understand what to log during development

## 18. Deployment

- [x] Learn backend deployment basics
- [ ] Deploy backend
- [ ] Use hosted database
- [ ] Set production environment variables
- [ ] Connect frontend to deployed backend

## 19. PWA (Progressive Web App)

- [ ] Refer to the detailed checklist in [PWA_todo.md](./PWA_todo.md) to implement offline capabilities, background sync, and install experience.


## 20. Better-Auth Library

- [ ] Convert Express backend to ES Modules to natively support Better Auth imports
- [ ] Configure Better Auth server instance with MongoDB adapter
- [ ] Replace manual JWT generation, token verification, and cookie handling with Better Auth automated sessions
- [ ] Replace manual bcrypt hashing & verification with Better Auth's built-in secure credentials system
- [ ] Remove custom endpoints for login, signup, logout, and raw Google OAuth redirects, routing all through the catch-all router
- [ ] Refactor frontend to use standard email-based login, username signup, and Google social login via the client SDK
- [ ] Integrate `authClient.useSession()` React hooks to replace custom local storage session caching and polling


## 21. Docker

- [ ] Learn Docker basics (Images, Containers, Volumes, and Networking)
- [ ] Understand the difference between a `Dockerfile` and `docker-compose.yml`
- [ ] Create a `Dockerfile` for the Node.js backend
- [ ] Create a `Dockerfile` for the React frontend
- [ ] Write a `docker-compose.yml` to spin up the frontend, backend, and MongoDB database together locally