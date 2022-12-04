FROM node:latest
# Create app directory
WORKDIR /app/likesAPI

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 5555
CMD [ "npm", "run", "start"]