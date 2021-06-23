FROM node:12.13-alpine As development

ARG NODE_ENV=prod
RUN echo $NODE_ENV

ARG PORT=8000
RUN echo $PORT

EXPOSE 80
EXPOSE 443
EXPOSE $PORT

ARG SRC_PATH=./src
RUN echo ls -a $SRC_PATH

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY ./src ./src
COPY ".env.dev" ./ 
COPY ".env.test" ./ 
COPY ".env.stage" ./ 
COPY ".env.prod" ./ 
COPY ./tsconfig.build.json .
COPY ./tsconfig.json .

RUN npm run build

RUN npm run post_build -- --name=$NODE_ENV

RUN rm -rf ./src

COPY ./Quest*.json ./dist

FROM node:12.13-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

EXPOSE 80
EXPOSE 443
EXPOSE $PORT

### 复制其他目录
### COPY ./others ./others

COPY --from=development /usr/src/app/dist ./dist
RUN mkdir /usr/src/app/documents
CMD ["node", "dist/main"]
