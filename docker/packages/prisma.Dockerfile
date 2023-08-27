FROM node:18.16.1

WORKDIR /app/

COPY package.json yarn.lock ./
COPY packages/prisma/package.json ./packages/prisma/

RUN yarn install