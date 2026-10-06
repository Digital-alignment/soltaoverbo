import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import CourseManagement from '../components/CourseManagement';
import ContactMessagesManagement from '../components/ContactMessagesManagement';
import BannerManagement from '../components/BannerManagement';
import BroadcastManagement from '../components/BroadcastManagement';
import CommentModeration from '../components/CommentModeration';
import CheckoutAnalytics from '../components/CheckoutAnalytics';
import AdminFinancasManager from '../components/AdminFinancasManager';
import AdminEmailFlowsManager from '../components/AdminEmailFlowsManager';
import AdminCouponsManager from '../components/AdminCouponsManager';
import PageContentManagement from '../components/PageContentManagement';
import MediaGalleryManagement from '../components/MediaGalleryManagement';
import Admin21DiasHub from '../components/admin/hubs/Admin21DiasHub';
import AdminCicloHub from '../components/admin/hubs/AdminCicloHub';
import AdminCafeHub from '../components/admin/hubs/AdminCafeHub';
import AdminExperienciasHub from '../components/admin/hubs/AdminExperienciasHub';
import StudentInspectionDrawer from '../components/admin/StudentInspectionDrawer';
import { ADMIN_NAV_ITEMS } from '../components/AdminSidebar';
import { StudentCourseProgress } from '../types/productHubs';
import {
  Users,
  BookOpen,
  Mail,
  Image as ImageIcon,
  Instagram,
  Linkedin,
  FileText,
  Search,
  Filter,
  X,
  Megaphone,
  MessageCircle,
  ShoppingCart,
  Download,
  Shield,
  Calendar,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Plus,
  Eye,
} from 'lucide-react';
import { calculateTrialStatus, isEntitlementActive, Entitlement } from '../lib/entitlements';
import { APP_VERSION } from '../config/version';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users_profiles']['Row'] & {
  email?: string;
};
type Course = Database['public']['Tables']['courses']['Row'];

const VALID_TABS = [
  'dashboard',
  'financas',
  'cupons',
  'email_flows',
  'programa_21_dias',
  'programa_ciclo',
  'programa_cafe_com_letras',
  'contrate_experiencia',
  'users',
  'courses',
  'messages',
  'banners',
  'broadcasts',
  'moderation',
  'checkout',
  'pages',
  'gallery',
] as const;
type TabType = typeof VALID_TABS[number];

