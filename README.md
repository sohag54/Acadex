# Acadex — Smart Academic Tracking & Exam Preparation System

<div align="center">

![Acadex Banner](https://img.shields.io/badge/Acadex-EdTech%20SaaS-6366f1?style=for-the-badge&logo=graduation-cap&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite%206-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**"Master Your Semester. Prepare Smarter."**  
*An intelligent academic companion designed for Computer Science & Engineering students.*

[Key Features](#-key-features) • [Tech Stack](#-technology-stack) • [Quick Start](#-quick-start) • [Admin Portal](#-faculty--admin-portal) • [Demo Accounts](#-1-click-demo-accounts)

</div>

---

## 📖 Overview

**Acadex** is a modern EdTech web application built to streamline semester planning and exam preparation for engineering students. It combines syllabus tracking, independent Midterm and Final exam metrics, Previous Year Questions (PYQs), dynamic mock tests, AI-assisted study tools, and a grounded PDF Tutor (RAG engine) alongside a comprehensive Faculty & Admin management portal.

---

## ✨ Key Features

### 1. 🎓 Smart Syllabus Tracking
- **Dual Progress Metrics**: Independent progress indicators for **Midterm** and **Final** semester exams.
- **Topic-Level Checklists**: Real-time completion checkboxes with structured module accordions and learning objectives.

### 2. 🤖 AI-Powered Study Suite
- **AI Question Generator**: Generates custom MCQs, short conceptual questions, and long essay prompts with model answers and step-by-step explanations.
- **Acadex AI Study Assistant**: Conversational academic tutor for concept breakdowns, algorithm visualizations, and study tips.
- **AI Answer Evaluation**: Analyzes written answers, scores submissions, and highlights strengths, weaknesses, and missing key points.
- **Weak Topic Analysis**: Visual classification of **Strong**, **Average**, and **Weak** topics based on quiz attempt accuracy.
- **AI Study Schedule**: Generates personalized daily study roadmaps based on upcoming exam dates.

### 3. 📄 PDF Tutor (RAG Engine)
- Upload course syllabus PDFs and lecture slides.
- Grounded Q&A with exact page citations (e.g., `[Page 3, Chunk 2]`).

### 4. 📚 PYQs & Learning Resources
- Searchable and filterable Previous Year Questions (PYQs) with step-by-step verified solutions.
- Topic-wise curated video lectures, technical documentation, and reference links.

### 5. ⏱️ Mock Test & Practice Engine
- Timed exam simulation with interactive question palette (*Answered, Unanswered, Marked for Review*).
- Instant performance analytics, accuracy charts, and category breakdowns.

### 6. 🛡️ Faculty & Admin Portal
- Protected `/admin/*` workspace for department faculty and administrators.
- Full management of **Courses**, **Syllabi & Modules**, **Question Pools**, and **Resources**.
- Exam paper upload with **automated PDF question extraction**.
- **AI Content Review**: Faculty review queue to approve or reject AI-generated questions (`Draft` → `Approved`).

### 7. 🌓 Seamless Theme Engine
- High-contrast, accessibility-compliant **Light Mode** and sleek **Dark Mode**.
- Powered by Tailwind CSS v4 class-based variant architecture with glassmorphism panels.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) + Custom Glassmorphism System |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Authentication** | [Firebase Authentication](https://firebase.google.com/) (Email/Password & Google OAuth) |
| **Dates & Utilities** | [date-fns](https://date-fns.org/), clsx, tailwind-merge |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/sohag54/Acadex.git
cd Acadex
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your Firebase credentials in `.env`:
```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
VITE_API_BASE_URL="http://localhost:5000/api"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## ⚡ 1-Click Demo Accounts

For instant evaluation without manual account registration, use the **⚡ Quick Demo Sign-In** on the Login screen:

- **Student Portal**:
  - Click **⚡ Student Demo**
  - Grants access to Syllabus Tracking, AI Tools, PDF Tutor, PYQs, and Mock Exams.

- **Admin Portal**:
  - Click **🛡️ Admin Demo**
  - Grants access to the full Admin Portal (`/admin/dashboard`, Courses, Syllabi, PYQs, AI Review).

---

## 📁 Project Structure

```text
acadex-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   └── common/          # Reusable UI (Navbar, Sidebar, AdminSidebar, Modals, StatCards)
│   ├── config/              # Firebase SDK configuration
│   ├── context/             # AuthContext (RBAC) & ThemeContext (Light/Dark)
│   ├── layouts/             # PublicLayout, AuthLayout, StudentLayout, AdminLayout
│   ├── pages/               # Student & Public Views (Dashboard, Practice, PYQs, PDF Tutor...)
│   │   └── admin/           # Admin Portal Views (Courses, Syllabi, Review, Settings...)
│   ├── services/            # API client service layer
│   ├── App.jsx              # Main routing & application architecture
│   ├── index.css            # Tailwind CSS v4 & theme definitions
│   └── main.jsx             # React DOM root entry point
├── .env.example             # Environment variables template
├── .gitignore               # Excludes node_modules, .env, and dist
├── package.json             # Dependencies and scripts
└── vite.config.js           # Vite configuration
```

---

## 🔒 Security & Access Control

- **Role-Based Access Control (RBAC)**: All administrative routes (`/admin/*`) are protected by `AdminLayout`. Non-admin accounts attempting to access these routes are automatically redirected to the student dashboard.
- **Sanitized Repository**: Private `.env` files and `node_modules` are excluded from version control to prevent credential leakage.

---

## 📄 License

Created for academic tracking and engineering exam preparation.  
© 2026 **Acadex**. All rights reserved.
