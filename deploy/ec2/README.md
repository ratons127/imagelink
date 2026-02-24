# TaskFlow EC2 Deployment (Single Server)

This stack runs:
- `backend` (Node/Express API)
- `worker` (reminder worker)
- `db` (PostgreSQL)
- `redis` (queue/cache)

## 1. EC2 prerequisites

- Ubuntu 22.04+ (recommended)
- Security group:
  - `22/tcp` from your IP (SSH)
  - `4000/tcp` from your frontend host or `0.0.0.0/0` temporarily for testing
- Docker + Docker Compose plugin installed

## 2. Copy project and prepare env

From repo root on the EC2 instance:

```bash
mkdir -p deploy/ec2
cp deploy/ec2/.env.example deploy/ec2/.env
```

Edit `deploy/ec2/.env` and set:
- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `CLIENT_URL` (your web frontend URL if applicable)
- `SMS_ENABLED=false` unless Twilio is configured

## 3. Start services

Run from repo root:

```bash
docker compose --env-file deploy/ec2/.env -f deploy/ec2/docker-compose.ec2.yml up -d --build
```

The backend container runs `prisma migrate deploy` before starting.

## 4. Verify

```bash
docker compose --env-file deploy/ec2/.env -f deploy/ec2/docker-compose.ec2.yml ps
docker compose --env-file deploy/ec2/.env -f deploy/ec2/docker-compose.ec2.yml logs --tail=200 backend worker
```

API should be reachable at:

```text
http://EC2_PUBLIC_IP:4000/api
```

## 5. Android app configuration

Set the Android app API base URL to:

```text
http://EC2_PUBLIC_IP:4000/api/
```

Use HTTPS (recommended) with a reverse proxy (Nginx/Caddy) before production mobile release.

## 6. Backup / restore (PostgreSQL)

Backup:

```bash
docker compose --env-file deploy/ec2/.env -f deploy/ec2/docker-compose.ec2.yml exec -T db \
  pg_dump -U "${POSTGRES_USER:-taskflow}" "${POSTGRES_DB:-taskflow}" > taskflow_backup.sql
```

Restore:

```bash
cat taskflow_backup.sql | docker compose --env-file deploy/ec2/.env -f deploy/ec2/docker-compose.ec2.yml exec -T db \
  psql -U "${POSTGRES_USER:-taskflow}" "${POSTGRES_DB:-taskflow}"
```

## Notes

- This is a single-instance setup (DB on the same EC2 host). It is fine for a small deployment but not HA.
- Do not expose PostgreSQL (`5432`) or Redis (`6379`) ports publicly.
- Add a reverse proxy + TLS certificate before production use.
