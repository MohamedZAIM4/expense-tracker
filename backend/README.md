# Expense Tracker – Backend

## Overview

This is the backend for the Expense Tracker application, providing a secure and scalable REST API for managing users, categories, and expenses. The backend is built with NestJS, uses Prisma as ORM, and implements JWT authentication for robust security.

## Tech Stack & Rationale

- **NestJS**: (Imposed by project requirements) A progressive Node.js framework that enforces modular architecture, strong typing with TypeScript, and maintainability. Chosen for its scalability and clear separation of concerns.
- **Prisma**: Modern ORM for Node.js and TypeScript. Chosen for its type safety, migration system, and ease of use with relational databases.
- **JWT (JSON Web Token)**: Used for stateless, secure authentication. Chosen because it allows scalable, RESTful APIs without server-side session storage.
- **PostgreSQL** (Imposed by project requirements): Reliable, production-ready relational database.

## Features

- **Authentication**: Register, login, and JWT-based authentication. Guards protect all sensitive endpoints.
- **Category Management**: CRUD operations for user-defined categories.
- **Expense Management**: CRUD operations for expenses, summary endpoints (by category, by month), and CSV export.
- **Validation & Security**: DTO validation, guards, and best practices for API security.

## Folder Structure

- `src/auth/` – JWT strategy, guards, authentication controller and service.
- `src/categories/` – Category controller, service, DTOs.
- `src/expenses/` – Expense controller, service, DTOs, summary and export logic.
- `src/prisma/` – Prisma service and module for database access.
- `src/app.module.ts` – Main application module.

## Why These Approaches?

- **NestJS**: Modular, testable, and maintainable. Encourages best practices and is widely adopted in the Node.js ecosystem.
- **Prisma**: Strong typing, easy migrations, and developer-friendly query syntax. Reduces runtime errors and speeds up development.
- **JWT**: Stateless, scalable, and secure. Works seamlessly with frontend frameworks and mobile apps.

## Setup & Usage

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Configure your database** (see `prisma/schema.prisma`).
3. **Run migrations**:
   ```bash
   npx prisma migrate dev
   ```
4. **Start the development server**:
   ```bash
   npm run start:dev
   ```
5. **Run tests**:
   ```bash
   npm run test
   npm run test:e2e
   ```

## API Overview

- **Auth**: `/auth/register`, `/auth/login` (returns JWT)
- **Categories**: `/categories` (CRUD, protected)
- **Expenses**: `/expenses` (CRUD, summary, export, protected)
- **Guards**: All sensitive routes require a valid JWT in the `Authorization` header.

## Improvements & Extensions

- Add more advanced analytics endpoints (e.g., custom time ranges).
- Add PDF export (currently only CSV is implemented in backend; PDF is handled in frontend).
- Add support for family/multi-user budgets.
- Add notifications, reminders, or recurring expenses.

## Future Propositions

- **Email Verification**: Implement email verification during user registration to enhance security and trust.
- **Additional Functionalities**: Add features such as password reset, user profile management, notifications, recurring expenses, and advanced analytics.
- **Family/Multi-user Budgets**: Support for shared budgets and collaborative expense tracking.

## Development Recommendations

**CORS & Startup Order:**

- To avoid CORS issues during development, always start the backend server first (it runs on port 3000 by default).
- Then start the frontend. Next.js will automatically use port 3001 (MAKE SURE THAT THE PORT 3001 IS FREE )
- This ensures that API requests from the frontend to the backend are properly proxied and CORS errors are avoided.
