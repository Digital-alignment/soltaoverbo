import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Play,
  Sparkles,
  Lock,
  Crown,
  MessageSquare,
  BookMarked,
  Compass,
  Heart,
  Pencil,
  X,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  Book,
  Plus,
  Feather,
  Clock,
  Maximize2,
  List,
  Calendar as CalendarIcon,
  Coffee,
  Rocket,
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
}

interface AgendaEvent {
  id: string;
  dayOfMonth: number;
  monthName: string;
  dayOfWeekLabel: string;
  title: string;
  description: string;
  time: string;
  countdownStr?: string;
  category: 'cafe' | 'admin' | 'launch' | 'personal';
  categoryLabel: string;
  modality: string;
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

// Tabela de Níveis e Marcos Literários / Equivalências de Palavras
const WORD_MILESTONES = [
  { minWords: 100, title: 'um haicai poético de bashō ou uma estrofe de vinicius de moraes' },
  { minWords: 500, title: "o poema 'no meio do caminho' de drummond ou uma carta de van gogh a theo" },
  { minWords: 1000, title: 'o manifesto antropófago de oswald de andrade' },
  { minWords: 3000, title: 'um conto de clarice lispector ou a arte da prudência de baltasar gracián' },
  { minWords: 5000, title: 'o banquete de platão ou o livro o pequeno príncipe' },
  { minWords: 9000, title: 'o libreto da ópera a flauta mágica de mozart' },
  { minWords: 15000, title: 'o livro a metamorfose de franz kafka' },
  { minWords: 25000, title: 'o clássico a revolução dos bichos de george orwell' },
  { minWords: 40000, title: 'o romance o alquimista de paulo coelho' },
  { minWords: 60000, title: 'o livro o apanhador no campo de centeio de j.d. salinger' },
  { minWords: 100000, title: 'a obra dom casmurro de machado de assis' },
  { minWords: 130000, title: 'o romance grande sertão: veredas de joão guimarães rosa' },
  { minWords: 160000, title: 'as tragédias completas de william shakespeare' },
  { minWords: 220000, title: 'a epopeia os lusíadas de luís de camões' },
  { minWords: 280000, title: 'o épico cem anos de solidão de gabriel garcía márquez' },
  { minWords: 350000, title: 'a obra monumental crime e castigo de dostoiévski' },
  { minWords: 500000, title: 'a divina comédia de dante alighieri ou moby dick de herman melville' },
  { minWords: 700000, title: 'a obra completa guerra e paz de léon tolstói' },
  { minWords: 1000000, title: 'a catedral literária em busca do tempo perdido de marcel proust' },
];

export default function Dashboard() {
  const { profile, user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Estado para Mês Selecionado no Calendário
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2026, 7, 1)); // Agosto 2026

  // Estado para Modal de Reler Texto do Dia no Histórico
  const [selectedDayDetail, setSelectedDayDetail] = useState<ActivityDay | null>(null);

  // Estado de Filtro de Abas na Agenda
  const [agendaTab, setAgendaTab] = useState<'todos' | 'cafe' | 'admin' | 'personal'>('todos');

  // Estado para Modal Pop-Up de Agenda Completa
  const [isFullAgendaOpen, setIsFullAgendaOpen] = useState(false);

  // Modo de Vista no Modal de Agenda: 'list' (Lista) ou 'calendar' (Vista Calendário)
  const [agendaModalView, setAgendaModalView] = useState<'list' | 'calendar'>('list');

  // Countdown Fictício para a próxima live do Café com Letras
  const [countdownStr, setCountdownStr] = useState('12h 52min');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hoursLeft = 12 - (now.getMinutes() % 2);
      const minsLeft = 59 - now.getSeconds();
      setCountdownStr(`${hoursLeft}h ${minsLeft < 10 ? '0' : ''}${minsLeft}min`);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const currentMonthLabel = useMemo(() => {
    return currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  }, [currentMonth]);

