# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
# Note: If you haven't created a package.json yet, run 'npm init -y' and 'npm install express cors body-parser' locally first
RUN npm install

# Copy the rest of the backend code
COPY . .

# Expose the port your app runs on (must match PORT in server.js)
EXPOSE 3001

# Command to run the application
CMD ["node", "server.js"]