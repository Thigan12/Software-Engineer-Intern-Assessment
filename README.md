# Software Engineer Intern Assessment - User Auth & CRUD

A minimal full-stack application with user authentication and user CRUD operations, built with Next.js, NestJS, and MongoDB Atlas.

---

## Live Deployment Links

- **Frontend (Vercel):** [https://software-engineer-intern-assessment.vercel.app](https://software-engineer-intern-assessment.vercel.app)
- **Backend (Render):** [https://software-engineer-intern-assessment.onrender.com](https://software-engineer-intern-assessment.onrender.com)

---

## Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** NestJS, TypeScript, Express adapter
- **Database:** MongoDB Atlas with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-only cookies, password hashing with bcrypt

---

## Features

- **Authentication:**
  - Register with name, email, and password (hashed with bcrypt, salt rounds: 10).
  - Login with credentials, issuing a signed JWT stored as an HTTP-only cookie.
  - Logout clears the cookie and terminates the session.
  - Route protection using NestJS `JwtAuthGuard` on the backend and Next.js `middleware.ts` on the frontend.
- **User CRUD (Scoped):**
  - View all registered users in a directory table (`GET /users`).
  - View single user details in a popup modal by clicking any table row (`GET /users/:id`).
  - Edit own profile name and email (`PATCH /users/me`).
  - Delete own account with confirmation (`DELETE /users/me`).

---

## Assumptions & Design Decisions

1. **Scoped User Operations:** Per the prompt requirements, no complex role-based access control (RBAC) was needed. Users can view the full directory of registered members, but updates and account deletions are strictly scoped to the logged-in user via `/users/me`.
2. **Cross-Domain Cookie Security:** Because the frontend is deployed on Vercel (`.vercel.app`) and the backend on Render (`.onrender.com`), cookies are configured with `SameSite=None; Secure=true` in production to allow cross-domain transmission. In development, it falls back to `SameSite=Lax`.
3. **Sensitive Data Protection:** The Mongoose schema explicitly excludes passwords (`password: { select: false }`), and the `toJSON` transform removes password and internal version keys to ensure hashes are never exposed in responses.
4. **Next.js Middleware & Session Handling:** To protect `/dashboard` at the edge while the backend cookie resides on a different domain, a lightweight session cookie is synced upon login/register, allowing Next.js `middleware.ts` to redirect unauthenticated visitors server-side before page render.
5. **Input Validation:** Request bodies are validated using `class-validator` and NestJS global `ValidationPipe` with `whitelist: true` to prevent unwanted fields from being injected.

---

## Project Structure

```text
.
├── backend/                  # NestJS API
│   ├── src/
│   │   ├── auth/             # Auth module, service, controller, JWT strategy & guard
│   │   ├── users/            # Users module, service, controller, schema, DTOs
│   │   ├── app.module.ts     # Root module with MongoDB connection
│   │   └── main.ts           # CORS, cookie-parser, validation setup
│   ├── .env.example
│   └── package.json
├── frontend/                 # Next.js App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/        # Login page
│   │   │   ├── register/     # Register page
│   │   │   └── dashboard/    # Dashboard page
│   │   ├── components/       # UI components (Navbar, UserTable, Modals)
│   │   ├── context/          # AuthContext for session management
│   │   ├── lib/              # API fetch client (credentials: 'include')
│   │   └── middleware.ts     # Route protection middleware
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Local Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm
- MongoDB Atlas account or local MongoDB instance

---

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
```

Fill in your `.env` variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Install dependencies and start the dev server:
```bash
npm install --legacy-peer-deps
npm run start:dev
```
Backend will run at `http://localhost:5000`.

---

### 2. Frontend Setup

```bash
cd frontend
cp .env.example .env.local
```

Fill in your `.env.local` variable:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Install dependencies and start the dev server:
```bash
npm install --legacy-peer-deps
npm run dev
```
Frontend will run at `http://localhost:3000`.
