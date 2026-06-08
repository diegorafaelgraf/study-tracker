# Study Tracker

A web application designed to track study sessions, organize learning topics, and visualize learning progress over time.

## Preview

> Screenshots will be added soon.

![Dashboard](docs/screenshots/dashboard.png)
![Topics](docs/screenshots/topics.png)

## Why this project exists

Study Tracker started as a personal project to replace a large spreadsheet used to manage study sessions, track learning progress, and organize topics.

As the amount of information grew, maintaining everything in a spreadsheet became increasingly difficult. To solve that problem, I decided to build a dedicated application using React, NestJS, and MongoDB.

## Features

- Track study sessions and study time in minutes.
- Organize learning content by years, areas, and topics.
- Monitor progress on each topic.
- View study statistics and progress metrics.
- User authentication and authorization.
- Admin user management.
- Fully Dockerized environment.
- Easy local deployment with Docker Compose.

## User Roles

### Administrator

The application creates a default administrator account during the initial database seed process.

Current administrator capabilities:

- Create new users.
- Manage access to the application.

### User

Regular users can:

- Log study sessions.
- Organize areas and topics.
- Track learning progress.
- View study statistics and insights.

## Technologies

### Frontend

- React
- TypeScript
- React Query
- React Router
- CSS Modules
- Vite

### Backend

- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication

### Infrastructure

- Docker
- Docker Compose

## Architecture

```text
Frontend (React)
        |
        v
Backend API (NestJS)
        |
        v
MongoDB
```

## Getting Started

See the installation guide:

```text
docs/installation.md
```

## First Login

A default administrator account is automatically created when the application runs for the first time.

Default credentials:

```text
Username: admin
Password: admin
```

⚠️ It is strongly recommended to change these credentials after installation.

## Project Status

Study Tracker is currently in the MVP (Minimum Viable Product) stage and is actively used for daily study tracking and learning management.

## Roadmap

### Completed

- [x] User authentication
- [x] User management
- [x] Areas management
- [x] Study session tracking
- [x] Progress tracking
- [x] Statistics dashboard
- [x] Dockerized development environment
- [x] Dockerized production environment

### Planned

- [ ] UI/UX improvements

## Contributing

This project is currently maintained as a personal project. Suggestions, ideas, and bug reports are always welcome.

## Support the Project

If Study Tracker helps you stay organized and focused on your learning goals, consider supporting its development.

### Argentina 🇦🇷

☕ Cafecito: ** https://cafecito.app/diegograf

### International 🌎

🌎 PayPal: ** https://paypal.me/diegorafaelgraf

## License

This project is published for educational, learning, and portfolio purposes.