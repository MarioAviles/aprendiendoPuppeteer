FROM mcr.microsoft.com/devcontainers/javascript-node:20-bookworm

# Instala dependencias necesarias para Chromium
RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates\
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Opcional: instala Chromium (puppeteer puede descargarlo automáticamente)
RUN apt-get update && apt-get install -y chromium

# Establece variables de entorno recomendadas para Puppeteer/Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=false \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Directorio de trabajo
WORKDIR /workspaces/pruebaPuppeteer

# Instala dependencias de Node.js si existe package.json
COPY package*.json ./
RUN if [ -f package.json ]; then npm install; fi