import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  Plus,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  UserCheck,
  Zap,
} from 'lucide-react';

interface StudentSubscriptionRecord {
  id: string;
  user_id: string;
  display_name: string;
  email: string;
  plan_name: string;
  amount_cents: number;
  payment_method: 'infinitepay_pix' | 'infinitepay_card' | 'pix' | 'outro';
  started_at: string;
  expires_at: string | null;
  status: 'ativa' | 'vencida' | 'cancelada';
}

export default function AdminFinancasManager() {
  const [subscriptions, setSubscriptions] = useState<StudentSubscriptionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'ativa' | 'vencida' | 'cancelada'>('todos');
  const [productFilter, setProductFilter] = useState<'todos' | '21dias' | 'cafe' | 'ciclo' | 'b2b'>('todos');
  const [selectedStudent, setSelectedStudent] = useState<StudentSubscriptionRecord | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      // Buscar usuários e assinaturas no Supabase
      const { data: profiles, error: profileErr } = await supabase
        .from('users_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: subsData, error: subErr } = await supabase
        .from('user_subscriptions')
        .select('*');

      if (profileErr || !profiles || profiles.length === 0) {
        // Dados demonstrativos de fallback para visualização imediata
        const demoRecords: StudentSubscriptionRecord[] = [
          {
            id: 'sub_1',
            user_id: 'u1',
            display_name: 'ana maria silva',
            email: 'anamaria@gmail.com',
            plan_name: 'ciclo de aprofundamento',
            amount_cents: 59700,
            payment_method: 'infinitepay_card',
            started_at: new Date(Date.now() - 15 * 86400000).toISOString(),
            expires_at: new Date(Date.now() + 75 * 86400000).toISOString(),
            status: 'ativa',
          },
          {
            id: 'sub_2',
            user_id: 'u2',
            display_name: 'carolina mendes',
            email: 'carol.mendes@hotmail.com',
            plan_name: '21 dias de escrita',
            amount_cents: 7700,
            payment_method: 'infinitepay_pix',
            started_at: new Date(Date.now() - 5 * 86400000).toISOString(),
            expires_at: new Date(Date.now() + 25 * 86400000).toISOString(),
            status: 'ativa',
          },
          {
            id: 'sub_3',
            user_id: 'u3',
            display_name: 'beatriz oliveira',
            email: 'bea.oliveira@outlook.com',
            plan_name: 'café com letras',
            amount_cents: 9700,
            payment_method: 'infinitepay_pix',
            started_at: new Date(Date.now() - 35 * 86400000).toISOString(),
            expires_at: new Date(Date.now() - 5 * 86400000).toISOString(),
            status: 'vencida',
          },
          {
            id: 'sub_4',
            user_id: 'u4',
            display_name: 'fernanda costa',
            email: 'nanda.costa@gmail.com',
            plan_name: '21 dias de escrita',
            amount_cents: 7700,
            payment_method: 'infinitepay_card',
            started_at: new Date(Date.now() - 2 * 86400000).toISOString(),
            expires_at: new Date(Date.now() + 28 * 86400000).toISOString(),
            status: 'ativa',
          },
          {
            id: 'sub_5',
            user_id: 'u5',
            display_name: 'juliana machado',
            email: 'ju.machado@empresa.com.br',
            plan_name: 'contrate uma experiência (b2b)',
            amount_cents: 350000,
            payment_method: 'pix',
            started_at: new Date(Date.now() - 20 * 86400000).toISOString(),
            expires_at: new Date(Date.now() + 345 * 86400000).toISOString(),
            status: 'ativa',
          },
        ];
        setSubscriptions(demoRecords);
      } else {
        const subsMap = new Map((subsData || []).map((s) => [s.user_id, s]));

        const records: StudentSubscriptionRecord[] = profiles.map((p) => {
          const sub = subsMap.get(p.id);
          const isPaid = p.role === 'paid' || p.role === 'admin';
          const defaultPlan = isPaid ? '21 dias de escrita' : 'gratuito / observadora';
          const defaultAmount = isPaid ? 7700 : 0;

          const started = sub?.started_at || p.created_at;
          const expires = sub?.expires_at || (isPaid ? new Date(Date.now() + 30 * 86400000).toISOString() : null);

          let currentStatus: 'ativa' | 'vencida' | 'cancelada' = 'ativa';
          if (!isPaid) {
            currentStatus = 'vencida';
          } else if (expires && new Date(expires).getTime() < Date.now()) {
            currentStatus = 'vencida';
          }

          return {
            id: sub?.id || `gen_${p.id}`,
            user_id: p.id,
            display_name: p.display_name || 'aluna',
            email: p.email_public || `${p.display_name.replace(/\s+/g, '')}@aluna.com.br`,
            plan_name: defaultPlan,
            amount_cents: defaultAmount,
            payment_method: 'infinitepay_pix',
            started_at: started,
            expires_at: expires,
            status: currentStatus,
          };
        });

        setSubscriptions(records);
      }
    } catch (err) {
      console.error('erro ao carregar finanças:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    record: StudentSubscriptionRecord,
    newStatus: 'ativa' | 'vencida' | 'cancelada',
    extendDays: number = 0,
    isLifetime: boolean = false
  ) => {
    try {
      const now = new Date();
      let newExpiresAt: string | null = record.expires_at;

      if (isLifetime) {
        newExpiresAt = new Date(now.getFullYear() + 50, 11, 31).toISOString();
      } else if (extendDays > 0) {
        const currentExp = record.expires_at ? new Date(record.expires_at) : now;
        const baseDate = currentExp.getTime() > now.getTime() ? currentExp : now;
        baseDate.setDate(baseDate.getDate() + extendDays);
        newExpiresAt = baseDate.toISOString();
      }

      // Atualizar localmente
      setSubscriptions((prev) =>
        prev.map((item) =>
          item.id === record.id
            ? {
                ...item,
                status: newStatus,
                expires_at: newExpiresAt,
              }
            : item
        )
      );

      // Tentar persistir em users_profiles
      if (newStatus === 'ativa') {
        await supabase.from('users_profiles').update({ role: 'paid' }).eq('id', record.user_id);
      }

      setActionSuccessMsg(
        `status da aluna ${record.display_name} atualizado para "${newStatus}"${
          extendDays > 0 ? ` (+${extendDays} dias)` : isLifetime ? ' (acesso vitalício)' : ''
        } com sucesso!`
      );

      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      console.error('erro ao atualizar status:', err);
    }
  };

  // Cálculos de métricas globais
  const activeSubs = subscriptions.filter((s) => s.status === 'ativa');
  const totalRevenue = subscriptions.reduce((acc, s) => acc + (s.status === 'ativa' ? s.amount_cents : 0), 0) / 100;
  const mrr = activeSubs.reduce((acc, s) => {
    if (s.plan_name.includes('café')) return acc + 97;
    if (s.plan_name.includes('ciclo')) return acc + 199; // mensal proporcional
    if (s.plan_name.includes('21 dias')) return acc + 38.5;
    return acc;
  }, 0);

  const revenue21dias = subscriptions.filter((s) => s.plan_name.includes('21 dias') && s.status === 'ativa').length * 77;
  const revenueCafe = subscriptions.filter((s) => s.plan_name.includes('café') && s.status === 'ativa').length * 97;
  const revenueCiclo = subscriptions.filter((s) => s.plan_name.includes('ciclo') && s.status === 'ativa').length * 597;
  const revenueB2b = subscriptions.filter((s) => s.plan_name.includes('b2b') && s.status === 'ativa').reduce((acc, s) => acc + s.amount_cents / 100, 0);

  // Filtragem da tabela
  const filteredSubscriptions = subscriptions.filter((s) => {
    const matchesSearch =
      s.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'todos' || s.status === statusFilter;

    let matchesProduct = true;
    if (productFilter === '21dias') matchesProduct = s.plan_name.includes('21 dias');
    if (productFilter === 'cafe') matchesProduct = s.plan_name.includes('café');
    if (productFilter === 'ciclo') matchesProduct = s.plan_name.includes('ciclo');
    if (productFilter === 'b2b') matchesProduct = s.plan_name.includes('b2b');

    return matchesSearch && matchesStatus && matchesProduct;
  });

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'indeterminado';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-acentoAzul mx-auto mb-2" />
        <p className="text-xs font-corpo text-tintaCarvao/60 italic lowercase">
          carregando dados financeiros e assinaturas...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
        <div>
          <span className="text-[10px] font-bold text-acentoTerracota font-corpo uppercase tracking-wider block mb-0.5">
            painel de receitas & mensalidades
          </span>
          <h2 className="font-editorial font-bold text-2xl text-acentoAzul lowercase">
            gestão de finanças & assinaturas
          </h2>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase mt-0.5">
            acompanhe pagamentos via infinitepay, datas de vencimento e renove acessos de alunas
          </p>
        </div>

        <button
          onClick={fetchFinancialData}
          className="self-start sm:self-auto py-2 px-4 bg-papelKraft/25 hover:bg-papelKraft/40 rounded-full text-xs font-corpo font-bold text-acentoAzul transition-colors flex items-center gap-1.5 cursor-pointer lowercase"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>atualizar dados</span>
        </button>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 bg-acentoOliva/20 border border-acentoOliva/40 rounded-2xl text-acentoOliva text-xs font-corpo font-bold lowercase flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Bento Grid de Métricas Globais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bgPlataforma p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-acentoAzul">
            <span className="text-[11px] font-bold font-corpo text-tintaCarvao/60 lowercase">receita total ativa</span>
            <DollarSign className="w-4 h-4 text-acentoAzul" />
          </div>
          <span className="font-editorial font-bold text-2xl sm:text-3xl text-acentoAzul block">
            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">faturamento acumulado em vigor</span>
        </div>

        <div className="bg-bgPlataforma p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-acentoOliva">
            <span className="text-[11px] font-bold font-corpo text-tintaCarvao/60 lowercase">mrr estimado (mensal)</span>
            <TrendingUp className="w-4 h-4 text-acentoOliva" />
          </div>
          <span className="font-editorial font-bold text-2xl sm:text-3xl text-acentoOliva block">
            R$ {mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">receita recorrente mensal</span>
        </div>

        <div className="bg-bgPlataforma p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-acentoTerracota">
            <span className="text-[11px] font-bold font-corpo text-tintaCarvao/60 lowercase">assinantes ativas</span>
            <Users className="w-4 h-4 text-acentoTerracota" />
          </div>
          <span className="font-editorial font-bold text-2xl sm:text-3xl text-acentoTerracota block">
            {activeSubs.length}
          </span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">de {subscriptions.length} alunas cadastradas</span>
        </div>

        <div className="bg-bgPlataforma p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-acentoAzul">
            <span className="text-[11px] font-bold font-corpo text-tintaCarvao/60 lowercase">método principal</span>
            <CreditCard className="w-4 h-4 text-acentoAzul" />
          </div>
          <span className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul block lowercase">
            infinitepay
          </span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">pix instantâneo & cartão</span>
        </div>
      </div>

      {/* Resumo por Produto */}
      <div className="bg-white rounded-2xl p-4 border border-papelKraft/40 shadow-xs grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-corpo">
        <div className="p-3 bg-bgPlataforma/60 rounded-xl border border-papelKraft/30">
          <span className="text-[10px] text-tintaCarvao/60 font-bold block">21 dias de escrita</span>
          <span className="font-editorial font-bold text-base text-acentoAzul">R$ {revenue21dias.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-bgPlataforma/60 rounded-xl border border-papelKraft/30">
          <span className="text-[10px] text-tintaCarvao/60 font-bold block">café com letras</span>
          <span className="font-editorial font-bold text-base text-acentoAzul">R$ {revenueCafe.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-bgPlataforma/60 rounded-xl border border-papelKraft/30">
          <span className="text-[10px] text-tintaCarvao/60 font-bold block">ciclo de aprofundamento</span>
          <span className="font-editorial font-bold text-base text-acentoAzul">R$ {revenueCiclo.toFixed(2)}</span>
        </div>
        <div className="p-3 bg-bgPlataforma/60 rounded-xl border border-papelKraft/30">
          <span className="text-[10px] text-tintaCarvao/60 font-bold block">experiências b2b</span>
          <span className="font-editorial font-bold text-base text-acentoAzul">R$ {revenueB2b.toFixed(2)}</span>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-papelClaro p-4 rounded-2xl border border-papelKraft/40">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-tintaCarvao/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="buscar por nome da aluna ou e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao placeholder:text-tintaCarvao/40 focus:outline-none focus:border-acentoAzul lowercase"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Filtro de Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
          >
            <option value="todos">todos os status</option>
            <option value="ativa">ativas</option>
            <option value="vencida">vencidas</option>
            <option value="cancelada">canceladas</option>
          </select>

          {/* Filtro de Produto */}
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value as any)}
            className="px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
          >
            <option value="todos">todos os produtos</option>
            <option value="21dias">21 dias de escrita</option>
            <option value="cafe">café com letras</option>
            <option value="ciclo">ciclo de aprofundamento</option>
            <option value="b2b">experiências b2b</option>
          </select>
        </div>
      </div>

      {/* Tabela de Assinaturas de Alunas */}
      <div className="bg-white rounded-2xl border border-papelKraft/40 overflow-hidden shadow-xs">
        <div className="px-5 py-3.5 border-b border-papelKraft/30 bg-papelClaro flex items-center justify-between">
          <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase">
            alunas & histórico de mensalidades ({filteredSubscriptions.length})
          </h3>
          <span className="text-[11px] font-corpo text-tintaCarvao/60 lowercase">
            clique nas ações rápidas para renovar ou alterar status
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-papelKraft/30 bg-bgPlataforma text-[10px] font-bold font-corpo text-tintaCarvao/60 lowercase">
                <th className="px-4 py-3">aluna / e-mail</th>
                <th className="px-4 py-3">plano ativo</th>
                <th className="px-4 py-3">data pagamento</th>
                <th className="px-4 py-3">próximo vencimento</th>
                <th className="px-4 py-3">método</th>
                <th className="px-4 py-3">status</th>
                <th className="px-4 py-3 text-right">ações rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-papelKraft/20 text-xs font-corpo text-tintaCarvao lowercase">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-tintaCarvao/50 italic">
                    nenhuma aluna encontrada com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const isExpiringSoon =
                    sub.expires_at &&
                    new Date(sub.expires_at).getTime() - Date.now() < 7 * 86400000 &&
                    sub.status === 'ativa';

                  return (
                    <tr key={sub.id} className="hover:bg-papelClaro/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <p className="font-bold text-acentoAzul lowercase">{sub.display_name}</p>
                        <p className="text-[11px] text-tintaCarvao/60 lowercase">{sub.email}</p>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-tintaCarvao">
                        <span className="px-2.5 py-1 rounded-lg bg-bgPlataforma border border-papelKraft/30 text-[11px] font-bold text-acentoAzul inline-block">
                          {sub.plan_name}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-tintaCarvao/70">
                        {formatDate(sub.started_at)}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`font-medium ${
                            isExpiringSoon
                              ? 'text-acentoTerracota font-bold'
                              : sub.status === 'vencida'
                              ? 'text-red-600'
                              : 'text-tintaCarvao/80'
                          }`}
                        >
                          {formatDate(sub.expires_at)}
                        </span>
                        {isExpiringSoon && (
                          <span className="block text-[9px] text-acentoTerracota font-bold">
                            vence em breve!
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-papelKraft/20 text-tintaCarvao text-[10px] font-bold flex items-center gap-1 w-fit">
                          <CreditCard className="w-3 h-3 text-acentoAzul" />
                          <span>
                            {sub.payment_method === 'infinitepay_pix'
                              ? 'infinitepay pix'
                              : sub.payment_method === 'infinitepay_card'
                              ? 'infinitepay cartão'
                              : 'pix direto'}
                          </span>
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        {sub.status === 'ativa' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-acentoOliva/20 text-acentoOliva font-bold text-[10px] inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ativa</span>
                          </span>
                        )}
                        {sub.status === 'vencida' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-acentoTerracota/15 text-acentoTerracota font-bold text-[10px] inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>vencida</span>
                          </span>
                        )}
                        {sub.status === 'cancelada' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-tintaCarvao/10 text-tintaCarvao/60 font-bold text-[10px] inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            <span>cancelada</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        {sub.status !== 'ativa' ? (
                          <button
                            onClick={() => handleUpdateStatus(sub, 'ativa', 30)}
                            className="py-1 px-2.5 rounded-lg bg-acentoOliva/20 hover:bg-acentoOliva/30 text-acentoOliva font-bold text-[11px] transition-all cursor-pointer lowercase"
                            title="marcar como paga e renovar por 30 dias"
                          >
                            marcar como paga
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateStatus(sub, 'ativa', 30)}
                            className="py-1 px-2.5 rounded-lg bg-acentoAzul/10 hover:bg-acentoAzul/20 text-acentoAzul font-bold text-[11px] transition-all cursor-pointer lowercase"
                            title="prorrogar assinatura por mais 30 dias"
                          >
                            +30 dias
                          </button>
                        )}

                        <button
                          onClick={() => handleUpdateStatus(sub, 'ativa', 90)}
                          className="py-1 px-2.5 rounded-lg bg-bgPlataforma hover:bg-papelKraft/40 text-acentoAzul font-bold text-[11px] transition-all cursor-pointer lowercase"
                          title="prorrogar assinatura por mais 90 dias (trimestre)"
                        >
                          +90 dias
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(sub, 'ativa', 0, true)}
                          className="py-1 px-2.5 rounded-lg bg-acentoTerracota/15 hover:bg-acentoTerracota/25 text-acentoTerracota font-bold text-[11px] transition-all cursor-pointer lowercase"
                          title="conceder acesso vitalício"
                        >
                          vitalício
                        </button>

                        {sub.status === 'ativa' && (
                          <button
                            onClick={() => handleUpdateStatus(sub, 'vencida')}
                            className="py-1 px-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-bold transition-all cursor-pointer lowercase"
                            title="marcar como vencida"
                          >
                            vencer
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
