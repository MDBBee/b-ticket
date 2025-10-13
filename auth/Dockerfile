FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm i --omit=dev 
COPY . .

CMD [ "npm", "start" ]