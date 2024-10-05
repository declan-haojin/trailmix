# Use an official Node.js Alpine-based image
FROM node:20.11.1-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Set npm to have longer timeouts and use cache
RUN npm config set cache /app/.npm-cache --global
RUN npm config set fetch-retries 10
RUN npm config set fetch-retry-mintimeout 40000
RUN npm config set fetch-retry-maxtimeout 220000

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Starting our application
CMD ["npm","start"]