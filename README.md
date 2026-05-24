# TaskFlow — Project Management SaaS

A full-stack MERN project management application inspired by Jira and GoodDay Work. Modern, dark, glassmorphism UI with drag-and-drop Kanban, role-based access, analytics, and more.

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Redux Toolkit, React Router v6, Axios, Recharts, @hello-pangea/dnd, Lucide React, React Hot Toast

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Multer

---

## Features

- JWT authentication with Admin / Member roles
- Project CRUD with team assignment, priority, deadline, progress tracking
- Task CRUD with status, priority, assignees, due dates
- Kanban board with drag-and-drop across columns (Todo / In Progress / Review / Done)
- Dashboard with stat cards, pie chart, bar chart, weekly activity chart
- Team management — role toggling, member removal
- Comment system on tasks
- Responsive sidebar (collapsible desktop, hamburger mobile)
- Toast notifications, loading skeletons, empty states
- Search and filter on projects and tasks

---

## Project Structure

```
taskflow/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/      # Modal, Badge, Avatar, Skeleton, etc.
│   │   │   ├── dashboard/   # StatCard
│   │   │   ├── kanban/      # KanbanCard, KanbanColumn
│   │   │   ├── forms/       # ProjectForm, TaskForm
│   │   │   └── charts/      # TaskStatusChart, WeeklyChart, ProjectProgressChart
│   │   ├── pages/
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── dashboard/   # Dashboard
│   │   │   ├── projects/    # Projects, ProjectDetail
│   │   │   ├── tasks/       # Tasks, KanbanBoard
│   │   │   └── settings/    # Team, Settings
│   │   ├── layouts/         # AppLayout (sidebar + navbar)
│   │   ├── redux/           # Store + slices (auth, projects, tasks, users)
│   │   ├── services/        # Axios API services
│   │   ├── hooks/           # useAuth
│   │   ├── utils/           # helpers (formatDate, badges, etc.)
│   │   └── routes/          # ProtectedRoute
│   └── ...config files
│
└── server/                  # Express + MongoDB backend
    ├── config/              # db.js
    ├── controllers/         # authController, projectController, taskController, commentController, userController
    ├── middleware/          # auth.js (protect, authorize), errorHandler.js
    ├── models/              # User, Project, Task, Comment
    ├── routes/              # auth, projects, tasks, comments, users
    ├── utils/               # generateToken.js
    ├── uploads/             # File uploads folder
    ├── app.js
    └── server.js
```

---

## Setup & Running

### 1. Clone & install dependencies

```bash
# From root
cd server && npm install
cd ../client && npm install
```

### 2. Configure environment variables

**Server** — copy `server/.env.example` to `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** — copy `client/.env.example` to `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start development servers

```bash
# Terminal 1 — Backend
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Frontend: http://localhost:5173  
Backend API: http://localhost:5000/api

---

## Demo Accounts

Register two accounts via the UI or seed manually:

| Role   | Email                  | Password    |
|--------|------------------------|-------------|
| Admin  | admin@taskflow.com     | password123 |
| Member | member@taskflow.com    | password123 |

> **Admin** can create projects, manage users, assign tasks, view all data.  
> **Member** can view assigned tasks, update statuses, add comments.

---

## API Reference

### Auth
| Method | Endpoint             | Access  |
|--------|----------------------|---------|
| POST   | /api/auth/register   | Public  |
| POST   | /api/auth/login      | Public  |
| GET    | /api/auth/profile    | Private |
| PUT    | /api/auth/profile    | Private |

### Projects
| Method | Endpoint             | Access       |
|--------|----------------------|--------------|
| GET    | /api/projects        | Private      |
| GET    | /api/projects/:id    | Private      |
| POST   | /api/projects        | Admin only   |
| PUT    | /api/projects/:id    | Admin only   |
| DELETE | /api/projects/:id    | Admin only   |

### Tasks
| Method | Endpoint          | Access   |
|--------|-------------------|----------|
| GET    | /api/tasks        | Private  |
| GET    | /api/tasks/stats  | Private  |
| GET    | /api/tasks/:id    | Private  |
| POST   | /api/tasks        | Private  |
| PUT    | /api/tasks/:id    | Private  |
| DELETE | /api/tasks/:id    | Private  |

### Comments
| Method | Endpoint                 | Access  |
|--------|--------------------------|---------|
| GET    | /api/comments/:taskId    | Private |
| POST   | /api/comments            | Private |
| DELETE | /api/comments/:id        | Private |

### Users
| Method | Endpoint              | Access     |
|--------|-----------------------|------------|
| GET    | /api/users            | Private    |
| PUT    | /api/users/:id/role   | Admin only |
| DELETE | /api/users/:id        | Admin only |

---

## Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables in the platform dashboard
2. Set `NODE_ENV=production`
3. Deploy the `server/` directory

### Frontend (Vercel / Netlify)
1. Set `VITE_API_URL` to your deployed backend URL
2. Build: `cd client && npm run build`
3. Deploy the `client/dist/` directory

---

## Color Palette

| Token        | Value     |
|--------------|-----------|
| Background   | `#050508` |
| Surface      | `#0f0f1a` |
| Border       | `rgba(255,255,255,0.06)` |
| Accent Blue  | `#4f8ef7` |
| Accent Purple| `#8b5cf6` |
| Success      | `#10b981` |
| Warning      | `#f59e0b` |
| Danger       | `#ef4444` |

---

## License

MIT © TaskFlow
