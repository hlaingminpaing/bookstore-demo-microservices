# --- Stage 1: Build the React App ---
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the app for production
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine

# Copy the build output from the previous stage to Nginx's html folder
# Note: Vite builds to 'dist' by default
COPY --from=build /app/dist /usr/share/nginx/html

# (Optional) Copy a custom nginx config if you need specific routing later
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]