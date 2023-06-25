FROM node:16-alpine as buildui

WORKDIR /weather-ly

COPY ./weather-ly/package.json package.json
COPY ./weather-ly/yarn.lock yarn.lock

RUN yarn install --silent

COPY ./weather-ly .

RUN yarn run ui:build


FROM node:16-alpine as buildserver

WORKDIR /weather-ly/server

COPY ./common /common

RUN cd /common \
  && yarn install --silent \
  && cd /weather-ly/server

COPY ./weather-ly/server/package.json package.json
COPY ./weather-ly/server/yarn.lock yarn.lock

RUN yarn install --silent

COPY ./weather-ly/server .
COPY --from=buildui /weather-ly/build /weather-ly/build

RUN yarn build --outDir /weather-ly-dist \
  && yarn install --production --silent \
  && mv /weather-ly/server/node_modules /weather-ly-dist/weather-ly/server/node_modules \
  && cd /common && yarn install --production --silent \
  && mv /common/node_modules /weather-ly-dist/common/node_modules \
  && mv /weather-ly/server/tsconfig.json /weather-ly-dist/weather-ly/server/tsconfig.json


FROM node:16-alpine

WORKDIR /weather-ly/server

COPY --from=buildserver /weather-ly-dist /
COPY --from=buildui /weather-ly/build /weather-ly/build

CMD ["node", "--max-http-header-size", "81000", "-r", "tsconfig-paths/register", "index.js"]