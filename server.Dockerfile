FROM node:alpine
WORKDIR /usr/local

COPY yarn.lock .

COPY package.json .
COPY /packages/server/package.json ./packages/server

RUN npm install yarn
RUN npm install typescript -g

RUN yarn install --prefer-offline --frozen-lockfile

COPY packages/server ./packages/server

RUN npx prisma generate --schema=./packages/server/prisma/schema.prisma

WORKDIR /usr/local/packages/server

RUN tsc

CMD ["node", "./dist/server.js"]
