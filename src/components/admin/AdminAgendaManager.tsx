import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../lib/supabase';
import { meetingsService } from '../../lib/meetingsService';
import { ProductSlug, ProductMeeting, MeetingAudienceType } from '../../types/productHubs';
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  X,
  Users,
  Shield,
  Layers,
  Globe,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Check,
  Edit3,
} from 'lucide-react';

interface UserProfileSimple {
  id: string;
  display_name: string | null;
  email?: string | null;
  role: string | null;
}

const AVAILABLE_PRODUCTS: { slug: ProductSlug; label: string }[] = [
  { slug: 'comunidade', label: 'comunidade (todas as fogueiras)' },
  { slug: 'programa_cafe_com_letras', label: 'café com letras' },
  { slug: 'programa_ciclo', label: 'ciclo de aprofundamento' },
  { slug: 'programa_21_dias', label: '21 dias de escrita' },
  { slug: 'contrate_experiencia', label: 'experiências corporativas (b2b)' },
];

const AVAILABLE_ROLES: { role: string; label: string }[] = [
  { role: 'paid', label: 'alunas pagantes / assinantes ativas' },
  { role: 'trial', label: 'alunas em período de degustação (trial ativo)' },
  { role: 'admin', label: 'administradoras / facilitadoras' },
];

