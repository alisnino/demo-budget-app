ARG NODE_VERSION
FROM node:${NODE_VERSION} as development

RUN npm install turbo --global

COPY --from=golang:1.21.4-alpine /usr/local/go/ /usr/local/go/
ENV PATH="/usr/local/go/bin:${PATH}"

WORKDIR /app

FROM development as production

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o /backend

EXPOSE 8080
