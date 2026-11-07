# Acadex — Smart Academic Tracking & Exam Preparation System

<div align="center">

![Acadex Banner](https://img.shields.io/badge/Acadex-Frontend-6366f1?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite%206-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**"Master Your Semester. Prepare Smarter."**

*A modern frontend application designed to help CSE students track academic progress and prepare for examinations.*

</div>

---

##  Overview

**Acadex** is a modern academic tracking and exam preparation web application built with React. It provides students with an organized platform to manage their semester syllabus, practice questions, monitor academic progress, and access AI-powered study tools.

The frontend focuses on providing a responsive, interactive, and user-friendly experience with separate student and admin interfaces.

---

##  Key Features

### 1.  Smart Syllabus Tracking
- Track Midterm and Final exam preparation separately.
- Topic-wise syllabus completion checklists.
- Visual progress indicators.
- Organized modules and learning objectives.

### 2. AI-Powered Study Interface
- AI Question Generator interface.
- AI Study Assistant interface.
- AI Answer Evaluation interface.
- Weak Topic Analysis dashboard.
- Personalized Study Schedule interface.

### 3. PDF Tutor
- PDF upload interface.
- Document-based question and answer interface.
- Page citation display.

### 4.  PYQs & Learning Resources
- Searchable Previous Year Questions.
- Topic-wise question filtering.
- Learning resources and video lecture sections.
- Step-by-step solution display.

### 5.  Mock Test & Practice
- Interactive mock examination interface.
- Timed exam interface.
- Question navigation palette.
- Answered and unanswered question indicators.
- Performance analytics and accuracy charts.

### 6.  Faculty & Admin Interface
- Admin dashboard UI.
- Course management interface.
- Syllabus and module management.
- Question pool management.
- Resource management interface.
- AI-generated question review interface.

### 7. Theme Customization
- Light Mode.
- Dark Mode.
- Responsive and accessible UI components.
- Modern glassmorphism design.

---

##  Technology Stack

| Category | Technology |
|---|---|
| Frontend Framework | React 19 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Icons | Lucide React |
| Charts | Recharts |
| Authentication Integration | Firebase Authentication |
| Utilities | date-fns, clsx, tailwind-merge |

---

## Getting Started

### Prerequisites

- Node.js (v18.0.0 or higher)
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sohag54/Acadex.git
cd Acadex
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file based on `.env.example`.

Add the required Firebase configuration:

```env
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```

### 4. Run Development Server

```bash
npm run dev
```

Open the local development URL displayed in your terminal.

### 5. Build for Production

```bash
npm run build
```

---

##  Project Structure

```text
acadex-frontend/
├── public/
│
├── src/
│   ├── components/
│   │   └── common/
│   │
│   ├── config/
│   │
│   ├── context/
│   │
│   ├── layouts/
│   │
│   ├── pages/
│   │   └── admin/
│   │
│   ├── services/
│   │
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js
```

---

##  Security & Authentication

- Firebase Authentication integration.
- Protected routes for authenticated users.
- Role-based UI access.
- Separate student and admin interfaces.
- Environment variables used for configuration.

---

## 📱 Responsive Design

Acadex frontend is designed to provide a consistent user experience across:

- Desktop computers.
- Tablets.
- Mobile devices.

---

## 📄 License

Created for academic tracking and engineering examination preparation.

© 2026 **Acadex**. All rights reserved.