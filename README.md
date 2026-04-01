# PharmaPulse AI

A full-stack role-based drug communication platform for **Admin**, **Doctor**, and **Medical Representative (MR)**.

## Tech Stack
- Frontend: HTML + CSS + Vanilla JavaScript
- Backend: Node.js + Express
- Database: MongoDB (Mongoose)
- Auth: JWT + bcrypt
- Email: Nodemailer (Gmail App Password)

## Folder Structure

```text
PharmaPlus-Ai/
├── public/
│   ├── css/style.css
│   ├── js/app.js
│   └── index.html
├── src/
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── models/
│   │   ├── Drug.js
│   │   ├── Feedback.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── mrRoutes.js
│   ├── seed/
│   │   ├── defaultAdmin.js
│   │   └── defaultUsers.js
│   ├── services/emailService.js
│   └── server.js
├── .env.example
├── package.json
└── README.md
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and fill values.
3. Start app:
   ```bash
   npm run dev
   ```
4. Open browser: `http://localhost:5000`

## Preview / Default Logins
These users are auto-created if missing on startup:
- **Admin**: `admin@gmail.com` / `admin123`
- **Doctor**: `doctor@gmail.com` / `doctor123`
- **MR**: `mr@gmail.com` / `mr123`

> If you only want admin auto-seeding, set `SEED_DEMO_USERS=false` in `.env`.

## Key Features
- JWT login with role-aware dashboard rendering.
- RBAC middleware protection for Admin/Doctor/MR APIs.
- Admin can add/remove users and view all users.
- Doctor sees drugs by specialization and submits feedback.
- MR can add drugs and trigger real email notifications to matching doctors.
- Responsive modern UI with role-based navbar/actions.

## Email Configuration Notes
Use Gmail App Password (16-digit) in `.env`:

```env
EMAIL=your_email@gmail.com
PASS=your_16_digit_app_password
```

