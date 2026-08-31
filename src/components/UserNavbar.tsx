import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell, LogOut, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function UserNavbar() {
  const { profile, signOut } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 bg-bgPlataforma/95 backdrop-blur-md border-b border-papelKraft/50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* LADO ESQUERDO: Notificações & Perfil do Usuário */}
          <div className="flex items-center gap-3">
            {/* Notificações com Badge */}
            <Link
              to="/notifications"
              className="relative p-2.5 text-tintaCarvao/80 hover:text-acentoAzul hover:bg-papelClaro rounded-full border border-papelKraft/40 transition-all shadow-sm"
              title="notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-acentoTerracota text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* User Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 p-1 hover:bg-papelClaro rounded-full border border-papelKraft/50 transition-all focus:outline-none shadow-sm cursor-pointer"
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

              {/* Menu Dropdown */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-3 w-56 bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft-lg z-50 overflow-hidden py-2 animate-fadeIn">
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

                    {profile?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm text-acentoAzul hover:bg-bgPlataforma transition-all lowercase font-medium"
                      >
                        <ShieldCheck className="w-4 h-4 text-acentoAzul" />
                        <span>painel admin</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut();
                      }}
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-acentoTerracota hover:bg-acentoTerracota/10 transition-all w-full text-left lowercase cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-acentoTerracota" />
                      <span>sair</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* LADO DIREITO: Logo Oficial Solta o Verbo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img
              src={BRAND_ASSETS.logos.horizontal}
              alt="solta o verbo"
              className="h-7 sm:h-9 max-w-[190px] object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
              }}
            />
          </Link>

        </div>
      </div>
    </header>
  );
}
