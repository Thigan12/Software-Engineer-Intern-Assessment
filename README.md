# Full-Stack Assessment - User Authentication & User CRUD

A minimal, robust full-stack application built for the Software Engineer Intern Assessment. It features secure JWT authentication stored in HTTP-only cookies and user CRUD functionality.

## Tech Stack
- **Frontend**: Next.js (App Router), Tailwind CSS
- **Backend**: NestJS
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT stored in HTTP-only cookies (Bcrypt password hashing)

## Repository Structure
```text
.
├── backend/          # NestJS API application
│   ├── src/          # Modules (Auth, Users), Guards, Schemas
│   └── .env.example
├── frontend/         # Next.js frontend application
│   ├── src/          # Pages (/register, /login, /dashboard), UI components
│   └── .env.example
├── .gitignore
└── README.md
```

## Live Deployment Links
- **Frontend (Vercel)**: [https://software-engineer-intern-assessment.vercel.app](https://software-engineer-intern-assessment.vercel.app)
- **Backend (Render)**: [https://software-engineer-intern-assessment.onrender.com](https://software-engineer-intern-assessment.onrender.com)

## Local Development Setup

### Prerequisites
- Node.js (v18+ or v20+)
- npm

### 1. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET in .env
npm install --legacy-peer-deps
npm run start:dev
```
Backend will be available on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env.local
npm install --legacy-peer-deps
npm run dev
```
Frontend will be available on `http://localhost:3000`.
