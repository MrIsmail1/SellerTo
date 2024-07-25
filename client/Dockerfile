FROM node:20.0.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


EXPOSE 5173