export default function Admin() {
  const { profile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [entitlementsMap, setEntitlementsMap] = useState<Record<string, Entitlement[]>>({});

  // Estado para Ficha Poética da Aluna (Student Inspection Drawer)
  const [selectedStudent, setSelectedStudent] = useState<StudentCourseProgress | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(() => {
    const saved = localStorage.getItem('admin_sidebar_expanded');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    const handleToggle = (e: CustomEvent) => {
      setSidebarExpanded(e.detail.expanded);
    };
    window.addEventListener('admin-sidebar-toggle' as any, handleToggle);
    return () => window.removeEventListener('admin-sidebar-toggle' as any, handleToggle);
  }, []);

  const rawTab = searchParams.get('tab');
  const activeSub = searchParams.get('sub') || '';
  const activeTab: TabType = VALID_TABS.includes(rawTab as TabType) ? (rawTab as TabType) : 'dashboard';

  const setActiveTab = (tab: TabType) => {
    setSearchParams({ tab }, { replace: true });
  };
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    paidUsers: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'free' | 'paid' | 'admin' | 'trial_active' | 'trial_expired' | 'has_product'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');

  const usersRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const bannersRef = useRef<HTMLDivElement>(null);
  const broadcastsRef = useRef<HTMLDivElement>(null);
  const moderationRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, dateFilter, users]);

  useEffect(() => {
    const scrollToSection = () => {
      let ref: React.RefObject<HTMLDivElement> | null = null;

      switch (activeTab) {
        case 'users':
          ref = usersRef;
          break;
        case 'courses':
          ref = coursesRef;
          break;
        case 'banners':
          ref = bannersRef;
          break;
        case 'broadcasts':
          ref = broadcastsRef;
          break;
        case 'moderation':
          ref = moderationRef;
          break;
        case 'messages':
          ref = messagesRef;
          break;
        case 'checkout':
          ref = checkoutRef;
          break;
        case 'pages':
          ref = pagesRef;
          break;
        case 'gallery':
          ref = galleryRef;
          break;
      }

      if (ref?.current) {
        setTimeout(() => {
          ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    };

    scrollToSection();
  }, [activeTab]);

  const filterUsers = () => {
    let filtered = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.display_name.toLowerCase().includes(query) ||
          (user.email && user.email.toLowerCase().includes(query))
      );
    }

    if (roleFilter !== 'all') {
      if (roleFilter === 'free' || roleFilter === 'paid' || roleFilter === 'admin') {
        filtered = filtered.filter((user) => user.role === roleFilter);
      } else if (roleFilter === 'trial_active') {
        filtered = filtered.filter((user) => {
          const userEnts = (entitlementsMap[user.id] || []).filter(isEntitlementActive);
          const trial = calculateTrialStatus(user.created_at, user.role === 'admin' || user.role === 'paid' || userEnts.length > 0);
          return trial.isTrial;
        });
      } else if (roleFilter === 'trial_expired') {
        filtered = filtered.filter((user) => {
          const userEnts = (entitlementsMap[user.id] || []).filter(isEntitlementActive);
          if (user.role === 'admin' || user.role === 'paid' || userEnts.length > 0) return false;
          const trial = calculateTrialStatus(user.created_at, false);
          return trial.isExpired;
        });
      } else if (roleFilter === 'has_product') {
        filtered = filtered.filter((user) => {
          const userEnts = (entitlementsMap[user.id] || []).filter(isEntitlementActive);
          return userEnts.length > 0;
        });
      }
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      if (dateFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      } else if (dateFilter === '90days') {
        filterDate.setDate(now.getDate() - 90);
      }

      filtered = filtered.filter((user) => new Date(user.created_at) >= filterDate);
    }

    setFilteredUsers(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setDateFilter('all');
  };

  const downloadUsersCSV = () => {
    const escapeCSV = (value: string | null | undefined): string => {
      if (!value) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const roleNames: { [key: string]: string } = {
      free: 'gratuito',
      paid: 'premium',
      admin: 'administrador'
    };

    const headers = ['nome', 'email', 'instagram', 'linkedin', 'substack', 'email publico', 'plano', 'produtos ativos', 'status do teste (96h)', 'data de registro'];

    const rows = filteredUsers.map(user => {
      const userEnts = (entitlementsMap[user.id] || []).filter(isEntitlementActive);
      const activeSlugs = userEnts.map((e) => e.product_slug).join(', ');
      const trial = calculateTrialStatus(user.created_at, user.role === 'admin' || user.role === 'paid' || userEnts.length > 0);
      const trialStatusText = user.role === 'admin' || userEnts.length > 0 || user.role === 'paid'
        ? 'coberto por plano'
        : trial.isTrial
        ? `ativo (${trial.daysRemaining}d restantes)`
        : 'expirado (modo leitura)';

      return [
        escapeCSV(user.display_name),
        escapeCSV(user.email),
        escapeCSV(user.instagram_url),
        escapeCSV(user.linkedin_url),
        escapeCSV(user.substack_url),
        escapeCSV(user.email_public),
        escapeCSV(roleNames[user.role] || user.role),
        escapeCSV(activeSlugs || 'nenhum'),
        escapeCSV(trialStatusText),
        escapeCSV(new Date(user.created_at).toLocaleDateString('pt-BR'))
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `alunas-soltaoverbo-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenStudentDrawer = (u: UserProfile) => {
    let completedCount = 0;
    try {
      const raw = localStorage.getItem(`soltaoverbo_completed_lessons_${u.id}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) completedCount = parsed.length;
      }
    } catch (e) {}

    const studentData: StudentCourseProgress = {
      user_id: u.id,
      display_name: u.display_name,
      email: u.email_public || u.email || 'e-mail não disponível',
      profile_picture_url: u.profile_picture_url,
      current_day: completedCount > 0 ? Math.min(21, completedCount) : 1,
      total_days: 21,
      completed_lessons: completedCount,
      last_activity: u.created_at ? `membro desde ${new Date(u.created_at).toLocaleDateString('pt-BR')}` : 'registrada recentemente',
      role: u.role,
      created_at: u.created_at,
      bio: u.bio,
      instagram_url: u.instagram_url,
      linkedin_url: u.linkedin_url,
      substack_url: u.substack_url,
      email_public: u.email_public,
    };
    setSelectedStudent(studentData);
    setIsDrawerOpen(true);
  };

  const loadData = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const usersWithEmails = (usersData || []).map((user) => ({
        ...user,
        email: user.email_public || user.email || '',
      }));

      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      // Buscar entitlements para mapeamento de status
      const { data: entitlementsData } = await supabase
        .from('user_entitlements')
        .select('*');

      const entMap: Record<string, Entitlement[]> = {};
      (entitlementsData || []).forEach((e) => {
        if (!entMap[e.user_id]) entMap[e.user_id] = [];
        entMap[e.user_id].push(e as Entitlement);
      });
      setEntitlementsMap(entMap);

      setUsers(usersWithEmails);
      setFilteredUsers(usersWithEmails);
      setCourses(coursesData || []);

      const freeCount = usersWithEmails.filter((u) => u.role === 'free').length;
      const paidCount = usersWithEmails.filter((u) => u.role === 'paid').length;

      setStats({
        totalUsers: usersWithEmails.length,
        freeUsers: freeCount,
        paidUsers: paidCount,
        totalCourses: coursesData?.length || 0,
      });
    } catch (error) {
      console.error('erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'free' | 'paid' | 'admin') => {
    try {
      const { error } = await supabase
        .from('users_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('erro ao atualizar papel:', error);
        alert(`erro ao atualizar papel: ${error.message}`);
        return;
      }

      await loadData();
    } catch (err) {
      console.error('erro inesperado:', err);
      alert('erro inesperado ao atualizar papel da aluna.');
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && activeSub) {
      if (['all', 'free', 'paid', 'admin'].includes(activeSub)) {
        setRoleFilter(activeSub as 'all' | 'free' | 'paid' | 'admin');
      }
    }
  }, [activeTab, activeSub]);

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-bgPlataforma text-tintaCarvao flex items-center justify-center p-4">
        <div className="bg-papelClaro p-8 rounded-3xl border border-papelKraft/40 text-center max-w-md space-y-3">
          <Shield className="w-10 h-10 text-acentoTerracota mx-auto" />
          <h2 className="text-xl font-editorial font-bold text-acentoAzul lowercase">acesso restrito</h2>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            você não possui permissão de administração para acessar este painel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8 pb-28 lg:pb-12">
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 transition-all duration-300 ${
          sidebarExpanded ? 'lg:pl-72' : 'lg:pl-24'
        }`}
      >
        
        {/* BREADCRUMB BAR PARA ABAS QUE NÃO POSSUEM CABEÇALHO/BREADCRUMB PRÓPRIO */}
        {!['programa_21_dias', 'programa_ciclo', 'programa_cafe_com_letras', 'contrate_experiencia'].includes(activeTab) && activeTab !== 'dashboard' && (
          <div className="flex items-center justify-between gap-2 border-b border-papelKraft/40 pb-3">
            <div className="flex items-center gap-2 text-xs font-corpo font-light text-tintaCarvao/70 lowercase tracking-wide">
              <button
                type="button"
                onClick={() => setActiveTab('dashboard')}
                className="font-light text-acentoAzul hover:underline cursor-pointer"
              >
                painel administrativo
              </button>
              <span className="text-tintaCarvao/40 font-light">/</span>
              <span className="font-light text-acentoTerracota">
                {ADMIN_NAV_ITEMS.find((item) => item.id === activeTab)?.label || activeTab}
              </span>
              {activeSub && (
                <>
                  <span className="text-tintaCarvao/40 font-light">/</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul font-light text-[11px]">
                    {ADMIN_NAV_ITEMS.find((item) => item.id === activeTab)?.subItems?.find((sub) => sub.id === activeSub)?.label || activeSub}
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* ABA DASHBOARD PRINCIPAL (CABECALHO + METRICAS + SHORTCUTS) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* CABEÇALHO DA DASHBOARD */}
            <div className="border-b border-papelKraft/40 pb-4 space-y-0.5">
              <div className="flex items-center gap-2 mb-1 text-xs font-corpo font-light text-tintaCarvao/70 lowercase tracking-wide">
                <span className="font-light text-acentoAzul">painel administrativo</span>
                <span className="text-tintaCarvao/40 font-light">/</span>
                <span className="font-light text-acentoTerracota">
                  dashboard
                </span>
              </div>

              <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
                painel administrativo
              </h1>
              <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
                gestão de alunas, oficinas, banners, transmissões e moderação da plataforma
              </p>
            </div>

            {/* CARTÕES DE MÉTRICAS GERAIS (RITUAL STATS) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
                <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                  total de alunas
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoAzul">
                    {stats.totalUsers}
                  </span>
                  <span className="text-[10px] text-tintaCarvao/50 font-corpo">cadastros</span>
                </div>
              </div>

              <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
                <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                  membros gratuitos
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-gesto font-normal text-2xl sm:text-3xl text-tintaCarvao/80">
                    {stats.freeUsers}
                  </span>
                  <span className="text-[10px] text-tintaCarvao/50 font-corpo">alunas</span>
                </div>
              </div>

              <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
                <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                  membros premium
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoTerracota">
                    {stats.paidUsers}
                  </span>
                  <span className="text-[10px] text-tintaCarvao/50 font-corpo">assinantes</span>
                </div>
              </div>

              <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
                <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                  total de oficinas
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoOliva">
                    {stats.totalCourses}
                  </span>
                  <span className="text-[10px] text-tintaCarvao/50 font-corpo">cursos</span>
                </div>
              </div>
            </div>

            {/* PAINEL DE VISÃO GERAL E ATALHOS RÁPIDOS */}
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
                      visão geral & atalhos
                    </span>
                  </div>
                  <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
                    dashboard administrativo
                  </h2>
                  <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                    central de atalhos rápidos, tarefas, consultas e agenda
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="px-4 py-2 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[18px] lowercase shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>consultar aluna</span>
                  </button>
                </div>
              </div>

              {/* GRID DE CARTÕES DE ATALHOS RÁPIDOS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-editorial text-acentoAzul lowercase">
                      consultar aluna
                    </span>
                    <Search className="w-4 h-4 text-acentoTerracota" />
                  </div>
                  <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                    busca rápida por e-mail ou nome para consultar papéis de assinatura e detalhes de conta.
                  </p>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="text-xs font-bold font-corpo text-acentoAzul hover:underline flex items-center gap-1 lowercase cursor-pointer"
                  >
                    <span>acessar gestão de alunas →</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-editorial text-acentoAzul lowercase">
                      gestão de páginas cms
                    </span>
                    <Layers className="w-4 h-4 text-acentoTerracota" />
                  </div>
                  <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                    editar frases, textos e fazer upload de fotos da landing page e programas públicos.
                  </p>
                  <button
                    onClick={() => setActiveTab('pages')}
                    className="text-xs font-bold font-corpo text-acentoAzul hover:underline flex items-center gap-1 lowercase cursor-pointer"
                  >
                    <span>acessar cms →</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-papelKraft/40 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-editorial text-acentoAzul lowercase">
                      nova oficina & cursos
                    </span>
                    <BookOpen className="w-4 h-4 text-acentoOliva" />
                  </div>
                  <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                    adicionar novas lições, cadastrar áudios binaurais ou criar módulos para a comunidade.
                  </p>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="text-xs font-bold font-corpo text-acentoAzul hover:underline flex items-center gap-1 lowercase cursor-pointer"
                  >
                    <span>gerenciar oficinas →</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HUBS DE PROGRAMAS E PRODUTOS */}
        {activeTab === 'programa_21_dias' && <Admin21DiasHub />}
        {activeTab === 'programa_ciclo' && <AdminCicloHub />}
        {activeTab === 'programa_cafe_com_letras' && <AdminCafeHub />}
        {activeTab === 'contrate_experiencia' && <AdminExperienciasHub />}

        {/* ABA 1: GERENCIAR ALUNAS */}
        {activeTab === 'users' && (
          <div ref={usersRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
              <div>
                <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
                  gerenciar alunas & membros
                </h2>
                <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                  listagem completa, papéis de acesso e exportação de relatórios
                </p>
              </div>

              <button
                onClick={downloadUsersCSV}
                disabled={filteredUsers.length === 0}
                className="px-4 py-2 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[19px] lowercase shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                title="exportar lista de alunas para CSV"
              >
                <Download className="w-4 h-4" />
                <span>exportar csv ({filteredUsers.length})</span>
              </button>
            </div>

            {/* BARRA DE BUSCA E FILTROS */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                
                {/* Campo de Busca */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tintaCarvao/40" />
                  <input
                    type="text"
                    placeholder="buscar por nome ou e-mail..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-tintaCarvao/40 hover:text-tintaCarvao"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filtro de Plano */}
                <div className="w-full sm:w-auto">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
                  >
                    <option value="all">todos os planos & acessos</option>
                    <option value="trial_active">🌱 teste ativo (4 dias)</option>
                    <option value="trial_expired">⏳ teste expirado (modo leitura)</option>
                    <option value="has_product">✨ com produto / assinatura</option>
                    <option value="free">plano gratuito</option>
                    <option value="paid">plano premium</option>
                    <option value="admin">administradores</option>
                  </select>
                </div>

                {/* Filtro de Data */}
                <div className="w-full sm:w-auto">
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as 'all' | '7days' | '30days' | '90days')}
                    className="w-full px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
                  >
                    <option value="all">todo o período</option>
                    <option value="7days">últimos 7 dias</option>
                    <option value="30days">últimos 30 dias</option>
                    <option value="90days">últimos 90 dias</option>
                  </select>
                </div>
              </div>

              {(searchQuery || roleFilter !== 'all' || dateFilter !== 'all') && (
                <div className="flex items-center justify-between text-xs font-corpo text-tintaCarvao/70 pt-1">
                  <span>
                    exibindo <strong className="text-acentoAzul">{filteredUsers.length}</strong> de {users.length} alunas
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-acentoTerracota hover:underline flex items-center gap-1 font-bold lowercase"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>limpar filtros</span>
                  </button>
                </div>
              )}
            </div>

            {/* LISTAGEM DE CARTÕES DE ALUNAS */}
            {loading ? (
              <LoadingPage />
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-white p-8 rounded-2xl border border-papelKraft/30 space-y-3">
                <Users className="w-10 h-10 text-tintaCarvao/30 mx-auto" />
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  nenhuma aluna encontrada com os filtros selecionados.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                {filteredUsers.map((user) => {
                  const userEnts = (entitlementsMap[user.id] || []).filter(isEntitlementActive);
                  const activeSlugs = userEnts.map((e) => e.product_slug);
                  const hasActiveProducts = activeSlugs.length > 0 || user.role === 'paid';
                  const trial = calculateTrialStatus(user.created_at, user.role === 'admin' || hasActiveProducts);

                  return (
                    <div
                      key={user.id}
                      className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      {/* Info da Aluna */}
                      <div
                        onClick={() => handleOpenStudentDrawer(user)}
                        className="space-y-1 min-w-0 flex-1 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-editorial font-bold text-base text-acentoAzul group-hover:text-acentoTerracota transition-colors lowercase truncate">
                            {user.display_name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[10px] font-bold font-corpo lowercase">
                            {user.role === 'admin' ? 'administradora' : user.role === 'paid' && activeSlugs.length === 0 ? 'premium' : user.role === 'paid' ? 'assinante' : 'gratuito'}
                          </span>

                          {/* Badges de Entitlements Ativos */}
                          {activeSlugs.map((slug) => (
                            <span
                              key={slug}
                              className="px-2 py-0.5 rounded-full bg-acentoOliva/20 text-acentoOliva text-[10px] font-bold font-corpo lowercase"
                            >
                              {slug === '21_dias'
                                ? '📖 21 dias'
                                : slug === 'cafe_com_letras'
                                ? '☕ café'
                                : slug === 'ciclo_aprofundamento'
                                ? '✨ ciclo'
                                : slug === 'degustacao_atelier'
                                ? '🌱 degustação'
                                : slug}
                            </span>
                          ))}

                          {/* Badge de Trial de 4 dias se não tem produtos adquiridos */}
                          {!hasActiveProducts && user.role !== 'admin' && (
                            trial.isTrial ? (
                              <span className="px-2 py-0.5 rounded-full bg-acentoOliva/15 text-acentoOliva text-[10px] font-bold font-corpo lowercase">
                                🌱 teste ({trial.daysRemaining}d restantes)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-papelKraft text-tintaCarvao/60 text-[10px] font-bold font-corpo lowercase">
                                ⏳ teste expirado
                              </span>
                            )
                          )}
                        </div>

                        <p className="text-xs font-corpo text-tintaCarvao/80 font-medium truncate">
                          {user.email_public || user.email || 'e-mail não disponível'}
                        </p>

                        <div className="flex items-center gap-3 text-[10px] font-corpo text-tintaCarvao/50">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-tintaCarvao/40" />
                            <span>membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Redes Sociais */}
                      <div className="flex items-center gap-1.5">
                        {user.substack_url && (
                          <a
                            href={user.substack_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors"
                            title="Substack"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {user.instagram_url && (
                          <a
                            href={user.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors"
                            title="Instagram"
                          >
                            <Instagram className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {user.linkedin_url && (
                          <a
                            href={user.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {user.email_public && (
                          <a
                            href={`mailto:${user.email_public}`}
                            className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors"
                            title="E-mail Público"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {/* Botão de Ver Ficha Poética & Seletor de Papel */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenStudentDrawer(user)}
                          className="px-3.5 py-1.5 rounded-xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[18px] lowercase transition-all shadow-xs flex items-center gap-1.5 cursor-pointer hover:scale-105"
                          title="abrir ficha poética da aluna e ver seus textos no atelier"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>ver ficha →</span>
                        </button>

                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value as 'free' | 'paid' | 'admin')}
                          className="px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-bold font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
                        >
                          <option value="free">gratuito</option>
                          <option value="paid">premium</option>
                          <option value="admin">admin</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAINEL LATERAL DE INSPEÇÃO DE ALUNA (FICHA POÉTICA) */}
            <StudentInspectionDrawer
              isOpen={isDrawerOpen}
              onClose={() => {
                setIsDrawerOpen(false);
                loadData();
              }}
              student={selectedStudent}
              productSlug="programa_21_dias"
              productName="visão geral do coletivo"
            />
          </div>
        )}

        {/* ABA 2: OFICINAS & CURSOS */}
        {activeTab === 'courses' && (
          <div ref={coursesRef}>
            <CourseManagement courses={courses} onRefresh={loadData} />
          </div>
        )}

        {/* ABA 3: BANNERS */}
        {activeTab === 'banners' && (
          <div ref={bannersRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <BannerManagement />
          </div>
        )}

        {/* ABA 4: BROADCASTS */}
        {activeTab === 'broadcasts' && (
          <div ref={broadcastsRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <BroadcastManagement />
          </div>
        )}

        {/* ABA 5: MODERAÇÃO DA FOGUEIRA E COMENTÁRIOS */}
        {activeTab === 'moderation' && (
          <div ref={moderationRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <CommentModeration />
          </div>
        )}

        {/* ABA 6: MENSAGENS DE CONTATO */}
        {activeTab === 'messages' && (
          <div ref={messagesRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <ContactMessagesManagement />
          </div>
        )}

        {/* ABA 7: CHECKOUT & CONVERSÃO */}
        {activeTab === 'checkout' && (
          <div ref={checkoutRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <CheckoutAnalytics />
          </div>
        )}

        {/* ABA FINANÇAS & ASSINATURAS */}
        {activeTab === 'financas' && (
          <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <AdminFinancasManager />
          </div>
        )}

        {/* ABA FLUXOS & AUTOMAÇÕES DE E-MAIL */}
        {activeTab === 'email_flows' && (
          <AdminEmailFlowsManager />
        )}

        {/* ABA CUPONS & BOLSAS COMUNITÁRIAS */}
        {activeTab === 'cupons' && (
          <AdminCouponsManager />
        )}

        {/* ABA 8: GESTÃO DE PÁGINAS DO SITE (CMS) */}
        {activeTab === 'pages' && (
          <div ref={pagesRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <PageContentManagement selectedSubPage={activeSub} />
          </div>
        )}

        {/* ABA 9: BANCO DE MÍDIAS & GALERIA */}
        {activeTab === 'gallery' && (
          <div ref={galleryRef} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft">
            <MediaGalleryManagement />
          </div>
        )}

        {/* RODAPÉ DO PAINEL */}
        <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-corpo text-tintaCarvao/60 lowercase">
          <span>solta o verbo coletivo • painel administrativo</span>
          <span>versão v{APP_VERSION}</span>
        </div>

      </div>
    </div>
  );
}
