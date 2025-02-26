# Step 1: Use a Node.js base image
FROM node:20-alpine

# Step 2: Set working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Compile TypeScript
RUN npx tsc


# Step 7: Expose the application port (replace 3000 with your app's port if different)
EXPOSE 8080

CMD ["sh", "-c", "npx typeorm migration:run --dataSource ./dist/config/database.js && node dist/app.js"]
