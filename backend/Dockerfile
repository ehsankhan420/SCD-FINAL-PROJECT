FROM node:18-alpine

WORKDIR /app

# Install wget for healthchecks
RUN apk add --no-cache wget

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"] 