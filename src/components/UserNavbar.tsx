import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell, LogOut, Flame, PenTool, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function UserNavbar() {
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
      .channel('user-navbar-notifications')
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
    { to: '/exercises', label: 'exercícios', icon: PenTool },
    { to: '/fogueira', label: 'nossa fogueira', icon: Flame },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-bgPlataforma/95 backdrop-blur-md border-b border-papelKraft/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo Brand Mark */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-papelClaro rounded-2xl border border-papelKraft/50 flex items-center justify-center transition-transform group-hover:rotate-6 shadow-kraft">
              <img
                src={BRAND_ASSETS.logos.icon}
                alt="solta o verbo"
                className="w-7 h-7"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/icone.svg';
                }}
              />
            </div>
            <img
              src={BRAND_ASSETS.logos.horizontal}
              alt="solta o verbo"
              className="h-8 max-w-[180px] object-contain hidden sm:block"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
              }}
            />
          </Link>

          {/* Links Principais de Aluno (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium lowercase transition-all ${
                    active
                      ? 'bg-papelClaro text-acentoAzul border border-papelKraft/60 shadow-kraft'
                      : 'text-tintaCarvao/80 hover:text-acentoAzul hover:bg-papelClaro/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-acentoAzul' : 'text-tintaCarvao/60'}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Acciones de Usuario (Notificaciones + Perfil Dropdown) */}
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

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-papelClaro rounded-full border border-papelKraft/50 transition-all focus:outline-none"
                aria-label="menu do perfil"
              >
                <div className="w-9 h-9 rounded-full bg-acentoAzul text-white font-bold flex items-center justify-center border-2 border-acentoTerracota overflow-hidden shadow-sm">
                  {profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold lowercase">
                      {profile?.display_name?.charAt(0).toLowerCase() || 'u'}
                    </span>
                  )}
                </div>
              </button>

              {/* Menu Dropdown de Alumno */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-56 bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft-lg z-50 overflow-hidden py-2 animate-fadeIn">
                    <div className="px-5 py-3 border-b border-papelKraft/40">
                      <p className="text-sm font-semibold text-acentoAzul lowercase truncate">
                        olá, {profile?.display_name || 'aluno'}
                      </p>
                      <p className="text-xs text-tintaCarvao/60 lowercase">
                        {profile?.role === 'admin' ? 'administrador' : 'aluno solta o verbo'}
                      </p>
                    </div>

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
