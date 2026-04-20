# ✦ AUCA Student Mentorship Portal

> *"As iron sharpens iron, so one person sharpens another."*
> — **Proverbs 27:17**

---

<div align="center">

**Student:** Confiance UFITAMAHORO &nbsp;|&nbsp; **ID:** 27185 &nbsp;|&nbsp; **AUCA, Rwanda**

**Course:** Best Programming Practices and Design Patterns

**Instructor:** RUTARINDWA JEAN PIERRE &nbsp;|&nbsp; **Academic Year:** 2026–2027

</div>

---

## 📖 Overview

The **AUCA Student Mentorship Portal** is a full-stack web application that bridges the gap between junior students (mentees) and senior students or lecturers (mentors) at the Adventist University of Central Africa. The system enables structured academic mentorship by allowing mentees to discover available mentors, book one-on-one sessions, and provide feedback after sessions are completed.

The portal operates with three distinct user roles — **Mentee**, **Mentor**, and **Admin** — and manages the entire mentorship lifecycle from mentor application and approval, through session scheduling, to post-session feedback and performance tracking.

---

## 🛠️ Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Frontend | React + Vite | 18.2 / 5.0 | User Interface & Client-side routing |
| Backend | Node.js + Express | 20 / 4.18 | REST API & Business Logic |
| Database | PostgreSQL | 15 | Persistent data storage |
| Authentication | JWT + bcrypt | 9.0 / 5.1 | Secure login & password hashing |
| Containerization | Docker + Compose | Latest | Consistent deployment environment |
| Testing | Jest + Supertest | 29.7 / 6.3 | Unit and integration testing |

---

## 📁 Project Structure

```
AUCA-Student-Mentorship-Portal/
├── backend/
│   └── src/
│       ├── config/         # PostgreSQL connection pool (Singleton)
│       ├── controllers/    # Business logic (MVC Controller layer)
│       ├── middlewares/    # JWT auth + global error handler
│       ├── models/         # Database queries (Repository pattern)
│       ├── routes/         # API endpoint definitions
│       ├── utils/          # Shared helper functions (DRY)
│       ├── app.js          # Express app setup
│       └── server.js       # HTTP server entry point
├── frontend/
│   └── src/
│       ├── components/     # Navbar, MentorCard, SessionCard
│       ├── context/        # AuthContext (Context API pattern)
│       ├── pages/          # Login, Register, Dashboard, Mentors, Sessions, Feedback
│       ├── services/       # Centralized API service (api.js)
│       └── styles/         # Premium CSS (Navy + Gold theme)
├── database/
│   ├── schema.sql          # Table definitions and indexes
│   └── seed.sql            # Initial test data
├── tests/
│   ├── unit/               # auth, session, feedback unit tests
│   └── integration/        # auth, session integration tests
├── diagrams/               # UML diagrams (PlantUML)
├── docs/                   # Project documentation
├── Dockerfile              # Backend container definition
├── docker-compose.yml      # Multi-service orchestration
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15
- Docker + Docker Compose (optional)

### Option 1 — Manual Setup

```bash
# 1. Clone the repository
git clone https://github.com/confiance22/AUCA-Student-Mentorship-Portal.git
cd AUCA-Student-Mentorship-Portal

# 2. Setup the database
psql -U postgres -c "CREATE DATABASE mentorship_portal;"
psql -U postgres -d mentorship_portal -f database/schema.sql
psql -U postgres -d mentorship_portal -f database/seed.sql

# 3. Start the backend
cd backend
npm install
npm run dev

# 4. Start the frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open your browser at `http://localhost:5173`

### Option 2 — Docker Setup

```bash
# Build and start all containers
docker-compose up --build

# Verify containers are running
docker ps
```

API will be available at `http://localhost:5000`

---

## 🔑 Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@auca.ac.rw | password123 |
| Mentor | jeanpaul@auca.ac.rw | password123 |
| Mentor | alice@auca.ac.rw | password123 |
| Mentee | bob@auca.ac.rw | password123 |

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Role | Description |
|---|---|---|---|---|
| POST | /api/auth/register | Public | Any | Register as mentee or mentor |
| POST | /api/auth/login | Public | Any | Login and receive JWT token |
| GET | /api/auth/me | Required | Any | Get current authenticated user |
| GET | /api/users/mentors | Required | Any | List all approved mentors |
| GET | /api/users/pending | Required | Admin | List pending mentor applications |
| GET | /api/users | Required | Admin | Get all users in the system |
| PATCH | /api/users/:id/approve | Required | Admin | Approve or reject a mentor |
| PUT | /api/users/profile | Required | Any | Update own profile |
| POST | /api/sessions | Required | Mentee | Book a new session |
| GET | /api/sessions | Required | Any | Get sessions for logged-in user |
| PATCH | /api/sessions/:id/status | Required | Mentor/Admin | Update session status |
| POST | /api/feedback | Required | Mentee | Submit feedback for a session |
| GET | /api/feedback/mentor/:id | Required | Any | Get feedback for a mentor |
| GET | /api/feedback | Required | Admin | Get all feedback in the system |

---

## 🎨 Design Patterns Applied

| Pattern | Where Applied | Description |
|---|---|---|
| **MVC** | Entire backend | Models, Controllers, Routes cleanly separated |
| **Singleton** | config/db.js | Single PostgreSQL connection pool shared across all models |
| **Repository** | All Model files | All DB queries encapsulated in model objects |
| **Middleware Chain** | app.js | CORS → JSON → Auth → Controller → Error Handler |
| **Context API** | AuthContext.jsx | Global auth state without prop drilling |
| **Guard Clause** | All controllers | Early return validation for clean, readable code |

---

## 🧪 Running Tests

```bash
cd backend
npm install

# Run all tests
npm test

# Run unit tests only
npx jest tests/unit/ --verbose

# Run integration tests only
npx jest tests/integration/ --verbose

# Run with coverage report
npx jest --coverage
```

### Test Results Summary

| Category | Total | Passed | Pass Rate |
|---|---|---|---|
| Unit Tests | 12 | 12 | 100% |
| Integration Tests | 5 | 5 | 100% |
| **TOTAL** | **17** | **17** | **100%** |

---

## 🐳 Docker Configuration

The application is fully containerized with two services:

- **mentorship_db** — PostgreSQL 15 database with automatic schema and seed initialization
- **mentorship_api** — Node.js Express backend API

```bash
# Start containers
docker-compose up --build

# Stop containers
docker-compose down

# View logs
docker logs mentorship_api
docker logs mentorship_db
```

---

## 🔀 Git Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `feature/auth-system` | JWT authentication and role-based access |
| `feature/mentors` | Mentor profile and approval workflow |
| `feature/session-management` | Session booking and status management |
| `feature/feedback-system` | Feedback submission and rating system |
| `feature/frontend-ui` | React frontend pages and components |
| `feature/docker-setup` | Dockerfile and docker-compose configuration |
| `feature/tests` | Unit and integration test suites |

---

## 📚 References

- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
- [Docker Documentation](https://docs.docker.com)
- [Jest Testing Framework](https://jestjs.io)
- Gamma, E. et al. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software.* Addison-Wesley.

---

<div align="center">

*"Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."*

**— Colossians 3:23**

---

*Developed with dedication for the glory of God and the advancement of education at AUCA.*

**Confiance UFITAMAHORO | Student ID: 27185 | AUCA, Rwanda | 2026**

</div>