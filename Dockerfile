# Frontend build stage
FROM node:16-alpine as frontend-build

WORKDIR /frontend

# Copy package files first to leverage Docker cache
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies with legacy peer deps flag to handle compatibility issues
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Backend stage
FROM python:3.9-slim

# Install node and serve for frontend
RUN apt-get update && apt-get install -y \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g serve \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy backend requirements and install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Copy built frontend from previous stage
COPY --from=frontend-build /frontend/build ./static

# Expose ports for both services
EXPOSE 3000 8000

# Copy start script
COPY start.sh .
RUN chmod +x start.sh

# Start both services
CMD ["./start.sh"] 