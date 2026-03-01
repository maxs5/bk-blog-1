# BK Blog

Полноценное fullstack SPA-приложение блога:
- `frontend` — клиент на React
- `backend` — API на Express + MongoDB

## Стек
- Frontend: React, Redux, React Router, styled-components
- Backend: Node.js, Express, Mongoose, JWT (авторизация через cookie)
- База данных: MongoDB (Atlas или локальная)

## Структура проекта
- `frontend/` — клиентская часть
- `backend/` — серверная часть
- `backend/routes/` — роуты (`user.js`, `post.js`, `index.js`)

## Роутинг API и SPA
Бэкенд настроен так, чтобы корректно работать с SPA:
- все API-эндпоинты находятся под префиксом `/api`
- все не-API запросы возвращают `frontend/build/index.html`

Это позволяет открывать и обновлять URL вроде `/login` и `/posts/:id` без ошибки 404 после сборки фронтенда.

## Переменные окружения (backend/.env)
Пример:

```env
DB_CONNECTION_STRING=mongodb://127.0.0.1:27017/bk-blog
DB_CONNECTION_STRING_ATLAS=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/bk-blog?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_long_secret
```

Примечания:
- приложение сначала пытается подключиться к Atlas (если строка задана), затем использует локальную MongoDB
- файл `.env` не должен попадать в git

## Запуск в локальной среде

### 1) Установка зависимостей

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2) Запуск backend

```bash
cd backend
npm run dev
```

По умолчанию backend: `http://localhost:3001`

### 3) Запуск frontend

```bash
cd frontend
npm start
```

По умолчанию frontend: `http://localhost:3000`

Во `frontend/package.json` настроен `proxy` на backend.

## Продакшен-сборка и раздача через backend

```bash
cd frontend
npm run build

cd ../backend
npm run dev
```

Backend раздает статику из `frontend/build` и обрабатывает SPA-роуты.

## Частые проблемы
- `Invalid token` на публичных страницах: проверь область применения auth-middleware в user-роутах.
- Ошибка Atlas `querySrv ENODATA`: проверь хост кластера, DNS и `Network Access` в Atlas.
- `EADDRINUSE` на порту `3001`: останови предыдущий процесс Node, который уже слушает порт.

## Безопасность
Если логин/пароль БД случайно попали в чат, скриншоты или коммиты, сразу смени пароль пользователя MongoDB в Atlas.
