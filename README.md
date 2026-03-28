💼 Job Portal – Full Stack MERN Application
A production-ready Full Stack Job Portal Web Application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) with secure authentication, role-based access control, and RESTful API architecture.
This project demonstrates real-world backend design, authentication workflows, and scalable frontend architecture.

🚀 Project Overview
The Job Portal allows:
👨‍💼 Recruiters to post, manage, and monitor job listings
👩‍💻 Applicants to browse jobs and apply
🔐 Secure JWT-based authentication
🧩 Role-based authorization (Recruiter / Applicant)
📊 Dashboard-based UI
This project focuses on clean architecture, REST API design, and separation of concerns.


🛠️ Tech Stack
🔹 Frontend
React.js (Functional Components + Hooks)
React Router DOM
Axios
Tailwind CSS
Context API (Global state management)
🔹 Backend
Node.js
Express.js
MongoDB (NoSQL Database)
Mongoose ODM
JWT (Authentication)
bcrypt (Password hashing)
Middleware-based authorization


🏗️ System Architecture
Client (React)
⬇
REST API (Express.js)
⬇
MongoDB Database
Stateless JWT authentication
Role-based middleware validation
Modular route structure
MVC-inspired backend organization


✨ Key Features
🔐 Authentication & Authorization
Secure user registration
Login with hashed passwords (bcrypt)
JWT token-based authentication
Protected routes using middleware
Role-based access control


👨‍💼 Recruiter Module
Create new job postings
View all posted jobs
View applicants per job
Delete job listings
Dedicated Recruiter Dashboard


👩‍💻 Applicant Module
Browse available jobs
Apply to jobs
Withdraw application
Track applied jobs


🛡️ Security Implementation
Password hashing with salt
Token validation middleware
Role verification middleware
Environment-based configuration using .env

FOLDER STRUCTURE OF PROJECT
job-portal/
│
├── backend/
│   ├── models/        # MongoDB Schemas
│   ├── routes/        # API Routes
│   ├── middleware/    # Auth & Role Middleware
│   ├── config/        # DB Configuration
│   └── server.js      # Entry Point
│
├── frontend/
│   ├── components/    # Reusable UI Components
│   ├── pages/         # Page-Level Components
│   ├── context/       # Global State Management
│   ├── App.js
│   └── index.js
│
└── README.md

📈 Engineering Highlights
✔ Designed stateless authentication using JWT
✔ Implemented middleware-based role authorization
✔ Created reusable frontend components
✔ Followed modular backend architecture
✔ Handled edge cases (duplicate applications, protected routes)
✔ Built scalable folder structure

🚀 Future Enhancements
Resume upload (Cloudinary integration)
Advanced job filtering & search
Pagination
Admin panel
Email notifications
Deployment (Render / Vercel / MongoDB Atlas)

👨‍💻 Author
Aditya Singh
B.Tech (2nd Year)
Full Stack Developer | 
