import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BRAND_ASSETS } from '../config/brandAssets';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Image as ImageIcon,
  Megaphone,
  MessageCircle,
  Mail,
  ShoppingCart,
  Layers,
  Images,
  Compass,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  Coffee,
  RefreshCw,
  Briefcase,
} from 'lucide-react';

export interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  group: 'geral' | 'cms' | 'comunidade';
  subItems?: { id: string; label: string }[];
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'dashboard',
    label: 'dashboard',
    icon: LayoutDashboard,
    group: 'geral',
  },
  {
    id: 'programa_21_dias',
    label: '21 dias de escrita',
    icon: BookOpen,
    group: 'geral',
    subItems: [
      { id: 'overview', label: 'visão geral' },
      { id: 'cms', label: 'cms da página' },
      { id: 'students', label: 'alunas & progresso (dia X/21)' },
      { id: 'lessons', label: 'aulas & áudios binaurais' },
      { id: 'tasks', label: 'tarefas & organizacao' },
      { id: 'broadcasts', label: 'comunicação & avisos' },
    ],
  },
  {
    id: 'programa_ciclo',
    label: 'ciclo de aprofundamento',
    icon: RefreshCw,
    group: 'geral',
    subItems: [
      { id: 'overview', label: 'visão geral' },
      { id: 'cms', label: 'cms da página' },
      { id: 'members', label: 'assinantes premium' },
      { id: 'meetings', label: 'encontros ao vivo' },
      { id: 'materials', label: 'materiais de apoio' },
      { id: 'tasks', label: 'tarefas & organizacao' },
      { id: 'broadcasts', label: 'comunicação & avisos' },
    ],
  },
  {
    id: 'programa_cafe_com_letras',
    label: 'café com letras',
    icon: Coffee,
    group: 'geral',
    subItems: [
      { id: 'overview', label: 'visão geral' },
      { id: 'cms', label: 'cms da página' },
      { id: 'participants', label: 'participantes' },
      { id: 'meetings', label: 'agendar encontros' },
      { id: 'materials', label: 'materiais de apoio' },
      { id: 'tasks', label: 'tarefas & organizacao' },
      { id: 'broadcasts', label: 'comunicação & avisos' },
    ],
  },
  {
    id: 'contrate_experiencia',
    label: 'contrate uma experiência (b2b)',
    icon: Briefcase,
    group: 'geral',
    subItems: [
      { id: 'overview', label: 'visão geral b2b' },
      { id: 'crm', label: 'crm de leads (kanban)' },
      { id: 'cms', label: 'cms da página' },
      { id: 'meetings', label: 'reuniões b2b' },
      { id: 'materials', label: 'deck & materiais pdf' },
      { id: 'tasks', label: 'tarefas & organizacao' },
    ],
  },
  {
    id: 'users',
    label: 'alunas & membros',
    icon: Users,
    group: 'geral',
    subItems: [
      { id: 'all', label: 'todas as alunas' },
      { id: 'paid', label: 'membros premium' },
      { id: 'free', label: 'membros gratuitos' },
      { id: 'admin', label: 'administradoras' },
    ],
  },
  {
    id: 'courses',
    label: 'gestão de oficinas',
    icon: BookOpen,
    group: 'geral',
    subItems: [
      { id: 'all', label: 'todas as oficinas' },
      { id: 'new', label: '+ criar nova oficina' },
    ],
  },
  {
    id: 'pages',
    label: 'gestão de páginas (cms)',
    icon: Layers,
    group: 'cms',
    subItems: [
      { id: 'landing', label: 'home / landing page' },
      { id: 'about', label: 'sobre nós (nossa história)' },
      { id: 'programs', label: 'catálogo de programas' },
      { id: 'programa_21_dias', label: '21 dias de escrita' },
      { id: 'programa_cafe_com_letras', label: 'café com letras' },
      { id: 'programa_ciclo', label: 'ciclo de aprofundamento' },
      { id: 'contrate_experiencia', label: 'contrate uma experiência' },
      { id: 'contacts', label: 'canais de contato & redes' },
      { id: 'tour_modal', label: 'modo observador (tour virtual)' },
    ],
  },
  {
    id: 'banners',
    label: 'gestão de banners',
    icon: ImageIcon,
    group: 'cms',
  },
  {
    id: 'gallery',
    label: 'banco de mídias & galeria',
    icon: Images,
    group: 'cms',
  },
  {
    id: 'broadcasts',
    label: 'transmissões & broadcasts',
    icon: Megaphone,
    group: 'comunidade',
  },
  {
    id: 'moderation',
    label: 'moderação da fogueira',
    icon: MessageCircle,
    group: 'comunidade',
  },
  {
    id: 'messages',
    label: 'mensagens de contato',
    icon: Mail,
    group: 'comunidade',
  },
  {
    id: 'checkout',
    label: 'métricas de checkout',
    icon: ShoppingCart,
    group: 'comunidade',
  },
];

