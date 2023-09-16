FROM node:18.16.1 as development

WORKDIR /app/

FROM development as production

COPY package.json yarn.lock ./
COPY services/backend/package.json services/backend/yarn.lock ./services/backend/

RUN yarn install

COPY services/backend/ .services/backend/

# RUN yarn build

EXPOSE 5000

CMD ["yarn", "workspace", "@services/backend", "start"]
