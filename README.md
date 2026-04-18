# 🏋️ FitPro Gym Management System

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application for managing a gym's members, trainers, membership plans, and attendance.

---

## 🚀 Features

- **User Authentication** — Signup & Login with JWT, bcrypt password hashing
- **Members Management** — Full CRUD (Add, View, Edit, Delete members)
- **Trainer Management** — Full CRUD for gym trainers
- **Membership Plans** — Create and manage pricing plans
- **Attendance Tracking** — Mark and view daily attendance with check-in/out times
- **Dashboard** — Live stats, recent members, trainer overview
- **Protected Routes** — All pages require authentication

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router v6, Axios  |
| Styling   | Custom CSS (clean & responsive)   |
| Backend   | Node.js, Express.js               |
| Database  | MongoDB with Mongoose ODM         |
| Auth      | JWT + bcryptjs                    |

---

## 📁 Project Structure

```
gym-management/
├── backend/
│   ├── models/         # Mongoose schemas (User, Member, Trainer, Plan, Attendance)
│   ├── routes/         # Express REST API routes
│   ├── middleware/     # JWT auth middleware
│   ├── server.js       # Entry point
│   └── .env.example    # Environment variables template
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── context/    # AuthContext (React Context API)
│       ├── pages/      # Dashboard, Members, Trainers, Plans, Attendance
│       ├── components/ # Layout (Sidebar + Topbar)
│       ├── App.js
│       └── App.css
│
└── README.md
```

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)
- npm

---

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/gym-management.git
cd gym-management
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
npm run dev
```

The backend runs on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

The frontend runs on **http://localhost:3000**

> The `"proxy": "http://localhost:5000"` in `frontend/package.json` forwards API calls automatically.

---

## 🌐 Deployment

### Backend — Render.com
1. Push backend folder to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set environment variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`
4. Build command: `npm install`, Start command: `node server.js`

### Frontend — Vercel / Netlify
1. Push frontend folder to GitHub
2. Deploy on [vercel.com](https://vercel.com) or [netlify.com](https://netlify.com)
3. Set `REACT_APP_API_URL` if needed or update proxy

### Database — MongoDB Atlas
1. Create free cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Get connection string → paste in `MONGO_URI`

---

## 🔑 API Endpoints

### Auth
| Method | Endpoint           | Description     |
|--------|--------------------|-----------------|
| POST   | /api/auth/signup   | Register user   |
| POST   | /api/auth/login    | Login           |
| GET    | /api/auth/me       | Get current user|

### Members
| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/members          | Get all members      |
| GET    | /api/members/:id      | Get single member    |
| POST   | /api/members          | Create member        |
| PUT    | /api/members/:id      | Update member        |
| DELETE | /api/members/:id      | Delete member        |
| GET    | /api/members/stats/summary | Dashboard stats |

### Trainers, Plans, Attendance
Follow the same CRUD pattern as Members.

---



## 👨‍💻 Author
- **Student Name:** Rushikesh Sitaphale and Shubham kusnure
- **Roll Number:** SA139,SA144
- **GitHub:** https://github.com/YOUR_USERNAME/gym-management
- **Live App:** https://your-app.vercel.app
