# ── Client Dockerfile — Multi-Stage Build ─────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package.json package-lock.json ./

# Install ALL dependencies (including devDeps needed for Vite build)
RUN npm install

# Copy client source code
COPY . .

# Build the production bundle
RUN npm run build

# ── Stage 2: Runtime ──────────────────────────────────────────────────
# Final image has NO Node.js — just lean Nginx serving static files
FROM nginx:alpine

# Remove default Nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Nginx runs in foreground
CMD ["nginx", "-g", "daemon off;"]
