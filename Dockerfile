FROM node:lts-slim as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
RUN yarn
COPY . /app
EXPOSE 4000
CMD [ "yarn", "prod" ]
