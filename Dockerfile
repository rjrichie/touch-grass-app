# Use the official Node.js 18 image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install dependencies for all projects
RUN npm install
RUN cd backend && npm install
RUN cd frontend && npm install

# Copy the application code
COPY . .

# Build the frontend for production
RUN cd frontend && npm run build

# Expose the port the app runs on
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]