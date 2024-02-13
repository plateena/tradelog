# Use the official lightweight Node.js 16 image
FROM node:21-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY src/package*.json ./

# Install dependencies
RUN npm install

# Update npm
RUN npm install -g npm@10.4.0

# Copy the rest of the application code to the container
COPY ./src .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
