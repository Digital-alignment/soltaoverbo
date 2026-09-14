import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserNavbar from './UserNavbar';

export default function Navbar() {
  const { profile } = useAuth();
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  // In admin view, eliminate the top header completely - only render sidebar
  if (profile?.role === 'admin' && isAdminRoute) {
    return null;
  }

  return <UserNavbar />;
}
