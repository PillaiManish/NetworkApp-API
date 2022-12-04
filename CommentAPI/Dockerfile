FROM node:latest
# Create app directory
WORKDIR /app/commentAPI

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 4444
CMD [ "npm", "run", "start"]