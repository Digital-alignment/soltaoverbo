import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Bell, LogOut, ShieldCheck, Compass } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { BRAND_ASSETS } from '../config/brandAssets';

export default function AdminNavbar() {
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

  return (
    <header className="sticky top-0 z-40 bg-bgPlataforma/95 backdrop-blur-md border-b border-acentoAzul/20 shadow-kraft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* LADO ESQUERDO: Logo Admin + Badge Oficial */}
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-papelClaro rounded-2xl border border-papelKraft/60 flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm">
                <img src={BRAND_ASSETS.logos.icon} alt="solta o verbo admin" className="w-7 h-7" />
              </div>
              <img
                src={BRAND_ASSETS.logos.horizontalPng}
                alt="solta o verbo admin"
                className="h-8 hidden sm:block"
              />
            </Link>

            {/* Badge de Rol Admin */}
            <span className="bg-acentoOliva text-tintaCarvao text-xs font-semibold px-3 py-1 rounded-full lowercase flex items-center gap-1 border border-acentoOliva/50 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-acentoAzul" />
              <span>painel admin</span>
            </span>
          </div>

          {/* CENTRO: Título do Modo Admin (Desktop) */}
          <div className="hidden md:flex items-center">
            <span className="font-editorial font-bold text-base text-acentoAzul lowercase">
              gestão da plataforma
            </span>
          </div>

          {/* LADO DIREITO: Botão de Troca para Modo Aluna + Notificações + Perfil Dropdown */}
          <div className="flex items-center gap-3">
            
            {/* BOTÃO PARA SAIR DO MODO ADMIN / ENTRAR NO MODO ALUNA */}
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-acentoTerracota/15 hover:bg-acentoTerracota/25 border border-acentoTerracota/40 text-acentoTerracota text-xs font-bold font-corpo lowercase transition-all shadow-xs cursor-pointer"
              title="sair do modo admin e voltar para a plataforma de alunas"
            >
              <Compass className="w-4 h-4 text-acentoTerracota" />
              <span className="hidden sm:inline">modo aluna</span>
            </Link>

            {/* Notificações */}
            <Link
              to="/notifications"
              className="relative p-2.5 text-tintaCarvao/80 hover:text-acentoAzul hover:bg-papelClaro rounded-full border border-papelKraft/40 transition-all shadow-xs"
              title="notificações"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-acentoTerracota text-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            {/* Admin Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-2 p-1 hover:bg-papelClaro rounded-full border border-papelKraft/60 transition-all focus:outline-none cursor-pointer shadow-xs"
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

              {/* Menu Dropdown Anclado a la Derecha */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-3 w-60 bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-kraft-lg z-50 overflow-hidden py-2 animate-fadeIn">
                    <div className="px-5 py-3 border-b border-papelKraft/40">
                      <p className="text-sm font-semibold font-corpo text-acentoAzul lowercase truncate">
                        {profile?.display_name || 'administradora'}
                      </p>
                      <p className="text-xs text-acentoAzul/70 font-medium font-corpo lowercase">
                        painel de administração
                      </p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-tintaCarvao hover:bg-bgPlataforma hover:text-acentoAzul transition-all lowercase"
                    >
                      <Compass className="w-4 h-4 text-acentoTerracota" />
                      <span>modo aluna (plataforma)</span>
                    </Link>

                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-5 py-2.5 text-sm text-acentoAzul hover:bg-bgPlataforma transition-all lowercase font-medium"
                    >
                      <ShieldCheck className="w-4 h-4 text-acentoAzul" />
                      <span>painel administrativo</span>
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

        </div>
      </div>
    </header>
  );
}
