# Specify node version
FROM node:8.2.0
# Create app directory
WORKDIR /usr/src/app
# Copy source
COPY . .
WORKDIR /usr/src/app/Server
RUN npm install
RUN npm install -g nodemon
# Expose app port
EXPOSE 8080
WORKDIR /usr/src/app
CMD ./runserver
