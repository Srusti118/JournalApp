# Docker & Containerization Cheatsheet

### 1. The 4 Fundamental Pillars
- **Image**: A frozen, read-only snapshot containing the OS, runtime, and app files (the blueprint).
- **Container**: A running, isolated process instantiated from an image.
- **Volume**: Persistent external storage. Container files are ephemeral; volumes ensure database records (`/data/db`) survive restarts.
- **Network**: Private virtual bridge. Allows containers to address each other by service name (e.g., `mongodb://mongodb:27017`).

---

### 2. Port Mapping (`-p HOST:CONTAINER`)
- Format: `[PORT OUTSIDE on PC] : [PORT INSIDE Container]`
- Example: `-p 5000:5000` routes laptop `localhost:5000` to container port 5000.

---

### 3. Key Dockerfile Instructions
- **`FROM <image>`**: Specifies base mini-OS (e.g., `node:20-alpine`, `nginx:alpine`).
- **`WORKDIR <path>`**: Sets the current working directory inside the container.
- **`COPY <src> <dest>`**: Copies files from host machine into container filesystem.
- **`RUN <cmd>`**: Executes command **during build time** (e.g., `RUN npm install`).
- **`EXPOSE <port>`**: Documents the port the app listens on.
- **`CMD ["cmd", "arg"]`**: Executes command **at runtime** when container starts (Exec form bypasses shell middleman for clean shutdown).

---

### 4. Multi-Stage Builds (Frontend)
- **Stage 1 (Builder)**: Uses `node:20-alpine` to run `npm install` and `npm run build` (outputs `dist/`).
- **Stage 2 (Production)**: Uses `nginx:alpine` (~15MB), copies only `dist/` and discards Node/npm and source files.

---

### 5. Docker Compose Architecture
Our `docker-compose.yml` connects 3 services:
1. **`mongodb`**: Official `mongo` image with `mongo_data` persistent volume.
2. **`backend`**: Node.js Express API listening on port 5000.
3. **`frontend`**: Nginx static server serving React on port 80.

---

### 6. Essential Commands
- **Start all services**: `docker compose up` (add `--build` to force image rebuild)
- **Start in background**: `docker compose up -d`
- **Stop all services**: `docker compose down`
- **View running containers**: `docker ps`
- **View container logs**: `docker compose logs -f`
