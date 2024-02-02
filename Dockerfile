FROM node:18-alpine3.18 AS build

LABEL maintainer="Anderson Aguiar"

WORKDIR /usr/src/app

COPY package*json ./

RUN apk update && apk add chromium

RUN npm install

COPY . .

RUN if [ -d "/app/tokens" ]; then rm -rf /app/tokens; fi

RUN npm run build

EXPOSE 3003

CMD ["node", "dist/main.js"]