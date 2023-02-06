# pull official base image
FROM node:18-alpine

# set working directory
WORKDIR /usr/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./package.json ./package-lock.json /usr/app/
RUN npm update -g
RUN npm ci

# add app
COPY . ./