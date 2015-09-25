FROM node:0.10.39

RUN mkdir /src
WORKDIR /src
ADD . /src
RUN npm install
EXPOSE 7890 7891