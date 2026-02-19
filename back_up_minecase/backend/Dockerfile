FROM node:20-slim

WORKDIR /app

# Install build tools for argon2 native dependency
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8080

# Env vars injected by Cloud Run (sourced from Doppler)
CMD ["node", "src/index.js"]
