import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import BannerSlider from '../components/BannerSlider';
import {
  BookOpen,
  ArrowRight,
  Calendar as CalendarIcon,
  Flame,
  Clock,
  CheckCircle2,
  Plus,
  PlayCircle,
  Video,
  Sparkles,
  Lock,
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
  dayName: string;
  dateStr: string;
  active: boolean;
  level: number; // 0 to 3 intensity
}

interface EventItem {
  id: string;
  title: string;
  time: string;
  type: 'live' | 'exercise' | 'personal';
  completed: boolean;
}

const welcomeMessages = [
  'olá, {name}!',
  'que bom ter você aqui, {name}!',
  'prazer em ver você, {name}!',
  'é ótimo ter você conosco, {name}!',
  'oi, {name}! vamos escrever hoje?',
  'feliz em ver você, {name}!',
  'olá, {name}! vamos soltar o verbo?',
  'que bom que você voltou, {name}!',
];

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock de Atividade (Heatmap dos dias de acesso/escrita)
  const [activityGrid] = useState<ActivityDay[]>(() => {
    const days: ActivityDay[] = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const isToday = i === 0;
      const active = isToday || i % 3 !== 0 || i % 5 === 0;
      days.push({
        dayName: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
        dateStr: d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
        active,
        level: active ? (i % 2 === 0 ? 3 : 2) : 0,
      });
    }
    return days;
  });

  // Mock de Agenda Personalizada
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: '1',
      title: 'café com letras ao vivo (roda de partilha)',
      time: 'segunda • 08h00',
      type: 'live',
      completed: false,
    },
    {
      id: '2',
      title: 'prática de escrita: dia 08 - escutar o silêncio',
      time: 'hoje • 14h30',
      type: 'exercise',
      completed: true,
    },
    {
      id: '3',
      title: 'revisão do caderno de textos pessoais',
      time: 'quarta • 19h00',
      type: 'personal',
      completed: false,
    },
  ]);

  const welcomeMessage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    const rawName = profile?.display_name || 'aluno';
    return welcomeMessages[randomIndex].replace('{name}', rawName);
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
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, completed: !ev.completed } : ev))
    );
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
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* CABEÇALHO DO DASHBOARD / GREETING */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-papelKraft/40 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-acentoTerracota/15 border border-acentoTerracota/30 text-acentoTerracota text-xs font-bold lowercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getRoleLabel()}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-editorial text-acentoAzul lowercase">
              {welcomeMessage}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/exercises"
              className="btn-pill-primary px-5 py-2.5 text-xs sm:text-sm font-semibold shadow-sm hover:scale-105 transition-transform"
            >
              <span>escrever agora</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* COMPOSIÇÃO BENTO GRID PRINCIPAL */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* BENTO 1: RETOMAR TALLER / CURSO ONDE PAROU (md:col-span-8) */}
          <div className="md:col-span-8 bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft relative overflow-hidden flex flex-col justify-between group">
            {/* Textura sutil de fundo */}
            <div
              className="absolute inset-0 opacity-[0.03] bg-cover bg-center pointer-events-none mix-blend-multiply"
              style={{ backgroundImage: "url('/brand-assets/textures/papel-semente.jpg')" }}
            />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-acentoAzul/70 bg-acentoAzul/10 px-3 py-1 rounded-full border border-acentoAzul/20 lowercase">
                  em andamento
                </span>
                <span className="text-xs font-mono text-tintaCarvao/60">38% concluído</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                {/* Ilustração Colagem */}
                <div className="sm:col-span-4 relative group/img">
                  <div className="w-full h-40 sm:h-36 rounded-2xl overflow-hidden border border-papelKraft/40 shadow-sm relative bg-bgPlataforma">
                    <img
                      src="/brand-assets/elements/collages/writes-torn-out-sheets-paper-trendy-vintage-style-mixed-media-art.png"
                      alt="continuar jornada"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
                    />
                  </div>
                </div>

                {/* Info da Aula */}
                <div className="sm:col-span-8 space-y-2">
                  <span className="text-xs text-acentoTerracota font-bold lowercase block">
                    21 dias de escrita online
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase leading-tight">
                    dia 08: escutar o silêncio e dar forma ao sussurro
                  </h3>
                  <p className="text-xs sm:text-sm text-tintaCarvao/80 font-medium lowercase line-clamp-2">
                    um ritual diário de presença para organizar o caos interno sem a pressão de ser autor.
                  </p>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="space-y-1.5 pt-2">
                <div className="w-full bg-papelKraft/40 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-acentoTerracota h-2 rounded-full transition-all duration-500"
                    style={{ width: '38%' }}
                  />
                </div>
              </div>

              {/* CTA Action */}
              <div className="pt-2 flex items-center justify-between">
                <Link
                  to="/exercises"
                  className="btn-pill-secondary px-6 py-3 text-xs sm:text-sm font-semibold shadow-sm inline-flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <PlayCircle className="w-4 h-4 text-white" />
                  <span>retomar taller onde parou</span>
                </Link>

                <span className="text-xs text-tintaCarvao/50 lowercase hidden sm:inline-block">
                  tempo estimado: 15 min
                </span>
              </div>
            </div>
          </div>

          {/* BENTO 2: PRÓXIMO ENCONTRO CAFÉ COM LETRAS (md:col-span-4) */}
          <div className="md:col-span-4 bg-acentoAzul text-papelClaro rounded-3xl p-6 sm:p-7 border border-acentoAzul/80 shadow-kraft-lg relative overflow-hidden flex flex-col justify-between h-full">
            {/* Marca d'água */}
            <div className="absolute -bottom-10 -right-10 opacity-10 pointer-events-none select-none">
              <img
                src="/brand-assets/icons/icone_63.svg"
                alt="fogueira icon"
                className="w-48 h-48 object-contain filter invert"
              />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-acentoOliva text-xs font-bold lowercase border border-white/15">
                  <Video className="w-3.5 h-3.5" />
                  <span>ao vivo</span>
                </span>
                <span className="text-[11px] text-papelClaro/70 font-mono">segunda-feira</span>
              </div>

              <div>
                <span className="text-xs font-gesto text-acentoOliva text-xl block mb-1">
                  encontro quinzenal
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-papelClaro lowercase leading-tight">
                  café com letras
                </h3>
              </div>

              <div className="space-y-2 bg-white/10 p-3.5 rounded-2xl border border-white/10 text-xs text-papelClaro/90 font-medium lowercase">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-acentoOliva" />
                  <span>08h00 - 08h30 (horário de brasília)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-acentoOliva" />
                  <span>próxima rodada: segunda-feira</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 mt-auto">
              <Link
                to="/cafe-com-letras"
                className="w-full py-3 px-4 rounded-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md lowercase"
              >
                <span>garantir vaga na fogueira</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* BENTO 3: VISUAL DE ACTIVIDAD / STREAK GRID (md:col-span-6) */}
          <div className="md:col-span-6 bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-tintaCarvao/60 font-medium lowercase block">
                  consistência e presença
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                  histórico de escrita & atividade
                </h3>
              </div>

              <div className="flex items-center gap-2 bg-acentoTerracota/10 px-3 py-1.5 rounded-full border border-acentoTerracota/20 text-acentoTerracota text-xs font-bold lowercase">
                <Flame className="w-4 h-4 fill-acentoTerracota text-acentoTerracota" />
                <span>12 dias seguidos</span>
              </div>
            </div>

            {/* Visual Grid de Dias Ativos (Estilo Heatmap GitHub / Habits) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs text-tintaCarvao/60 font-medium lowercase">
                <span>últimos 28 dias</span>
                <span>85% de presença</span>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {activityGrid.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-1 group/day relative"
                  >
                    <div
                      className={`w-full h-8 sm:h-9 rounded-xl transition-all duration-300 flex items-center justify-center text-[10px] font-bold ${
                        day.active
                          ? day.level === 3
                            ? 'bg-acentoAzul text-white shadow-sm scale-105'
                            : 'bg-acentoOliva text-tintaCarvao'
                          : 'bg-papelKraft/30 text-tintaCarvao/30'
                      }`}
                    >
                      {day.dateStr.split(' ')[0]}
                    </div>

                    {/* Tooltip do dia */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-tintaCarvao text-papelClaro text-[10px] font-medium lowercase rounded-lg opacity-0 pointer-events-none group-hover/day:opacity-100 transition-opacity whitespace-nowrap z-30 shadow-md">
                      {day.dateStr} • {day.active ? 'prática concluída' : 'sem registro'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-tintaCarvao/70 pt-2 border-t border-papelKraft/30">
              <span className="lowercase">sequência atual: 12 dias</span>
              <span className="lowercase font-bold text-acentoAzul">maior sequência: 21 dias</span>
            </div>
          </div>

          {/* BENTO 4: CALENDÁRIO PERSONALIZADO & AGENDA DE EVENTOS (md:col-span-6) */}
          <div className="md:col-span-6 bg-papelClaro rounded-3xl p-6 sm:p-7 border border-papelKraft/60 shadow-kraft space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-tintaCarvao/60 font-medium lowercase block">
                  compromissos do seu ritual
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-editorial text-acentoAzul lowercase">
                  agenda & encontros agendados
                </h3>
              </div>

              <button
                type="button"
                className="p-2 rounded-full bg-acentoAzul/10 hover:bg-acentoAzul text-acentoAzul hover:text-white transition-colors border border-acentoAzul/20 text-xs font-bold flex items-center gap-1 lowercase cursor-pointer"
                title="adicionar evento à agenda"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Eventos Agendados para o Aluno */}
            <div className="space-y-3">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => toggleEventComplete(ev.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between cursor-pointer ${
                    ev.completed
                      ? 'bg-bgPlataforma/60 border-papelKraft/40 opacity-70'
                      : 'bg-white border-papelKraft/60 shadow-sm hover:border-acentoAzul'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 transition-colors ${
                        ev.completed ? 'text-acentoOliva fill-acentoOliva/20' : 'text-tintaCarvao/30'
                      }`}
                    />
                    <div>
                      <h4
                        className={`text-xs sm:text-sm font-bold lowercase transition-all ${
                          ev.completed ? 'line-through text-tintaCarvao/50' : 'text-acentoAzul'
                        }`}
                      >
                        {ev.title}
                      </h4>
                      <span className="text-[11px] text-tintaCarvao/60 font-mono block">
                        {ev.time}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full lowercase ${
                      ev.type === 'live'
                        ? 'bg-acentoTerracota/15 text-acentoTerracota'
                        : ev.type === 'exercise'
                        ? 'bg-acentoOliva/20 text-tintaCarvao'
                        : 'bg-acentoAzul/10 text-acentoAzul'
                    }`}
                  >
                    {ev.type === 'live' ? 'ao vivo' : ev.type === 'exercise' ? 'prática' : 'pessoal'}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <span className="text-xs text-tintaCarvao/60 lowercase italic block">
                clique em um compromisso para marcar como concluído
              </span>
            </div>
          </div>

          {/* BENTO 5: SEÇÃO DE CURSOS DISPONÍVEIS & EXPERIÊNCIAS (md:col-span-12) */}
          <div className="md:col-span-12 bg-papelClaro rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-kraft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-tintaCarvao/60 font-medium lowercase block">
                  jornadas de aprofundamento
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase">
                  programas & cursos disponíveis
                </h3>
              </div>

              <Link
                to="/programs"
                className="text-xs font-bold text-acentoAzul hover:text-acentoTerracota transition-colors lowercase flex items-center gap-1"
              >
                <span>ver todos os programas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {courses.length === 0 ? (
              <div className="rounded-2xl border border-papelKraft/50 p-8 text-center bg-bgPlataforma/50 space-y-3">
                <BookOpen className="w-12 h-12 text-acentoAzul/40 mx-auto" />
                <h4 className="text-lg font-bold text-acentoAzul lowercase">nenhum curso carregado ainda</h4>
                <p className="text-xs text-tintaCarvao/70 lowercase">os cursos aparecerão aqui quando forem criados.</p>
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
                      <div className="relative h-44 overflow-hidden bg-papelKraft/30">
                        {course.thumbnail_url ? (
                          <img
                            src={course.thumbnail_url}
                            alt={course.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-acentoAzul/10">
                            <BookOpen className="w-12 h-12 text-acentoAzul/40" />
                          </div>
                        )}
                        {!hasAccess && (
                          <div className="absolute inset-0 bg-tintaCarvao/75 backdrop-blur-[2px] flex items-center justify-center">
                            <div className="text-center text-papelClaro">
                              <Lock className="w-8 h-8 mx-auto mb-1 text-acentoOliva" />
                              <p className="text-xs font-bold lowercase">conteúdo exclusivo</p>
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold lowercase shadow-sm ${
                              course.course_type === 'free'
                                ? 'bg-acentoOliva text-tintaCarvao'
                                : 'bg-acentoTerracota text-white'
                            }`}
                          >
                            {course.course_type === 'free' ? 'gratuito' : 'premium'}
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-lg font-bold font-editorial text-acentoAzul lowercase mb-2 group-hover:text-acentoTerracota transition-colors">
                            {course.title}
                          </h4>
                          <div
                            className="text-xs text-tintaCarvao/80 line-clamp-2 leading-relaxed lowercase"
                            dangerouslySetInnerHTML={{ __html: course.description || '' }}
                          />
                        </div>

                        <div className="pt-3 border-t border-papelKraft/40 flex items-center justify-between text-xs font-bold text-acentoAzul lowercase">
                          <span>{hasAccess ? 'acessar aulas →' : 'conhecer programa →'}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* BENTO 6: ESPAÇO POÉTICO & ESCREVER AGORA (md:col-span-12) */}
          <div className="md:col-span-12 bg-gradient-to-r from-acentoAzul/10 via-papelClaro to-acentoOliva/10 rounded-3xl p-6 sm:p-8 border border-papelKraft/60 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <span className="font-gesto text-acentoTerracota text-2xl font-normal block">
                estímulo poético do dia
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul lowercase">
                “o que o seu silêncio está tentando dizer hoje?”
              </h3>
              <p className="text-xs sm:text-sm text-tintaCarvao/70 font-medium lowercase">
                uma provocação simples para abrir o caderno de textos e soltar a voz.
              </p>
            </div>

            <Link
              to="/exercises"
              className="btn-pill-primary px-7 py-3 text-xs sm:text-sm font-semibold shadow-md whitespace-nowrap hover:scale-105 transition-transform"
            >
              <span>abrir meu caderno →</span>
            </Link>
          </div>

        </div>

        {/* FOOTER DISCRETO DO DASHBOARD */}
        <div className="pt-10 border-t border-papelKraft/40 text-center">
          <img
            src={BRAND_ASSETS.logos.horizontal}
            alt="solta o verbo"
            className="h-10 sm:h-12 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo_horizontal_4.png';
            }}
          />
        </div>

      </div>
    </div>
  );
}
