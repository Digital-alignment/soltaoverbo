import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import {
  BookOpen,
  ArrowRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Plus,
  Play,
  Video,
  Sparkles,
  Lock,
  Crown,
  MessageSquare,
  BookMarked,
  Compass,
  Heart,
  Pencil,
  X,
  ExternalLink,
  CalendarPlus,
  BarChart3,
  Feather,
  Star,
} from 'lucide-react';
import type { Database } from '../lib/database.types';
import { BRAND_ASSETS } from '../config/brandAssets';

type Course = Database['public']['Tables']['courses']['Row'];

interface Subscription {
  installment_plan: string;
  total_installments: number;
  completed_installments: number;
  next_payment_date: string | null;
  expires_at: string;
}

interface ActivityDay {
  dayNum: string;
  dateStr: string;
  active: boolean;
  level: number;
  words?: number;
  title?: string;
  excerpt?: string;
  isMilestone?: boolean;
}

interface AgendaEvent {
  id: string;
  title: string;
  time: string;
  category: 'cafe' | 'admin' | 'launch' | 'personal';
  categoryLabel: string;
  completed: boolean;
  isExclusiveAdmin?: boolean;
  linkUrl?: string;
}

interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  excerpt: string;
  timeAgo: string;
  likes: number;
}

interface NotebookItem {
  id: string;
  title: string;
  updatedAt: string;
  wordCount: number;
}

