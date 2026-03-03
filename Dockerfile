# Reservation of Flights - Vite + React, served with nginx
# Build-time env vars: REACT_APP_API_URL, REACT_APP_WEBSITE_ID

# ----- Stage 1: Build -----
FROM node:22-alpine AS builder

WORKDIR /app

# Build args - use /api for CORS-free proxy (nginx forwards to api.skyfareshub.com)
ARG REACT_APP_API_URL=/api
ARG REACT_APP_WEBSITE_ID=f0c88814-ba97-4498-8a4c-d1318d338898

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WEBSITE_ID=$REACT_APP_WEBSITE_ID

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies for build)
RUN npm ci && npm cache clean --force

# Copy source
COPY . .

# Build (Vite outputs to ./dist)
RUN npm run build

# ----- Stage 2: Serve -----
FROM nginx:alpine

# Copy built static files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
