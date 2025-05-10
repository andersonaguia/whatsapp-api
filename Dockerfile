FROM node:22-alpine AS build

LABEL maintainer="Anderson Aguiar"

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

# 🟢 Instalar dependências necessárias pro Chromium do Puppeteer
RUN apk update && apk add --no-cache \
  udev \
  ttf-freefont \
  nss \
  freetype \
  harfbuzz \
  ca-certificates \
  chromium \
  libx11 \
  libxcomposite \
  libxdamage \
  libxrandr \
  gtk+3.0 \
  alsa-lib

RUN npm install

COPY . .

RUN if [ -d "/app/tokens" ]; then rm -rf /app/tokens; fi

RUN npm run build

EXPOSE 3003

CMD find /usr/src/app/tokens/ubuntu-server -name "SingletonLock" -delete && node dist/main.js


