import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell, LogOut, Settings, ShieldCheck, Flame, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function AdminNavbar() {
  const { profile, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

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
      .channel('admin-navbar-notifications')
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

  const navLinks = [
    { to: '/dashboard', label: 'início', icon: Home },
    { to: '/admin', label: 'painel admin', icon: Settings },
    { to: '/fogueira', label: 'comunidade', icon: Flame },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-bgPlataforma/95 backdrop-blur-md border-b border-acentoAzul/20 shadow-kraft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo + Badge Admin */}
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-papelClaro rounded-2xl border border-papelKraft/60 flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm">
                <img src={BRAND_ASSETS.logos.icon} alt="solta o verbo" className="w-7 h-7" />
              </div>
              <img
                src={BRAND_ASSETS.logos.horizontalPng}
                alt="solta o verbo"
                className="h-8 hidden sm:block"
              />
            </Link>

            {/* Badge de Rol Admin */}
            <span className="bg-acentoOliva text-tintaCarvao text-xs font-semibold px-3 py-1 rounded-full lowercase flex items-center gap-1 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-acentoAzul" />
              <span>admin</span>
            </span>
          </div>

          {/* Links Principales Admin (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium lowercase transition-all ${
                    active
                      ? 'bg-acentoAzul text-white shadow-sm'
                      : 'text-tintaCarvao/80 hover:text-acentoAzul hover:bg-papelClaro/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-acentoOliva' : 'text-tintaCarvao/60'}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Acciones de Admin (Notificaciones + Perfil Dropdown) */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <Link
              to="/notifications"
              className="relative p-2.5 text-tintaCarvao/80 hover:text-acentoAzul hover:bg-papelClaro rounded-full border border-papelKraft/40 transition-all"
              title="notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-acentoTerracota text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Admin Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-papelClaro rounded-full border border-papelKraft/60 transition-all focus:outline-none"
                aria-label="menu do perfil admin"
              >
                <div className="w-9 h-9 rounded-full bg-acentoAzul text-white font-bold flex items-center justify-center border-2 border-acentoOliva overflow-hidden shadow-sm">
                  {profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold lowercase">
                      {profile?.display_name?.charAt(0).toLowerCase() || 'a'}
                    </span>
                  )}
                </div>
              </button>

              {/* Menu Dropdown de Admin */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-60 bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft-lg z-50 overflow-hidden py-2 animate-fadeIn">
                    <div className="px-5 py-3 border-b border-papelKraft/40">
                      <p className="text-sm font-semibold text-acentoAzul lowercase truncate">
                        {profile?.display_name || 'admin'}
                      </p>
                      <p className="text-xs text-acentoAzul/70 font-medium lowercase">
                        painel de administração
                      </p>
                    </div>

                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-tintaCarvao hover:bg-bgPlataforma hover:text-acentoAzul transition-all lowercase"
                    >
                      <Settings className="w-4 h-4 text-acentoAzul" />
                      <span>gestão de cursos e leções</span>
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-tintaCarvao hover:bg-bgPlataforma hover:text-acentoAzul transition-all lowercase"
                    >
                      <User className="w-4 h-4 text-acentoAzul" />
                      <span>meu perfil</span>
                    </Link>

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-acentoTerracota hover:bg-acentoTerracota/10 transition-all w-full text-left lowercase"
                    >
                      <LogOut className="w-4 h-4 text-acentoTerracota" />
                      <span>sair</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
