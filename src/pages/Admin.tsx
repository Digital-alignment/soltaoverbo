import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import CourseManagement from '../components/CourseManagement';
import ContactMessagesManagement from '../components/ContactMessagesManagement';
import BannerManagement from '../components/BannerManagement';
import BroadcastManagement from '../components/BroadcastManagement';
import CommentModeration from '../components/CommentModeration';
import { Users, BookOpen, Mail, Image, Instagram, Linkedin, FileText, Search, Filter, X, Megaphone, MessageCircle } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'users' | 'courses' | 'messages' | 'banners' | 'broadcasts' | 'moderation'>('users');
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

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.display_name.toLowerCase().includes(query) ||
          (user.email && user.email.toLowerCase().includes(query))
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Date filter
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

  const loadData = async () => {
    try {
      // Fetch users with emails from auth.users
      const { data: usersData, error: usersError } = await supabase
        .from('users_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      // Fetch emails from auth.users for each user
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
      console.error('Erro ao carregar dados:', error);
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
        console.error('Erro ao atualizar papel do usuário:', error);
        alert(`Erro ao atualizar papel do usuário: ${error.message}`);
        return;
      }

      // Show success feedback
      const roleNames = {
        free: 'Gratuito',
        paid: 'Premium',
        admin: 'Administrador'
      };

      alert(`Papel do usuário atualizado para ${roleNames[newRole]} com sucesso!`);

      // Reload data to reflect changes
      await loadData();
    } catch (err) {
      console.error('Erro inesperado:', err);
      alert('Erro inesperado ao atualizar papel do usuário. Tente novamente.');
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-paper">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Acesso negado</h2>
          <p className="text-gray-600 mt-2">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0e6d1' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Painel Administrativo</h1>
          <p className="text-gray-600">Gerencie usuários, cursos, banners e mensagens da plataforma</p>
        </div>

        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'users'
                ? 'bg-white text-amber-600 shadow-lg'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            Usuários
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'courses'
                ? 'bg-white text-amber-600 shadow-lg'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Cursos
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'banners'
                ? 'bg-white text-amber-600 shadow-lg'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            <Image className="w-5 h-5 mr-2" />
            Banners
          </button>
          <button
            onClick={() => setActiveTab('broadcasts')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'broadcasts'
                ? 'bg-white text-amber-600 shadow-lg'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            <Megaphone className="w-5 h-5 mr-2" />
            Broadcasts
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'moderation'
                ? 'bg-white text-amber-600 shadow-lg'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Moderação
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'messages'
                ? 'bg-white text-amber-600 shadow-lg'
                : 'bg-white/60 text-gray-700 hover:bg-white/80'
            }`}
          >
            <Mail className="w-5 h-5 mr-2" />
            Mensagens
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total de Usuários</h3>
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Usuários Gratuitos</h3>
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.freeUsers}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Usuários Premium</h3>
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.paidUsers}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total de Cursos</h3>
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalCourses}</p>
          </div>
        </div>

        {activeTab === 'users' && (
          <div ref={usersRef} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Users className="w-6 h-6 mr-2 text-amber-600" />
              Gerenciar Usuários
            </h2>

            {/* Search and Filter Bar */}
            <div className="mb-6 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Role Filter */}
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as 'all' | 'free' | 'paid' | 'admin')}
                    className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">Todos os planos</option>
                    <option value="free">Plano Gratuito</option>
                    <option value="paid">Plano Premium</option>
                    <option value="admin">Administradores</option>
                  </select>
                </div>

                {/* Date Filter */}
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | '7days' | '30days' | '90days')}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                >
                  <option value="all">Todo o período</option>
                  <option value="7days">Últimos 7 dias</option>
                  <option value="30days">Últimos 30 dias</option>
                  <option value="90days">Últimos 90 dias</option>
                </select>
              </div>

              {/* Active Filters & Clear Button */}
              {(searchQuery || roleFilter !== 'all' || dateFilter !== 'all') && (
                <div className="flex items-center justify-between text-sm">
                  <p className="text-gray-600">
                    Mostrando <span className="font-semibold">{filteredUsers.length}</span> de{' '}
                    <span className="font-semibold">{users.length}</span> usuários
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-32"></div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou a busca para encontrar usuários.
                </p>
                {(searchQuery || roleFilter !== 'all' || dateFilter !== 'all') && (
                  <button
                    onClick={clearFilters}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    Limpar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-lg truncate">
                          {user.display_name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      {/* Social Media Icons */}
                      <div className="flex items-center gap-2">
                        {user.instagram_url && (
                          <a
                            href={user.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 text-white hover:opacity-80 transition-opacity"
                            title="Instagram"
                          >
                            <Instagram className="w-4 h-4" />
                          </a>
                        )}
                        {user.linkedin_url && (
                          <a
                            href={user.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {user.substack_url && (
                          <a
                            href={user.substack_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors"
                            title="Substack"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}
                        {(user.email_public || user.email) && (
                          <a
                            href={`mailto:${user.email_public || user.email}`}
                            className="p-2 rounded-full bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                            title="Email"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                        {!user.instagram_url && !user.linkedin_url && !user.substack_url && (
                          <span className="text-xs text-gray-400 italic px-2">Sem links sociais</span>
                        )}
                      </div>

                      {/* Role Selector */}
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateUserRole(user.id, e.target.value as 'free' | 'paid' | 'admin')
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-colors min-w-[140px] ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                            : user.role === 'paid'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        <option value="free">Gratuito</option>
                        <option value="paid">Premium</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div ref={coursesRef}>
            <CourseManagement courses={courses} onRefresh={loadData} />
          </div>
        )}

        {activeTab === 'banners' && (
          <div ref={bannersRef} className="bg-white rounded-2xl shadow-lg p-6">
            <BannerManagement />
          </div>
        )}

        {activeTab === 'broadcasts' && (
          <div ref={broadcastsRef} className="bg-white rounded-2xl shadow-lg p-6">
            <BroadcastManagement />
          </div>
        )}

        {activeTab === 'moderation' && (
          <div ref={moderationRef} className="bg-white rounded-2xl shadow-lg p-6">
            <CommentModeration />
          </div>
        )}

        {activeTab === 'messages' && (
          <div ref={messagesRef} className="bg-white rounded-2xl shadow-lg p-6">
            <ContactMessagesManagement />
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-white/30 flex justify-between items-center">
          <p className="text-gray-600 text-sm">Plataforma Soltão Overboo - Painel Administrativo</p>
          <p className="text-gray-500 text-xs">v{APP_VERSION}</p>
        </div>
      </div>
    </div>
  );
}
