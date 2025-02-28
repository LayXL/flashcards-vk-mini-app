FROM node:alpine
WORKDIR /usr/local

COPY package.json .

RUN mkdir packages
RUN mkdir packages/server

COPY packages/server/package.json ./packages/server

RUN npm install yarn
RUN npm install typescript -g

RUN yarn install --frozen-lockfile --no-cache

COPY packages/server ./packages/server

RUN npx prisma generate --schema=./packages/server/prisma/schema.prisma

WORKDIR /usr/local/packages/server

RUN tsc

CMD ["node", "./dist/server.js"]
