FROM node:20.3 as base

FROM base as development
WORKDIR /app

EXPOSE 3000 

FROM base as production
WORKDIR /app
COPY files/app/package*.json ./
RUN npm ci

COPY files/app ./
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]