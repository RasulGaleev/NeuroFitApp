# NeuroFitApp

## Описание
NeuroFitApp — это современное веб-приложение для отслеживания прогресса, питания, тренировок и взаимодействия с коучами. Проект состоит из backend на Django и frontend на React + TypeScript + Vite + TailwindCSS.

---

## Структура проекта

```
NeuroFitApp/
├── backend/      # Серверная часть (Django, DRF)
│   ├── main/     # Настройки и корневой модуль
│   ├── users/    # Пользователи
│   ├── nutrition/# Питание
│   ├── workouts/ # Тренировки
│   ├── blog/     # Блог
│   ├── coaches/  # Коучи
│   ├── progress/ # Прогресс
│   └── ...
└── frontend/     # Клиентская часть (React, Vite)
    └── src/
        ├── pages/      # Страницы (Home, Profile, Nutrition, и др.)
        ├── components/ # Общие компоненты (Navbar и др.)
        ├── services/   # API сервисы
        └── ...
```

---

## Backend (Django)

### Зависимости
Установить из `backend/requirements.txt`:
- Django 4.2
- djangorestframework
- django-cors-headers
- psycopg2
- openai
- и др.

### Переменные окружения
Создайте файл `.env` в папке `backend` (пример):
```
SECRET_KEY=...
DEBUG=True
DB_NAME=neurofit
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5432
OPENAI_API_KEY=...
OPENAI_MODEL=...
```

### Запуск backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

---

## Frontend (React + Vite)

### Зависимости
Установить из `frontend/package.json`:
- react, react-dom
- react-router-dom
- axios
- tailwindcss
- chart.js, react-chartjs-2
- и др.

### Запуск frontend
```bash
cd frontend
npm install
npm run dev
```

---

## Примечания
- Backend запускается на http://localhost:8000
- Frontend по умолчанию на http://localhost:5173
- Для работы с БД требуется PostgreSQL
- Для работы с OpenAI укажите корректный API-ключ в .env

---

## Контакты
Автор Telegram: @RasulGaleev 