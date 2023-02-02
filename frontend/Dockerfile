# pull official base image
FROM node:18-alpine

# set working directory
WORKDIR /usr/app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY ./frontend/package.json ./frontend/package-lock.json /usr/app/
RUN npm update -g
RUN npm ci

# add app
COPY . ./

# # start app
CMD ["npm", "dev"]