FROM node:10

WORKDIR /app
COPY . /app

RUN chmod 777 ./scripts/wait-for-it.sh 

RUN npm install
RUN apt-get update
RUN apt-get --assume-yes install  mysql-server

CMD ["npm", "start"]