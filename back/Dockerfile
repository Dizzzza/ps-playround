FROM node:24-alpine

WORKDIR /user/src/app

RUN npm install -g pnpm

COPY package*.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3001

CMD ["pnpm", "start"]