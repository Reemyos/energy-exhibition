# Use an official Node.js image as the base for building the app
FROM node:alpine

# Set working directory
WORKDIR /app

# Copy jsconfig.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
