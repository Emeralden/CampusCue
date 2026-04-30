# CampusCue - A Full-Stack College Companion App


[![Live App](https://img.shields.io/badge/Live-App-brightgreen?style=for-the-badge)](https://campuscue-web.vercel.app/)
[![API Docs](https://img.shields.io/badge/API-Docs-blue?style=for-the-badge)](https://campuscue.onrender.com/docs)

<img width="1354" height="485" alt="Airbrush-image-extender" src="https://github.com/user-attachments/assets/003a59e0-312e-497d-b024-4bb06a74ec65" />


Welcome to the official repository for CampusCue, the all-in-one companion app designed for students at IIT Bhilai. This project showcases a complete, professional-grade application featuring a robust Python backend built from scratch and a real-world React frontend client.

---

## Project Architecture

This repository is structured as a **Full-Stack Project** with a clear separation of concerns between the backend API and the frontend client, even though they coexist in this single repository for ease of management.

*   `./CampusCueAPI/`: The **Brain**. A secure, scalable FastAPI application. This is my original work.
*   `./frontend/`: The **Body**. A React-based PWA that serves as a dynamic, user-facing client for the API.

---

## The Backend

The core of this project is a professional-grade backend API built from the ground up with **FastAPI** and **SQLAlchemy**. This is the application's single source of truth, handling all data management, business logic, and security.

### Key Features Implemented:

*   **Secure User Authentication:** Complete registration and login system featuring a **seamless session refresh** mechanism using short-lived Access Tokens (JWT) and long-lived,       securely stored Refresh Tokens, using industry-standard password hashing (`passlib`) and JWTs (`python-jose`).
*   **Personalized, Relational Data:** Architected a normalized database schema with **PostgreSQL** (Production) and **SQLite** (Dev) that powers all user-specific features,         including:
    *   A **Course Subscription System** allowing users to select elective courses (both during onboarding and from settings), complete with backend clash detection.
    *   A complex **Class Schedule System** with date-based user overrides.
    *   A dynamic **Mess Menu System** with user-specific dietary preferences (`veg`/`non-veg`/`eggetarian`) and bi-weekly cycle selection, complete with **smart cycle-toggle reminders**.
    *   A personal **Satisfaction Logger** ("Hustle Meter").
*   **Professional-Grade Logging:** A multi-environment, structured logging system (using JSON and `rich`) with correlation IDs for robust production debugging.
*   **Automated CI:** A **GitHub Actions** workflow ensures code quality with automated linting (`ruff`) on every push.
*   **Live Cloud Deployment:** The entire application is deployed as a live web service on **Render**.

### My Key Achievement:

This entire backend was architected and built by me from scratch, demonstrating a deep, practical understanding of modern web architecture, complex database design, API security, and end-to-end DevOps principles.

---

## The Frontend

The frontend is a **React PWA** whose initial visual scaffolding and component styling were accelerated using LLM-assisted generation. Then, the application logic, architecture, integration, and productionization were implemented and refined by me.

### My Contributions:

* **Full Backend Integration:** Implemented and connected all frontend API interactions, transforming the UI from static mockups into a fully functional, data-driven application.
* **Frontend Engineering:** Structured client-side state management, asynchronous data fetching, authentication flows, token refresh handling, and protected routing.
* **UX/UI Redesign & Refinement:** Reworked the navigation flow, decluttered screens, improved responsiveness, and redesigned several interaction patterns for a cleaner and more intuitive user experience.
* **PWA & Mobile Packaging:** Configured the application as a Progressive Web App and packaged it into a native **Android app** using **Capacitor**.
* **Deployment & Distribution:** Set up deployment pipelines and distributed mobile beta builds through **Firebase App Distribution**.

---

## Technology Stack

| Area      | Technology                                           |
| :-------- | :--------------------------------------------------- |
| **Backend** | Python, FastAPI, SQLAlchemy, PostgreSQL, SQLite, Pydantic |
| **Frontend**  | React, Vite, Tailwind CSS, TanStack Query, Framer Motion |
| **DevOps**    | Git, GitHub Actions (CI), Render (Deployment), Capacitor, Firebase |
| **Security**  | JWT, Refresh tokens, Passlib (bcrypt), CORS Middleware               |

---
