FROM mhart/alpine-node:4
RUN apk add --update curl 
RUN apk add --update openssh
RUN apk add --update git
RUN rm -rf /var/cache/apk/*
RUN apk add --update bash
RUN npm install -g pm2
ADD . /opt/maestro
WORKDIR /opt/maestro
RUN npm install
CMD pm2 start index.js -i 2 --name=maestro-cluster && while true; do echo "running"; sleep 2; done
#CMD node index.js