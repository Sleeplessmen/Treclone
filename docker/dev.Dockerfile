# Development Dockerfile for Next.js + Prisma
# Multi-stage build for better caching

FROM node:20-alpine AS base

# Install dependencies for Prisma
RUN apk add --no-cache python3 make g++

# Create app user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy Prisma files
COPY prisma/ ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY . .

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["npm", "run", "dev"]
