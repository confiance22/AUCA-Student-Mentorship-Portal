# AUCA Student Mentorship Portal

> **Student:** Confiance UFITAMAHORO | **ID:** 27185 | **AUCA, Rwanda**  
> **Course:** Best Programming Practices and Design Patterns

## Overview
A full-stack web application that connects junior students (mentees) with senior
students and lecturers (mentors) for academic and career guidance at AUCA.

## Tech Stack
| Layer    | Technology          |
|----------|---------------------|
| Frontend | React 18 + Vite     |
| Backend  | Node.js + Express   |
| Database | PostgreSQL 15       |
| Auth     | JWT (bcrypt)        |
| Docker   | Docker + Compose    |

## Quick Start

### Prerequisites
- Node.js 20+, PostgreSQL 15, Docker (optional)

### Manual Setup

```bash
# 1. Database
psql -U postgres -f database/schema.sql
psql -U postgres -d mentorship_portal -f database/seed.sql

# 2. Backend
cd backend && npm install && npm run dev

# 3. Frontend
cd frontend && npm install && npm run dev
```

### Docker Setup

```bash
docker-compose up --build
```

## Test Credentials (from seed.sql)
| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| Admin  | admin@auca.ac.rw       | password123 |
| Mentor | jeanpaul@auca.ac.rw    | password123 |
| Mentor | alice@auca.ac.rw       | password123 |
| Mentee | bob@auca.ac.rw         | password123 |

## API Endpoints

| Method | Endpoint                    | Auth        | Description                  |
|--------|-----------------------------|-------------|------------------------------|
| POST   | /api/auth/register          | Public      | Register mentee/mentor        |
| POST   | /api/auth/login             | Public      | Login                        |
| GET    | /api/auth/me                | Any         | Get current user              |
| GET    | /api/users/mentors          | Any         | List approved mentors         |
| GET    | /api/users/pending          | Admin       | Pending mentor applications   |
| PATCH  | /api/users/:id/approve      | Admin       | Approve/reject mentor         |
| POST   | /api/sessions               | Mentee      | Book a session                |
| GET    | /api/sessions               | Any         | Get my sessions               |
| PATCH  | /api/sessions/:id/status    | Mentor/Admin| Update session status         |
| POST   | /api/feedback               | Mentee      | Submit feedback               |
| GET    | /api/feedback/mentor/:id    | Any         | Get mentor feedback           |

## Running Tests
```bash
cd backend && npm test
```

## Design Patterns Used
- **MVC** — Models, Controllers, Routes separation
- **Singleton** — DB connection pool
- **Middleware chain** — Auth, error handling
- **Repository pattern** — Model objects encapsulate all DB queries
- **Context API** — Frontend auth state management"# AUCA-Student-Mentorship-Portal" 
