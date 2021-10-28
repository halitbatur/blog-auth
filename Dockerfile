FROM node:14

RUN mkdir -p /backend-app
WORKDIR /backend-app
COPY package.json .
RUN npm install
COPY ./server ./server
CMD [ "npm", "run", "start:app" ]