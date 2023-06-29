FROM node:18-alpine AS build

LABEL maintainer="Anderson Aguiar"

WORKDIR /usr/src/app

COPY package*json ./

RUN apt-get update && apt-get install -y chromium-browser

RUN npm install

COPY . .

RUN if [ -d "/app/tokens" ]; then rm -rf /app/tokens; fi

RUN npm run build

EXPOSE 3003

CMD ["node", "dist/main.js"]