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

## Android App (Native)
- Android project: `android-app/TaskFlowMobile`
- Mobile README: `android-app/TaskFlowMobile/README.md`
- Emulator health check: `http://10.0.2.2:4000/api/health`

### Android + Local Docker (recommended dev flow)
1. Start backend stack:
```
docker compose up -d --build
```
2. Verify API:
```
http://localhost:4000/api/health
```
3. Open `android-app/TaskFlowMobile` in Android Studio.
4. Run emulator and install app.
5. If `10.0.2.2` does not work, use `adb reverse` and set Android debug URL to `http://127.0.0.1:4000/api/`.

## EC2 Deployment (Single Server)
- Deployment files: `deploy/ec2/`
- Guide: `deploy/ec2/README.md`
- Compose stack: `deploy/ec2/docker-compose.ec2.yml`
- Env template: `deploy/ec2/.env.example`

## API Overview
- `GET /health`
- `GET /api/health`
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
- For local Docker without Twilio, set `SMS_ENABLED=false`.
