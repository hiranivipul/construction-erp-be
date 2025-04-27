# Start of Selection
# Use the official Node.js image as the base image
FROM node:18-alpine AS Base

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
# End of Selection