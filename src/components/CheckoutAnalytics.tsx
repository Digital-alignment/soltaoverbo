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
      console.error('Error loading checkout data:', error);
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
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Análise de Checkout</h2>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
        >
          <option value="7days">Últimos 7 dias</option>
          <option value="30days">Últimos 30 dias</option>
          <option value="all">Todos os tempos</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total de Tentativas</h3>
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</p>
          <p className="text-xs text-gray-500 mt-1">Últimos 7 dias: {stats.last7Days}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Compras Concluídas</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.completedCheckouts}</p>
          <p className="text-xs text-gray-500 mt-1">Conversão realizada</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Checkouts Abandonados</h3>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-600">{stats.abandonedCheckouts}</p>
          <p className="text-xs text-gray-500 mt-1">Necessitam atenção</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Taxa de Conversão</h3>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-amber-600">{stats.conversionRate.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">Conversão do funil</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Tentativas Recentes</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 lowercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 lowercase tracking-wider">
                  Data da Tentativa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 lowercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 lowercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 lowercase tracking-wider">
                  Data de Conclusão
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhuma tentativa de checkout encontrada
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{attempt.email || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600">{formatDate(attempt.attempted_at)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{attempt.plan_type || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.completed ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Concluído
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Abandonado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
