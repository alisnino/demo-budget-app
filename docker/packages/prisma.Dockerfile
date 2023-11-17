ARG NODE_VERSION
FROM node:${NODE_VERSION} as development

WORKDIR /app/

FROM development as production

COPY package.json yarn.lock ./
COPY packages/prisma/package.json ./packages/prisma/

RUN yarn install