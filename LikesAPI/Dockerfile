FROM node:latest
# Create app directory
WORKDIR /app/authAPI

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 1111
CMD [ "npm", "run", "start"]