# Use the official Node image as the base image for building the app
FROM node:21 as builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the working directory
COPY . .

# Build the Vite-React app
RUN npm run build

# Use the official Nginx image as the base image for serving the app
FROM nginx:latest

# Copy the built app from the builder stage to the Nginx web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
