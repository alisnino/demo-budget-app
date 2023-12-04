ARG NODE_VERSION
FROM node:${NODE_VERSION} as development

RUN npm install turbo --global
WORKDIR /app/

FROM development as production

COPY package.json yarn.lock ./
COPY services/frontend/package.json services/frontend/yarn.lock ./services/frontend/

RUN yarn install

COPY services/frontend/ .services/frontend/

# RUN yarn build

EXPOSE 5000

CMD ["yarn", "workspace", "@services/frontend", "start"]
