# TaskFlow

A complete Microsoft To Do + Odoo-inspired task manager with SMS reminders.

## Features
- JWT auth + refresh tokens
- Lists, tasks, subtasks, tags, priorities, statuses
- My Day, Planned, Important, Completed views
- Kanban board with drag & drop
- SMS reminders via Twilio (BullMQ + Redis)
- PostgreSQL + Prisma ORM
- Docker-ready

## Project Structure
- `backend/` Express API, Prisma, worker
- `frontend/` React + Vite + Tailwind UI
- `docker-compose.yml` Postgres, Redis, API, worker, UI

## Environment Variables
Create these files:

`backend/.env`
```
PORT=4000
DATABASE_URL=postgresql://taskflow:taskflow@localhost:5432/taskflow
JWT_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
REDIS_URL=redis://localhost:6379
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_FROM_NUMBER=+10000000000
CLIENT_URL=http://localhost:5173
SMS_ENABLED=true
EMAIL_ENABLED=false
```

`frontend/.env`
```
VITE_API_URL=http://localhost:4000/api
```

## Local Setup (without Docker)
1. Install dependencies:
```
cd backend
npm install
cd ../frontend
npm install
```

2. Start Postgres + Redis (local or via Docker):
```
docker compose up db redis -d
```

3. Run Prisma migration and generate client:
```
cd backend
npx prisma migrate dev
npx prisma generate
```

4. Start backend + worker:
```
cd backend
npm run dev
node src/worker/reminderWorker.js
```

5. Start frontend:
```
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Docker Compose (full stack)
```
docker compose up --build
```

## API Overview
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/users/me`
- `PUT /api/users/me`
- `GET /api/task-lists`
- `POST /api/task-lists`
- `PUT /api/task-lists/:id`
- `DELETE /api/task-lists/:id`
- `POST /api/task-lists/:id/members`
- `DELETE /api/task-lists/:id/members/:userId`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/subtasks`
- `PUT /api/tasks/subtasks/:subtaskId`
- `DELETE /api/tasks/subtasks/:subtaskId`
- `GET /api/reminders`
- `POST /api/reminders`

## Notes
- For SMS reminders, configure Twilio credentials in `backend/.env`.
- Worker uses BullMQ and Redis. Keep it running to send SMS.