export default function AdminSidebar() {
  const { profile, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const activeSub = searchParams.get('sub') || '';

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('admin_sidebar_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    [activeTab]: true,
  });

  const [hoveredFlyout, setHoveredFlyout] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    if (activeTab) {
      setOpenSubMenus((prev) => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab]);

  const toggleExpanded = () => {
    const next = !isExpanded;
    setIsExpanded(next);
    localStorage.setItem('admin_sidebar_expanded', String(next));
    window.dispatchEvent(new CustomEvent('admin-sidebar-toggle', { detail: { expanded: next } }));
  };

  const toggleSubMenu = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubMenus((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleSelectTab = (tabId: string, subId?: string) => {
    const params: Record<string, string> = { tab: tabId };
    if (subId) {
      params.sub = subId;
    }
    setSearchParams(params);
    setMobileDrawerOpen(false);
    setHoveredFlyout(null);
  };

  const renderNavGroup = (
    groupKey: 'geral' | 'cms' | 'comunidade',
    groupLabel: string,
    forceExpanded: boolean = false
  ) => {
    const groupItems = ADMIN_NAV_ITEMS.filter((item) => item.group === groupKey);
    const showExpanded = forceExpanded || isExpanded;

    return (
      <div key={groupKey} className="space-y-1">
        {showExpanded && (
          <div className="px-3 pt-3 pb-1 text-xs font-bold font-editorial text-acentoAzul/80 lowercase tracking-wider border-b border-papelKraft/30 mb-1">
            {groupLabel}
          </div>
        )}

        {groupItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const hasSub = item.subItems && item.subItems.length > 0;
          const isSubOpen = !!openSubMenus[item.id];

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => !showExpanded && setHoveredFlyout(item.id)}
              onMouseLeave={() => !showExpanded && setHoveredFlyout(null)}
            >
              {/* MAIN ITEM BUTTON */}
              <div
                onClick={() => handleSelectTab(item.id, hasSub ? item.subItems![0].id : undefined)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-2xl transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-acentoAzul text-white shadow-xs font-bold'
                    : 'text-tintaCarvao/85 hover:text-acentoAzul hover:bg-papelKraft/25'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                      isActive ? 'bg-white/15 text-white' : 'text-tintaCarvao/70 group-hover:text-acentoAzul'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {showExpanded && (
                    <span className="text-sm font-corpo font-medium lowercase truncate leading-tight">
                      {item.label}
                    </span>
                  )}
                </div>

                {showExpanded && hasSub && (
                  <button
                    onClick={(e) => toggleSubMenu(item.id, e)}
                    className="p-1 rounded-lg hover:bg-black/10 text-current/70 transition-colors"
                    aria-label="expandir submenu"
                  >
                    {isSubOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {/* TREE SUB-ITEMS (EXPANDED MODE) */}
              {showExpanded && hasSub && isSubOpen && (
                <div className="relative ml-6 pl-3 border-l border-papelKraft/60 space-y-1 my-1 animate-fadeIn">
                  {item.subItems!.map((sub) => {
                    const isSubActive = isActive && activeSub === sub.id;

                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSelectTab(item.id, sub.id)}
                        className={`w-full text-left flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs sm:text-[13px] font-corpo lowercase transition-all cursor-pointer ${
                          isSubActive
                            ? 'bg-acentoTerracota text-white font-bold shadow-xs'
                            : 'text-tintaCarvao/75 hover:text-acentoAzul hover:bg-white/80'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                        <span className="truncate">{sub.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* FLYOUT POPOVER CARD (COLLAPSED ICON-ONLY MODE) */}
              {!showExpanded && hoveredFlyout === item.id && (
                <div className="absolute left-16 top-0 z-[9999] bg-papelClaro rounded-2xl border border-papelKraft/60 shadow-kraft-lg p-3.5 min-w-[220px] animate-fadeIn space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-papelKraft/30 text-acentoAzul">
                    <Icon className="w-4.5 h-4.5" />
                    <span className="text-sm font-bold font-editorial lowercase">{item.label}</span>
                  </div>

                  {hasSub ? (
                    <div className="space-y-1">
                      {item.subItems!.map((sub) => {
                        const isSubActive = isActive && activeSub === sub.id;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => handleSelectTab(item.id, sub.id)}
                            className={`w-full text-left flex items-center gap-2 py-1.5 px-2.5 rounded-xl text-xs font-corpo lowercase transition-all cursor-pointer ${
                              isSubActive
                                ? 'bg-acentoTerracota text-white font-bold'
                                : 'text-tintaCarvao/80 hover:bg-bgPlataforma hover:text-acentoAzul'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 shrink-0" />
                            <span className="truncate">{sub.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleSelectTab(item.id)}
                      className="w-full text-left py-1.5 px-2.5 rounded-xl text-xs font-corpo text-acentoAzul bg-acentoAzul/10 font-bold lowercase cursor-pointer"
                    >
                      abrir seção →
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {/* DESKTOP SIDEBAR ADMIN (COMPLETAMENTE NAVEGÁVEL NO LADO ESQUERDO) */}
      <aside
        className={`hidden lg:flex fixed left-4 top-4 bottom-4 z-40 flex-col bg-papelClaro/95 backdrop-blur-md rounded-3xl border border-papelKraft/60 shadow-kraft-lg transition-all duration-300 overflow-visible ${
          isExpanded ? 'w-64' : 'w-20'
        }`}
      >
        {/* CABEÇALHO DO SIDEBAR: LOGO OFICIAL + CONTROLE DE EXPANSÃO */}
        <div className="p-4 border-b border-papelKraft/40 flex items-center justify-between gap-2 bg-bgPlataforma/40 rounded-t-3xl">
          {isExpanded ? (
            <Link to="/admin" className="flex items-center gap-2 min-w-0 group">
              <img
                src={BRAND_ASSETS.logos.horizontalPng}
                alt="solta o verbo admin"
                className="h-7 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
                }}
              />
            </Link>
          ) : (
            <div className="w-9 h-9 rounded-2xl bg-papelClaro border border-papelKraft/60 flex items-center justify-center shrink-0 mx-auto shadow-xs">
              <img src={BRAND_ASSETS.logos.icon} alt="solta o verbo" className="w-6 h-6" />
            </div>
          )}

          <button
            onClick={toggleExpanded}
            className="p-1.5 rounded-xl hover:bg-papelKraft/30 text-tintaCarvao/70 hover:text-acentoAzul transition-colors cursor-pointer shrink-0"
            title={isExpanded ? 'recolher menu lateral' : 'expandir menu lateral'}
          >
            {isExpanded ? <ChevronLeft className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* BARRA DE AÇÕES DO USUÁRIO (ALUNA + PERFIL DESDOBRÁVEL SEM CORTE) */}
        <div className="p-3 border-b border-papelKraft/30 bg-papelClaro/80">
          {isExpanded ? (
            <div className="flex items-center justify-between gap-2">
              {/* BOTÃO ALUNA */}
              <Link
                to="/dashboard"
                className="flex-1 flex items-center justify-between py-1.5 px-3 rounded-full bg-acentoTerracota/15 hover:bg-acentoTerracota/25 border border-acentoTerracota/40 text-acentoTerracota text-xs font-bold font-corpo lowercase transition-all shadow-xs cursor-pointer"
                title="voltar para a plataforma de alunas"
              >
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-acentoTerracota" />
                  <span>aluna</span>
                </div>
                <span className="text-[10px] opacity-75">→</span>
              </Link>

              {/* PERFIL AVATAR */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 p-1 hover:bg-papelKraft/30 rounded-full border border-papelKraft/60 transition-all focus:outline-none cursor-pointer shadow-xs"
                  aria-label="menu do perfil"
                >
                  <div className="w-7 h-7 rounded-full bg-acentoAzul text-white font-bold flex items-center justify-center border border-acentoOliva overflow-hidden">
                    {profile?.profile_picture_url ? (
                      <img
                        src={profile.profile_picture_url}
                        alt={profile.display_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold lowercase">
                        {profile?.display_name?.charAt(0).toLowerCase() || 'a'}
                      </span>
                    )}
                  </div>
                </button>

                {/* DROPDOWN DO PERFIL FLUTUANTE À DIREITA (SEM CORTE DE OVERFLOW) */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute left-full top-0 ml-2 w-56 bg-papelClaro rounded-2xl border border-papelKraft/60 shadow-kraft-lg z-[9999] overflow-hidden py-2 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-papelKraft/40">
                        <p className="text-xs font-bold font-corpo text-acentoAzul lowercase truncate">
                          {profile?.display_name || 'administradora'}
                        </p>
                        <p className="text-[10px] text-tintaCarvao/60 font-corpo lowercase">
                          painel admin
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-tintaCarvao hover:bg-bgPlataforma hover:text-acentoAzul transition-all lowercase"
                      >
                        <Compass className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span>plataforma aluna</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-tintaCarvao hover:bg-bgPlataforma hover:text-acentoAzul transition-all lowercase"
                      >
                        <User className="w-3.5 h-3.5 text-acentoAzul" />
                        <span>meu perfil</span>
                      </Link>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-acentoTerracota hover:bg-acentoTerracota/10 transition-all w-full text-left lowercase cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span>sair</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              {/* COLLAPSED ALUNA BUTTON */}
              <Link
                to="/dashboard"
                className="w-9 h-9 rounded-2xl bg-acentoTerracota/15 hover:bg-acentoTerracota/25 border border-acentoTerracota/40 text-acentoTerracota flex items-center justify-center shadow-xs transition-all"
                title="plataforma aluna"
              >
                <Compass className="w-4 h-4 text-acentoTerracota" />
              </Link>

              {/* COLLAPSED PROFILE BUTTON */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="w-9 h-9 rounded-full bg-acentoAzul text-white font-bold flex items-center justify-center border border-acentoOliva overflow-hidden shadow-xs cursor-pointer"
                  title="perfil admin"
                >
                  {profile?.profile_picture_url ? (
                    <img
                      src={profile.profile_picture_url}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold lowercase">
                      {profile?.display_name?.charAt(0).toLowerCase() || 'a'}
                    </span>
                  )}
                </button>

                {/* DROPDOWN DO PERFIL EM MODO RECOLHIDO FLUTUANTE À DIREITA */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute left-full top-0 ml-3 w-56 bg-papelClaro rounded-2xl border border-papelKraft/60 shadow-kraft-lg z-[9999] overflow-hidden py-2 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-papelKraft/40">
                        <p className="text-xs font-bold font-corpo text-acentoAzul lowercase truncate">
                          {profile?.display_name || 'administradora'}
                        </p>
                        <p className="text-[10px] text-tintaCarvao/60 font-corpo lowercase">
                          painel admin
                        </p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-tintaCarvao hover:bg-bgPlataforma hover:text-acentoAzul transition-all lowercase"
                      >
                        <Compass className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span>plataforma aluna</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-tintaCarvao hover:bg-bgPlataforma hover:text-acentoAzul transition-all lowercase"
                      >
                        <User className="w-3.5 h-3.5 text-acentoAzul" />
                        <span>meu perfil</span>
                      </Link>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-acentoTerracota hover:bg-acentoTerracota/10 transition-all w-full text-left lowercase cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span>sair</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* CORPO DO SIDEBAR COM ROLAGEM ESTILIZADA DA MARCA */}
        <div className="flex-1 overflow-y-auto sidebar-scrollbar p-3 space-y-4 rounded-b-3xl">
          {renderNavGroup('geral', 'gestão geral')}
          {renderNavGroup('cms', 'conteúdo do site (cms)')}
          {renderNavGroup('comunidade', 'comunidade & vendas')}
        </div>

        {/* RODAPÉ DO SIDEBAR (INDICADOR DE VERSÃO E STATUS) */}
        {isExpanded && (
          <div className="p-3 border-t border-papelKraft/40 bg-bgPlataforma/50 text-[10px] font-corpo text-tintaCarvao/60 lowercase text-center rounded-b-3xl">
            <span>solta o verbo • modo admin</span>
          </div>
        )}
      </aside>

      {/* MOBILE TRIGGER BUTTON (FLUTUANTE NO CANTO SUPERIOR OU BOTTOM) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="p-3.5 rounded-full bg-acentoAzul text-white shadow-kraft-lg flex items-center gap-2 border border-acentoOliva cursor-pointer"
          aria-label="abrir menu admin"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs font-bold font-corpo lowercase">menu admin</span>
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-tintaCarvao/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileDrawerOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-papelClaro h-full shadow-2xl flex flex-col z-10 border-r border-papelKraft/60">
            {/* CABEÇALHO DO DRAWER MOBILE */}
            <div className="p-4 border-b border-papelKraft/40 flex items-center justify-between bg-bgPlataforma">
              <Link to="/admin" onClick={() => setMobileDrawerOpen(false)} className="flex items-center gap-2">
                <img
                  src={BRAND_ASSETS.logos.horizontalPng}
                  alt="solta o verbo admin"
                  className="h-6 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
                  }}
                />
              </Link>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-xl text-tintaCarvao/70 hover:text-acentoAzul transition-colors cursor-pointer"
                aria-label="fechar menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BARRA DE AÇÕES RÁPIDAS MOBILE (ALUNA + MEU PERFIL / SAIR) */}
            <div className="p-3 border-b border-papelKraft/30 bg-papelClaro/80 flex items-center justify-between gap-2">
              <Link
                to="/dashboard"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 flex items-center justify-between py-1.5 px-3 rounded-full bg-acentoTerracota/15 hover:bg-acentoTerracota/25 border border-acentoTerracota/40 text-acentoTerracota text-xs font-bold font-corpo lowercase transition-all shadow-xs cursor-pointer"
              >
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-acentoTerracota" />
                  <span>aluna</span>
                </div>
                <span className="text-[10px] opacity-75">→</span>
              </Link>

              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  signOut();
                }}
                className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-acentoTerracota/10 hover:bg-acentoTerracota/20 border border-acentoTerracota/30 text-acentoTerracota text-xs font-corpo lowercase transition-all cursor-pointer"
                title="sair"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>sair</span>
              </button>
            </div>

            {/* ITENS DO MENU NAVEGÁVEL MOBILE (SEMPRE EXPANDIDOS) */}
            <div className="flex-1 overflow-y-auto sidebar-scrollbar p-3 space-y-4">
              {renderNavGroup('geral', 'gestão geral', true)}
              {renderNavGroup('cms', 'conteúdo do site (cms)', true)}
              {renderNavGroup('comunidade', 'comunidade & vendas', true)}
            </div>

            {/* RODAPÉ DO DRAWER MOBILE */}
            <div className="p-3 border-t border-papelKraft/40 bg-bgPlataforma/50 text-[10px] font-corpo text-tintaCarvao/60 lowercase text-center">
              <span>solta o verbo • modo admin</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
