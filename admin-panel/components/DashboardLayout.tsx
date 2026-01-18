'use client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900">E-Commerce Dashboard</h2>
        </div>
      </header>
      <main className="mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
