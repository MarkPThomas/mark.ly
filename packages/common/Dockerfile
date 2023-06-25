FROM node:16-alpine

WORKDIR /common

## Fix security issue node < 16
## ERROR: http://dl-cdn.alpinelinux.org/alpine/v3.11/main: BAD signature
RUN sed -i -e 's/http:/https:/' /etc/apk/repositories

RUN apk update && apk add bash && apk add curl

COPY ./common/package.json package.json
COPY ./common/yarn.lock yarn.lock

RUN yarn install --silent

COPY . .
