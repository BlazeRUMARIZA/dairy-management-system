# Multi-stage build for production
# Structure: / (frontend React/Vite) and /backend (Express/TypeScript)

# Stage 1: Build React/Vite frontend
FROM node:18-alpine AS client-builder
WORKDIR /app/client

# Copy frontend package files (from root)
COPY package*.json ./
RUN npm install

# Copy frontend source files
COPY src/ ./src/
COPY public/ ./public/ 2>/dev/null || true
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tsconfig.node.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Build the frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS server-builder
WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./
RUN npm install

# Copy backend source files
COPY backend/src/ ./src/
COPY backend/tsconfig.json ./

# Build TypeScript
RUN npm run build

# Stage 3: Production server
FROM node:18-alpine
WORKDIR /app

# Copy backend package files and install production dependencies only
COPY backend/package*.json ./
RUN npm install --production

# Copy built backend files
COPY --from=server-builder /app/backend/dist ./dist

# Copy built frontend files to serve as static
COPY --from=client-builder /app/client/dist ./public

# Copy database schema if needed
COPY backend/database ./database 2>/dev/null || true

# Expose port (Railway uses PORT env variable)
EXPOSE ${PORT:-5000}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "const http = require('http'); http.get('http://localhost:' + (process.env.PORT || 5000) + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the server
CMD ["node", "dist/server.js"]
