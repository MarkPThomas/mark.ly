
## Build image with compiled server files
FROM node:16-alpine as builder

WORKDIR /app-api

COPY ./common /common

RUN cd /common \
  && yarn install --silent

COPY ./app-api/package.json package.json
COPY ./app-api/yarn.lock yarn.lock

RUN yarn install --silent

COPY ./app-api .

RUN yarn build --outDir /app-api-dist \
  && yarn install --production --silent \
  && mv /app-api/node_modules /app-api-dist/app-api/node_modules \
  && mv /common/node_modules /app-api-dist/common/node_modules \
  && mv /app-api/tsconfig.json /app-api-dist/app-api/tsconfig.json


## Compose production image
FROM node:16-alpine

WORKDIR /app/app-api

COPY --from=builder /app-api-dist /app

# TODO: determine what to do w/o AWS RDS
#RUN wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem

CMD ["node","--max-http-header-size", "81000", "-r", "tsconfig-paths/register", "index.js"]


