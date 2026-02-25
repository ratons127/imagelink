# Ubuntu 24.04 Backend + DB Setup Note (imagelink.qtiqo.com)

This note documents the full working setup for the TaskFlow backend on an Ubuntu 24 VM, based on the issues encountered during deployment.

## Architecture (final target)

- Domain: `imagelink.qtiqo.com`
- Public HTTPS: Nginx on `:443`
- Backend app: Node.js on `127.0.0.1:4000`
- Database: PostgreSQL (local)
- Cache/queue/session support: Redis (local)
- Android release API base URL: `https://imagelink.qtiqo.com/api/`

## Important discovery (monorepo layout)

The repo root is a monorepo and **does not** contain the backend `package.json`.

- Repo root: `/opt/taskflow-backend`
- Backend folder: `/opt/taskflow-backend/backend`

Run backend commands from:

```bash
cd /opt/taskflow-backend/backend
```

## 1. Install base packages (Ubuntu 24)

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx curl git ufw postgresql postgresql-contrib redis-server
```

## 2. Install Node.js (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

## 3. Enable and verify services

```bash
sudo systemctl enable --now postgresql
sudo systemctl enable --now redis-server
sudo systemctl status postgresql --no-pager
sudo systemctl status redis-server --no-pager
redis-cli ping
```

Expected Redis response:

```text
PONG
```

## 4. Firewall (UFW)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

## 5. PostgreSQL database setup

Open `psql`:

```bash
sudo -u postgres psql
```

Create DB and user:

```sql
CREATE DATABASE imagelink_db;
CREATE USER imagelink_user WITH ENCRYPTED PASSWORD 'CHANGE_THIS_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE imagelink_db TO imagelink_user;
\q
```

## 6. Clone app repo

```bash
sudo mkdir -p /opt/taskflow-backend
sudo chown -R $USER:$USER /opt/taskflow-backend
git clone https://github.com/ratons127/imagelink.git /opt/taskflow-backend
```

## 7. Install backend dependencies (backend subfolder)

```bash
cd /opt/taskflow-backend/backend
npm install
```

Note:
- This backend currently does **not** have an `npm run build` script.
- Start command is `npm start` (`node src/server.js`).

## 8. Production environment file

Create:

```bash
sudo mkdir -p /etc/taskflow
sudo nano /etc/taskflow/taskflow-backend.env
```

Use this template (replace placeholders):

```env
NODE_ENV=production
PORT=4000

# Required app secrets (generate strong random values)
JWT_SECRET=REPLACE_WITH_LONG_RANDOM_SECRET
JWT_REFRESH_SECRET=REPLACE_WITH_ANOTHER_LONG_RANDOM_SECRET

# Local Redis
REDIS_URL=redis://127.0.0.1:6379

# PostgreSQL (replace password with your real DB password)
DATABASE_URL=postgres://imagelink_user:REAL_DB_PASSWORD@127.0.0.1:5432/imagelink_db
```

Important:
- If DB password contains special characters (`@`, `:`, `/`, `#`, `%`), URL-encode it in `DATABASE_URL`.
- If a secret was pasted in chat/logs, rotate it before production.

## 9. systemd service (final working config)

Create/edit:

```bash
sudo nano /etc/systemd/system/taskflow-backend.service
```

Use:

```ini
[Unit]
Description=TaskFlow Backend API
After=network.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/opt/taskflow-backend/backend
EnvironmentFile=/etc/taskflow/taskflow-backend.env
Environment=NODE_ENV=production
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

Notes:
- `User=root` is a quick working config.
- For production hardening, create a dedicated user (recommended later).

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable taskflow-backend
sudo systemctl restart taskflow-backend
sudo systemctl status taskflow-backend
sudo journalctl -u taskflow-backend -f
```

Expected healthy log signal:

```text
TaskFlow API listening on 4000
```

If you see `Missing env vars: ...`, fix `/etc/taskflow/taskflow-backend.env` and restart.

## 10. Local backend test (before Nginx)

Root `/` may return `404` and that is normal.

```bash
curl http://127.0.0.1:4000
```

Test real API routes under `/api/...` (examples):

```bash
curl -i http://127.0.0.1:4000/api/health
curl -i http://127.0.0.1:4000/api/auth/login
```

## 11. Nginx config for imagelink.qtiqo.com

Copy the template from this repo:

```bash
sudo cp /opt/taskflow-backend/android-app/TaskFlowMobile/deployment/linux-vm/nginx/taskflow-api.conf /etc/nginx/sites-available/taskflow-api
sudo ln -s /etc/nginx/sites-available/taskflow-api /etc/nginx/sites-enabled/taskflow-api
sudo nginx -t
sudo systemctl reload nginx
```

The template proxies requests to `http://127.0.0.1:4000`.

## 12. DNS record (required before HTTPS)

Create/update an `A` record:

- Host: `imagelink.qtiqo.com`
- Value: your Ubuntu VM public IP

Wait until DNS resolves:

```bash
dig +short imagelink.qtiqo.com
```

## 13. Enable HTTPS with Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d imagelink.qtiqo.com
```

Test HTTPS:

```bash
curl -I https://imagelink.qtiqo.com
```

## 14. Android release build (production API URL)

Build the Android app with the production API base URL:

```bash
./gradlew bundleRelease -PTASKFLOW_RELEASE_API_BASE_URL=https://imagelink.qtiqo.com/api/
```

## Troubleshooting quick list

- `npm ERR! ENOENT package.json` at repo root:
  - Run commands in `/opt/taskflow-backend/backend`
- `npm ERR! Missing script: build`:
  - This backend has no build script; use `npm start`
- `ECONNREFUSED 127.0.0.1:6379`:
  - Install/start Redis and set `REDIS_URL`
- `systemd status=217/USER`:
  - The configured `User=` does not exist; use `root` temporarily or create a real service user
- `GET / 404`:
  - Normal if app routes are under `/api`
- `Missing env vars: ...`:
  - Add required vars to `/etc/taskflow/taskflow-backend.env` and restart service

## Recommended hardening after launch

1. Run backend as a dedicated system user instead of `root`
2. Rotate all JWT secrets if exposed anywhere
3. Add daily PostgreSQL backups (`pg_dump`)
4. Add app health endpoint and uptime monitoring
5. Lock SSH to key-only auth and install `fail2ban`
