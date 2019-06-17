FROM node:10

WORKDIR /app
COPY . /app

RUN npm install
RUN apt-get update
RUN apt-get --assume-yes install  mysql-server

CMD ["npm", "start"]