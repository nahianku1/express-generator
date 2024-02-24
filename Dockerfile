FROM node

RUN mkdir -p /home/app

WORKDIR /home/app

COPY package.json .

RUN npm install

COPY . .

CMD ["node","/home/app/dist/server.js"]