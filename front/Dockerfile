FROM node:18-alpine

WORKDIR /app

# Копируем package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Открываем порт фронтенда
EXPOSE 3000

# Запускаем фронтенд в режиме разработки
CMD ["npm", "run", "dev"]