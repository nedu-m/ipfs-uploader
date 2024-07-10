# Use the official Node.js image as the base
FROM node:20-alpine 

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app will run on (the Next.js default is 3000)
EXPOSE 3000

# Build the Next.js app for production
RUN npm run build

# Start the Next.js app in production mode
CMD ["npm", "start"]
