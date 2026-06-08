# Installation

## Prerequisites

Before installing Study Tracker, make sure you have:

- Docker
- Docker Compose

Verify your installation:

```bash
docker --version
docker compose version
```

---

## Quick Start (Recommended)

Study Tracker is designed as a self-hosted application and ships with sensible default settings so it can run out of the box.

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/study-tracker.git
cd study-tracker
```

Start the application:

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Once the containers are running, open:

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

That's it. No additional configuration is required for local or private installations.

---

# Configuration

All application settings are externalized through environment variables and can be customized for advanced deployments.

## Backend Configuration

Configuration file:

```text
backend/.env.production
```

Example:

```env
JWT_SECRET=study-tracker-local-install
JWT_EXPIRES_IN=1d
MONGO_URI=mongodb://mongo:27017/study-tracker
PORT=3000
NODE_ENV=production
```

## Frontend Configuration

Configuration file:

```text
frontend/.env.production
```

Example:

```env
VITE_API_URL=http://localhost:5000
```

---

# Security Note

The default JWT secret is intentionally included in the repository to provide a zero-configuration self-hosted experience.

This is perfectly acceptable for:

- Local installations
- Home servers
- Personal use
- Private self-hosted deployments

If you plan to:

- Expose the application to the Internet
- Deploy it on a public server
- Use it as a multi-user SaaS application

you should replace the default JWT secret with a secure value before deployment.

Example:

```env
JWT_SECRET=your-long-random-secret-here
```

---

# Default Credentials

The application ships with a default administrator account:

```text
Username: admin
Password: admin
```

It is recommended to log in and create your own users or change pasword after installation.

---

# Updating

To update to the latest version:

```bash
git pull

docker compose -f docker-compose.prod.yml up -d --build
```

---

# Stopping the Application

```bash
docker compose -f docker-compose.prod.yml down
```

To stop the application and remove all data:

```bash
docker compose -f docker-compose.prod.yml down -v
```

⚠️ Warning: The `-v` option permanently removes the MongoDB database.