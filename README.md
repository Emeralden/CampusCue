# CampusCue - A Full-Stack College Companion App

Welcome to the official repository for CampusCue, the all-in-one companion app designed for students at IIT Bhilai. This project showcases a complete, professional-grade application featuring a robust Python backend built from scratch and a real-world React frontend client.

---

## Project Architecture

This repository is structured as a **Full-Stack Project** with a clear separation of concerns between the backend API and the frontend client, even though they coexist in this single repository for ease of management.

*   `./CampusCueAPI/`: The **Brain**. A secure, scalable FastAPI application. This is my original work.
*   `./frontend/`: The **Body**. A React-based PWA that serves as a dynamic client for the API.

---

## The Backend (My Original Work)

The core of this project is a professional-grade backend API built from the ground up with **FastAPI** and **SQLAlchemy**. This is the application's single source of truth, handling all data management, business logic, and security.

### Key Features Implemented:

*   **Secure User Authentication:** Full registration and login system using industry-standard password hashing (`passlib`) and JWTs (`python-jose`).
*   **Database Integration:** Seamlessly connected to **PostgreSQL** (Production) and **SQLite** (Development), architected with SQLAlchemy Core for precise query control.
*   **Personalized Data Endpoints:** Implemented a suite of protected, user-specific endpoints, including:
    *   A dynamic **Mess Menu System** with user-specific cycle preferences.
    *   A complex **Class Schedule System** with date-based user overrides.
    *   A personal **Satisfaction Logger** ("Hustle Meter").
*   **Professional-Grade Logging:** A multi-environment, structured logging system (using JSON and `rich`) with correlation IDs for robust production debugging.
*   **Automated CI:** A **GitHub Actions** workflow ensures code quality with automated linting (`ruff`) on every push.
*   **Live Cloud Deployment:** The entire application is deployed as a live web service on **Render**.

### My Key Achievement:

This entire backend was architected and built by me from scratch, demonstrating a deep, practical understanding of modern web architecture, database design, API security, and DevOps principles.

---

## The Frontend (Scaffolded & Refactored Client)

The frontend is a **React PWA**, originally scaffolded using the Base44 platform. Its role in this project is to serve as a tangible, real-world client that consumes and showcases the power of the backend API I built.

**My Contribution:** All original hardcoded data and business logic were surgically removed from the frontend. I then integrated it with the backend by implementing all the necessary API calls, transforming it from a static mock-up into a dynamic, data-driven application.

---

## Technology Stack

| Area      | Technology                                           |
| :-------- | :--------------------------------------------------- |
| **Backend** | Python, FastAPI, SQLAlchemy, PostgreSQL, SQLite, Pydantic |
| **Frontend**  | React, Vite, Tailwind CSS, TanStack Query, Framer Motion |
| **DevOps**    | Git, GitHub Actions (CI), Render (Deployment), Capacitor |
| **Security**  | JWT, Passlib (bcrypt), CORS Middleware               |

---
