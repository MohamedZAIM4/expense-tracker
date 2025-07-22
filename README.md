# Expense Tracker

## Overview

Expense Tracker is a full-featured web application to manage your expenses, categories, and visualize your statistics. The project is split into a backend (NestJS/Prisma/PostgreSQL) and a frontend (Next.js/React).

---

## Main Features

- Secure authentication (JWT)
- Category management (CRUD)
- Expense management (CRUD)
- Dashboard with charts and summaries
- CSV/PDF export
- 100% French user interface (can be adapted)

---

## Project Structure

```
expense-tracker/
  backend/    # NestJS + Prisma API (see backend/README.md for details)
  frontend/   # Next.js/React app (see frontend/README.md for details)
```

---

## Installation

1. **Clone the project**

   ```bash
   git clone <repo-url>
   cd expense-tracker
   ```

2. **Install dependencies**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure the database**

   - Edit `backend/.env` with your PostgreSQL URL
   - Run Prisma migrations:
     ```bash
     cd backend
     npx prisma migrate dev
     ```

4. **Start the backend**

   ```bash
   cd backend
   npm run start:dev
   ```

5. **Start the frontend**

   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the app**
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend: [http://localhost:3000](http://localhost:3000)

---

## Development Tips

- Always start the backend before the frontend to avoid CORS issues.
- Default ports: 3000 (API) and 3001 (frontend).
- JWT tokens are stored in localStorage on the client.

---

## More Information

- For backend API details, see `backend/README.md`.
- For frontend usage and customization, see `frontend/README.md`.

---

## Contribution

Contributions are welcome!

---

## License

This project is open-source.
