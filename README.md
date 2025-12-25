# CampusCue - A Full-Stack College Companion App
Welcome to the official monorepo of CampusCue, the all-in-one companion app for students at IIT Bhilai. This repository contains the complete source code for Python backend and React frontend.
## Project Architecture
This project is structured as a monorepo, containing two distinct self-contained applications:
### Backend (My Work)
The core of this project is a robust, scalable, and secure backend API built with FastAPI. This is the brain of the application, responsible for all data management, business logic, and user authentication.
- Framework: FastAPI
- Database: SQLAlchemy with PostgreSQL (Production) & SQLite (Development)
- Security: JWT Token Authentication, Password Hashing with Passlib
- CI/CD: GitHub Actions for automated linting

Key Achievement: This entire backend was built from the ground up to professional standards, demonstrating a deep understanding of modern web architecture.

### Frontend (Scaffolded)
The frontend is a React-based and is originally scaffolded using the Base44 platform. Its purpose in this repository is to serve as a real-world client to consume and demonstrate the power of the backend API.
- Framework: React

Key Role: Acts as the "body" to the backend "brain," making live API calls for all data.
