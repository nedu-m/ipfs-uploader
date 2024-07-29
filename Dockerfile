# Stage 1: Build the Next.js app
FROM node:20-alpine AS builder

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Stage 2: Serve the app using Nginx and supervisord
FROM nginx:alpine

# Install Node.js and supervisord
RUN apk add --no-cache nodejs npm supervisor

# Copy the Next.js build output to the Nginx HTML directory
COPY --from=builder /app/.next /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the supervisord configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy the rest of the application code (needed for running Next.js)
COPY --from=builder /app /app

# Expose the port Nginx will run on
EXPOSE 80

# Start supervisord with the configuration file
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
