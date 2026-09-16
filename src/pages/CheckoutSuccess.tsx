import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, MessageCircle, HelpCircle, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
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

  const receiptUrl = searchParams.get('receipt_url');
  const orderNsu = searchParams.get('order_nsu');
  const transactionNsu = searchParams.get('transaction_nsu');
  const captureMethod = searchParams.get('capture_method');
  const sessionId = searchParams.get('session_id') || orderNsu || transactionNsu;

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
          console.error('erro ao buscar dados da assinatura:', error);
          return;
        }

        if (data) {
          setSubscriptionData(data);
        }
      } catch (err) {
        console.error('erro ao carregar assinatura:', err);
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

  const formatInstallmentPlan = (plan: string, total: number) => {
    if (total === 1) return 'pagamento único';
    return `${total}x parcelado`;
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
    <div className="min-h-screen bg-bgPlataforma flex items-center justify-center p-4">
      <div className="max-w-2xl w-full my-8">
        <div className="bg-papelClaro rounded-3xl shadow-kraft-lg p-6 sm:p-12 text-center border border-papelKraft/60 overflow-hidden">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-acentoOliva/20 rounded-full flex items-center justify-center border border-acentoOliva/40">
              <CheckCircle2 className="w-12 h-12 text-acentoOliva" />
            </div>
          </div>

          <h1 className="font-editorial text-3xl sm:text-5xl text-acentoAzul font-bold lowercase mb-2">
            parabéns!
          </h1>

          <p className="text-xl sm:text-2xl text-acentoTerracota font-gesto font-normal lowercase mb-6">
            seu pagamento foi processado com sucesso
          </p>

          <div className="bg-white rounded-2xl p-6 mb-8 border border-papelKraft/40 text-left space-y-4 shadow-xs">
            <p className="text-sm text-tintaCarvao/85 font-corpo font-medium lowercase leading-relaxed">
              você está oficialmente inscrita no solta o verbo! prepare-se para uma jornada transformadora de escrita autoral.
            </p>

            {subscriptionData && (
              <div className="pt-4 border-t border-papelKraft/30 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-bgPlataforma rounded-xl p-3 border border-papelKraft/30">
                  <p className="text-[10px] text-tintaCarvao/60 font-corpo font-bold lowercase">plano de pagamento</p>
                  <p className="text-sm font-editorial font-bold text-acentoAzul lowercase mt-0.5">
                    {formatInstallmentPlan(subscriptionData.installment_plan, subscriptionData.total_installments)}
                  </p>
                </div>
                {subscriptionData.next_payment_date && subscriptionData.total_installments > 1 && (
                  <div className="bg-bgPlataforma rounded-xl p-3 border border-papelKraft/30">
                    <p className="text-[10px] text-tintaCarvao/60 font-corpo font-bold lowercase">próximo pagamento</p>
                    <p className="text-sm font-editorial font-bold text-acentoAzul lowercase mt-0.5">
                      {formatNextPaymentDate(subscriptionData.next_payment_date)}
                    </p>
                  </div>
                )}
              </div>
            )}

            {captureMethod && (
              <p className="text-[11px] text-tintaCarvao/70 font-corpo font-bold lowercase pt-2">
                forma de pagamento: {captureMethod === 'credit_card' ? 'cartão de crédito' : captureMethod.toLowerCase()}
              </p>
            )}

            {receiptUrl && (
              <div className="pt-2">
                <a
                  href={receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-acentoAzul font-corpo font-bold hover:underline lowercase"
                >
                  <FileText className="w-4 h-4" />
                  <span>ver comprovante de pagamento →</span>
                </a>
              </div>
            )}

            {sessionId && (
              <p className="text-[10px] text-tintaCarvao/40 font-mono pt-1">
                id do pedido: {sessionId}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <a
              href="https://wa.me/5548991823637?text=Ol%C3%A1!%20Acabei%20de%20realizar%20minha%20inscri%C3%A7%C3%A3o%20no%20Solta%20o%20Verbo."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-corpo font-bold py-3.5 px-6 rounded-full transition-all text-xs sm:text-sm shadow-xs cursor-pointer lowercase"
            >
              <MessageCircle className="w-4 h-4" />
              <span>falar no whatsapp</span>
            </a>
            <a
              href="mailto:contato@soltaoverbo.com.br?subject=Dúvidas sobre o Solta o Verbo"
              className="flex items-center justify-center gap-2.5 bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-corpo font-bold py-3.5 px-6 rounded-full transition-all text-xs sm:text-sm shadow-xs cursor-pointer lowercase"
            >
              <HelpCircle className="w-4 h-4" />
              <span>dúvidas? fale conosco</span>
            </a>
          </div>

          <div className="space-y-3 mb-8 text-left bg-white/60 rounded-2xl p-5 border border-papelKraft/40">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-acentoOliva/20 text-acentoOliva flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
              <div>
                <p className="font-editorial font-bold text-sm text-acentoAzul lowercase">acesso imediato</p>
                <p className="text-xs text-tintaCarvao/70 font-corpo lowercase">sua conta já tem acesso liberado aos materiais da plataforma</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-acentoOliva/20 text-acentoOliva flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
              <div>
                <p className="font-editorial font-bold text-sm text-acentoAzul lowercase">comunidade exclusiva</p>
                <p className="text-xs text-tintaCarvao/70 font-corpo lowercase">você receberá os convites para os grupos de avisos e fogueira</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-acentoOliva/20 text-acentoOliva flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</div>
              <div>
                <p className="font-editorial font-bold text-sm text-acentoAzul lowercase">suporte dedicado</p>
                <p className="text-xs text-tintaCarvao/70 font-corpo lowercase">nossa equipe está pronta para te acolher em cada passo da jornada</p>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <p className="text-xs text-tintaCarvao/60 font-corpo lowercase">
              redirecionando em {timeLeft} segundos...
            </p>
            <button
              onClick={() => {
                if (user) {
                  navigate('/dashboard');
                } else {
                  navigate('/login');
                }
              }}
              className="py-3 px-8 rounded-full bg-acentoAzul hover:bg-acentoAzul/90 text-white font-corpo font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs lowercase inline-flex items-center gap-2"
            >
              <span>acessar plataforma agora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
