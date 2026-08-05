# --- Stage 1: Build Next.js Frontend ---
FROM node:22-bookworm-slim AS frontend-build
WORKDIR /app/frontend

# Копируем package.json для кэширования установки зависимостей
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --no-audit --no-fund --legacy-peer-deps

COPY frontend/ ./

# Передаем публичный ключ Clerk. 
# NEXT_PUBLIC_ префикс обязателен, чтобы Next.js вшил его в клиентский JS.
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Собираем проект. Результат будет в папке .next
RUN npm run build

# --- Stage 2: Build Express Backend ---
FROM node:22-bookworm-slim AS backend-build
WORKDIR /app/backend

COPY backend/package.json backend/package-lock.json ./
RUN npm install --no-audit --no-fund

COPY backend/ ./

# Компилируем TypeScript в JavaScript (результат в папке dist)
RUN npm run build

# --- Stage 3: Production Runtime Image ---
FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
# Порт, который слушает наш Express сервер
ENV PORT=5000 

# 1. Устанавливаем только продакшн-зависимости для бэкенда
COPY backend/package.json backend/package-lock.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# 2. Копируем скомпилированный бэкенд
COPY --from=backend-build /app/backend/dist ./dist

# 3. Копируем собранный фронтенд (.next) и статические файлы
# Next.js нужен весь контекст сборки для работы в standalone режиме или стандартном
COPY --from=frontend-build /app/frontend/.next ./frontend/.next
COPY --from=frontend-build /app/frontend/public ./frontend/public
COPY --from=frontend-build /app/frontend/package.json ./frontend/package.json

# 4. Копируем папку uploads (если она есть на этапе сборки, иначе создастся при работе)
# Для продакшена лучше использовать внешнее хранилище, но для начала оставим так
RUN mkdir -p /app/backend/public/uploads

EXPOSE 5000

# Запускаем бэкенд. Он будет отдавать и API, и статику.
# Фронтенд будет деплоиться отдельно на Vercel, либо мы настроим проксирование.
CMD ["node", "dist/index.js"]