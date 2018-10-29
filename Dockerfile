FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY Server .

# Install depenedencies
RUN npm install --production

# Expose and run
EXPOSE 8080
CMD [ "npm", "start" ]