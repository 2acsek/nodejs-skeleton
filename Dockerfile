FROM node:16 as builder

WORKDIR /app

COPY package.json yarn.lock .npmrc ./
RUN yarn install --pure-lockfile
COPY src src
COPY tsconfig.base.json tsconfig.json ./
RUN yarn run build

FROM node:16-slim

WORKDIR /app

COPY package.json yarn.lock .npmrc ./
RUN yarn install --pure-lockfile --production
COPY --from=builder /app/build /app/build
ENV NODE_ENV production

CMD VERSION=$(node -p "require('./package.json').version") node ./build/index.js
