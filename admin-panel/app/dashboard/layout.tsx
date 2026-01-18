'use client';

import Sidebar from '@/components/Sidebar';
import DashboardLayout from '@/components/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <DashboardLayout>{children}</DashboardLayout>
        </div>
      </div>
    </ProtectedRoute>
  );
}
