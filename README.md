# PharmaPulse AI

PharmaPulse AI is a full-stack RBAC web application for Admins, Doctors, and Medical Representatives (MRs).

## Tech Stack
- Frontend: HTML/CSS/JavaScript
- Backend: Node.js + Express
- Database: MongoDB
- Auth: JWT + bcrypt
- Email: Nodemailer (Gmail App Password)

## Folder Structure
```
PharmaPlus-Ai/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Drug.js
│   │   └── Feedback.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── mrRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── css/styles.css
│   ├── js/
│   │   ├── config.js
│   │   ├── common.js
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── doctor.js
│   │   └── mr.js
│   ├── pages/
│   │   ├── admin.html
│   │   ├── doctor.html
│   │   └── mr.html
│   └── index.html
└── README.md
```

## Setup
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Update `.env` with MongoDB URI, JWT secret, and Gmail app password.

3. Run backend:
   ```bash
   npm run dev
   ```

4. Open frontend login page:
   - `http://localhost:5000/frontend/index.html`

## Default Admin (Auto-created)
When server starts, it checks if admin exists and creates one only once:
- Email: `admin@gmail.com`
- Password: `admin123`
- Role: `admin`

## Core Features
- JWT login and role-based redirects
- Admin can add/delete doctors and MRs
- Doctor can view specialization-based drugs and provide feedback
- MR can submit drugs and trigger doctor notifications via email
- Professional HTML email template
