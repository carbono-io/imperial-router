FROM node:4.1.2
COPY . /imperial-router
WORKDIR /imperial-router
RUN npm install

EXPOSE 7877

CMD ["/bin/sh", "-c", "node ."]
