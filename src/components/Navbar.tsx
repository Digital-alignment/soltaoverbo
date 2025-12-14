import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell, LogOut, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { profile, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!profile) return;

    const fetchUnreadCount = async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id)
        .eq('is_read', false);

      setUnreadCount(count || 0);
    };

    fetchUnreadCount();

    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${profile.id}`,
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  return (
    <nav className="border-b border-darkNeutral/10 sticky top-0 z-50" style={{ backgroundColor: '#EDE6D4' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[#F5F1E8] rounded-xl flex items-center justify-center transition-all transform group-hover:rotate-6">
              <img src="/icone.svg" alt="Solta o Verbo" className="w-10 h-10" />
            </div>
            <img
              src="/logo_soltaoverboo.png"
              alt="Solta o Verbo"
              className="h-8 hidden sm:block"
            />
          </Link>

          <div className="flex items-center space-x-2">
            <Link
              to="/notifications"
              className="relative p-2 text-darkNeutral/70 hover:text-deepBlue hover:bg-darkNeutral/5 rounded-lg transition-all"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ backgroundColor: '#1f008f', color: '#fff7ed' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {profile?.role === 'admin' && (
              <Link
                to="/admin"
                className="p-2 text-darkNeutral/70 hover:text-deepBlue hover:bg-darkNeutral/5 rounded-lg transition-all"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}

            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 hover:bg-darkNeutral/5 rounded-lg transition-all">
                <div className="w-8 h-8 bg-deepBlue rounded-full flex items-center justify-center text-white font-bold border-2 border-actionOrange overflow-hidden">
                  {profile?.profile_picture_url ? (
                    <img
                      src={`${profile.profile_picture_url}?v=${Date.now()}`}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile?.display_name?.charAt(0).toUpperCase()
                  )}
                </div>
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-darkNeutral/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="px-4 py-3 border-b border-darkNeutral/10">
                  <p className="text-sm font-bold text-deepBlue">{profile?.display_name}</p>
                  <p className="text-xs text-darkNeutral/60 capitalize">{profile?.role}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-darkNeutral hover:bg-actionOrange/10 hover:text-deepBlue transition-all"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Meu Perfil</span>
                </Link>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-actionOrange hover:bg-actionOrange/10 transition-all w-full text-left rounded-b-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
