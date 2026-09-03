import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import CourseManagement from '../components/CourseManagement';
import ContactMessagesManagement from '../components/ContactMessagesManagement';
import BannerManagement from '../components/BannerManagement';
import BroadcastManagement from '../components/BroadcastManagement';
import CommentModeration from '../components/CommentModeration';
import CheckoutAnalytics from '../components/CheckoutAnalytics';
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
} from 'lucide-react';
import { APP_VERSION } from '../config/version';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users_profiles']['Row'] & {
  email?: string;
};
type Course = Database['public']['Tables']['courses']['Row'];

export default function Admin() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'messages' | 'banners' | 'broadcasts' | 'moderation' | 'checkout'>('users');
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    paidUsers: 0,
    totalCourses: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'free' | 'paid' | 'admin'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days' | '90days'>('all');

  const usersRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const bannersRef = useRef<HTMLDivElement>(null);
  const broadcastsRef = useRef<HTMLDivElement>(null);
  const moderationRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);

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
      filtered = filtered.filter((user) => user.role === roleFilter);
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

    const headers = ['nome', 'email', 'instagram', 'linkedin', 'substack', 'email publico', 'plano', 'data de registro'];

    const rows = filteredUsers.map(user => [
      escapeCSV(user.display_name),
      escapeCSV(user.email),
      escapeCSV(user.instagram_url),
      escapeCSV(user.linkedin_url),
      escapeCSV(user.substack_url),
      escapeCSV(user.email_public),
      escapeCSV(roleNames[user.role] || user.role),
      escapeCSV(new Date(user.created_at).toLocaleDateString('pt-BR'))
    ]);

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

  const loadData = async () => {
    try {
      const { data: usersData, error: usersError } = await supabase
        .from('users_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      const usersWithEmails = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: authData } = await supabase.auth.admin.getUserById(user.id);
          return {
            ...user,
            email: authData?.user?.email || '',
          };
        })
      );

      const { data: coursesData } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:pl-28">
        
        {/* CABEÇALHO PRINCIPAL DO PAINEL */}
        <div className="border-b border-papelKraft/40 pb-4 space-y-0.5">
          <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
            painel administrativo
          </h1>
          <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
            gestão de alunas, oficinas, banners, transmissões e moderação da plataforma
          </p>
        </div>

        {/* NAVEGAÇÃO DE ABAS EM PÍLDORAS */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-papelKraft/40 pb-2">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-acentoAzul text-white shadow-xs'
                : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>alunas ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-acentoAzul text-white shadow-xs'
                : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>oficinas ({courses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'banners'
                ? 'bg-acentoAzul text-white shadow-xs'
                : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>banners</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'broadcasts'
                ? 'bg-acentoAzul text-white shadow-xs'
                : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>broadcasts</span>
          </button>

          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'moderation'
                ? 'bg-acentoAzul text-white shadow-xs'
                : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>moderação</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'messages'
                ? 'bg-acentoAzul text-white shadow-xs'
                : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>mensagens</span>
          </button>

          <button
            onClick={() => setActiveTab('checkout')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'checkout'
                ? 'bg-acentoTerracota text-white shadow-xs'
                : 'bg-white/80 text-acentoTerracota hover:text-acentoTerracota/90 border border-papelKraft/40'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>checkout</span>
          </button>
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
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'free' | 'paid' | 'admin')}
                    className="w-full px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
                  >
                    <option value="all">todos os planos</option>
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
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Info da Aluna */}
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase truncate">
                          {user.display_name}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[10px] font-bold font-corpo lowercase">
                          {user.role === 'admin' ? 'administradora' : user.role === 'paid' ? 'premium' : 'gratuito'}
                        </span>
                      </div>

                      <p className="text-xs font-corpo text-tintaCarvao/70 truncate">
                        {user.email || 'e-mail não disponível'}
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

                    {/* Seletor de Papel */}
                    <div>
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
                ))}
              </div>
            )}
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

        {/* RODAPÉ DO PAINEL */}
        <div className="pt-6 border-t border-papelKraft/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-corpo text-tintaCarvao/60 lowercase">
          <span>solta o verbo coletivo • painel administrativo</span>
          <span>versão v{APP_VERSION}</span>
        </div>

      </div>
    </div>
  );
}
