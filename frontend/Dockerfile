FROM node:20-slim

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Disable npm timeout limits and retries
RUN npm config set fetch-timeout 600000 \
    && npm config set fetch-retry-maxtimeout 600000 \
    && npm config set fetch-retries 999 \
    && npm install -g npm@latest

# Install dependencies with no timeout
RUN npm install --prefer-offline --no-audit --progress=false

# Copy rest of the code
COPY . .

# Install Tailwind
RUN npm install -D @tailwindcss/vite
COPY . .

CMD ["npm", "run", "dev", "--", "--host"]