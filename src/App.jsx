import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Student Pages
import { StudentDashboard } from './pages/StudentDashboard';
import { MySemesterPage } from './pages/MySemesterPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { PracticePage } from './pages/PracticePage';
import { AIQuestionGenPage } from './pages/AIQuestionGenPage';
import { AcadexAIPage } from './pages/AcadexAIPage';
import { WeakTopicsPage } from './pages/WeakTopicsPage';
import { StudyPlanPage } from './pages/StudyPlanPage';
import { PDFTutorPage } from './pages/PDFTutorPage';
import { PYQPage } from './pages/PYQPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { MockTestsPage } from './pages/MockTestsPage';
import { MockTestRunPage } from './pages/MockTestRunPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { ProfilePage } from './pages/ProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminStudentsPage } from './pages/admin/AdminStudentsPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminSyllabusPage } from './pages/admin/AdminSyllabusPage';
import { AdminAIReviewPage } from './pages/admin/AdminAIReviewPage';
import { AdminPYQPage } from './pages/admin/AdminPYQPage';
import { AdminResourcesPage } from './pages/admin/AdminResourcesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* Auth Pages (full-width, no footer) */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Route>

          {/* Student Protected Portal Routes */}
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/my-semester" element={<MySemesterPage />} />
            <Route path="/courses" element={<MySemesterPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/ai-question-gen" element={<AIQuestionGenPage />} />
            <Route path="/acadex-ai" element={<AcadexAIPage />} />
            <Route path="/pdf-tutor" element={<PDFTutorPage />} />
            <Route path="/pyqs" element={<PYQPage />} />
            <Route path="/mock-tests" element={<MockTestsPage />} />
            <Route path="/mock-tests/:testId" element={<MockTestRunPage />} />
            <Route path="/weak-topics" element={<WeakTopicsPage />} />
            <Route path="/study-plan" element={<StudyPlanPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Admin Protected Portal Routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/students" element={<AdminStudentsPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/syllabus" element={<AdminSyllabusPage />} />
            <Route path="/admin/questions" element={<AdminAIReviewPage />} />
            <Route path="/admin/pyqs" element={<AdminPYQPage />} />
            <Route path="/admin/resources" element={<AdminResourcesPage />} />
            <Route path="/admin/mock-tests" element={<AdminDashboardPage />} />
            <Route path="/admin/ai-review" element={<AdminAIReviewPage />} />
            <Route path="/admin/settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