  // Gerador do Calendário do Mês Ativo para Histórico
  const monthDaysGrid = useMemo(() => {
    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const emptyLeadingSlots = Array.from({ length: firstDayOfWeek });

    const days: ActivityDay[] = [];
    let totalWordsInMonth = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const active = day === 5 || day === 8 || day === 9 || day === 11 || day === 12 || day === 14 || day === 15 || day === 16 || day === 17 || day === 21 || day === 23 || day === 27 || day === 29 || day === 31;
      const wordCount = active ? 280 + ((day * 37) % 350) : 0;
      if (active) totalWordsInMonth += wordCount;
      days.push({
        dayNum: String(day).padStart(2, '0'),
        dateStr: `${day} de ${currentMonth.toLocaleDateString('pt-BR', { month: 'short' })}`,
        active,
        level: active ? 3 : 0,
        words: wordCount,
        title: active ? `dia ${day}: escutar o silêncio e dar forma ao sussurro` : 'sem prática gravada',
        excerpt: active
          ? 'um ritual diário de presença para organizar o caos interno sem a pressão de ser autor...'
          : undefined,
      });
    }

    return { emptyLeadingSlots, days, totalWordsInMonth };
  }, [currentMonth]);

  // Total de Palavras Acumuladas & Marco Literário Equivalente Alcançado
  const totalWordsAccumulated = 5420; // Produção total acumulada pelo aluno
  const currentMilestone = useMemo(() => {
    let milestone = WORD_MILESTONES[0];
    for (const m of WORD_MILESTONES) {
      if (totalWordsAccumulated >= m.minWords) {
        milestone = m;
      } else {
        break;
      }
    }
    return milestone;
  }, [totalWordsAccumulated]);

  // Agenda Integrada com Estrutura Módulo-A-Módulo (Top, Middle, Bottom)
  const [agendaEvents, setAgendaEvents] = useState<AgendaEvent[]>([
    {
      id: '1',
      dayOfMonth: 8,
      monthName: 'agosto',
      dayOfWeekLabel: 'segunda-feira',
      title: 'café com letras (roda de partilha poética)',
      description: 'roda virtual quinzenal de leitura e partilha de textos com todo o colectivo.',
      time: '08h00',
      countdownStr: '12h 52min',
      category: 'cafe',
      categoryLabel: 'ao vivo • fogueira',
      modality: 'online • meet',
      completed: false,
      linkUrl: '/cafe-com-letras',
    },
    {
      id: '2',
      dayOfMonth: 9,
      monthName: 'agosto',
      dayOfWeekLabel: 'terça-feira',
      title: 'mentoria exclusiva com facilitadoras bruna & júlia',
      description: 'encontro individual de orientação poética e acompanhamento autoral.',
      time: '15h00',
      countdownStr: '21h 10min',
      category: 'admin',
      categoryLabel: 'convite das facilitadoras',
      modality: 'online • exclusivo',
      completed: false,
      isExclusiveAdmin: true,
      linkUrl: '/profile',
    },
    {
      id: '3',
      dayOfMonth: 11,
      monthName: 'agosto',
      dayOfWeekLabel: 'quinta-feira',
      title: 'lançamento oficial: novo ciclo de aprofundamento 2026',
      description: 'transmissão especial de abertura do novo ciclo trimestral de escrita.',
      time: '19h00',
      category: 'launch',
      categoryLabel: 'lançamento',
      modality: 'online • transmissão',
      completed: false,
      linkUrl: '/ciclo-de-aprofundamento',
    },
    {
      id: '4',
      dayOfMonth: 12,
      monthName: 'agosto',
      dayOfWeekLabel: 'sexta-feira',
      title: 'meu ritual: escrita livre no caderno de memórias',
      description: 'momento individual de escrita espontânea e acolhimento dos sentimentos.',
      time: '20h00',
      category: 'personal',
      categoryLabel: 'ritual pessoal',
      modality: 'prática individual',
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

        {/* BENTO GRID PRINCIPAL (items-start para desacoplar a altura dos cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ========================================================
              ITEM 1 DO BENTO: HISTÓRICO DE ESCRITA & AGENDA E ENCONTROS
              (Hero Hub - items-start para alturas independentes)
             ======================================================== */}
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* 1A: Histórico de Escrita e Atividade (lg:col-span-7 no Desktop) */}
            <div className="lg:col-span-7 bg-papelClaro rounded-3xl p-5 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-5">
              <div className="space-y-4">
                
                {/* Título Limpo Sem Frase Superior e Sem Tag Lateral */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                    histórico de escrita & atividade
                  </h2>
                </div>

                {/* Seleção do Mês Ativo (< Mês Ano >) e Aviso de Clique Mais Visível */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-bgPlataforma/60 p-2.5 rounded-2xl border border-papelKraft/40">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1 rounded-lg hover:bg-papelKraft/40 text-acentoAzul transition-colors"
                      title="mês anterior"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs sm:text-sm font-bold font-editorial text-acentoAzul lowercase min-w-[110px] text-center">
                      {currentMonthLabel}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1 rounded-lg hover:bg-papelKraft/40 text-acentoAzul transition-colors"
                      title="próximo mês"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Aviso "clique em um dia para releer" Bem Visível */}
                  <div className="inline-flex items-center gap-1.5 bg-acentoAzul/10 px-3 py-1 rounded-full border border-acentoAzul/20 text-acentoAzul text-[11px] font-semibold lowercase">
                    <BookOpen className="w-3 h-3 text-acentoAzul" />
                    <span>clique em um dia para releer</span>
                  </div>
                </div>

                {/* Grid do Calendário Mensal Completo (Dias Ativos em Terracota com Número Branco) */}
                <div className="space-y-1.5 pt-1">
                  {/* Cabeçalho dos Dias da Semana */}
                  <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono text-tintaCarvao/50 lowercase pb-1">
                    <span>dom</span>
                    <span>seg</span>
                    <span>ter</span>
                    <span>qua</span>
                    <span>qui</span>
                    <span>sex</span>
                    <span>sáb</span>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {/* Espaços vazios iniciais */}
                    {monthDaysGrid.emptyLeadingSlots.map((_, idx) => (
                      <div key={`empty-${idx}`} className="h-9 sm:h-10 rounded-xl bg-transparent" />
                    ))}

                    {/* Dias do Mês */}
                    {monthDaysGrid.days.map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedDayDetail(day)}
                        className="flex flex-col items-center justify-center group/day relative focus:outline-none"
                      >
                        {/* Tile do Dia: Fundo Terracota e Número Branco se Houve Atividade */}
                        <div
                          className={`w-full h-9 sm:h-10 rounded-xl transition-all duration-300 flex items-center justify-center font-gesto text-base sm:text-lg relative ${
                            day.active
                              ? 'bg-acentoTerracota text-white shadow-sm hover:scale-105'
                              : 'bg-papelKraft/25 text-tintaCarvao/50 hover:bg-papelKraft/40'
                          }`}
                        >
                          {day.dayNum}
                          {/* Ponto indicador de atividade */}
                          {day.active && (
                            <span className="w-1.5 h-1.5 rounded-full bg-acentoOliva absolute bottom-1" />
                          )}
                        </div>

                        {/* Tooltip no Hover Melhora UI: Fundo Branco, Texto Azul, Número em Muthazle */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-3.5 py-1.5 bg-white text-acentoAzul border border-papelKraft/80 text-xs sm:text-sm font-semibold lowercase rounded-2xl opacity-0 pointer-events-none group-hover/day:opacity-100 transition-all duration-200 whitespace-nowrap z-30 shadow-lg flex items-center gap-1.5">
                          <span className="font-gesto text-base sm:text-lg text-acentoTerracota font-normal">{day.words}</span>
                          <span className="text-acentoAzul font-bold">palavras escritas</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* SEÇÃO INFERIOR REORGANIZADA: Preenche o espaço antes em branco com Palavras Totais, Sequência Ativa, Chancela Literária e Botões */}
              <div className="pt-4 border-t border-papelKraft/40 space-y-4">
                
                {/* Produção Escrita Acumulada & Dias Consecutivos lado a lado */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-bgPlataforma/80 p-3.5 rounded-2xl border border-papelKraft/50 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-acentoAzul/10 text-acentoAzul">
                      <Feather className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-tintaCarvao/60 font-medium lowercase block">produção escrita total</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-gesto text-2xl font-normal text-acentoAzul">
                          {totalWordsAccumulated.toLocaleString('pt-BR')}
                        </span>
                        <span className="text-xs text-tintaCarvao/70 font-semibold lowercase">palavras soltas</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-bgPlataforma/80 p-3.5 rounded-2xl border border-papelKraft/50 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-acentoTerracota/10 text-acentoTerracota">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-tintaCarvao/60 font-medium lowercase block">frequência sustentada</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-gesto text-2xl font-normal text-acentoTerracota">
                          12
                        </span>
                        <span className="text-xs text-tintaCarvao/70 font-semibold lowercase">dias de sequência ativa</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chancela Poética / Equivalência Literária de Palavras Escritas (SEM GRADIENTE) */}
                <div className="bg-bgPlataforma/70 p-3.5 sm:p-4 rounded-2xl border border-papelKraft/60 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-acentoOliva/20 text-acentoAzul shrink-0">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <p className="text-xs sm:text-sm text-tintaCarvao/85 lowercase leading-relaxed">
                    você já escreveu a mesma quantidade de palavras que{' '}
                    <strong className="text-acentoTerracota font-bold font-editorial text-sm sm:text-base">
                      {currentMilestone.title}
                    </strong>.
                  </p>
                </div>

                {/* Botões de Ação Compactos */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Link
                    to="/exercises"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-all text-xs font-semibold lowercase border border-acentoAzul/20 shadow-sm"
                  >
                    <Book className="w-3.5 h-3.5" />
                    <span>meus cadernos</span>
                  </Link>

                  <Link
                    to="/exercises?new=true"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white transition-all text-xs font-semibold lowercase shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 text-white" />
                    <span>novo texto</span>
                  </Link>
                </div>

              </div>

            </div>

            {/* 1B: Agenda Integrada (NOVO ESTRUTURADO EM 3 SEÇÕES: TOP COUNTDOWN, MIDDLE DATE & CONTENT, BOTTOM MODALITY & CTAS) */}
            <div className="lg:col-span-5 bg-papelClaro rounded-3xl p-5 sm:p-6 border border-papelKraft/60 shadow-kraft space-y-4">
              <div className="space-y-4">
                
                {/* Header Limpo com Layout de Abas 100% Visíveis Sem Scrollbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-papelKraft/30 pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                    agenda & encontros
                  </h2>

                  {/* Abas de Filtro 100% Visíveis Sem Scrollbar */}
                  <div className="inline-flex items-center gap-1 bg-bgPlataforma p-1 rounded-full border border-papelKraft/50 text-xs font-semibold lowercase shrink-0">
                    <button
                      type="button"
                      onClick={() => setAgendaTab('todos')}
                      className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                        agendaTab === 'todos' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                      }`}
                    >
                      todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgendaTab('cafe')}
                      className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                        agendaTab === 'cafe' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                      }`}
                    >
                      ao vivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgendaTab('admin')}
                      className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                        agendaTab === 'admin' ? 'bg-acentoTerracota text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                      }`}
                    >
                      convites
                    </button>
                  </div>
                </div>

                {/* LISTA DE CARDS DE EVENTO COM ESTRUTURA MÓDULO-A-MÓDULO (TOP, MIDDLE, BOTTOM) */}
                <div className="space-y-4">
                  {filteredEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className={`rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden flex flex-col justify-between ${
                        ev.isExclusiveAdmin
                          ? 'border-acentoTerracota/50 bg-white'
                          : 'border-papelKraft/60 bg-white hover:border-acentoAzul'
                      }`}
                    >
                      {/* SEÇÃO 1 (TOP): CONTAGEM REGRESSIVA (ESQUERDA) + ÍCONE DO TIPO (DIREITA) */}
                      <div className="bg-acentoAzul text-papelClaro px-4 py-2.5 flex items-center justify-between">
                        {/* Esquerda: Animação de Dot e Conta Regressiva */}
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-acentoTerracota animate-ping" />
                          <span className="text-xs font-bold lowercase font-mono tracking-wide text-acentoOliva">
                            ao vivo em {ev.countdownStr || countdownStr}
                          </span>
                        </div>

                        {/* Direita: Ícone do Tipo do Evento */}
                        <div className="flex items-center gap-1.5" title={ev.categoryLabel}>
                          {ev.category === 'cafe' && <Coffee className="w-4 h-4 text-acentoOliva" />}
                          {ev.category === 'admin' && <Crown className="w-4 h-4 text-acentoTerracota" />}
                          {ev.category === 'launch' && <Rocket className="w-4 h-4 text-acentoOliva" />}
                          {ev.category === 'personal' && <Feather className="w-4 h-4 text-papelClaro/70" />}
                        </div>
                      </div>

                      {/* SEÇÃO 2 (MIDDLE): ESQUERDA = DATA (NÚMERO GRANDE MUTHAZLE + MÊS), DIREITA = TÍTULO E DESCRIÇÃO */}
                      <div className="p-4 flex items-center gap-4 bg-papelClaro/70">
                        {/* Esquerda: Módulo de Data Em Bloco Sólido */}
                        <div className="bg-acentoTerracota text-white rounded-2xl px-4 py-3 text-center shrink-0 min-w-[76px] shadow-sm">
                          <span className="font-gesto text-3xl font-normal block leading-none">
                            {String(ev.dayOfMonth).padStart(2, '0')}
                          </span>
                          <span className="text-[10px] font-mono font-bold lowercase tracking-wider block mt-1">
                            {ev.monthName}
                          </span>
                        </div>

                        {/* Direita: Título & Descrição */}
                        <div className="space-y-1 flex-1">
                          <h3 className="text-sm sm:text-base font-bold font-editorial text-acentoAzul lowercase leading-snug">
                            {ev.title}
                          </h3>
                          <p className="text-xs text-tintaCarvao/80 lowercase leading-relaxed line-clamp-2">
                            {ev.description}
                          </p>
                        </div>
                      </div>

                      {/* SEÇÃO 3 (BOTTOM): ESQUERDA = MODALIDADE (ONLINE/ETC), DIREITA = BOTÃO GOOGLE CAL + ENTRAR */}
                      <div className="px-4 py-3 bg-bgPlataforma/80 border-t border-papelKraft/40 flex items-center justify-between">
                        {/* Esquerda: Tipo/Modalidade do Evento */}
                        <span className="px-3 py-1 rounded-full bg-papelKraft/40 text-tintaCarvao text-[10px] font-bold lowercase">
                          {ev.modality}
                        </span>

                        {/* Direita: Exportar Google Cal + Botão Entrar */}
                        <div className="flex items-center gap-2">
                          <a
                            href={generateGoogleCalendarUrl(ev.title, `${ev.time} • ${ev.description}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white hover:bg-papelKraft/40 text-acentoAzul border border-papelKraft/50 transition-colors shadow-sm"
                            title="adicionar ao google calendar"
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </a>

                          <Link
                            to={ev.linkUrl || '/cafe-com-letras'}
                            className="px-4 py-1.5 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-bold lowercase shadow-sm transition-transform hover:scale-105 inline-flex items-center gap-1"
                          >
                            <span>entrar →</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botão de Expandir Agenda Completa em Modal Pop-up Tela Cheia */}
                <button
                  type="button"
                  onClick={() => setIsFullAgendaOpen(true)}
                  className="w-full py-2.5 px-4 rounded-2xl bg-bgPlataforma/80 hover:bg-papelKraft/40 text-acentoAzul text-xs font-bold lowercase transition-all flex items-center justify-center gap-2 border border-papelKraft/50 shadow-sm"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>ver agenda completa ({agendaEvents.length} encontros) →</span>
                </button>

              </div>

              <div className="pt-2 text-center border-t border-papelKraft/30">
                <span className="text-xs text-tintaCarvao/60 lowercase italic">
                  clique no ícone + do evento para exportar para o seu calendário pessoal
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

        {/* MODAL POP-UP AGENDA COMPLETA COM ESTRUTURA MÓDULO-A-MÓDULO E VISTA CALENDÁRIO */}
        {isFullAgendaOpen && (
          <div className="fixed inset-0 z-40 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 lg:pl-24 pb-20 lg:pb-6 animate-fadeIn">
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 sm:p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-kraft-lg relative space-y-5">
              <button
                type="button"
                onClick={() => setIsFullAgendaOpen(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full hover:bg-bgPlataforma text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-papelKraft/40 pb-4 pr-10">
                <div>
                  <span className="text-xs font-bold text-acentoTerracota lowercase block">
                    agenda completa & rituais do mês
                  </span>
                  <h3 className="text-2xl font-bold font-editorial text-acentoAzul lowercase">
                    todos os encontros agendados ({agendaEvents.length})
                  </h3>
                </div>

                {/* Alternador entre Vista Lista e Vista Calendário */}
                <div className="flex items-center gap-1 bg-bgPlataforma p-1 rounded-2xl border border-papelKraft/50 text-xs font-semibold lowercase self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setAgendaModalView('list')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      agendaModalView === 'list' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                    <span>lista</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAgendaModalView('calendar')}
                    className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                      agendaModalView === 'calendar' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70 hover:text-tintaCarvao'
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>vista calendário</span>
                  </button>
                </div>
              </div>

              {/* VISTA 1: LISTA DE ENCONTROS COM NOVO LAYOUT MÓDULO-A-MÓDULO */}
              {agendaModalView === 'list' && (
                <div className="space-y-4">
                  {/* Abas de Filtro da Agenda sem Scrollbar */}
                  <div className="inline-flex items-center gap-1 bg-bgPlataforma p-1 rounded-full border border-papelKraft/50 text-xs font-semibold lowercase">
                    <button
                      type="button"
                      onClick={() => setAgendaTab('todos')}
                      className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                        agendaTab === 'todos' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70'
                      }`}
                    >
                      todos
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgendaTab('cafe')}
                      className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                        agendaTab === 'cafe' ? 'bg-acentoAzul text-white shadow-sm font-bold' : 'text-tintaCarvao/70'
                      }`}
                    >
                      ao vivo
                    </button>
                    <button
                      type="button"
                      onClick={() => setAgendaTab('admin')}
                      className={`px-3 py-1 rounded-full transition-all whitespace-nowrap ${
                        agendaTab === 'admin' ? 'bg-acentoTerracota text-white shadow-sm font-bold' : 'text-tintaCarvao/70'
                      }`}
                    >
                      convites
                    </button>
                  </div>

                  <div className="space-y-4 pt-1">
                    {filteredEvents.map((ev) => (
                      <div
                        key={ev.id}
                        className={`rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden flex flex-col justify-between ${
                          ev.isExclusiveAdmin
                            ? 'border-acentoTerracota/50 bg-white'
                            : 'border-papelKraft/60 bg-white hover:border-acentoAzul'
                        }`}
                      >
                        {/* SEÇÃO 1 (TOP): CONTAGEM REGRESSIVA (ESQUERDA) + ÍCONE DO TIPO (DIREITA) */}
                        <div className="bg-acentoAzul text-papelClaro px-5 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-acentoTerracota animate-ping" />
                            <span className="text-xs sm:text-sm font-bold lowercase font-mono tracking-wide text-acentoOliva">
                              ao vivo em {ev.countdownStr || countdownStr}
                            </span>
                          </div>

                          <div className="flex items-center gap-2" title={ev.categoryLabel}>
                            {ev.category === 'cafe' && <Coffee className="w-5 h-5 text-acentoOliva" />}
                            {ev.category === 'admin' && <Crown className="w-5 h-5 text-acentoTerracota" />}
                            {ev.category === 'launch' && <Rocket className="w-5 h-5 text-acentoOliva" />}
                            {ev.category === 'personal' && <Feather className="w-5 h-5 text-papelClaro/70" />}
                          </div>
                        </div>

                        {/* SEÇÃO 2 (MIDDLE): ESQUERDA = DATA (NÚMERO GRANDE MUTHAZLE + MÊS), DIREITA = TÍTULO E DESCRIÇÃO */}
                        <div className="p-5 flex items-center gap-5 bg-papelClaro/70">
                          <div className="bg-acentoTerracota text-white rounded-2xl px-5 py-3 text-center shrink-0 min-w-[85px] shadow-sm">
                            <span className="font-gesto text-4xl font-normal block leading-none">
                              {String(ev.dayOfMonth).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-mono font-bold lowercase tracking-wider block mt-1">
                              {ev.monthName}
                            </span>
                          </div>

                          <div className="space-y-1 flex-1">
                            <h4 className="text-base sm:text-lg font-bold font-editorial text-acentoAzul lowercase leading-snug">
                              {ev.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-tintaCarvao/80 lowercase leading-relaxed">
                              {ev.description}
                            </p>
                          </div>
                        </div>

                        {/* SEÇÃO 3 (BOTTOM): ESQUERDA = MODALIDADE (ONLINE/ETC), DIREITA = BOTÃO GOOGLE CAL + ENTRAR */}
                        <div className="px-5 py-3.5 bg-bgPlataforma/80 border-t border-papelKraft/40 flex items-center justify-between">
                          <span className="px-3.5 py-1 rounded-full bg-papelKraft/40 text-tintaCarvao text-xs font-bold lowercase">
                            {ev.modality}
                          </span>

                          <div className="flex items-center gap-2">
                            <a
                              href={generateGoogleCalendarUrl(ev.title, `${ev.time} • ${ev.description}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-white hover:bg-papelKraft/40 text-acentoAzul border border-papelKraft/50 transition-colors shadow-sm"
                              title="adicionar ao google calendar"
                            >
                              <CalendarPlus className="w-4 h-4" />
                            </a>

                            <Link
                              to={ev.linkUrl || '/cafe-com-letras'}
                              className="px-5 py-2 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-bold lowercase shadow-sm transition-transform hover:scale-105 inline-flex items-center gap-1"
                            >
                              <span>entrar →</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VISTA 2: CALENDÁRIO COMPLETO DO MÊS COM EVENTOS FIXADOS NOS DIAS */}
              {agendaModalView === 'calendar' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-bgPlataforma/60 p-3 rounded-2xl border border-papelKraft/40">
                    <span className="text-sm font-bold font-editorial text-acentoAzul lowercase">
                      {currentMonthLabel} • encontros agendados
                    </span>
                    <span className="text-xs font-mono text-tintaCarvao/60">agosto 2026</span>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-7 gap-2 text-center text-xs font-mono text-tintaCarvao/60 lowercase pb-1 border-b border-papelKraft/30">
                      <span>dom</span>
                      <span>seg</span>
                      <span>ter</span>
                      <span>qua</span>
                      <span>qui</span>
                      <span>sex</span>
                      <span>sáb</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {monthDaysGrid.emptyLeadingSlots.map((_, idx) => (
                        <div key={`empty-cal-${idx}`} className="h-24 sm:h-28 rounded-2xl bg-bgPlataforma/20 border border-transparent" />
                      ))}

                      {monthDaysGrid.days.map((day) => {
                        const dayNum = parseInt(day.dayNum, 10);
                        const matchedEvents = agendaEvents.filter((ev) => ev.dayOfMonth === dayNum);

                        return (
                          <div
                            key={`cal-day-${day.dayNum}`}
                            className={`h-24 sm:h-28 p-2 rounded-2xl border transition-all flex flex-col justify-between overflow-hidden ${
                              matchedEvents.length > 0
                                ? 'bg-white border-acentoAzul/30 shadow-sm'
                                : 'bg-bgPlataforma/40 border-papelKraft/30'
                            }`}
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-gesto text-lg font-normal text-acentoAzul">{day.dayNum}</span>
                              {matchedEvents.length > 0 && (
                                <span className="w-2 h-2 rounded-full bg-acentoTerracota" />
                              )}
                            </div>

                            <div className="space-y-1 overflow-y-auto max-h-16 pr-0.5">
                              {matchedEvents.map((ev) => (
                                <a
                                  key={ev.id}
                                  href={generateGoogleCalendarUrl(ev.title, `${ev.time} • ${ev.description}`)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`block p-1 rounded-lg text-[9px] font-bold lowercase line-clamp-2 transition-transform hover:scale-105 ${
                                    ev.category === 'cafe'
                                      ? 'bg-acentoAzul text-white'
                                      : ev.category === 'admin'
                                      ? 'bg-acentoTerracota text-white'
                                      : ev.category === 'launch'
                                      ? 'bg-acentoOliva text-tintaCarvao'
                                      : 'bg-papelKraft text-tintaCarvao'
                                  }`}
                                  title={`${ev.title} (${ev.time})`}
                                >
                                  {ev.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-papelKraft/40 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsFullAgendaOpen(false)}
                  className="btn-pill-secondary px-6 py-2 text-xs font-bold lowercase"
                >
                  fechar agenda
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL / POPOVER COM LARGURA AMPLIADA (max-w-2xl) AO CLICAR EM UM DIA */}
        {selectedDayDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tintaCarvao/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 sm:p-8 max-w-2xl w-full shadow-kraft-lg relative space-y-5">
              <button
                type="button"
                onClick={() => setSelectedDayDetail(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-bgPlataforma text-tintaCarvao/60 hover:text-tintaCarvao transition-colors border border-papelKraft/40"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-acentoTerracota lowercase flex items-center gap-1.5">
                  <span>data: {selectedDayDetail.dateStr}</span>
                  <span>•</span>
                  <span>
                    total de palavras escritas: <strong className="font-gesto text-xl font-normal text-acentoAzul">{selectedDayDetail.words}</strong> palavras escritas
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase leading-tight pt-1">
                  {selectedDayDetail.title}
                </h3>
              </div>

              {selectedDayDetail.excerpt ? (
                <div className="p-5 rounded-2xl bg-bgPlataforma border border-papelKraft/40 space-y-2">
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
                    className="btn-pill-primary px-6 py-2.5 text-xs sm:text-sm font-semibold shadow-sm inline-flex items-center gap-1.5"
                  >
                    <span>reler caderno →</span>
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
