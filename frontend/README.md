# Expense Tracker – Frontend

## Overview

This is the frontend for the Expense Tracker application, designed to help individuals manage and visualize their personal expenses. The app is intuitive, mobile-friendly, and allows users to record expenses, manage categories, and view summaries with export options.

## Tech Stack & Rationale

- **Next.js**: (Imposed by project requirements) Modern React-based framework, fast development, built-in routing, SSR/SSG support, and great developer experience.
- **React Query**: Efficiently manages server state, caching, and background updates, making API data handling robust and simple.
- **CSS Modules**: Ensures style encapsulation, avoids global CSS conflicts, and keeps styles maintainable as the app grows.
- **jsPDF**: Enables client-side PDF export of expenses, providing users with offline and shareable reports without backend processing.

## Features

- **Authentication**: Secure login/register with JWT token management (see backend for details).
- **Expense Management**: Add, edit, and delete expenses with amount, category, date, and description.
- **Category Management**: Create, edit, and delete custom categories.
- **Dashboard**: Visual summary of expenses by category and by month, with charts for better insights.
- **Export**: Download expenses as CSV or PDF for external use.
- **Responsive Design**: Fully mobile-friendly interface.

## Folder Structure

- `src/pages/` – Main pages: `dashboard.tsx`, `expenses.tsx`, `categories.tsx`, `login.tsx`, `register.tsx`.
- `src/components/` – Reusable UI components: `Navigation`, `ExpenseForm`, `CategoryForm`, etc.
- `src/api/` – API abstraction for backend communication (handles JWT, error handling, etc).
- `src/styles/` – CSS Modules for each page/component.

## Why These Approaches?

- **Next.js**: Enables fast navigation, SEO, and easy deployment. SSR/SSG is not strictly required here, but Next.js offers flexibility for future needs.
- **React Query**: Handles API state, caching, and revalidation automatically, reducing boilerplate and improving UX.
- **CSS Modules**: Keeps styles local to components, making collaboration and scaling easier.
- **jsPDF**: Allows PDF export directly in the browser, no server-side rendering or extra backend logic needed.

## Setup & Usage: As recommendation you should run backend first (if not you should modify the CORS port)

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   ```
3. **Open** [http://localhost:3001](http://localhost:3001) in your browser.

## API Communication

- All API calls are made to the backend (NestJS) using fetch/axios wrappers in `src/api/`.
- JWT token is stored in localStorage and sent with each request for authentication.

## Improvements & Extensions

- Add more advanced charts (e.g., pie/bar charts with recharts or chart.js).
- Enhance PDF export with tables, multi-page support, and custom branding.
- Add notifications, reminders, or budget limits.
- Support for multi-user/family budgets.

## Development Recommendations

**CORS & Startup Order:**

- To avoid CORS issues during development, always start the backend server first (it runs on port 3000 by default).
- Then start the frontend. Next.js will automatically use port 3001 (as configured).
- This ensures that API requests from the frontend to the backend are properly proxied and CORS errors are avoided.
