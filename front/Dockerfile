FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN apk add --no-cache curl
RUN echo "Waiting for backend to be ready..." && \
    curl -f http://back:3001/health || exit 1

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start"]