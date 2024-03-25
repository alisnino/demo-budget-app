FROM node:20.11.1-bullseye as dev

WORKDIR /app

FROM dev as prod

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

# Write environment variables to /app/.env
ARG NEXT_PUBLIC_API_BASE_URL
RUN echo "NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" > .env

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
