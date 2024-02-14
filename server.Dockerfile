FROM node:alpine
WORKDIR /usr/local
COPY package.json .

RUN npm install yarn
RUN npm install typescript -g

COPY packages ./packages

RUN yarn install

RUN npx prisma generate --schema=./packages/db/prisma/schema.prisma

WORKDIR /usr/local/packages/server

RUN tsc

CMD ["node", "./dist/index.js"]
