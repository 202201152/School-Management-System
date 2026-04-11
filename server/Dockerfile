# ── Server Dockerfile ──────────────────────────────────────────────────
# Node 20 Alpine — small, production-ready base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy dependency manifests first (layer caching — reinstall only when deps change)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy the rest of the server source
COPY . .

# Expose the API port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
