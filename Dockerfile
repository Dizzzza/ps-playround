FROM node:24-alpine

WORKDIR /app

# Устанавливаем pnpm
RUN npm install -g pnpm

# Копируем package.json (и lock-файл, если есть)
COPY pnpm-lock.yaml ./  

# Устанавливаем зависимости
RUN pnpm install --shamefully-hoist

# Копируем весь проект
COPY . .

EXPOSE 3000
EXPOSE 3001

CMD ["pnpm", "run", "start"]
