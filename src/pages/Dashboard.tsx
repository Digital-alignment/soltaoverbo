import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import BannerSlider from '../components/BannerSlider';
import { Lock, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

interface Subscription {
  installment_plan: string;
  total_installments: number;
  completed_installments: number;
  next_payment_date: string | null;
  expires_at: string;
}

const welcomeMessages = [
  'Olá, {name}!',
  'Que bom ter você aqui, {name}!',
  'Bem-vindo(a), {name}!',
  'Prazer em ver você, {name}!',
  'É ótimo ter você conosco, {name}!',
  'Olá, {name}! Pronto(a) para aprender?',
  'Que alegria ter você aqui, {name}!',
  'Seja bem-vindo(a), {name}!',
  'Oi, {name}! Vamos escrever hoje?',
  'Feliz em ver você, {name}!',
  'Olá, {name}! Vamos soltar o verbo?',
  'Que bom que você voltou, {name}!',
];

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const welcomeMessage = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
    return welcomeMessages[randomIndex].replace('{name}', profile?.display_name || '');
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
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const canAccessCourse = (course: Course) => {
    if (course.course_type === 'free') return true;
    return profile?.role === 'paid' || profile?.role === 'admin';
  };

  const getRoleBadgeColor = () => {
    switch (profile?.role) {
      case 'admin':
        return 'bg-deepBlue/10 text-deepBlue';
      case 'paid':
        return 'bg-actionOrange/10 text-actionOrange';
      default:
        return 'bg-darkNeutral/10 text-darkNeutral';
    }
  };

  const getRoleLabel = () => {
    switch (profile?.role) {
      case 'admin':
        return 'Administrador';
      case 'paid':
        return 'Membro Premium';
      default:
        return 'Membro Gratuito';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInstallmentProgress = () => {
    if (!subscription) return 0;
    return (subscription.completed_installments / subscription.total_installments) * 100;
  };

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-deepBlue mb-2">
            {welcomeMessage}
          </h1>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor()}`}>
              {getRoleLabel()}
            </span>
          </div>
        </div>

        {profile?.role === 'paid' && subscription && (
          <div className="mb-8 bg-gradient-to-r from-actionOrange/10 to-limeGreen/10 rounded-2xl border border-actionOrange/20 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-xs text-deepBlue/60 font-semibold lowercase">Plano de Pagamento</p>
                <p className="text-lg font-bold text-deepBlue mt-2">
                  {subscription.total_installments > 1 ? `${subscription.total_installments}x Parcelado` : 'Pagamento Único'}
                </p>
              </div>

              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-xs text-deepBlue/60 font-semibold lowercase">Parcelas Pagas</p>
                <p className="text-lg font-bold text-limeGreen mt-2">
                  {subscription.completed_installments}/{subscription.total_installments}
                </p>
              </div>

              {subscription.next_payment_date && subscription.total_installments > 1 && (
                <div className="bg-white/60 rounded-xl p-4">
                  <p className="text-xs text-deepBlue/60 font-semibold lowercase flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Próximo Pagamento
                  </p>
                  <p className="text-lg font-bold text-actionOrange mt-2">
                    {formatDate(subscription.next_payment_date)}
                  </p>
                </div>
              )}

              <div className="bg-white/60 rounded-xl p-4">
                <p className="text-xs text-deepBlue/60 font-semibold lowercase">Acesso até</p>
                <p className="text-lg font-bold text-deepBlue mt-2">
                  {formatDate(subscription.expires_at)}
                </p>
              </div>
            </div>

            {subscription.total_installments > 1 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-deepBlue">Progresso de Pagamento</p>
                  <p className="text-sm font-semibold text-deepBlue">{getInstallmentProgress().toFixed(0)}%</p>
                </div>
                <div className="w-full bg-deepBlue/10 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-limeGreen to-actionOrange h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getInstallmentProgress()}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mb-8">
          <BannerSlider />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-deepBlue mb-6">Cursos Disponíveis</h2>

          {courses.length === 0 ? (
            <div className="rounded-2xl border border-deepBlue/10 p-12 text-center" style={{ backgroundColor: '#f0e7d1' }}>
              <BookOpen className="w-16 h-16 text-deepBlue/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-deepBlue mb-2">
                Nenhum curso disponível ainda
              </h3>
              <p className="text-deepBlue/70">
                Os cursos aparecerão aqui quando forem criados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const hasAccess = canAccessCourse(course);
                return (
                  <Link
                    key={course.id}
                    to={hasAccess ? `/course/${course.id}` : '/roteirooriginal'}
                    className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                      !hasAccess && 'opacity-75'
                    }`}
                    style={{
                      backgroundColor: course.course_type === 'premium' ? '#190087' : '#ede6d4',
                      borderColor: course.course_type === 'premium' ? '#190087' : '#190087'
                    }}
                  >
                    <div className="relative h-48 bg-gradient-to-br from-amber-500 to-orange-600 overflow-hidden">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-white opacity-50" />
                        </div>
                      )}
                      {!hasAccess && (
                        <div className="absolute inset-0 bg-darkNeutral/80 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Lock className="w-12 h-12 mx-auto mb-2" />
                            <p className="font-semibold">Curso Premium</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            course.course_type === 'free'
                              ? 'bg-limeGreen text-darkNeutral'
                              : 'bg-actionOrange text-white'
                          }`}
                        >
                          {course.course_type === 'free' ? 'Gratuito' : 'Premium'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3
                        className="text-xl font-bold mb-2 group-hover:opacity-80 transition"
                        style={{ color: '#140d82' }}
                      >
                        {course.title}
                      </h3>
                      <div
                        className="text-sm line-clamp-3 prose prose-sm max-w-none [&_*]:!text-[#140d82]"
                        style={{ color: '#140d82 !important', opacity: 0.8 }}
                        dangerouslySetInnerHTML={{ __html: course.description || '' }}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {profile?.role === 'free' && (
          <div className="rounded-2xl overflow-hidden shadow-xl border border-deepBlue/10">
            <div className="bg-white p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-3xl md:text-4xl font-bold text-deepBlue mb-4">
                  Desbloqueie Todos os Cursos Premium
                </h3>
                <p className="text-lg text-deepBlue/70 mb-8 leading-relaxed">
                  Acesse o Roteiro Original, a primeira mentoria coletiva da solta o verbo. Desenvolva suas habilidades de escrita com conteúdo exclusivo e aulas ao vivo.
                </p>
                <button
                  onClick={() => navigate('/roteirooriginal')}
                  className="bg-deepBlue text-white px-8 py-4 rounded-lg font-bold hover:bg-deepBlue/90 transition shadow-lg flex items-center gap-2 group"
                >
                  Descobrir Agora
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
              </div>
              <div className="flex-1">
                <img
                  src="/whatsapp_image_2025-12-11_at_5.08.40_pm.jpeg"
                  alt="Roteiro Original"
                  className="w-full h-auto rounded-xl shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        )}

        <div className="mt-16 pt-12 border-t border-deepBlue/10">
          <div className="flex flex-col items-center justify-center">
            <img
              src="/logo_horizontal_4 copy.png"
              alt="Solta o Verbo"
              className="h-16 sm:h-20 md:h-24 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
