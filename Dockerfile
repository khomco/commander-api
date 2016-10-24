FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

ENV KAFKA_HOST localhost
ENV KAFKA_PORT 2181
ENV PORT 8080
EXPOSE 8080

ENTRYPOINT [ "npm", "start" ]