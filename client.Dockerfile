# Stage 1: Build the application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Install yarn globally
RUN npm install -g yarn

# Copy package.json and yarn.lock to install dependencies
COPY package.json yarn.lock ./

# Install dependencies with Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Build the application (adjust to your actual build script name if needed)
RUN cd packages/client && yarn build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built static files from the build stage
COPY --from=build /app/packages/client/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
