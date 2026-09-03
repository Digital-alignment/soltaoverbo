import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Users, CheckCircle, XCircle, Calendar, Mail } from 'lucide-react';

interface CheckoutAttempt {
  id: string;
  user_id: string | null;
  email: string;
  attempted_at: string;
  completed_at: string | null;
  completed: boolean;
  source_page: string;
  plan_type: string | null;
  created_at: string;
}

interface CheckoutStats {
  totalAttempts: number;
  completedCheckouts: number;
  abandonedCheckouts: number;
  conversionRate: number;
  last7Days: number;
  last30Days: number;
}

export default function CheckoutAnalytics() {
  const [attempts, setAttempts] = useState<CheckoutAttempt[]>([]);
  const [stats, setStats] = useState<CheckoutStats>({
    totalAttempts: 0,
    completedCheckouts: 0,
    abandonedCheckouts: 0,
    conversionRate: 0,
    last7Days: 0,
    last30Days: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<'all' | '7days' | '30days'>('30days');

  useEffect(() => {
    loadCheckoutData();
  }, [dateFilter]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('checkout_attempts')
        .select('*')
        .order('attempted_at', { ascending: false });

      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query = query.gte('attempted_at', sevenDaysAgo.toISOString());
      } else if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        query = query.gte('attempted_at', thirtyDaysAgo.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      setAttempts(data || []);

      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const completed = (data || []).filter((a) => a.completed).length;
      const total = (data || []).length;
      const last7 = (data || []).filter((a) => new Date(a.attempted_at) >= sevenDaysAgo).length;
      const last30 = (data || []).filter((a) => new Date(a.attempted_at) >= thirtyDaysAgo).length;

      setStats({
        totalAttempts: total,
        completedCheckouts: completed,
        abandonedCheckouts: total - completed,
        conversionRate: total > 0 ? (completed / total) * 100 : 0,
        last7Days: last7,
        last30Days: last30,
      });
    } catch (error) {
      console.error('erro ao carregar dados de checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return <p className="text-xs font-corpo text-tintaCarvao/60 italic text-center py-6">carregando análise...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-papelKraft/30 pb-4">
        <div>
          <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            análise de checkout & conversão
          </h2>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            métricas de funil, compras concluídas e abandonos de checkout
          </p>
        </div>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
          className="px-3 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
        >
          <option value="7days">últimos 7 dias</option>
          <option value="30days">últimos 30 dias</option>
          <option value="all">todo o período</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bgPlataforma p-4 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">total de tentativas</span>
          <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoAzul block">{stats.totalAttempts}</span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">últimos 7 dias: {stats.last7Days}</span>
        </div>

        <div className="bg-bgPlataforma p-4 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">compras concluídas</span>
          <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoOliva block">{stats.completedCheckouts}</span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">conversão realizada</span>
        </div>

        <div className="bg-bgPlataforma p-4 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">abandonos</span>
          <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoTerracota block">{stats.abandonedCheckouts}</span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">necessitam atenção</span>
        </div>

        <div className="bg-bgPlataforma p-4 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">taxa de conversão</span>
          <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoAzul block">{stats.conversionRate.toFixed(1)}%</span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">conversão do funil</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-papelKraft/40 overflow-hidden shadow-xs">
        <div className="px-5 py-3 border-b border-papelKraft/30 bg-papelClaro">
          <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase">
            tentativas recentes de checkout
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-papelKraft/30 bg-bgPlataforma text-[10px] font-bold font-corpo text-tintaCarvao/60 lowercase">
                <th className="px-4 py-2.5">e-mail</th>
                <th className="px-4 py-2.5">data da tentativa</th>
                <th className="px-4 py-2.5">plano</th>
                <th className="px-4 py-2.5">status</th>
                <th className="px-4 py-2.5">conclusão</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-papelKraft/20 text-xs font-corpo text-tintaCarvao lowercase">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-tintaCarvao/50 italic">
                    nenhuma tentativa de checkout registrada no período.
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-papelClaro/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-acentoAzul">
                      {attempt.email || 'não informado'}
                    </td>
                    <td className="px-4 py-3 text-tintaCarvao/70">
                      {formatDate(attempt.attempted_at)}
                    </td>
                    <td className="px-4 py-3 font-bold text-acentoTerracota">
                      {attempt.plan_type || 'premium'}
                    </td>
                    <td className="px-4 py-3">
                      {attempt.completed ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-acentoOliva/20 text-acentoOliva font-bold text-[10px]">
                          ✓ concluído
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota font-bold text-[10px]">
                          abandonado
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-tintaCarvao/60">
                      {attempt.completed_at ? formatDate(attempt.completed_at) : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
