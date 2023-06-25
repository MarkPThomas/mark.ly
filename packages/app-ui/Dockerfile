FROM node:16-alpine as buildui

WORKDIR /app-ui

COPY ./app-ui/package.json package.json
COPY ./app-ui/yarn.lock yarn.lock

RUN yarn install --silent

COPY ./app-ui .

RUN yarn run ui:build



FROM node:16-alpine as buildserver

WORKDIR /app-ui/server

COPY ./common /common

RUN cd /common \
  && yarn install --silent \
  && cd /app-ui/server


COPY ./app-ui/server/package.json package.json
COPY ./app-ui/server/yarn.lock yarn.lock

RUN yarn install --silent

COPY ./app-ui/server .
COPY --from=buildui /app-ui/build /app-ui/build

RUN yarn build --outDir /app-ui-dist \
  && yarn install --production --silent \
  && mv /app-ui/server/node_modules /app-ui-dist/app-ui/server/node_modules \
  && cd /common && yarn install --production --silent \
  && mv /common/node_modules /app-ui-dist/common/node_modules \
  && mv /app-ui/server/tsconfig.json /app-ui-dist/app-ui/server/tsconfig.json


FROM node:16-alpine

WORKDIR /app-ui/server

COPY --from=buildserver /app-ui-dist /
COPY --from=buildui /app-ui/build /app-ui/build

# TODO: determine what to do w/o AWS RDS
#RUN wget https://s3.amazonaws.com/rds-downloads/rds-combined-ca-bundle.pem

CMD ["node", "--max-http-header-size", "81000", "-r", "tsconfig-paths/register", "index.js"]