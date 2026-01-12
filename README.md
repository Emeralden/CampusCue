# CampusCue - A Full-Stack College Companion App

Welcome to the official repository for CampusCue, the all-in-one companion app designed for students at IIT Bhilai. This project showcases a complete, professional-grade application featuring a robust Python backend built from scratch and a real-world React frontend client.

---

## Project Architecture

This repository is structured as a **Full-Stack Project** with a clear separation of concerns between the backend API and the frontend client, even though they coexist in this single repository for ease of management.

*   `./CampusCueAPI/`: The **Brain**. A secure, scalable FastAPI application. This is my original work.
*   `./frontend/`: The **Body**. A React-based PWA that serves as a dynamic, user-facing client for the API.

---

## The Backend (My Original Work)

The core of this project is a professional-grade backend API built from the ground up with **FastAPI** and **SQLAlchemy**. This is the application's single source of truth, handling all data management, business logic, and security.

### Key Features Implemented:

*   **Secure User Authentication:** Complete registration and login system featuring a **seamless session refresh** mechanism using short-lived Access Tokens (JWT) and long-lived,       securely stored Refresh Tokens, using industry-standard password hashing (`passlib`) and JWTs (`python-jose`).
*   **Personalized, Relational Data:** Architected a normalized database schema with **PostgreSQL** (Production) and **SQLite** (Dev) that powers all user-specific features,         including:
    *   A **Course Subscription System** allowing users to select elective courses, complete with backend clash detection.
    *   A complex **Class Schedule System** with date-based user overrides.
    *   A dynamic **Mess Menu System** with user-specific dietary and cycle preferences (`veg`/`non-veg`).
    *   A personal **Satisfaction Logger** ("Hustle Meter").
*   **Professional-Grade Logging:** A multi-environment, structured logging system (using JSON and `rich`) with correlation IDs for robust production debugging.
*   **Automated CI:** A **GitHub Actions** workflow ensures code quality with automated linting (`ruff`) on every push.
*   **Live Cloud Deployment:** The entire application is deployed as a live web service on **Render**.

### My Key Achievement:

This entire backend was architected and built by me from scratch, demonstrating a deep, practical understanding of modern web architecture, complex database design, API security, and end-to-end DevOps principles.

---

## The Frontend (Scaffolded & Refactored Client)

The frontend is a **React PWA**, originally scaffolded using the Base44 platform. Its role in this project is to serve as a tangible, real-world client that consumes and showcases the power of the backend API I built.

**My Contribution:** 
*   **Full API Integration:** I integrated the frontend with the backend by implementing all the necessary API calls, transforming it from a static mock-up into a dynamic, data-driven application.
*   **UX/UI Redesign:** I personally redesigned the entire navigation flow, de-cluttering the UI and implementing a more intuitive, context-aware user experience.
*   **Native Mobile Deployment:** Packaged the entire React application into a native **Android App** using **Capacitor** and set up a private beta distribution channel using **Firebase App Distribution**.

---

## Technology Stack

| Area      | Technology                                           |
| :-------- | :--------------------------------------------------- |
| **Backend** | Python, FastAPI, SQLAlchemy, PostgreSQL, SQLite, Pydantic |
| **Frontend**  | React, Vite, Tailwind CSS, TanStack Query, Framer Motion |
| **DevOps**    | Git, GitHub Actions (CI), Render (Deployment), Capacitor, Firebase |
| **Security**  | JWT, Refresh tokens, Passlib (bcrypt), CORS Middleware               |

---