export default function AdminAgendaManager() {
  const [meetings, setMeetings] = useState<ProductMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [usersList, setUsersList] = useState<UserProfileSimple[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAudience, setFilterAudience] = useState<'all' | 'upcoming' | 'past' | 'comunidade' | 'product' | 'role' | 'specific_users'>('all');

  // Modal de Criação / Edição
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeetingId, setEditingMeetingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [productSlug, setProductSlug] = useState<ProductSlug>('comunidade');
  const [audienceType, setAudienceType] = useState<MeetingAudienceType>('all');
  const [targetProducts, setTargetProducts] = useState<ProductSlug[]>([]);
  const [targetRoles, setTargetRoles] = useState<string[]>(['paid']);
  const [targetUserIds, setTargetUserIds] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  useEffect(() => {
    fetchMeetings();
    fetchUsers();
    const unsubscribe = meetingsService.onMeetingsChanged(() => {
      fetchMeetings();
    });
    return () => unsubscribe();
  }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const data = await meetingsService.getAllMeetings();
      setMeetings(data);
    } catch (err) {
      console.error('Error fetching meetings in AdminAgendaManager:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_profiles')
        .select('id, display_name, email, role')
        .order('display_name', { ascending: true })
        .limit(100);

      if (!error && data) {
        setUsersList(data as UserProfileSimple[]);
      }
    } catch (err) {
      console.warn('Could not fetch users for meeting assignment:', err);
    }
  };

  const openCreateModal = () => {
    setEditingMeetingId(null);
    setTitle('');
    // Sugerir amanhã às 19:30
    const tomorrow = new Date(Date.now() + 86400000);
    tomorrow.setHours(19, 30, 0, 0);
    const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setDateTime(localIso);
    setMeetingLink('');
    setDescription('');
    setIsPublished(true);
    setProductSlug('comunidade');
    setAudienceType('all');
    setTargetProducts([]);
    setTargetRoles(['paid']);
    setTargetUserIds([]);
    setUserSearchQuery('');
    setIsModalOpen(true);
  };

  const openEditModal = (meeting: ProductMeeting) => {
    setEditingMeetingId(meeting.id);
    setTitle(meeting.title);
    const d = new Date(meeting.date_time);
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setDateTime(localIso);
    setMeetingLink(meeting.meeting_link || '');
    setDescription(meeting.description || '');
    setIsPublished(meeting.is_published);
    setProductSlug(meeting.product_slug || 'comunidade');
    setAudienceType(meeting.audience_type || 'all');
    setTargetProducts(meeting.target_products || []);
    setTargetRoles(meeting.target_roles || ['paid']);
    setTargetUserIds(meeting.target_user_ids || []);
    setUserSearchQuery('');
    setIsModalOpen(true);
  };

  const handleSaveMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dateTime) return;

    setSaving(true);
    const meetingPayload: Omit<ProductMeeting, 'id'> = {
      product_slug: productSlug,
      title: title.trim().toLowerCase(),
      date_time: new Date(dateTime).toISOString(),
      meeting_link: meetingLink.trim() || undefined,
      description: description.trim().toLowerCase() || undefined,
      is_published: isPublished,
      audience_type: audienceType,
      target_products: audienceType === 'product' ? targetProducts : undefined,
      target_roles: audienceType === 'role' ? targetRoles : undefined,
      target_user_ids: audienceType === 'specific_users' ? targetUserIds : undefined,
    };

    try {
      await meetingsService.saveMeeting(meetingPayload, editingMeetingId || undefined);
      const refreshed = await meetingsService.getAllMeetings();
      setMeetings(refreshed);

      setIsModalOpen(false);
      setFeedbackMsg('encontro salvo com sucesso na agenda.');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } catch (err) {
      console.error('Error saving meeting:', err);
    } finally {
      setSaving(false);
    }
  };

  const togglePublishStatus = async (meeting: ProductMeeting) => {
    try {
      await meetingsService.saveMeeting(
        { ...meeting, is_published: !meeting.is_published },
        meeting.id
      );
      const refreshed = await meetingsService.getAllMeetings();
      setMeetings(refreshed);
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const deleteMeeting = async (id: string) => {
    if (!confirm('deseja realmente excluir este encontro da agenda?')) return;
    try {
      await meetingsService.deleteMeeting(id);
      const refreshed = await meetingsService.getAllMeetings();
      setMeetings(refreshed);
    } catch (err) {
      console.error('Error deleting meeting:', err);
    }
  };

  const copyMeetingLink = (id: string, link?: string) => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle do seletor de produtos
  const toggleProductTarget = (slug: ProductSlug) => {
    setTargetProducts((prev) =>
      prev.includes(slug) ? prev.filter((p) => p !== slug) : [...prev, slug]
    );
  };

  // Toggle do seletor de papéis
  const toggleRoleTarget = (role: string) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  // Toggle do seletor de alunas nominais
  const toggleUserTarget = (userId: string) => {
    setTargetUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Filtragem
  const now = new Date();
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      // Busca por texto
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesDesc = (m.description || '').toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      const mDate = new Date(m.date_time);
      if (filterAudience === 'upcoming') {
        return mDate >= now;
      }
      if (filterAudience === 'past') {
        return mDate < now;
      }
      if (filterAudience === 'comunidade') {
        return m.audience_type === 'all' || !m.audience_type;
      }
      if (filterAudience === 'product') {
        return m.audience_type === 'product';
      }
      if (filterAudience === 'role') {
        return m.audience_type === 'role';
      }
      if (filterAudience === 'specific_users') {
        return m.audience_type === 'specific_users';
      }
      return true;
    });
  }, [meetings, searchQuery, filterAudience]);

  // Estatísticas Bento
  const stats = useMemo(() => {
    const total = meetings.length;
    const upcoming = meetings.filter((m) => new Date(m.date_time) >= now).length;
    const community = meetings.filter((m) => m.audience_type === 'all' || !m.audience_type).length;
    const segmented = meetings.filter((m) => m.audience_type && m.audience_type !== 'all').length;
    return { total, upcoming, community, segmented };
  }, [meetings]);

  // Usuárias filtradas na busca do modal
  const filteredUsersList = useMemo(() => {
    if (!userSearchQuery.trim()) return usersList;
    const q = userSearchQuery.toLowerCase();
    return usersList.filter(
      (u) =>
        (u.display_name || '').toLowerCase().includes(q) ||
        (u.email || '').toLowerCase().includes(q)
    );
  }, [usersList, userSearchQuery]);

  return (
    <div className="space-y-6">
      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div className="p-3.5 rounded-2xl bg-acentoAzul text-white text-xs font-corpo lowercase shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-acentoOliva" />
            <span>{feedbackMsg}</span>
          </div>
          <button type="button" onClick={() => setFeedbackMsg(null)} className="opacity-80 hover:opacity-100">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
              curadoria viva • gestão de encontros
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-editorial text-marromProfundo lowercase tracking-tight">
            agenda & encontros da comunidade
          </h2>
          <p className="text-xs sm:text-sm text-marromTerra/80 font-corpo lowercase mt-1 max-w-2xl">
            planeje, crie e segmente encontros ao vivo, oficinas e rodas de conversa. defina quem pode ver cada encontro: toda a comunidade, alunas de cursos específicos, por papel ou convites nominais.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-5 py-2.5 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white font-corpo text-xs font-medium tracking-wider lowercase shadow-sm transition-transform hover:scale-105 flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>+ agendar novo encontro</span>
        </button>
      </div>

      {/* BENTO STATS METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs">
          <div className="flex items-center justify-between text-acentoAzul mb-2">
            <span className="text-xs font-corpo font-medium lowercase">total de encontros</span>
            <Calendar className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl sm:text-3xl font-editorial font-bold text-marromProfundo lowercase">
            {stats.total}
          </p>
          <span className="text-[11px] text-marromTerra/70 font-corpo lowercase">cadastrados no sistema</span>
        </div>

        <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs">
          <div className="flex items-center justify-between text-acentoTerracota mb-2">
            <span className="text-xs font-corpo font-medium lowercase">próximos agendados</span>
            <Clock className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl sm:text-3xl font-editorial font-bold text-marromProfundo lowercase">
            {stats.upcoming}
          </p>
          <span className="text-[11px] text-marromTerra/70 font-corpo lowercase">nas próximas datas</span>
        </div>

        <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs">
          <div className="flex items-center justify-between text-acentoOliva mb-2">
            <span className="text-xs font-corpo font-medium lowercase">abertos à comunidade</span>
            <Globe className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl sm:text-3xl font-editorial font-bold text-marromProfundo lowercase">
            {stats.community}
          </p>
          <span className="text-[11px] text-marromTerra/70 font-corpo lowercase">visíveis a todas</span>
        </div>

        <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs">
          <div className="flex items-center justify-between text-marromTerra mb-2">
            <span className="text-xs font-corpo font-medium lowercase">segmentados / exclusivos</span>
            <Shield className="w-4 h-4 opacity-80" />
          </div>
          <p className="text-2xl sm:text-3xl font-editorial font-bold text-marromProfundo lowercase">
            {stats.segmented}
          </p>
          <span className="text-[11px] text-marromTerra/70 font-corpo lowercase">por produto, papel ou id</span>
        </div>
      </div>

      {/* BARRA DE FILTROS E BUSCA */}
      <div className="bg-papelClaro rounded-2xl border border-papelKraft/40 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Campo de Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-marromTerra/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="buscar encontro por título ou pauta..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-papelKraft/40 text-xs text-marromProfundo font-corpo lowercase placeholder:text-marromTerra/40 focus:outline-hidden focus:border-acentoAzul shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-marromTerra/50 hover:text-marromProfundo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Contador de Resultados */}
          <span className="text-xs text-marromTerra/70 font-corpo lowercase self-center sm:self-auto">
            mostrando {filteredMeetings.length} de {meetings.length} encontros
          </span>
        </div>

        {/* Abas de Segmentação */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-corpo lowercase">
          {[
            { id: 'all', label: 'todos' },
            { id: 'upcoming', label: 'próximos' },
            { id: 'past', label: 'passados' },
            { id: 'comunidade', label: 'comunidade (abertos)' },
            { id: 'product', label: 'por produto' },
            { id: 'role', label: 'por papel' },
            { id: 'specific_users', label: 'alunas específicas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterAudience(tab.id as any)}
              className={`px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                filterAudience === tab.id
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white hover:bg-papelKraft/20 text-marromTerra border border-papelKraft/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA DE ENCONTROS */}
      {loading ? (
        <div className="py-12 text-center bg-papelClaro rounded-2xl border border-papelKraft/40">
          <Clock className="w-6 h-6 animate-spin text-acentoAzul mx-auto mb-2 opacity-70" />
          <p className="text-xs text-marromTerra font-corpo lowercase">carregando agenda de encontros...</p>
        </div>
      ) : filteredMeetings.length === 0 ? (
        <div className="py-12 text-center bg-papelClaro rounded-2xl border border-papelKraft/40 space-y-3">
          <Calendar className="w-8 h-8 text-marromTerra/40 mx-auto" />
          <p className="text-sm text-marromTerra font-corpo lowercase">
            nenhum encontro encontrado para os filtros selecionados.
          </p>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-4 py-2 rounded-full bg-acentoAzul text-white text-xs font-corpo lowercase shadow-xs hover:bg-acentoAzul/90 inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>agendar novo encontro</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMeetings.map((m) => {
            const dateObj = new Date(m.date_time);
            const isPast = dateObj < now;
            const dayNum = dateObj.getDate();
            const monthStr = dateObj.toLocaleDateString('pt-BR', { month: 'short' });
            const dayOfWeekStr = dateObj.toLocaleDateString('pt-BR', { weekday: 'short' });
            const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            // Identificação de Audiência
            const audience = m.audience_type || 'all';

            return (
              <div
                key={m.id}
                className={`bg-papelClaro rounded-2xl border border-papelKraft/40 p-4 sm:p-5 shadow-xs transition-shadow hover:shadow-sm space-y-3.5 relative ${
                  !m.is_published ? 'opacity-70 bg-papelKraft/10' : ''
                }`}
              >
                {/* TOPO DO CARD: DATA, BADGE DE PRODUTO E ESTADO DE PUBLICAÇÃO */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Bloco de Data Poético */}
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 border border-papelKraft/40 ${
                        isPast
                          ? 'bg-papelKraft text-tintaCarvao'
                          : m.product_slug === 'programa_cafe_com_letras'
                          ? 'bg-acentoAzul text-white'
                          : m.product_slug === 'programa_ciclo'
                          ? 'bg-acentoOliva text-tintaCarvao'
                          : m.product_slug === 'contrate_experiencia'
                          ? 'bg-acentoTerracota text-white'
                          : 'bg-acentoAzul text-white'
                      }`}
                    >
                      <span className="text-[11px] font-corpo font-normal lowercase leading-none">
                        {monthStr}
                      </span>
                      <span className="text-base font-editorial font-bold leading-none mt-0.5">
                        {dayNum}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-marromProfundo font-corpo lowercase">
                          {dayOfWeekStr} às {timeStr}
                        </span>
                        {isPast && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-papelKraft text-tintaCarvao/80 text-[10px] font-corpo lowercase">
                            passado
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-marromTerra/70 font-corpo lowercase">
                        {m.product_slug === 'comunidade'
                          ? 'encontro geral da comunidade'
                          : m.product_slug.replace('programa_', '').replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Toggle de Publicação */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => togglePublishStatus(m)}
                      title={m.is_published ? 'encontro visível (clique para ocultar)' : 'rascunho oculto (clique para publicar)'}
                      className={`p-1.5 rounded-lg border border-papelKraft/40 transition-colors ${
                        m.is_published
                          ? 'bg-acentoOliva/20 text-tintaCarvao hover:bg-acentoOliva/40'
                          : 'bg-white text-marromTerra/50 hover:text-marromProfundo'
                      }`}
                    >
                      {m.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(m)}
                      title="editar encontro"
                      className="p-1.5 rounded-lg bg-white border border-papelKraft/40 text-marromTerra hover:text-acentoAzul transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMeeting(m.id)}
                      title="excluir encontro"
                      className="p-1.5 rounded-lg bg-white border border-papelKraft/40 text-marromTerra hover:text-acentoTerracota transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* TÍTULO E DESCRIÇÃO */}
                <div>
                  <h3 className="text-base sm:text-lg font-editorial font-bold text-marromProfundo lowercase leading-snug">
                    {m.title}
                  </h3>
                  {m.description && (
                    <p className="text-xs text-marromTerra/80 font-corpo lowercase mt-1 line-clamp-2">
                      {m.description}
                    </p>
                  )}
                </div>

                {/* SEGMENTAÇÃO / AUDIÊNCIA TAG */}
                <div className="pt-2 border-t border-papelKraft/30 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {audience === 'all' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-papelKraft/40 text-[11px] font-corpo lowercase text-acentoAzul">
                        <Globe className="w-3 h-3 text-acentoAzul" />
                        <span>toda a comunidade</span>
                      </span>
                    )}

                    {audience === 'product' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-papelKraft/40 text-[11px] font-corpo lowercase text-marromTerra">
                        <Layers className="w-3 h-3 text-acentoOliva" />
                        <span>
                          apenas:{' '}
                          {(m.target_products && m.target_products.length > 0
                            ? m.target_products
                            : [m.product_slug]
                          )
                            .map((p) => p.replace('programa_', '').replace(/_/g, ' '))
                            .join(', ')}
                        </span>
                      </span>
                    )}

                    {audience === 'role' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-papelKraft/40 text-[11px] font-corpo lowercase text-acentoTerracota">
                        <Shield className="w-3 h-3 text-acentoTerracota" />
                        <span>papéis: {(m.target_roles || []).join(', ')}</span>
                      </span>
                    )}

                    {audience === 'specific_users' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-papelKraft/40 text-[11px] font-corpo lowercase text-marromProfundo">
                        <Users className="w-3 h-3 text-acentoAzul" />
                        <span>
                          {m.target_user_ids?.length || 0} aluna(s) selecionada(s)
                        </span>
                      </span>
                    )}
                  </div>

                  {/* LINK DA SALA */}
                  {m.meeting_link && (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => copyMeetingLink(m.id, m.meeting_link)}
                        className="p-1 rounded-md text-marromTerra/60 hover:text-marromProfundo text-[10px] font-corpo lowercase flex items-center gap-1"
                        title="copiar link da sala"
                      >
                        {copiedId === m.id ? (
                          <Check className="w-3 h-3 text-acentoOliva" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      <a
                        href={m.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-acentoAzul hover:underline text-[11px] font-corpo lowercase flex items-center gap-1"
                      >
                        <span>abrir sala</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================
          MODAL DE CRIAÇÃO / EDIÇÃO DE ENCONTRO
         ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tintaCarvao/50 backdrop-blur-xs">
          <div className="bg-papelClaro rounded-3xl border border-papelKraft/50 p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-kraft-lg space-y-6">
            <div className="flex items-center justify-between border-b border-papelKraft/40 pb-4">
              <div>
                <span className="text-[11px] font-bold font-corpo lowercase text-acentoTerracota block">
                  {editingMeetingId ? 'edição de encontro' : 'novo agendamento ao vivo'}
                </span>
                <h3 className="text-xl sm:text-2xl font-editorial font-bold text-marromProfundo lowercase">
                  {editingMeetingId ? 'editar encontro na agenda' : 'agendar encontro ao vivo'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-bgPlataforma text-marromTerra/60 hover:text-marromProfundo transition-colors border border-papelKraft/40"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMeeting} className="space-y-5">
              {/* Título */}
              <div>
                <label className="block text-xs font-bold font-corpo text-marromProfundo lowercase mb-1">
                  título do encontro *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: roda de partilha e escrita matinal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-papelKraft/40 text-xs text-marromProfundo font-corpo lowercase placeholder:text-marromTerra/40 focus:outline-hidden focus:border-acentoAzul shadow-xs"
                />
              </div>

              {/* Data e Hora + Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-corpo text-marromProfundo lowercase mb-1">
                    data e horário *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-papelKraft/40 text-xs text-marromProfundo font-corpo lowercase focus:outline-hidden focus:border-acentoAzul shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-corpo text-marromProfundo lowercase mb-1">
                    link da sala ao vivo (zoom / meet)
                  </label>
                  <input
                    type="url"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-papelKraft/40 text-xs text-marromProfundo font-corpo lowercase placeholder:text-marromTerra/40 focus:outline-hidden focus:border-acentoAzul shadow-xs"
                  />
                </div>
              </div>

              {/* Descrição / Pauta */}
              <div>
                <label className="block text-xs font-bold font-corpo text-marromProfundo lowercase mb-1">
                  descrição poética ou pauta do encontro
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="conte sobre o propósito, dinâmicas e o que as alunas devem trazer..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-papelKraft/40 text-xs text-marromProfundo font-corpo lowercase placeholder:text-marromTerra/40 focus:outline-hidden focus:border-acentoAzul shadow-xs resize-none"
                />
              </div>

              {/* Produto de Referência */}
              <div>
                <label className="block text-xs font-bold font-corpo text-marromProfundo lowercase mb-1">
                  produto / canal de referência
                </label>
                <select
                  value={productSlug}
                  onChange={(e) => setProductSlug(e.target.value as ProductSlug)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-papelKraft/40 text-xs text-marromProfundo font-corpo lowercase focus:outline-hidden focus:border-acentoAzul shadow-xs"
                >
                  {AVAILABLE_PRODUCTS.map((prod) => (
                    <option key={prod.slug} value={prod.slug}>
                      {prod.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* ========================================================
                  SEGMENTAÇÃO DE AUDIÊNCIA (REQUISITO CHAVE DA FASE 4)
                 ======================================================== */}
              <div className="bg-bgPlataforma/60 p-4 rounded-2xl border border-papelKraft/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-acentoAzul" />
                  <span className="text-xs font-bold font-corpo text-marromProfundo lowercase">
                    quem pode ver e participar deste encontro? (segmentação de audiência)
                  </span>
                </div>
                <p className="text-[11px] text-marromTerra/70 font-corpo lowercase">
                  encontros restritos ficam completamente ocultos na agenda de alunas que não atendem aos critérios.
                </p>

                {/* Opções de Rádio */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {[
                    { id: 'all', label: 'toda a comunidade', desc: 'aberto para todas as alunas' },
                    { id: 'product', label: 'por produto', desc: 'apenas matriculadas em cursos' },
                    { id: 'role', label: 'por papel de aluna', desc: 'pagantes, trial ou admin' },
                    { id: 'specific_users', label: 'alunas específicas', desc: 'convite individual a dedo' },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                        audienceType === opt.id
                          ? 'bg-white border-acentoAzul shadow-xs'
                          : 'bg-white/60 border-papelKraft/30 hover:bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="audienceType"
                        value={opt.id}
                        checked={audienceType === opt.id}
                        onChange={() => setAudienceType(opt.id as MeetingAudienceType)}
                        className="mt-0.5 text-acentoAzul focus:ring-acentoAzul"
                      />
                      <div>
                        <span className="text-xs font-bold font-corpo text-marromProfundo lowercase block leading-tight">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-marromTerra/70 font-corpo lowercase block mt-0.5">
                          {opt.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* SUB-SELEÇÃO: PRODUTOS */}
                {audienceType === 'product' && (
                  <div className="pt-3 border-t border-papelKraft/30 space-y-2">
                    <span className="text-xs font-medium font-corpo text-marromProfundo lowercase block">
                      selecione os produtos que dão acesso:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_PRODUCTS.filter((p) => p.slug !== 'comunidade').map((prod) => (
                        <label
                          key={prod.slug}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white border border-papelKraft/30 text-xs font-corpo lowercase cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={targetProducts.includes(prod.slug)}
                            onChange={() => toggleProductTarget(prod.slug)}
                            className="rounded-xs text-acentoAzul focus:ring-acentoAzul"
                          />
                          <span>{prod.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-SELEÇÃO: PAPÉIS */}
                {audienceType === 'role' && (
                  <div className="pt-3 border-t border-papelKraft/30 space-y-2">
                    <span className="text-xs font-medium font-corpo text-marromProfundo lowercase block">
                      selecione os papéis com permissão:
                    </span>
                    <div className="space-y-1.5">
                      {AVAILABLE_ROLES.map((r) => (
                        <label
                          key={r.role}
                          className="flex items-center gap-2 p-2 rounded-lg bg-white border border-papelKraft/30 text-xs font-corpo lowercase cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={targetRoles.includes(r.role)}
                            onChange={() => toggleRoleTarget(r.role)}
                            className="rounded-xs text-acentoAzul focus:ring-acentoAzul"
                          />
                          <span>{r.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-SELEÇÃO: ALUNAS ESPECÍFICAS */}
                {audienceType === 'specific_users' && (
                  <div className="pt-3 border-t border-papelKraft/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium font-corpo text-marromProfundo lowercase">
                        selecione as alunas convidadas ({targetUserIds.length} selecionadas):
                      </span>
                    </div>

                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="buscar por nome ou e-mail da aluna..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-papelKraft/40 text-xs text-marromProfundo font-corpo lowercase placeholder:text-marromTerra/40 focus:outline-hidden focus:border-acentoAzul"
                    />

                    <div className="max-h-40 overflow-y-auto space-y-1 p-1 bg-white rounded-lg border border-papelKraft/30">
                      {filteredUsersList.length === 0 ? (
                        <p className="text-[11px] text-marromTerra/60 font-corpo lowercase p-2 text-center">
                          nenhuma aluna encontrada.
                        </p>
                      ) : (
                        filteredUsersList.map((u) => (
                          <label
                            key={u.id}
                            className="flex items-center justify-between p-1.5 rounded-md hover:bg-papelKraft/10 text-xs font-corpo lowercase cursor-pointer"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <input
                                type="checkbox"
                                checked={targetUserIds.includes(u.id)}
                                onChange={() => toggleUserTarget(u.id)}
                                className="rounded-xs text-acentoAzul focus:ring-acentoAzul"
                              />
                              <span className="font-medium text-marromProfundo truncate">
                                {u.display_name || 'aluna sem nome'}
                              </span>
                              {u.email && (
                                <span className="text-[10px] text-marromTerra/60 truncate">
                                  ({u.email})
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-bgPlataforma text-marromTerra shrink-0">
                              {u.role || 'free'}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Status de Publicação */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="publishToggle"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded-xs text-acentoAzul focus:ring-acentoAzul"
                />
                <label htmlFor="publishToggle" className="text-xs font-corpo text-marromProfundo lowercase cursor-pointer">
                  publicar imediatamente na agenda das alunas elegíveis
                </label>
              </div>

              {/* Botões de Ação */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-papelKraft/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-papelKraft/40 text-xs font-corpo lowercase text-marromTerra hover:bg-bgPlataforma transition-colors"
                >
                  cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white text-xs font-corpo lowercase shadow-xs transition-transform hover:scale-105 disabled:opacity-50"
                >
                  {saving ? 'salvando...' : editingMeetingId ? 'atualizar encontro' : 'salvar encontro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
