#
# Front End
#

# pull official base image
FROM node:18-alpine

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

COPY . .
WORKDIR /frontend/
RUN npm update -g
RUN npm ci
