FROM node:20-alpine

MAINTAINER Anna Slip

RUN mkdir /app
WORKDIR /app

COPY ./backend/package.json /app

RUN npm i

