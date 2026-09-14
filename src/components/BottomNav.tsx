import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FloatingNavbar from './FloatingNavbar';
import AdminSidebar from './AdminSidebar';

export default function BottomNav() {
  const { profile } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (profile?.role === 'admin' && isAdminRoute) {
    return <AdminSidebar />;
  }

  return <FloatingNavbar />;
}
