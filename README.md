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
HOST=0.0.0.0
PORT=3001
SITE_URL=http://<VPS_IP>:3001
```

Примечания:
- приложение сначала пытается подключиться к Atlas (если строка задана), затем использует локальную MongoDB
- файл `.env` не должен попадать в git
- `SITE_URL` используется для явного публичного адреса в логах сервера

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

## Адрес сайта на VPS
После запуска backend на VPS сайт будет доступен по:
- `http://<VPS_IP>:3001` (если порт 3001 открыт)
- либо по домену из `SITE_URL`, если настроен DNS/прокси

Рекомендуемые значения для `backend/.env`:

```env
HOST=0.0.0.0
PORT=3001
SITE_URL=http://<VPS_IP>:3001
```

## Частые проблемы
- `Invalid token` на публичных страницах: проверь область применения auth-middleware в user-роутах.
- Ошибка Atlas `querySrv ENODATA`: проверь хост кластера, DNS и `Network Access` в Atlas.
- `EADDRINUSE` на порту `3001`: останови предыдущий процесс Node, который уже слушает порт.

## Безопасность
Если логин/пароль БД случайно попали в чат, скриншоты или коммиты, сразу смени пароль пользователя MongoDB в Atlas.
