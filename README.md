# YeahDays

Mobile-first PWA for daily productivity scoring with account sync (MongoDB), premium glass UI, and offline support.

## Tech stack

- Frontend: React + Vite + TypeScript + Tailwind
- State: Zustand
- Backend: Node.js + Express + MongoDB (Mongoose) + JWT
- PWA: `vite-plugin-pwa`
- Deploy: Docker + Nginx reverse proxy

## Quick local start

1) Install dependencies:

```bash
npm install
npm --prefix server install
```

2) Configure backend env:

```bash
cp server/.env.example server/.env
```

Fill `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`.

3) Start app:

```bash
npm run dev
npm run dev:api
```

## Production-ready files included

- Frontend image: [Dockerfile](Dockerfile)
- Backend image: [server/Dockerfile](server/Dockerfile)
- Reverse proxy + services: [docker-compose.yml](docker-compose.yml)
- Nginx config: [nginx.conf](nginx.conf)
- CI workflow: [.github/workflows/ci.yml](.github/workflows/ci.yml)

## Environment variables

Backend (`server/.env`):

- `MONGODB_URI`
- `JWT_SECRET`
- `PORT` (default `4000`)
- `CLIENT_ORIGIN` (e.g. `https://your-domain.com`)

Frontend:

- Optional local `.env`: `VITE_API_URL="http://localhost:4000"`
- In Docker production the frontend uses `/api` through Nginx proxy.

## Prepare for GitHub

1) Ensure secrets are NOT committed (`.env` is ignored).
2) Create repository and push:

```bash
git init
git add .
git commit -m "Initial YeahDays production setup"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

3) Add repository secrets if needed for future CD:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `MONGODB_URI`
- `JWT_SECRET`

## Deploy on DigitalOcean (Droplet + Docker Compose)

1) Create Ubuntu droplet (recommended: 2GB+ RAM).

2) Install Docker:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

3) Pull project:

```bash
git clone <your-github-repo-url>
cd YeahDays
```

4) Configure production env:

```bash
cp server/.env.example server/.env
nano server/.env
```

Set:

- `MONGODB_URI=...`
- `JWT_SECRET=very-long-random-string`
- `CLIENT_ORIGIN=https://your-domain.com`

5) Start services:

```bash
docker compose up -d --build
docker compose ps
```

6) Point your domain A-record to droplet IP.

7) Add HTTPS (recommended with Caddy or Nginx + Certbot on host).

## Useful commands

```bash
npm run build
npm run docker:build
npm run docker:up
npm run docker:down
docker compose logs -f
```

## Security notes

- Never commit `server/.env`.
- Rotate MongoDB password/JWT if previously exposed.
- Restrict MongoDB Atlas network access to required IP ranges.

## One-click DigitalOcean App Platform

Use ready app spec: [.do/app.yaml](.do/app.yaml)

1. In DigitalOcean: **Apps → Create App → App Spec**
2. Paste content from `.do/app.yaml` (or upload file)
3. Replace secret values:
	- `MONGODB_URI`
	- `JWT_SECRET`
4. Click **Create Resources**

This creates two services automatically:

- `web` (frontend, route `/`)
- `api` (backend, route `/api`)
