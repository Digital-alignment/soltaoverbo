import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/database.types';
import Navbar from './Navbar';
import BottomNav from './BottomNav';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: UserRole[];
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0e6d1' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRole && profile && !requireRole.includes(profile.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="pb-20">{children}</div>
      <BottomNav />
    </>
  );
}
