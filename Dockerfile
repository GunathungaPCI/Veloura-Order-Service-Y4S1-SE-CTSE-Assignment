FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source code.
COPY . .

EXPOSE 5001

CMD ["npm", "start"]
