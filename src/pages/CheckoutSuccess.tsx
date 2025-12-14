import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle, HelpCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SubscriptionData {
  installment_plan: string;
  total_installments: number;
  completed_installments: number;
  next_payment_date: string | null;
}

export default function CheckoutSuccess() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [timeLeft, setTimeLeft] = useState(8);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchSubscriptionData = async () => {
      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('installment_plan, total_installments, completed_installments, next_payment_date')
          .eq('user_id', user.id)
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Error fetching subscription data:', error);
          return;
        }

        if (data) {
          setSubscriptionData(data);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
      }
    };

    fetchSubscriptionData();
  }, [user]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (user) {
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, user]);

  const sessionId = searchParams.get('session_id');

  const formatInstallmentPlan = (plan: string, total: number) => {
    if (total === 1) return 'Pagamento Único';
    return `${total}x Parcelado`;
  };

  const formatNextPaymentDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-limeGreen/10 via-white to-actionOrange/10 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border-4 border-limeGreen">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-limeGreen to-limeGreen/60 rounded-full mb-6">
              <CheckCircle2 className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>

          <h1 className="font-editorial text-4xl md:text-5xl text-deepBlue mb-4">
            Parabéns!
          </h1>

          <p className="text-2xl text-deepBlue/80 mb-6 font-editorial">
            Seu pagamento foi processado com sucesso
          </p>

          <div className="bg-gradient-to-r from-limeGreen/10 to-actionOrange/10 rounded-2xl p-6 mb-8 border border-limeGreen/30">
            <p className="text-lg text-deepBlue/70 leading-relaxed mb-4">
              Você está oficialmente inscrito no Roteiro Original!
            </p>
            <p className="text-deepBlue/60">
              Prepare-se para uma jornada transformadora de 12 encontros. Em breve, você receberá um email com instruções de acesso e detalhes do programa.
            </p>

            {subscriptionData && (
              <div className="mt-6 pt-6 border-t border-limeGreen/20">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/50 rounded-lg p-3">
                    <p className="text-xs text-deepBlue/60 font-semibold uppercase">Plano de Pagamento</p>
                    <p className="text-lg font-bold text-deepBlue mt-1">
                      {formatInstallmentPlan(subscriptionData.installment_plan, subscriptionData.total_installments)}
                    </p>
                  </div>
                  {subscriptionData.next_payment_date && subscriptionData.total_installments > 1 && (
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="text-xs text-deepBlue/60 font-semibold uppercase">Próximo Pagamento</p>
                      <p className="text-lg font-bold text-deepBlue mt-1">
                        {formatNextPaymentDate(subscriptionData.next_payment_date)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {sessionId && (
              <p className="text-sm text-deepBlue/40 mt-4 font-mono">
                ID da Sessão: {sessionId}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <a
              href="https://wa.link/w67ibp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl transition-all hover:scale-105"
            >
              <MessageCircle className="w-6 h-6" />
              <span>Fale no WhatsApp</span>
            </a>
            <a
              href="mailto:contato@soltaoverbo.com.br?subject=Dúvidas sobre Roteiro Original"
              className="flex items-center justify-center gap-3 bg-actionOrange hover:bg-actionOrange/90 text-white font-bold py-4 rounded-xl transition-all hover:scale-105"
            >
              <HelpCircle className="w-6 h-6" />
              <span>Dúvidas? Fala Conosco</span>
            </a>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 bg-deepBlue/5 rounded-xl p-4">
              <div className="text-limeGreen mt-1">✓</div>
              <div className="text-left">
                <p className="font-bold text-deepBlue">Acesso Imediato</p>
                <p className="text-sm text-deepBlue/60">Você já tem acesso à plataforma e aos materiais</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-deepBlue/5 rounded-xl p-4">
              <div className="text-limeGreen mt-1">✓</div>
              <div className="text-left">
                <p className="font-bold text-deepBlue">Grupo de Apoio</p>
                <p className="text-sm text-deepBlue/60">Você será adicionado ao grupo exclusivo do WhatsApp</p>
              </div>
            </div>
            <div className="flex items-start gap-4 bg-deepBlue/5 rounded-xl p-4">
              <div className="text-limeGreen mt-1">✓</div>
              <div className="text-left">
                <p className="font-bold text-deepBlue">Suporte Personalizado</p>
                <p className="text-sm text-deepBlue/60">Nossa equipe está aqui para ajudar em qualquer dúvida</p>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-deepBlue/60 mb-3">Você será redirecionado em {timeLeft} segundos...</p>
            <button
              onClick={() => {
                if (user) {
                  navigate('/dashboard');
                } else {
                  navigate('/login');
                }
              }}
              className="btn-primary px-8 py-3"
            >
              Ir Agora
            </button>
          </div>

          <p className="text-sm text-deepBlue/40 border-t border-deepBlue/10 pt-6">
            Obrigado por fazer parte da comunidade Solta o Verbo!
          </p>
        </div>
      </div>
    </div>
  );
}
