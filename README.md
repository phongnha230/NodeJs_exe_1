# TaskFlow – Task & Team Management Web Application

> **Assignment 1:** Technical Foundation, Prisma ORM, PostgreSQL Database & Vercel Deployment.

---

## 📌 Project Overview
TaskFlow is a modern Task & Team Management application designed to demonstrate a robust fullstack architecture. It is built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM** connected to a cloud-hosted **PostgreSQL database on Supabase**.

### Key Features (Assignment 1)
- **Public Task CRUD:** Visitors can create, view, update status/priority/details, and delete tasks without authentication.
- **Client-Side Validation & Filtering:** Instant filtering by Status (`TODO`, `IN_PROGRESS`, `DONE`), Priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and title/description search.
- **Metric Dashboard:** Live summary cards displaying task distribution.
- **Clean Senior Architecture:** Separation of Concerns with dedicated `services/`, `hooks/`, `components/ui/`, and feature-based modules.
- **Teams Preview:** Placeholder page prepared for multi-tenant collaboration in Assignment 2.

---

## 🏛️ System Architecture

```mermaid
flowchart TD
    subgraph Client["Frontend Client (Browser)"]
        UI["React 19 Components (app/page.tsx)"]
        Hooks["Custom Hooks: useTasks & useTaskFilter"]
        Services["API Client: task.service.ts"]
        UI --> Hooks --> Services
    end

    subgraph Server["Next.js Backend Server (Vercel Serverless)"]
        Routes["Route Handlers: /api/tasks & /api/tasks/[id]"]
        PrismaClient["Prisma Client Singleton (lib/prisma.ts)"]
        Services -->|HTTP JSON REST| Routes
        Routes --> PrismaClient
    end

    subgraph Database["Supabase PostgreSQL Cloud"]
        Pooler["Transaction Pooler (Port 6543 - PgBouncer)"]
        Postgres[("PostgreSQL Database")]
        PrismaClient --> Pooler --> Postgres
    end
```

---

## 🗄️ Database Design (Entity-Relationship Diagram)

```mermaid
erDiagram
    User ||--o{ Team : "owns"
    User ||--o{ TeamMember : "belongs to"
    User ||--o{ Task : "assigned to"
    Team ||--o{ TeamMember : "has"
    Team ||--o{ Task : "contains"

    User {
        string id PK
        string name
        string email UK
        string password
        datetime createdAt
        datetime updatedAt
    }

    Team {
        string id PK
        string name
        string description
        string ownerId FK
        datetime createdAt
        datetime updatedAt
    }

    TeamMember {
        string id PK
        string teamId FK
        string userId FK
        Role role "OWNER | ADMIN | MEMBER"
        datetime joinedAt
    }

    Task {
        string id PK
        string title
        string description
        TaskStatus status "TODO | IN_PROGRESS | DONE"
        TaskPriority priority "LOW | MEDIUM | HIGH | URGENT"
        datetime dueDate
        string teamId FK "Nullable (Ass 1)"
        string assigneeId FK "Nullable (Ass 1)"
        datetime createdAt
        datetime updatedAt
    }
```

---

## 📂 Project Structure

```text
├── app/
│   ├── api/tasks/             # REST Route Handlers (GET, POST, PUT, DELETE)
│   ├── teams/                 # Teams placeholder (Assignment 2 preparation)
│   ├── globals.css            # Tailwind CSS styling
│   ├── layout.tsx             # Shared root layout (Navbar & Footer)
│   └── page.tsx               # Orchestrator Task Dashboard page
├── components/
│   ├── layout/                # Navbar, Footer
│   ├── tasks/                 # Feature: TaskStats, TaskCard, TaskList, TaskCreateForm, TaskEditModal
│   └── ui/                    # Reusable primitives: Button, Input, Select, Badge, Modal
├── hooks/                     # useTasks.ts, useTaskFilter.ts
├── lib/                       # prisma.ts (Singleton), utils.ts
├── prisma/
│   ├── migrations/            # Migration history
│   └── schema.prisma          # Database schema (4 models)
├── services/                  # task.service.ts
└── types/                     # task.ts, user.ts, team.ts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL instance (or free Supabase project)

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your Supabase connection strings:
```env
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### 3. Database Migration
```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment on Vercel
1. Push this repository to GitHub.
2. Import the project on [Vercel](https://vercel.com).
3. Set the Environment Variables (`DATABASE_URL` and `DIRECT_URL`) under **Settings > Environment Variables**.
4. Click **Deploy**.
