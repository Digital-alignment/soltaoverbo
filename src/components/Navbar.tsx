import { useAuth } from '../contexts/AuthContext';
import UserNavbar from './UserNavbar';
import AdminNavbar from './AdminNavbar';

export default function Navbar() {
  const { profile } = useAuth();

  if (profile?.role === 'admin') {
    return <AdminNavbar />;
  }

  return <UserNavbar />;
}
