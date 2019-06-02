FROM node:10

WORKDIR /app
COPY . /app

RUN npm install

ENV DB_HOST=host.docker.internal

CMD ["npm", "start"]
