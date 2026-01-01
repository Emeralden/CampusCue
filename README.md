# CampusCue - A Full-Stack College Companion App
Welcome to the official monorepo for CampusCue, the all-in-one companion app designed for students at IIT Bhilai. This project demonstrates a complete, professional full-stack architecture, featuring a robust Python backend and a real-world React frontend client.
## Project Architecture
This project is structured as a monorepo, a modern development pattern that houses two distinct, self-contained applications in one repository:
### Backend (My Original Work)
The core of this project is a robust, scalable, and secure backend API built with FastAPI and SQLAlchemy. This is the brain of the application, responsible for all data management, business logic, and user authentication.
- Framework: FastAPI
- Database: SQLAlchemy with PostgreSQL (Production) & SQLite (Development)
- Security: JWT Token Authentication, Password Hashing with Passlib
- CI/CD: GitHub Actions for automated linting
- Deployment: Containerized and deployed live on Render

Key Achievement: This entire backend was built from the ground up to professional standards, demonstrating a deep, practical understanding of modern web architecture, database design and security practices.

### Frontend (Scaffolded Client)
The frontend is a React PWA, originally scaffolded using the Base44 platform. Its purpose in this repository is to serve as a real-world client to consume and demonstrate the power and functionality of the backend API I built.
