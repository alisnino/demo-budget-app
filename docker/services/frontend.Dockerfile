FROM node:18.16.1

WORKDIR /app/

COPY package.json yarn.lock ./
COPY services/frontend/package.json services/frontend/yarn.lock ./services/frontend/

RUN yarn install

COPY services/frontend/ .services/frontend/

# RUN yarn build

EXPOSE 5000

CMD ["yarn", "workspace", "@services/frontend", "start"]
