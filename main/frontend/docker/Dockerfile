FROM node:20.11.1-bullseye as dev

WORKDIR /app

FROM dev as prod

COPY package.json ./
COPY package-lock.lock ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
