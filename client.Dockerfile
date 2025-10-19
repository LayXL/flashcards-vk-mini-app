# Stage 1: Build the application
FROM oven/bun:1 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and bun.lockb to install dependencies
COPY package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN cd packages/client && bun run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built static files from the build stage
COPY --from=build /app/packages/client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
