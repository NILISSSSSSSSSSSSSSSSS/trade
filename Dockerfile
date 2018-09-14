FROM node:8-alpine
COPY package package
WORKDIR package
CMD node build/main.js --production