# Parlour Admin Dashboard

A full-stack web-based dashboard system for managing a parlour business — featuring **role-based access control**, **employee task management**, and **live real-time attendance tracking** using **WebSockets**.

### Live Demo

🌐 [Visit Live Site](https://parlour-krisha.vercel.app/)

---

## Monorepo Structure

```
/parlour-project
├── /frontend-parlour-dashboard → Next.js 15 + TypeScript + TailwindCSS + ShadCN UI
└── /backend-parlour-api → Node.js + TypeScript + Express + MongoDB + Socket.IO
```

---

##  Tech Stack

| Layer    | Technology                          |
| -------- | ----------------------------------- |
| Frontend | Next.js 15 (App Router), TypeScript |
| UI       | TailwindCSS, ShadCN UI              |
| Backend  | Node.js, Express, TypeScript (MVC)  |
| Database | MongoDB                             |
| Auth     | JWT (JSON Web Token)                |
| Realtime | WebSockets via Socket.IO            |

---

##  User Roles

### Super Admin

* Full access to all dashboard features.
* Can **add/edit/delete** employees and tasks.
* Can view and delete attendance logs.

### Admin

* **Read-only** access.
* Can only **view** employees, tasks, and attendance logs.

---

## Pages & Features

### 1. Login Page

* Email & Password authentication.
* JWT stored securely.
* Redirects based on role.

### 2. Dashboard (`/dashboard`)

* **Employees Section**:

  * Super Admin: add/edit/delete employees.
  * Admin: view only.
* **Tasks Section**:

  * Super Admin: assign/update/delete tasks.
  * Admin: view only.
* **Attendance Section**:

  * Real-time attendance logs.
  * Live updates via WebSocket when employees punch in/out.

### 3. Attendance Page (`/attendance`)

* Public-facing Punch In/Out system.
* Displays all employee cards with punch button.
* Sends punch action to backend via WebSocket.
* Dashboard updates live on all admin views.

---

## Real-Time Functionality

* Built with **Socket.IO**.
* Punch In/Out actions from `/attendance` instantly update admin dashboards.
* No manual page reloads needed.

---

## API & Backend Overview

* Follows **MVC Architecture**.
* Built using **Express + TypeScript**.
* Authentication secured with **JWT**.
* Stores data in **MongoDB** using Mongoose.
* **WebSocket events** used for real-time attendance.

---

## Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/krishachikka/Parlour-Admin-Dashboard.git
cd Parlour-Admin-Dashboard
```

---

### 2. Install Dependencies

#### Frontend

```bash
cd frontend-parlour-dashboard
npm install
```

#### Backend

```bash
cd ../backend-parlour-api
npm install
```

---

### 3. Configure Environment Variables

#### Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

#### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### 4. Run the App

#### Backend

```bash
cd backend-parlour-api
npm run dev
```

#### Frontend

```bash
cd frontend-parlour-dashboard
npm run dev
```

---

## 📝 Author

**Krisha Chikka**
GitHub: [@krishachikka](https://github.com/krishachikka)
