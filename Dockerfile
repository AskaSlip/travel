FROM node:20-alpine

MAINTAINER Anna Slip

RUN mkdir /app
WORKDIR /app

COPY ./backend/package.json ./backend/package-lock.json ./

RUN npm i

COPY ./backend ./

CMD ["npx", "nest", "start"]