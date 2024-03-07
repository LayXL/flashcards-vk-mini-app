FROM node:alpine
WORKDIR /usr/local
COPY package.json .
COPY yarn.lock .

RUN npm install yarn
RUN npm install typescript -g

COPY packages ./packages

RUN yarn install --prefer-offline --frozen-lockfile

RUN npx prisma generate --schema=./packages/server/prisma/schema.prisma

WORKDIR /usr/local/packages/server

RUN tsc

CMD ["node", "./dist/server.js"]
