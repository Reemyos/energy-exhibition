# Use an official Node.js image as the base for building the app
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Build the app for production
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
