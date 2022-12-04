FROM node:latest
# Create app directory
WORKDIR /app/networkAPI

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 2222
CMD [ "npm", "run", "start"]