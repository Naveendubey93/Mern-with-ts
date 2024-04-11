# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies and build the application
RUN npm ci --only=development
COPY . .
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

ENV NODE_ENV=production

WORKDIR /app

# Copy package.json and lock file for production
COPY package*.json ./

# Install app dependencies with scripts execution
RUN npm ci --only=production

# Copy built files from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5500

CMD ["node", "src/server.js"]
