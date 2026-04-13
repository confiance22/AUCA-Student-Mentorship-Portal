# ============================================================
# Multi-stage Dockerfile for AUCA Mentorship Portal Backend
# ============================================================
FROM node:20-alpine AS base
WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source
COPY backend/ ./backend/

# Expose API port
EXPOSE 5000

CMD ["node", "backend/src/server.js"]