interface DiscoverItem {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
}

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para Modal de Reler Texto do Dia no Histórico
  const [selectedDayDetail, setSelectedDayDetail] = useState<ActivityDay | null>(null);

  // Estado de Filtro de Abas na Agenda
  const [agendaTab, setAgendaTab] = useState<'todos' | 'cafe' | 'admin' | 'personal'>('todos');

  // Countdown Fictício para a próxima live do Café com Letras
  const [countdownStr, setCountdownStr] = useState('14h 22min');

  useEffect(() => {
    // Simular countdown regressivo suave
    const timer = setInterval(() => {
      const now = new Date();
      const hoursLeft = 14 - (now.getMinutes() % 3);
      const minsLeft = 59 - now.getSeconds();
      setCountdownStr(`${hoursLeft}h ${minsLeft < 10 ? '0' : ''}${minsLeft}min`);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Mock de Histórico de Atividade (28 dias com dados poéticos e números em Muthazle)
  const [activityGrid] = useState<ActivityDay[]>(() => {
    const days: ActivityDay[] = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isToday = i === 0;
      const active = isToday || i % 3 !== 0 || i % 5 === 0;
      const isMilestone = i === 7 || i === 14 || i === 21;
      days.push({
        dayNum: String(d.getDate()).padStart(2, '0'),
        dateStr: d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
        active,
        level: active ? (i % 2 === 0 ? 3 : 2) : 0,
        words: active ? 250 + (i * 35) % 400 : 0,
        title: active ? `dia ${28 - i}: escutar o silêncio e dar forma ao sussurro` : 'sem prática gravada',
        excerpt: active
          ? 'escrever é dar forma ao que vive dentro e criar pontes de presença sem a obrigação de ser autor...'
          : undefined,
        isMilestone,
      });
    }
    return days;
  });

  // Agenda Integrada (Café com letras, eventos admin, pessoais, lançamentos)
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([
    {
      id: '1',
      title: 'café com letras ao vivo (roda de partilha poética)',
      time: 'segunda-feira • 08h00',
      category: 'cafe',
      categoryLabel: 'ao vivo • fogueira',
      completed: false,
      linkUrl: '/cafe-com-letras',
    },
    {
      id: '2',
      title: 'mentoria exclusiva com facilitadoras bruna & júlia',
      time: 'terça-feira • 15h00',
      category: 'admin',
      categoryLabel: 'convite das facilitadoras',
      completed: false,
      isExclusiveAdmin: true,
      linkUrl: '/profile',
    },
    {
      id: '3',
      title: 'lançamento oficial: novo ciclo de aprofundamento 2026',
      time: 'quinta-feira • 19h00',
      category: 'launch',
      categoryLabel: 'lançamento',
      completed: false,
      linkUrl: '/ciclo-de-aprofundamento',
    },
    {
      id: '4',
      title: 'meu ritual: escrita livre no caderno de memórias',
      time: 'hoje • 20h00',
      category: 'personal',
      categoryLabel: 'ritual pessoal',
      completed: true,
      linkUrl: '/exercises',
    },
  ]);

  // Feed da Comunidade Nossa Fogueira
  const [communityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      author: 'bruna riedel',
      avatar: '/bruna copy copy.png',
      title: 'escutar o silêncio antes de nomear o caos',
      excerpt: 'na prática de hoje percebi como a escrita é antes de tudo um exercício de pausa e coragem...',
      timeAgo: 'há 2 horas',
      likes: 14,
    },
    {
      id: '2',
      author: 'júlia alvim',
      avatar: '/jo.png',
      title: 'fogueira das segundas: novos temas no ar',
      excerpt: 'preparamos um caminho poético especial para o nosso próximo encontro ao vivo...',
      timeAgo: 'há 5 horas',
      likes: 21,
    },
  ]);

  // Meus Cadernos de Escrita
  const [notebooks] = useState<NotebookItem[]>([
    { id: '1', title: 'caderno de sussurros & presença', updatedAt: 'hoje às 14h20', wordCount: 420 },
    { id: '2', title: 'memórias da infância no mar', updatedAt: 'ontem', wordCount: 890 },
    { id: '3', title: 'diário de transição autoral', updatedAt: 'há 3 dias', wordCount: 1250 },
  ]);

  // Curadoria Descubra (Cursos, Blog & Recomendações Admin)
  const [discoverItems] = useState<DiscoverItem[]>([
    {
      id: '1',
      title: 'ciclo de aprofundamento trimestral',
      category: 'programa ao vivo',
      image: '/brand-assets/elements/collages/creative-vintage-collage-design.png',
      link: '/ciclo-de-aprofundamento',
    },
    {
      id: '2',
      title: 'como sustentar a escrita sem cobrança',
      category: 'artigo do blog',
      image: '/brand-assets/elements/collages/butterfly-collage-woman-art.png',
      link: '/about',
    },
  ]);

  // Mensagem de Boas-Vindas Curta em Muthazle
  const welcomeMessage = useMemo(() => {
    const rawName = profile?.display_name?.split(' ')[0]?.toLowerCase() || 'aluna';
    return `olá, ${rawName}! bem-vinda de volta.`;
  }, [profile?.display_name]);

  useEffect(() => {
    loadDashboardData();
  }, [profile, user]);

  const loadDashboardData = async () => {
    try {
      const coursesPromise = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      const [coursesResult] = await Promise.all([coursesPromise]);

      if (coursesResult.error) throw coursesResult.error;
      setCourses(coursesResult.data || []);

      if (user && profile?.role === 'paid') {
        const { data: subData, error: subError } = await supabase
          .from('user_subscriptions')
          .select('installment_plan, total_installments, completed_installments, next_payment_date, expires_at')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!subError && subData) {
          setSubscription(subData as Subscription);
        }
      }
    } catch (error) {
      console.error('erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEventComplete = (id: string) => {
    setAgendaEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, completed: !ev.completed } : ev))
    );
  };

  const filteredEvents = useMemo(() => {
    if (agendaTab === 'todos') return agendaEvents;
    if (agendaTab === 'cafe') return agendaEvents.filter((e) => e.category === 'cafe');
    if (agendaTab === 'admin') return agendaEvents.filter((e) => e.category === 'admin' || e.isExclusiveAdmin);
    if (agendaTab === 'personal') return agendaEvents.filter((e) => e.category === 'personal');
    return agendaEvents;
  }, [agendaEvents, agendaTab]);

  const generateGoogleCalendarUrl = (title: string, details: string) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedDetails = encodeURIComponent(`${details} - Solta o Verbo Coletivo`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedTitle}&details=${encodedDetails}`;
  };

  const canAccessCourse = (course: Course) => {
    if (course.course_type === 'free') return true;
    return profile?.role === 'paid' || profile?.role === 'admin';
  };

  const getRoleLabel = () => {
    switch (profile?.role) {
      case 'admin':
        return 'administrador';
      case 'paid':
        return 'membro premium';
      default:
        return 'membro registrado';
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* CABEÇALHO DO DASHBOARD (Título Curto em Muthazle, Badge Sem Botão Lateral) */}
        <div className="flex items-center justify-between border-b border-papelKraft/40 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoTerracota/15 border border-acentoTerracota/30 text-acentoTerracota text-xs font-bold lowercase tracking-wider mb-1.5 shadow-sm">
              <Crown className="w-3.5 h-3.5 text-acentoTerracota" />
              <span>{getRoleLabel()}</span>
            </div>
            {/* Título mais pequeno na fonte Muthazle (font-gesto) */}
            <h1 className="text-2xl sm:text-3xl font-normal font-gesto text-acentoAzul lowercase">
              {welcomeMessage}
            </h1>
          </div>
        </div>

        {/* BENTO GRID PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================
              ITEM 1 DO BENTO: HISTÓRICO DE ESCRITA & AGENDA E ENCONTROS
              (Hero Hub Principal - md:col-span-12)
             ======================================================== */}
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 1A: Histórico de Escrita e Atividade (Com Métricas Poéticas & Números em Muthazle) */}
            <div className="lg:col-span-6 bg-papelClaro rounded-3xl p-5 sm:p-6 border border-papelKraft/60 shadow-kraft space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-tintaCarvao/60 font-medium lowercase block">
                      ritmo e constância do ritual
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase">
                      histórico de escrita & atividade
                    </h2>
                  </div>

                  {/* Contador de Dias Ativos com Ícone de Coroa / Estrela (Sem Fogo) */}
                  <div className="flex items-center gap-1.5 bg-acentoOliva/25 px-3 py-1 rounded-full border border-acentoOliva/40 text-tintaCarvao text-xs font-bold lowercase shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-acentoAzul" />
                    <span>12 dias ativos</span>
                  </div>
                </div>

                {/* Métricas Poéticas e Humanas */}
                <div className="grid grid-cols-3 gap-2 bg-bgPlataforma/70 p-3 rounded-2xl border border-papelKraft/40 text-center">
                  <div>
                    <span className="text-[10px] text-tintaCarvao/60 font-medium lowercase block">palavras soltas</span>
                    <span className="font-gesto text-lg sm:text-xl font-normal text-acentoAzul">4.250</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-tintaCarvao/60 font-medium lowercase block">rituais concluídos</span>
                    <span className="font-gesto text-lg sm:text-xl font-normal text-acentoTerracota">14</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-tintaCarvao/60 font-medium lowercase block">frequência</span>
                    <span className="font-gesto text-lg sm:text-xl font-normal text-acentoAzul">85%</span>
                  </div>
                </div>

                {/* Grid do Calendário com Números em Muthazle (font-gesto) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs text-tintaCarvao/60 font-medium lowercase">
                    <span>últimos 28 dias</span>
                    <span className="text-[11px] text-tintaCarvao/50 italic">clique em um dia para releer</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {activityGrid.map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDayDetail(day)}
                        className="flex flex-col items-center gap-0.5 group/day relative cursor-pointer focus:outline-none"
                      >
                        {/* Número do dia formatado na fonte Muthazle */}
                        <div
                          className={`w-full h-8 sm:h-9 rounded-xl transition-all duration-300 flex items-center justify-center font-gesto text-base sm:text-lg relative ${
                            day.active
                              ? day.level === 3
                                ? 'bg-acentoAzul text-white shadow-sm scale-105'
                                : 'bg-acentoOliva text-tintaCarvao'
                              : 'bg-papelKraft/30 text-tintaCarvao/40'
                          }`}
                        >
                          {day.dayNum}
                          {day.isMilestone && (
                            <Star className="w-2.5 h-2.5 text-acentoTerracota fill-acentoTerracota absolute top-0.5 right-0.5" />
                          )}
                        </div>

                        {/* Tooltip do dia */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-tintaCarvao text-papelClaro text-[10px] font-medium lowercase rounded-lg opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-md">
                          {day.dateStr} • {day.active ? `${day.words} palavras` : 'sem registro'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-tintaCarvao/70 pt-2 border-t border-papelKraft/30">
                <span className="lowercase">sequência ativa: 12 dias</span>
                <span className="lowercase font-bold text-acentoAzul">recorde: 21 dias</span>
              </div>
            </div>

            {/* 1B: Agenda Integrada (Café com Letras, Convites Exclusivos Admin, Abas de Filtro & Countdown) */}
            <div className="lg:col-span-6 bg-papelClaro rounded-3xl p-5 sm:p-6 border border-papelKraft/60 shadow-kraft space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-tintaCarvao/60 font-medium lowercase block">
                      seus compromissos & encontros
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase">
                      agenda & encontros
                    </h2>
                  </div>

                  {/* Abas de Filtro da Agenda */}
                  <div className="flex items-center gap-1 bg-bgPlataforma p-1 rounded-full border border-papelKraft/50 text-[10px] font-bold lowercase">
                    <button
                      onClick={() => setAgendaTab('todos')}
                      className={`px-2.5 py-1 rounded-full transition-all ${
                        agendaTab === 'todos' ? 'bg-acentoAzul text-white shadow-sm' : 'text-tintaCarvao/70'
                      }`}
                    >
                      todos
                    </button>
                    <button
                      onClick={() => setAgendaTab('cafe')}
                      className={`px-2.5 py-1 rounded-full transition-all ${
                        agendaTab === 'cafe' ? 'bg-acentoAzul text-white shadow-sm' : 'text-tintaCarvao/70'
                      }`}
                    >
                      ao vivo
                    </button>
                    <button
                      onClick={() => setAgendaTab('admin')}
                      className={`px-2.5 py-1 rounded-full transition-all ${
                        agendaTab === 'admin' ? 'bg-acentoTerracota text-white shadow-sm' : 'text-tintaCarvao/70'
                      }`}
                    >
                      convites
                    </button>
                  </div>
                </div>

                {/* Banner de Cuenta Regresiva Poética para el próximo Café com Letras */}
                <div className="bg-acentoAzul text-papelClaro p-3.5 rounded-2xl border border-acentoAzul/80 shadow-sm flex items-center justify-between gap-3 relative overflow-hidden">
                  <div className="space-y-0.5 relative z-10">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-acentoOliva lowercase">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>ao vivo em {countdownStr}</span>
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold font-editorial text-papelClaro lowercase">
                      café com letras (roda de partilha poética)
                    </h3>
                    <p className="text-[10px] text-papelClaro/75 font-mono">segunda-feira • 08h00</p>
                  </div>

                  <Link
                    to="/cafe-com-letras"
                    className="px-3 py-1.5 rounded-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-semibold whitespace-nowrap lowercase shadow-sm transition-transform hover:scale-105"
                  >
                    <span>entrar ao vivo →</span>
                  </Link>
                </div>

                {/* Lista Mesclada de Eventos */}
                <div className="space-y-2">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className={`p-3 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-2 relative ${
                        ev.isExclusiveAdmin
                          ? 'bg-gradient-to-r from-acentoTerracota/10 via-papelClaro to-acentoOliva/10 border-acentoTerracota/40 shadow-sm'
                          : ev.completed
                          ? 'bg-bgPlataforma/50 border-papelKraft/30 opacity-70'
                          : 'bg-white border-papelKraft/60 shadow-sm hover:border-acentoAzul'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => toggleEventComplete(ev.id)}
                          className="focus:outline-none"
                        >
                          <CheckCircle2
                            className={`w-4 h-4 transition-colors ${
                              ev.completed ? 'text-acentoOliva fill-acentoOliva/20' : 'text-tintaCarvao/30'
                            }`}
                          />
                        </button>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3
                              className={`text-xs sm:text-sm font-bold lowercase transition-all ${
                                ev.completed ? 'line-through text-tintaCarvao/50' : 'text-acentoAzul'
                              }`}
                            >
                              {ev.title}
                            </h3>
                            {ev.isExclusiveAdmin && (
                              <Crown className="w-3.5 h-3.5 text-acentoTerracota" title="convite exclusivo" />
                            )}
                          </div>
                          <span className="text-[10px] text-tintaCarvao/60 font-mono block">
                            {ev.time}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {/* Exportar para Google Calendar */}
                        <a
                          href={generateGoogleCalendarUrl(ev.title, ev.time)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-tintaCarvao/50 hover:text-acentoAzul transition-colors"
                          title="adicionar ao meu google calendar"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                        </a>

                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full lowercase whitespace-nowrap ${
                            ev.category === 'cafe'
                              ? 'bg-acentoAzul text-white'
                              : ev.category === 'admin'
                              ? 'bg-acentoTerracota text-white'
                              : ev.category === 'launch'
                              ? 'bg-acentoOliva text-tintaCarvao'
                              : 'bg-papelKraft/40 text-tintaCarvao'
                          }`}
                        >
                          {ev.categoryLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-1 text-center">
                <span className="text-[10px] text-tintaCarvao/50 lowercase italic">
                  clique no círculo para concluir compromissos ou no ícone + para exportar ao calendário
                </span>
              </div>
            </div>

          </div>

          {/* ========================================================
              ITEM 2 DO BENTO: CARD RETOMAR CURSOS / TALLERES
              (Dia em Muthazle, % DEBAIXO DA BARRA, sem tempo estimado, botão só "retomar")
             ======================================================== */}
          <div className="lg:col-span-6 bg-papelClaro rounded-3xl p-5 sm:p-7 border border-papelKraft/60 shadow-kraft relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-acentoAzul/70 bg-acentoAzul/10 px-3 py-1 rounded-full border border-acentoAzul/20 lowercase">
                em andamento
              </span>
              <span className="text-xs font-bold text-acentoTerracota lowercase">21 dias de escrita online</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Miniatura Colagem */}
              <div className="sm:col-span-4 relative">
                <div className="w-full h-32 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative bg-bgPlataforma">
                  <img
                    src="/brand-assets/elements/collages/writes-torn-out-sheets-paper-trendy-vintage-style-mixed-media-art.png"
                    alt="continuar jornada"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Título da Leção com Dia e Número em Muthazle (font-gesto) */}
              <div className="sm:col-span-8 space-y-1">
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
                  <span className="font-gesto text-2xl sm:text-3xl text-acentoTerracota font-normal mr-1.5">
                    dia 08:
                  </span>
                  escutar o silêncio e dar forma ao sussurro
                </h3>
                <p className="text-xs text-tintaCarvao/80 font-medium lowercase line-clamp-2">
                  um ritual diário de presença para organizar o caos interno sem a pressão de ser autor.
                </p>
              </div>
            </div>

            {/* Barra de Progresso com % de Concluído DEBAIXO DA BARRA */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full bg-papelKraft/40 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-acentoTerracota h-2.5 rounded-full transition-all duration-500"
                  style={{ width: '38%' }}
                />
              </div>
              <div className="flex justify-between items-center text-[11px] font-mono text-tintaCarvao/60 pt-0.5">
                <span>progresso da jornada</span>
                <span className="font-bold text-acentoAzul">38% concluído</span>
              </div>
            </div>

            {/* Apenas Botão "retomar" com Ícone de Play */}
            <div className="pt-1">
              <Link
                to="/exercises"
                className="btn-pill-primary px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-sm inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Play className="w-4 h-4 text-white fill-white" />
                <span>retomar</span>
              </Link>
            </div>
          </div>

          {/* ========================================================
              ITEM 3 DO BENTO: NOSSA FOGUEIRA (COMUNIDADE)
              (Últimas entradas e partilhas da comunidade)
             ======================================================== */}
          <div className="lg:col-span-6 bg-papelClaro rounded-3xl p-5 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-tintaCarvao/60 font-medium lowercase block">
                  comunidade ativa
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase">
                  nossa fogueira (últimas partilhas)
                </h3>
              </div>

              <Link
                to="/fogueira"
                className="text-xs font-bold text-acentoAzul hover:text-acentoTerracota transition-colors lowercase flex items-center gap-1"
              >
                <span>ver fogueira</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Posts da Comunidade */}
            <div className="space-y-3">
              {communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 rounded-2xl bg-white border border-papelKraft/50 shadow-sm space-y-2 hover:border-acentoAzul transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-papelKraft">
                        <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-bold text-acentoAzul lowercase">{post.author}</span>
                    </div>
                    <span className="text-[10px] text-tintaCarvao/50 font-mono">{post.timeAgo}</span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-tintaCarvao lowercase leading-snug">
                    {post.title}
                  </h4>
                  <p className="text-xs text-tintaCarvao/75 lowercase line-clamp-1 font-medium">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px] text-tintaCarvao/60">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-acentoTerracota fill-acentoTerracota/20" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-acentoAzul" />
                      responder
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              ITEM 4 DO BENTO: MEU CADERNO
              (Lista de cadernos já escritos + botão para escrever algo novo)
             ======================================================== */}
          <div className="lg:col-span-6 bg-papelClaro rounded-3xl p-5 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-tintaCarvao/60 font-medium lowercase block">
                  seus textos & memórias
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase">
                  meu caderno de escrita
                </h3>
              </div>

              <Link
                to="/exercises"
                className="btn-pill-primary px-3.5 py-1.5 text-xs font-semibold shadow-sm inline-flex items-center gap-1.5 hover:scale-105 transition-transform"
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>escrever algo novo</span>
              </Link>
            </div>

            {/* Lista dos Cadernos Já Escritos */}
            <div className="space-y-2.5">
              {notebooks.map((nb) => (
                <div
                  key={nb.id}
                  className="p-3 rounded-2xl bg-white border border-papelKraft/50 shadow-sm flex items-center justify-between hover:border-acentoAzul transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookMarked className="w-5 h-5 text-acentoAzul" />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-acentoAzul lowercase">
                        {nb.title}
                      </h4>
                      <span className="text-[10px] text-tintaCarvao/50 font-mono block">
                        atualizado {nb.updatedAt} • {nb.wordCount} palavras
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/exercises"
                    className="text-xs text-acentoTerracota font-bold hover:underline lowercase"
                  >
                    abrir →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              ITEM 5 DO BENTO: DESCUBRA (CURADORIA DO ADMIN)
              (Cursos, blogs e conteúdos selecionados pelas facilitadoras)
             ======================================================== */}
          <div className="lg:col-span-6 bg-papelClaro rounded-3xl p-5 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-tintaCarvao/60 font-medium lowercase block">
                  recomendado pelas facilitadoras
                </span>
                <h3 className="text-lg sm:text-xl font-bold font-editorial text-acentoAzul lowercase">
                  descubra & novidades
                </h3>
              </div>

              <Link
                to="/programs"
                className="text-xs font-bold text-acentoAzul hover:text-acentoTerracota transition-colors lowercase flex items-center gap-1"
              >
                <Compass className="w-3.5 h-3.5 text-acentoTerracota" />
                <span>explorar tudo</span>
              </Link>
            </div>

            {/* Lista de Recomendações do Admin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {discoverItems.map((disc) => (
                <Link
                  key={disc.id}
                  to={disc.link}
                  className="bg-bgPlataforma rounded-2xl border border-papelKraft/50 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
                >
                  <div className="h-28 overflow-hidden relative">
                    <img
                      src={disc.image}
                      alt={disc.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-acentoAzul text-white lowercase shadow-sm">
                        {disc.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <h4 className="text-xs sm:text-sm font-bold font-editorial text-acentoAzul lowercase group-hover:text-acentoTerracota transition-colors line-clamp-2">
                      {disc.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ========================================================
              ITEM 6 DO BENTO: CURSOS DISPONÍVEIS COMPLETO
             ======================================================== */}
          <div className="lg:col-span-12 bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-tintaCarvao/60 font-medium lowercase block">
                  todas as jornadas da plataforma
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                  cursos & oficinas disponíveis
                </h3>
              </div>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-papelKraft/50 p-8 text-center bg-bgPlataforma/50 space-y-2">
                <BookOpen className="w-12 h-12 text-acentoAzul/40 mx-auto" />
                <h4 className="text-base font-bold text-acentoAzul lowercase">nenhum curso disponível ainda</h4>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const hasAccess = canAccessCourse(course);
                  return (
                    <Link
                      key={course.id}
                      to={hasAccess ? `/course/${course.id}` : '/roteirooriginal'}
                      className="bg-bgPlataforma rounded-2xl border border-papelKraft/60 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div className="relative h-40 overflow-hidden bg-papelKraft/30">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-acentoAzul/10">
                            <BookOpen className="w-10 h-10 text-acentoAzul/40" />
                          </div>
                        )}
                        {!hasAccess && (
                          <div className="absolute inset-0 bg-tintaCarvao/75 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="text-center text-papelClaro">
                              <Lock className="w-7 h-7 mx-auto mb-1 text-acentoOliva" />
                              <p className="text-[11px] font-bold lowercase">exclusivo premium</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold lowercase shadow-sm ${
                              course.course_type === 'free'
                                ? 'bg-acentoOliva text-tintaCarvao'
                                : 'bg-acentoTerracota text-white'
                            }`}
                          >
                            {course.course_type === 'free' ? 'gratuito' : 'premium'}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-base font-bold font-editorial text-acentoAzul lowercase mb-1 group-hover:text-acentoTerracota transition-colors">
                            {course.title}
                          </h4>
                          <div
                            className="text-xs text-tintaCarvao/80 line-clamp-2 leading-relaxed lowercase"
                            dangerouslySetInnerHTML={{ __html: course.description || '' }}
                          />
                        </div>

                        <div className="pt-2 border-t border-papelKraft/40 flex items-center justify-between text-xs font-bold text-acentoAzul lowercase">
                          <span>{hasAccess ? 'acessar aulas →' : 'conhecer programa →'}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* MODAL DE RELEER TEXTO DO DIA SELECIONADO NO HISTÓRICO */}
        {selectedDayDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tintaCarvao/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 sm:p-8 max-w-md w-full shadow-kraft-lg relative space-y-4">
              <button
                type="button"
                onClick={() => setSelectedDayDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-bgPlataforma text-tintaCarvao/60 hover:text-tintaCarvao transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-acentoTerracota lowercase block">
                  {selectedDayDetail.dateStr} • {selectedDayDetail.words} palavras escritas
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
                  {selectedDayDetail.title}
                </h3>
              </div>

              {selectedDayDetail.excerpt ? (
                <div className="p-4 rounded-2xl bg-bgPlataforma border border-papelKraft/40 space-y-2">
                  <p className="text-xs sm:text-sm text-tintaCarvao/85 lowercase italic font-medium leading-relaxed">
                    “{selectedDayDetail.excerpt}”
                  </p>
                </div>
              ) : (
                <p className="text-xs text-tintaCarvao/60 lowercase italic">
                  nenhum registro gravado neste dia.
                </p>
              )}

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedDayDetail(null)}
                  className="text-xs font-semibold text-tintaCarvao/60 hover:text-tintaCarvao lowercase"
                >
                  fechar
                </button>

                {selectedDayDetail.active && (
                  <Link
                    to="/exercises"
                    onClick={() => setSelectedDayDetail(null)}
                    className="btn-pill-primary px-5 py-2 text-xs font-semibold shadow-sm inline-flex items-center gap-1.5"
                  >
                    <span>reler meu texto no caderno →</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER DISCRETO */}
        <div className="pt-8 border-t border-papelKraft/40 text-center">
          <img
            src={BRAND_ASSETS.logos.horizontal}
            alt="solta o verbo"
            className="h-9 sm:h-11 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
            }}
          />
        </div>

      </div>
    </div>
  );
}
