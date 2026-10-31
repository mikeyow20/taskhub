# TaskHub

A full-stack task management app built with the MERN stack. Admins create tasks, assign them to team members and track progress across the team. Members work through each task's checklist, and the task's status and progress update automatically as they go.

## Features

**Admins**
- Create, edit and delete tasks with a priority (Low / Medium / High), due date, checklist and attachment links
- Assign a task to one or more team members
- Dashboard with task counts and charts by status and priority
- View all team members and how many tasks each has pending, in progress and completed
- Export task and user reports to Excel

**Team members**
- Dashboard showing only the tasks assigned to them
- View task details and tick off checklist items
- Status and progress update automatically from the checklist: no items done is *Pending*, some done is *In Progress*, all done is *Completed*

**Everyone**
- Sign up and log in with JWT authentication (passwords hashed with bcrypt)
- Profile photo upload (JPG/PNG), with a default avatar
- Responsive layout for desktop and mobile

## Tech stack

| Layer        | Technology                                                    |
| ------------ | ------------------------------------------------------------- |
| Frontend     | React 19, Vite, Tailwind CSS, React Router, Axios, Recharts   |
| Backend      | Node.js, Express, MongoDB with Mongoose                       |
| Auth         | JSON Web Tokens, bcrypt                                       |
| File uploads | Multer (stored on disk in `backend/uploads/`)                 |
| Reports      | ExcelJS                                                       |

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 20.19 or newer
- A MongoDB database, either local or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Install dependencies

The frontend lives in the project root and the API in `backend/`, so install both:

```bash
npm install
npm install --prefix backend
```

### 2. Configure environment variables

Copy the example file and fill in the values:

```bash
cp backend/.env.example backend/.env
```

| Variable             | Description                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| `MONGO_URL`          | MongoDB connection string                                                                         |
| `JWT_SECRET`         | Long random string used to sign login tokens                                                      |
| `ADMIN_INVITE_TOKEN` | Code entered at sign-up to create an admin account (see below)                                    |
| `PORT`               | Port for the API. Keep it at `8000`, which is where the frontend expects it (`src/utils/apiPaths.js`) |
| `CLIENT_URL`         | Optional. Origin allowed by CORS. Defaults to allowing all origins                                |

### 3. Run the app

```bash
npm run dev
```

This starts the frontend at http://localhost:5173 and the API at http://localhost:8000. Stop both with `Ctrl+C`.

### Creating an admin account

Anyone who signs up becomes a team member by default. To create an admin, enter the value of `ADMIN_INVITE_TOKEN` in the **Admin Invite Token** field on the sign-up page.

## Scripts

Run from the project root:

| Command                | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Start the frontend and backend together      |
| `npm run dev:frontend` | Start only the Vite dev server               |
| `npm run dev:backend`  | Start only the API (with nodemon)            |
| `npm run build`        | Build the frontend for production            |
| `npm run lint`         | Run ESLint                                   |

## Project structure

```
TaskHub/
├── src/                  # React frontend
│   ├── components/       # Cards, charts, inputs, layouts
│   ├── context/          # Logged-in user context
│   ├── pages/            # Admin, User and Auth pages
│   ├── routes/           # Role-based route protection
│   └── utils/            # Axios instance, API paths, helpers
├── backend/              # Express API
│   ├── config/           # MongoDB connection
│   ├── controllers/      # Auth, task, user and report logic
│   ├── middlewares/      # JWT auth, admin check, file uploads
│   ├── models/           # User and Task schemas
│   ├── routes/           # API routes
│   ├── uploads/          # Uploaded profile photos
│   └── server.js
└── public/               # Static assets
```

## API

Every route except register, login and image upload needs an `Authorization: Bearer <token>` header.

| Method | Endpoint                         | Access | Description                                  |
| ------ | -------------------------------- | ------ | -------------------------------------------- |
| POST   | `/api/auth/register`             | Public | Create an account                            |
| POST   | `/api/auth/login`                | Public | Log in and receive a token                   |
| GET    | `/api/auth/profile`              | User   | Get the current user's profile               |
| PUT    | `/api/auth/profile`              | User   | Update the current user's profile            |
| POST   | `/api/auth/upload-image`         | Public | Upload a profile photo                       |
| GET    | `/api/users`                     | Admin  | List team members with task counts           |
| GET    | `/api/users/:id`                 | User   | Get a user by ID                             |
| GET    | `/api/tasks`                     | User   | List tasks (admins see all, members see their own) |
| GET    | `/api/tasks/:id`                 | User   | Get a task by ID                             |
| POST   | `/api/tasks`                     | Admin  | Create a task                                |
| PUT    | `/api/tasks/:id`                 | User   | Update a task                                |
| DELETE | `/api/tasks/:id`                 | Admin  | Delete a task                                |
| PUT    | `/api/tasks/:id/status`          | User   | Update a task's status                       |
| PUT    | `/api/tasks/:id/todo`            | User   | Update a task's checklist                    |
| GET    | `/api/tasks/dashboard-data`      | User   | Admin dashboard statistics                   |
| GET    | `/api/tasks/user-dashboard-data` | User   | Member dashboard statistics                  |
| GET    | `/api/reports/export/tasks`      | Admin  | Download all tasks as Excel                  |
| GET    | `/api/reports/export/users`      | Admin  | Download the user task summary as Excel      |
