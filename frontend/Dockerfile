#
# Front End
#

# pull official base image
FROM node:18

COPY . .
WORKDIR /frontend/
RUN npm update -g
RUN npm ci
