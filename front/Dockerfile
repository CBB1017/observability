# Step 1: Build Stage
FROM node:20 AS build

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all files and build the application
COPY . .
RUN npm run build

# Step 2: Base Nginx Stage
FROM nginx:alpine AS base

# Copy built files to Nginx's default serving directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy common scripts (shared by all stages)
COPY env.sh /usr/share/nginx/html/env.sh
RUN chmod +x /usr/share/nginx/html/env.sh

# Step 3: Development Stage
FROM base AS dev

# Use development-specific Nginx configuration
COPY nginx-dev.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["sh", "/usr/share/nginx/html/env.sh"]

# Step 4: Production Stage
FROM base AS prod

# Use production-specific Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["sh", "/usr/share/nginx/html/env.sh"]
