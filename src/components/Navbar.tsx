import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';

export default function Navbar() {
  const { profile } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (profile?.role === 'admin' && isAdminRoute) {
    return <AdminNavbar />;
  }

  return <UserNavbar />;
}
