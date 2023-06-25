FROM node:18-alpine

## Fix security issue node < 16
## ERROR: http://dl-cdn.alpinelinux.org/alpine/v3.11/main: BAD signature
RUN sed -i -e 's/http:/https:/' /etc/apk/repositories

WORKDIR /common

RUN apk --update add bash

COPY cmd.sh /cmd.sh
COPY mongodb-scripts /mongodb-scripts

CMD ["/cmd.sh"]