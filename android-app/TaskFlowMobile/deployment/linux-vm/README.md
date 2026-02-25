# Linux VM Deployment Template (Nginx + systemd)

This folder contains a simple production template for hosting the TaskFlow backend on a Linux VM.

Assumptions:
- Ubuntu 22.04/24.04 VM
- Backend listens on `127.0.0.1:4000`
- Public API domain is `imagelink.qtiqo.com`
- Nginx handles HTTPS and proxies to the backend

## 1. Prepare the VM

```bash
sudo apt update
sudo apt install -y nginx curl
```

If your backend is Node.js, install Node LTS (example with NodeSource):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2. Deploy backend code

Example app path:

```bash
sudo mkdir -p /opt/taskflow-backend
sudo chown -R $USER:$USER /opt/taskflow-backend
```

Copy your backend code to `/opt/taskflow-backend`, install dependencies, and build it.

## 3. Create runtime environment file

Create `/etc/taskflow/taskflow-backend.env` (root-owned):

```bash
sudo mkdir -p /etc/taskflow
sudo nano /etc/taskflow/taskflow-backend.env
```

Add your real values (example):

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
JWT_ACCESS_SECRET=replace_me
JWT_REFRESH_SECRET=replace_me
```

## 4. Install systemd service

Copy `systemd/taskflow-backend.service` to `/etc/systemd/system/taskflow-backend.service` and edit:
- `User`
- `Group`
- `WorkingDirectory`
- `ExecStart`

Then enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now taskflow-backend
sudo systemctl status taskflow-backend
```

## 5. Configure Nginx reverse proxy

Copy `nginx/taskflow-api.conf` to `/etc/nginx/sites-available/taskflow-api` and update `server_name`.

```bash
sudo ln -s /etc/nginx/sites-available/taskflow-api /etc/nginx/sites-enabled/taskflow-api
sudo nginx -t
sudo systemctl reload nginx
```

## 6. Enable HTTPS (Let's Encrypt)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d imagelink.qtiqo.com
```

## 7. Android release app config

Set the release API URL when building:

```bash
./gradlew bundleRelease -PTASKFLOW_RELEASE_API_BASE_URL=https://imagelink.qtiqo.com/api/
```

## Useful commands

```bash
sudo systemctl restart taskflow-backend
sudo journalctl -u taskflow-backend -f
sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log
```
