# CampusCue - A Full-Stack College Companion App


[![Live App](https://img.shields.io/badge/Live-App-brightgreen?style=for-the-badge)](https://campuscue-web.vercel.app/)

<img width="1354" height="485" alt="Airbrush-image-extender" src="https://github.com/user-attachments/assets/003a59e0-312e-497d-b024-4bb06a74ec65" />


Welcome to the official repository for CampusCue, the all-in-one companion app designed for students at IIT Bhilai. This project showcases a complete, professional-grade application featuring a robust Python backend built from scratch and a real-world React frontend client.

---

## Project Architecture

This repository is structured as a **Full-Stack Project** with a clear separation of concerns between the backend API and the frontend client, even though they coexist in this single repository for ease of management.

*   `./backend-fastapi/`: FastAPI backend (Python)
*   `./backend-node/`: Express backend (Node.js)
*   `./shared/`: Shared seed data (Menu + Schedule)
*   `./frontend/`: The **Body**. A React-based PWA that serves as a dynamic, user-facing client for the API.

---

## The Backend v1 - FastAPI

The core of this project is a professional-grade backend API built from the ground up with **FastAPI** and **SQLAlchemy**. This is the application's single source of truth, handling all data management, business logic, and security.

[![FastAPI Docs](https://img.shields.io/badge/API-Docs-blue?style=for-the-badge)](https://campuscue-f.onrender.com/docs)

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

---

### Backend v2 — Node.js Rewrite
The entire backend was later **rewritten in Node.js/Express** and migrated from PostgreSQL/SQLite to **MongoDB Atlas**, as a deliberate technical exercise in language migration, NoSQL schema design, and full-stack refactoring.
*   **Runtime:** Node.js with Express.js
*   **Database:** MongoDB Atlas via Mongoose (ODM)
*   **Auth:** JWT + Argon2
*   **Architecture:** Same REST API surface, rewritten from scratch with Mongoose schemas, middleware-based auth, and an idempotent seed pipeline reading from shared JSON data files
*   **Deployment:** Live on Render

### My Key Achievement:

This entire backend was architected and built by me from scratch, demonstrating a deep, practical understanding of modern web architecture, complex database design, API security, and end-to-end DevOps principles.

---

## The Frontend

The frontend is a React PWA built with React, Vite, and Tailwind CSS. All application logic, architecture, backend integration, and productionization were designed and implemented by me.

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
| **Backend** | Python, FastAPI, SQLAlchemy, PostgreSQL (v1) · Node.js, Express, MongoDB, Mongoose (v2) |
| **Frontend**  | React, Vite, Tailwind CSS, TanStack Query, Framer Motion |
| **DevOps**    | Git, GitHub Actions (CI), Render (Deployment), Capacitor, Firebase |
| **Security**  | JWT, Refresh tokens, Passlib (bcrypt), CORS Middleware |

---
