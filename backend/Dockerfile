FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript
RUN npm run build

# Remove dev dependencies and source
RUN npm prune --production && rm -rf src

# Expose port
EXPOSE 5000

# Set environment to production
ENV NODE_ENV=production

# Start server
CMD ["node", "dist/server.js"]
