ARG NODE_VERSION
FROM node:${NODE_VERSION} as development

RUN npm install turbo --global
WORKDIR /app/

FROM development as production

COPY package.json yarn.lock ./
COPY packages/prisma/package.json ./packages/prisma/

RUN yarn install