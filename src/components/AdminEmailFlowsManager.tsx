import { useState } from 'react';
import {
  Mail,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Eye,
  RefreshCw,
  CreditCard,
  Users,
  Bell,
  ShieldCheck,
  Layers,
  Coffee,
  BookOpen,
  Filter,
  Code,
  Check,
  X,
  Play,
} from 'lucide-react';

export interface EmailFlowDefinition {
  id: string;
  name: string;
  category: 'onboarding' | 'retention' | 'payments' | 'admin';
  triggerType: 'event' | 'webhook' | 'schedule';
  triggerEvent: string;
  timing: string;
  condition: string;
  recipient: string;
  sender: string;
  subject: string;
  templateName: string;
  sideEffects: string[];
  endpoint: string;
  method: 'POST' | 'GET';
  samplePayload?: Record<string, any>;
  previewHtmlGenerator: (sampleData?: any) => string;
}

export const EMAIL_FLOWS: EmailFlowDefinition[] = [
  {
    id: 'flow-welcome-main',
    name: 'boas-vindas ao solta o verbo',
    category: 'onboarding',
    triggerType: 'event',
    triggerEvent: 'auth.signup (novo cadastro)',
    timing: 'imediato ao criar conta',
    condition: 'qualquer nova aluna cadastrada na plataforma',
    recipient: 'e-mail da nova aluna',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: 'boas-vindas ao solta o verbo · sua jornada de escrita começa aqui',
    templateName: 'getWelcomeEmailHtml',
    sideEffects: [
      'cria registro em users_profiles',
      'inicia período de 96 horas de degustação livre',
      'dispara sequência de onboarding da travessia',
    ],
    endpoint: '/api/auth/welcome-email',
    method: 'POST',
    samplePayload: {
      email: 'aluna@exemplo.com',
      displayName: 'Mariana Luz',
    },
    previewHtmlGenerator: (d) => `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FAF7F0; border: 1px solid #E8DFD0; border-radius: 24px; padding: 32px; color: #2C2720;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: #FFFFFF; border: 1px solid #E8DFD0; color: #140D82; font-size: 11px;">comunidade de escrita autoral</span>
          <h1 style="color: #140D82; font-size: 24px; margin: 16px 0 6px 0; text-transform: lowercase;">olá, ${d?.displayName?.toLowerCase() || 'mariana'}</h1>
          <p style="color: #FD5E32; font-style: italic; font-size: 15px; margin: 0;">as palavras já estão prontas dentro de você 𖦹</p>
        </div>
        <p style="font-size: 14px; line-height: 1.7; color: #4A443D;">que alegria imensa ter você aqui no <strong>solta o verbo</strong>. seu espaço sagrado e descomplicado para soltar o que sente no papel está pronto.</p>
        <div style="background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 16px; padding: 18px; text-align: center; margin: 20px 0;">
          <p style="font-style: italic; font-size: 14px; margin: 0 0 6px 0; color: #140D82;">“escrever não é sobre ter algo incrível para dizer, é sobre encontrar quem somos enquanto dizemos.”</p>
          <span style="font-size: 12px; color: #7D7569;">manifesto solta o verbo</span>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <span style="display: inline-block; background: #FD5E32; color: #FFFFFF; padding: 10px 24px; border-radius: 9999px; font-size: 13px; text-decoration: none;">entrar no meu atelier de escrita →</span>
        </div>
      </div>
    `,
  },
  {
    id: 'flow-welcome-guide',
    name: 'guia da travessia & primeiros passos',
    category: 'onboarding',
    triggerType: 'event',
    triggerEvent: 'auth.signup (em sequência automática)',
    timing: 'logo após o e-mail de boas-vindas',
    condition: 'qualquer nova aluna cadastrada',
    recipient: 'e-mail da nova aluna',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: 'preparada para soltar o verbo? 𖦹',
    templateName: 'getOnboardingStepsEmailHtml',
    sideEffects: [
      'entrega passo a passo de como usar o atelier de escrita',
      'instruções para partilha na fogueira',
      'link direto para acolhimento no whatsapp com as facilitadoras',
    ],
    endpoint: '/api/email/onboarding-steps',
    method: 'POST',
    samplePayload: {
      email: 'aluna@exemplo.com',
      displayName: 'Mariana Luz',
    },
    previewHtmlGenerator: (d) => `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FAF7F0; border: 1px solid #E8DFD0; border-radius: 24px; padding: 32px; color: #2C2720;">
        <h1 style="color: #140D82; font-size: 22px; text-transform: lowercase; margin-bottom: 6px;">olá, ${d?.displayName?.toLowerCase() || 'mariana'}</h1>
        <p style="color: #FD5E32; font-style: italic; font-size: 14.5px; margin-bottom: 20px;">os 5 passos da nossa travessia poética 𖦹</p>
        <div style="background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 14px; padding: 16px; margin-bottom: 12px;">
          <strong style="color: #140D82; font-size: 14px;">1. abra seu primeiro caderno</strong>
          <p style="font-size: 13px; color: #4A443D; margin: 4px 0 0 0;">escreva 5 minutos sem julgar nem corrigir a gramática.</p>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 14px; padding: 16px; margin-bottom: 12px;">
          <strong style="color: #140D82; font-size: 14px;">2. acenda a fogueira</strong>
          <p style="font-size: 13px; color: #4A443D; margin: 4px 0 0 0;">partilhe seus versos anonimamente ou com seu nome na comunidade.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'flow-admin-new-user-alert',
    name: 'alerta de nova integrante (facilitadoras)',
    category: 'admin',
    triggerType: 'event',
    triggerEvent: 'auth.signup (novo cadastro)',
    timing: 'imediato',
    condition: 'disparado para as co-criadoras em qualquer cadastro',
    recipient: 'soltaoverbocoletivo@gmail.com',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: '[novo cadastro] {nome} criou conta no solta o verbo',
    templateName: 'getAdminNotificationHtml',
    sideEffects: [
      'notifica Bruna & Júlia por e-mail com nome e data de cadastro',
      'atualiza métrica de novos cadastros no admin dashboard',
    ],
    endpoint: '/api/auth/welcome-email',
    method: 'POST',
    previewHtmlGenerator: (d) => `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 24px; color: #2C2720;">
        <span style="background: #FEF3C7; color: #92400E; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold;">novo cadastro no colectivo</span>
        <h2 style="color: #140D82; font-size: 18px; margin: 12px 0 8px 0;">nova aluna cadastrada</h2>
        <p style="font-size: 13px; color: #4A443D; margin: 0 0 16px 0;">detalhes da usuária cadastrada:</p>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 6px 0; color: #6B7280;">Nome:</td><td style="padding: 6px 0; font-weight: bold;">${d?.displayName || 'Mariana Luz'}</td></tr>
          <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 6px 0; color: #6B7280;">E-mail:</td><td style="padding: 6px 0;">${d?.email || 'aluna@exemplo.com'}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Horário:</td><td style="padding: 6px 0;">${new Date().toLocaleString('pt-BR')}</td></tr>
        </table>
      </div>
    `,
  },
  {
    id: 'flow-trial-countdown-24h',
    name: 'contagem regressiva de degustação (24h restantes)',
    category: 'retention',
    triggerType: 'schedule',
    triggerEvent: 'scheduler autônomo (30min) ou cron endpoint',
    timing: 'marca de 72 horas (janela 70h - 95h após cadastro)',
    condition: 'usuária free/trial, sem assinatura ativa e sem lembrete prévio',
    recipient: 'e-mail da aluna em teste',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: 'sua degustação termina em 24 horas 𖦹',
    templateName: 'getTrialCountdownEmailHtml',
    sideEffects: [
      'atualiza trial_reminder_sent_at no users_profiles',
      'cria notificação in-app na tabela notifications',
      'armazena id em cache de idempotência',
    ],
    endpoint: '/api/cron/trial-countdown-reminders',
    method: 'POST',
    samplePayload: {
      dryRun: true,
    },
    previewHtmlGenerator: (d) => `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FAF7F0; border: 1px solid #E8DFD0; border-radius: 24px; padding: 32px; color: #2C2720;">
        <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: #FFFFFF; border: 1px solid #E8DFD0; color: #140D82; font-size: 11px;">degustação livre 𖦹</span>
        <h1 style="color: #140D82; font-size: 22px; margin: 16px 0 4px 0; text-transform: lowercase;">olá, ${d?.displayName?.toLowerCase() || 'mariana'}</h1>
        <p style="color: #FD5E32; font-style: italic; font-size: 15px; margin: 0 0 18px 0;">faltam 24 horas para o fim da sua degustação livre 𖦹</p>
        <p style="font-size: 14px; line-height: 1.65; color: #4A443D;">escrever é um ato de presença e coragem. suas palavras escritas até aqui continuam guardadas em segurança na sua estante pessoal.</p>
        <div style="background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 16px; padding: 18px; margin: 18px 0;">
          <h3 style="color: #140D82; font-size: 16px; margin: 0 0 6px 0;">café com letras</h3>
          <p style="font-size: 13px; color: #4A443D; margin: 0 0 12px 0;">encontros ao vivo de escrita toda terça 08h00 pelo zoom + atelier liberado.</p>
          <span style="background: #FD5E32; color: #FFF; padding: 7px 18px; border-radius: 9999px; font-size: 12px;">entrar na roda do café →</span>
        </div>
        <div style="background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 16px; padding: 18px; margin: 18px 0;">
          <h3 style="color: #140D82; font-size: 16px; margin: 0 0 6px 0;">21 dias de escrita poética</h3>
          <p style="font-size: 13px; color: #4A443D; margin: 0 0 12px 0;">curso completo com áudios binaurais + 1 ano de atelier liberado.</p>
          <span style="background: #140D82; color: #FFF; padding: 7px 18px; border-radius: 9999px; font-size: 12px;">conhecer os 21 dias (r$ 77) →</span>
        </div>
      </div>
    `,
  },
  {
    id: 'flow-payment-receipt',
    name: 'confirmação de pagamento & recibo',
    category: 'payments',
    triggerType: 'webhook',
    triggerEvent: 'infinitepay.transaction_approved',
    timing: 'imediato à aprovação do pagamento',
    condition: 'qualquer compra aprovada via InfinitePay (Pix ou Cartão)',
    recipient: 'e-mail da aluna compradora',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: 'pagamento confirmado · seu acesso ao solta o verbo está liberado!',
    templateName: 'getPaymentConfirmedHtml',
    sideEffects: [
      'atualiza users_profiles.role = "paid"',
      'insere registro na tabela user_entitlements com data de expiração',
      'cria notificação in-app de boas-vindas comemorativa',
    ],
    endpoint: '/api/webhooks/infinitepay',
    method: 'POST',
    previewHtmlGenerator: (d) => `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FAF7F0; border: 1px solid #E8DFD0; border-radius: 24px; padding: 32px; color: #2C2720;">
        <span style="background: #D1FAE5; color: #065F46; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold;">pagamento confirmado ✓</span>
        <h1 style="color: #140D82; font-size: 22px; margin: 16px 0 4px 0; text-transform: lowercase;">olá, ${d?.displayName?.toLowerCase() || 'mariana'}!</h1>
        <p style="color: #FD5E32; font-style: italic; font-size: 15px; margin: 0 0 18px 0;">seu acesso está liberado com afeto 𖦹</p>
        <p style="font-size: 14px; line-height: 1.65; color: #4A443D;">recebemos a confirmação do seu pagamento para o plano <strong>21 dias de escrita poética</strong>. seu atelier e aulas já estão 100% disponíveis.</p>
        <div style="background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 16px; padding: 18px; margin: 20px 0;">
          <div style="font-size: 13px; color: #4A443D;"><strong>Valor:</strong> R$ 77,00</div>
          <div style="font-size: 13px; color: #4A443D; margin-top: 4px;"><strong>Forma:</strong> Pix / Cartão (InfinitePay)</div>
          <div style="font-size: 13px; color: #4A443D; margin-top: 4px;"><strong>Validade:</strong> 1 ano de acesso total</div>
        </div>
      </div>
    `,
  },
  {
    id: 'flow-onboarding-21dias',
    name: 'boas-vindas aos 21 dias de escrita',
    category: 'onboarding',
    triggerType: 'webhook',
    triggerEvent: 'compra confirmada de "21_dias"',
    timing: 'imediato após o recibo de pagamento',
    condition: 'produto comprado corresponde aos 21 Dias de Escrita (R$ 77)',
    recipient: 'e-mail da nova aluna',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: 'bem-vinda aos 21 dias de escrita 𖦹',
    templateName: 'get21DiasWelcomeEmailHtml',
    sideEffects: [
      'desbloqueia os 21 dias de exercícios com áudios binaurais',
      'concede 365 dias de escrita ilimitada no atelier e fogueira',
    ],
    endpoint: '/api/webhooks/infinitepay',
    method: 'POST',
    previewHtmlGenerator: (d) => `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FAF7F0; border: 1px solid #E8DFD0; border-radius: 24px; padding: 32px; color: #2C2720;">
        <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: #FFFFFF; border: 1px solid #E8DFD0; color: #140D82; font-size: 11px;">21 dias de escrita · início 𖦹</span>
        <h1 style="color: #140D82; font-size: 22px; margin: 16px 0 4px 0; text-transform: lowercase;">olá, ${d?.displayName?.toLowerCase() || 'mariana'}</h1>
        <p style="color: #FD5E32; font-style: italic; font-size: 15px; margin: 0 0 18px 0;">seu hábito de escrita autoral começa agora 𖦹</p>
        <p style="font-size: 14px; line-height: 1.65; color: #4A443D;">durante as próximas três semanas, você terá um espaço sagrado e descomplicado para soltar o que sente no papel com áudios guiados e provocações diárias.</p>
        <div style="text-align: center; margin-top: 24px;">
          <span style="background: #FD5E32; color: #FFF; padding: 10px 24px; border-radius: 9999px; font-size: 13px;">abrir meu dia 1 de prática →</span>
        </div>
      </div>
    `,
  },
  {
    id: 'flow-onboarding-cafe',
    name: 'boas-vindas ao café com letras',
    category: 'onboarding',
    triggerType: 'webhook',
    triggerEvent: 'assinatura confirmada de "cafe_com_letras"',
    timing: 'imediato após o recibo de pagamento',
    condition: 'produto comprado corresponde ao Café com Letras (mensal R$ 97)',
    recipient: 'e-mail da assinante',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: 'bem-vinda ao café com letras ☕',
    templateName: 'getCafeWelcomeEmailHtml',
    sideEffects: [
      'desbloqueia link fixo do Zoom para encontros de terça 08h',
      'adiciona botão direto para salvar eventos no Google Agenda',
      'concede 30 dias de escrita ilimitada com renovação automática',
    ],
    endpoint: '/api/webhooks/infinitepay',
    method: 'POST',
    previewHtmlGenerator: (d) => `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FAF7F0; border: 1px solid #E8DFD0; border-radius: 24px; padding: 32px; color: #2C2720;">
        <span style="display: inline-block; padding: 4px 14px; border-radius: 9999px; background: #FFFFFF; border: 1px solid #E8DFD0; color: #140D82; font-size: 11px;">café com letras · roda semanal ☕</span>
        <h1 style="color: #140D82; font-size: 22px; margin: 16px 0 4px 0; text-transform: lowercase;">bem-vinda à roda, ${d?.displayName?.toLowerCase() || 'mariana'}!</h1>
        <p style="color: #FD5E32; font-style: italic; font-size: 15px; margin: 0 0 18px 0;">o café com letras te espera toda terça ☕</p>
        <div style="background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 16px; padding: 18px; margin: 18px 0;">
          <p style="margin: 0; font-size: 13px; color: #2C2720; line-height: 1.6;">
            <strong>quando:</strong> toda terça-feira, 08h00 às 08h30 (horário de brasília)<br>
            <strong>onde:</strong> sala ao vivo pelo zoom<br>
            <strong>formato:</strong> 5min provocação, 20min escrita concentrada e 5min partilha opcional.
          </p>
        </div>
        <div style="text-align: center; margin-top: 24px;">
          <span style="background: #140D82; color: #FFF; padding: 10px 24px; border-radius: 9999px; font-size: 13px;">adicionar as terças no google agenda →</span>
        </div>
      </div>
    `,
  },
  {
    id: 'flow-admin-order-alert',
    name: 'alerta de nova venda (facilitadoras)',
    category: 'admin',
    triggerType: 'webhook',
    triggerEvent: 'infinitepay.transaction_approved',
    timing: 'imediato à aprovação',
    condition: 'disparado para as co-criadoras em qualquer venda aprovada',
    recipient: 'soltaoverbocoletivo@gmail.com',
    sender: 'Solta o Verbo <ola@contato.soltaoverbocoletivo.com>',
    subject: '[pagamento recebido] R$ {valor} · {cliente}',
    templateName: 'getAdminNotificationHtml',
    sideEffects: [
      'alerta Bruna & Júlia no e-mail oficial com valor, cliente e parcelas',
      'atualiza dados financeiros e MRR no painel admin',
    ],
    endpoint: '/api/webhooks/infinitepay',
    method: 'POST',
    previewHtmlGenerator: (d) => `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; background: #FFFFFF; border: 1px solid #E8DFD0; border-radius: 18px; padding: 24px; color: #2C2720;">
        <span style="background: #D1FAE5; color: #065F46; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold;">pagamento aprovado (infinitepay)</span>
        <h2 style="color: #140D82; font-size: 18px; margin: 12px 0 8px 0;">nova venda confirmada</h2>
        <table style="width: 100%; font-size: 13px; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 6px 0; color: #6B7280;">Produto:</td><td style="padding: 6px 0; font-weight: bold;">21 dias de escrita poética</td></tr>
          <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 6px 0; color: #6B7280;">Valor:</td><td style="padding: 6px 0; font-weight: bold; color: #065F46;">R$ 77,00</td></tr>
          <tr style="border-bottom: 1px solid #F3F4F6;"><td style="padding: 6px 0; color: #6B7280;">Aluna:</td><td style="padding: 6px 0;">${d?.displayName || 'Mariana Luz'}</td></tr>
          <tr><td style="padding: 6px 0; color: #6B7280;">Forma:</td><td style="padding: 6px 0;">Pix à vista</td></tr>
        </table>
      </div>
    `,
  },
];

export default function AdminEmailFlowsManager() {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [previewFlow, setPreviewFlow] = useState<EmailFlowDefinition | null>(null);
  const [testModalFlow, setTestModalFlow] = useState<EmailFlowDefinition | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [customTestEmail, setCustomTestEmail] = useState('');

  const filteredFlows = EMAIL_FLOWS.filter((flow) => {
    if (filterCategory === 'all') return true;
    return flow.category === filterCategory;
  });

  const handleTestCronDryRun = async (flow: EmailFlowDefinition) => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await fetch(`${flow.endpoint}?dryRun=true`, {
        method: flow.method,
      });
      const data = await response.json();
      setTestResult({
        status: response.status,
        data,
      });
    } catch (err: any) {
      setTestResult({
        error: err.message,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-papelKraft/30 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-corpo font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                microserviço resend ativo · porta 3001
              </span>
              <span className="text-xs text-tintaCarvao/60 font-corpo">
                remetente: ola@contato.soltaoverbocoletivo.com
              </span>
            </div>
            <h1 className="font-editorial font-bold text-2xl sm:text-3xl text-acentoAzul lowercase">
              fluxos & automações de e-mail
            </h1>
            <p className="font-corpo text-sm text-tintaCarvao/70 mt-1 max-w-2xl">
              mapa visual com os 8 fluxos automáticos de e-mail transacional, regras de ativação, gatilhos de tempo e prévias poéticas.
            </p>
          </div>

          {/* ESTATÍSTICAS RÁPIDAS */}
          <div className="flex items-center gap-3">
            <div className="bg-white border border-papelKraft/40 rounded-2xl p-3.5 text-center min-w-[100px] shadow-sm">
              <span className="block text-xl font-bold font-editorial text-acentoAzul">8</span>
              <span className="text-xs text-tintaCarvao/60 lowercase">fluxos ativos</span>
            </div>
            <div className="bg-white border border-papelKraft/40 rounded-2xl p-3.5 text-center min-w-[100px] shadow-sm">
              <span className="block text-xl font-bold font-editorial text-emerald-600">3x</span>
              <span className="text-xs text-tintaCarvao/60 lowercase">idempotência</span>
            </div>
            <div className="bg-white border border-papelKraft/40 rounded-2xl p-3.5 text-center min-w-[100px] shadow-sm">
              <span className="block text-xl font-bold font-editorial text-acentoTerracota">100%</span>
              <span className="text-xs text-tintaCarvao/60 lowercase">transacional</span>
            </div>
          </div>
        </div>

        {/* FILTROS POR CATEGORIA */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs font-medium text-tintaCarvao/60 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" /> filtrar:
          </span>
          {[
            { id: 'all', label: 'todos os fluxos (8)' },
            { id: 'onboarding', label: 'boas-vindas & onboarding (4)' },
            { id: 'retention', label: 'degustação & retenção (1)' },
            { id: 'payments', label: 'pagamentos (1)' },
            { id: 'admin', label: 'alertas de facilitadora (2)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-corpo transition-all ${
                filterCategory === cat.id
                  ? 'bg-acentoAzul text-white shadow-sm font-medium'
                  : 'bg-white/80 hover:bg-white text-tintaCarvao/80 border border-papelKraft/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRADE DE FLUXOS VISUAIS (PIPELINES) */}
      <div className="space-y-5">
        {filteredFlows.map((flow, index) => (
          <div
            key={flow.id}
            className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-6 shadow-kraft hover:border-acentoAzul/30 transition-all space-y-4"
          >
            {/* CABEÇALHO DO FLUXO */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-papelKraft/20 pb-3.5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-acentoAzul bg-acentoAzul/10 px-2.5 py-1 rounded-lg border border-acentoAzul/20">
                  #{flow.id}
                </span>
                <div>
                  <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                    {flow.name}
                  </h3>
                  <p className="text-xs text-tintaCarvao/70 font-corpo">
                    assunto: <span className="font-serif italic text-acentoTerracota">"{flow.subject}"</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-corpo">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  ativo em produção
                </span>
                <button
                  onClick={() => setPreviewFlow(flow)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-papelClaro border border-papelKraft/50 text-acentoAzul text-xs font-corpo transition-all shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" />
                  ver prévia
                </button>
                <button
                  onClick={() => {
                    setTestModalFlow(flow);
                    setTestResult(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-corpo transition-all shadow-sm"
                >
                  <Code className="w-3.5 h-3.5" />
                  detalhes & teste
                </button>
              </div>
            </div>

            {/* PIPELINE GRÁFICO (NODOS VISUAIS) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1">
              {/* NÓ 1: GATILHO */}
              <div className="bg-white rounded-2xl border border-papelKraft/40 p-4 space-y-2 relative shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-acentoAzul lowercase">
                  <Clock className="w-4 h-4 text-acentoTerracota shrink-0" />
                  1. gatilho / trigger
                </div>
                <div className="space-y-1">
                  <span className="block text-xs font-mono font-medium text-tintaCarvao bg-papelClaro px-2 py-0.5 rounded border border-papelKraft/30 truncate">
                    {flow.triggerEvent}
                  </span>
                  <p className="text-xs text-tintaCarvao/70 font-corpo">
                    momento: <strong>{flow.timing}</strong>
                  </p>
                </div>
                {/* SETA VISUAL PARA DESKTOP */}
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-papelKraft/40 items-center justify-center text-tintaCarvao/40 shadow-xs">
                  <ArrowRight className="w-3 h-3 text-acentoAzul" />
                </div>
              </div>

              {/* NÓ 2: CONDIÇÃO / FILTRO */}
              <div className="bg-white rounded-2xl border border-papelKraft/40 p-4 space-y-2 relative shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-acentoAzul lowercase">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  2. regra & filtro
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-tintaCarvao/80 font-corpo leading-relaxed">
                    {flow.condition}
                  </p>
                  <span className="inline-block text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    idempotência garantida
                  </span>
                </div>
                {/* SETA VISUAL PARA DESKTOP */}
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-papelKraft/40 items-center justify-center text-tintaCarvao/40 shadow-xs">
                  <ArrowRight className="w-3 h-3 text-acentoAzul" />
                </div>
              </div>

              {/* NÓ 3: E-MAIL & TEMPLATE */}
              <div className="bg-white rounded-2xl border border-papelKraft/40 p-4 space-y-2 relative shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-acentoAzul lowercase">
                  <Mail className="w-4 h-4 text-acentoAzul shrink-0" />
                  3. template resend
                </div>
                <div className="space-y-1">
                  <span className="block text-xs font-mono text-acentoAzul font-medium truncate">
                    {flow.templateName}()
                  </span>
                  <p className="text-xs text-tintaCarvao/70 font-corpo truncate">
                    para: <strong>{flow.recipient}</strong>
                  </p>
                </div>
                {/* SETA VISUAL PARA DESKTOP */}
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-white border border-papelKraft/40 items-center justify-center text-tintaCarvao/40 shadow-xs">
                  <ArrowRight className="w-3 h-3 text-acentoAzul" />
                </div>
              </div>

              {/* NÓ 4: EFEITO COLATERAL / PERSISTÊNCIA */}
              <div className="bg-white rounded-2xl border border-papelKraft/40 p-4 space-y-2 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-bold text-acentoAzul lowercase">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  4. efeitos no sistema
                </div>
                <ul className="text-xs text-tintaCarvao/80 font-corpo space-y-1 list-disc list-inside">
                  {flow.sideEffects.slice(0, 2).map((effect, eIdx) => (
                    <li key={eIdx} className="truncate">
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE PRÉVIA POÉTICA DO E-MAIL */}
      {previewFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tintaCarvao/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-papelClaro border border-papelKraft/50 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* TOPO DO MODAL */}
            <div className="flex items-center justify-between p-5 border-b border-papelKraft/40 bg-white/60">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs text-acentoAzul font-bold bg-acentoAzul/10 px-2 py-0.5 rounded">
                  #{previewFlow.id}
                </span>
                <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                  prévia: {previewFlow.name}
                </h3>
              </div>
              <button
                onClick={() => setPreviewFlow(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-tintaCarvao/60 hover:text-tintaCarvao hover:bg-papelKraft/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* METADADOS DO CABEÇALHO */}
            <div className="p-4 bg-white/40 border-b border-papelKraft/30 text-xs font-corpo space-y-1">
              <div><strong className="text-acentoAzul">remetente:</strong> {previewFlow.sender}</div>
              <div><strong className="text-acentoAzul">destinatário:</strong> {previewFlow.recipient}</div>
              <div><strong className="text-acentoAzul">assunto:</strong> {previewFlow.subject}</div>
            </div>

            {/* CORPO DO E-MAIL SIMULADO */}
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div
                dangerouslySetInnerHTML={{
                  __html: previewFlow.previewHtmlGenerator(),
                }}
              />
            </div>

            {/* RODAPÉ DO MODAL */}
            <div className="p-4 border-t border-papelKraft/30 bg-white/60 flex items-center justify-between text-xs font-corpo text-tintaCarvao/70">
              <span>design oficial solta o verbo · cores sólidas & minúsculas</span>
              <button
                onClick={() => setPreviewFlow(null)}
                className="px-4 py-2 rounded-full bg-acentoAzul text-white text-xs font-medium hover:bg-acentoAzul/90 transition-all"
              >
                fechar prévia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE DETALHES TÉCNICOS & TESTES DE ENDPOINT */}
      {testModalFlow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-tintaCarvao/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-papelClaro border border-papelKraft/50 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* TOPO DO MODAL */}
            <div className="flex items-center justify-between p-5 border-b border-papelKraft/40 bg-white/60">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs text-acentoTerracota font-bold bg-acentoTerracota/10 px-2 py-0.5 rounded">
                  {testModalFlow.method}
                </span>
                <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                  detalhes da rota: {testModalFlow.name}
                </h3>
              </div>
              <button
                onClick={() => setTestModalFlow(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-tintaCarvao/60 hover:text-tintaCarvao hover:bg-papelKraft/30 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CONTEÚDO TÉCNICO */}
            <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar text-xs font-corpo">
              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1">
                  endpoint oficial no microserviço:
                </label>
                <code className="block p-3 rounded-xl bg-white border border-papelKraft/40 font-mono text-acentoTerracota text-xs">
                  {testModalFlow.method} {testModalFlow.endpoint}
                </code>
              </div>

              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1">
                  gatilho associado:
                </label>
                <p className="p-3 rounded-xl bg-white border border-papelKraft/40 text-tintaCarvao">
                  {testModalFlow.triggerEvent} ({testModalFlow.timing})
                </p>
              </div>

              {testModalFlow.samplePayload && (
                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1">
                    exemplo de payload JSON recebido:
                  </label>
                  <pre className="p-3 rounded-xl bg-white border border-papelKraft/40 font-mono text-xs text-tintaCarvao overflow-x-auto">
                    {JSON.stringify(testModalFlow.samplePayload, null, 2)}
                  </pre>
                </div>
              )}

              {/* BOTÃO DE TESTE PARA ROTAS AGENDÁVEIS OU CRON */}
              {testModalFlow.id === 'flow-trial-countdown-24h' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-acentoTerracota" />
                    simular verificação de candidatas (dry-run seguro)
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    executa a consulta no microserviço sem disparar e-mails para alunas reais. lista usuárias elegíveis na janela de 70h a 95h.
                  </p>
                  <button
                    disabled={isTesting}
                    onClick={() => handleTestCronDryRun(testModalFlow)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-acentoAzul text-white text-xs font-medium hover:bg-acentoAzul/90 transition-all disabled:opacity-50"
                  >
                    {isTesting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    executar dry-run agora
                  </button>

                  {testResult && (
                    <div className="mt-2 p-3 rounded-xl bg-white border border-amber-300 font-mono text-[11px] text-tintaCarvao overflow-x-auto max-h-40">
                      {JSON.stringify(testResult, null, 2)}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RODAPÉ DO MODAL */}
            <div className="p-4 border-t border-papelKraft/30 bg-white/60 flex items-center justify-end">
              <button
                onClick={() => setTestModalFlow(null)}
                className="px-4 py-2 rounded-full bg-papelKraft/30 hover:bg-papelKraft/50 text-tintaCarvao text-xs font-medium transition-all"
              >
                fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
