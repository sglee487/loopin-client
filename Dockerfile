### syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies (use npm ci for reproducible builds)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# ---------- Production stage ----------
FROM nginx:1.25-alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Replace default nginx config with our SPA-friendly one
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 