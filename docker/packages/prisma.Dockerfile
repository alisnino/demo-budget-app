FROM node:18.16.1 as development

WORKDIR /app/

FROM development as production

COPY package.json yarn.lock ./
COPY packages/prisma/package.json ./packages/prisma/

RUN yarn install