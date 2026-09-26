# Use official lightweight Node.js 20 Alpine Linux image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package manifests first for Docker layer caching
COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy application code
COPY . .

# Document that the backend listens on port 5000
EXPOSE 5000

# Run the server when the container starts
CMD ["npm", "start"]
