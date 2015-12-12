FROM mhart/alpine-node:4
RUN apk add --update curl 
RUN apk add --update openssh
RUN apk add --update git
RUN rm -rf /var/cache/apk/*
RUN apk add --update bash
RUN npm install -g pm2
ADD . /opt/maestro
WORKDIR /opt/maestro