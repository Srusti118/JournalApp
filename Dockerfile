# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build production bundle
COPY . .
RUN npm run build

# Stage 2: Serve production assets with lightweight Nginx web server
FROM nginx:alpine

# Copy built static files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration for React Router SPA support
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose standard HTTP web port
EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
