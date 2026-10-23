import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/common/Navbar';
import { AdminSidebar } from '../components/common/AdminSidebar';

export const AdminLayout = () => {
  const { userProfile, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-sm font-semibold">Verifying Admin Access Credentials...</p>
      </div>
    );
  }

  // Admin security check! Non-admin users are blocked.
  if (!userProfile || userProfile.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <AdminSidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
