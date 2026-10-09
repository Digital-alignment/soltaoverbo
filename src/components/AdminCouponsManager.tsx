import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Copy,
  Trash2,
  ExternalLink,
  Gift,
  Ticket,
  Sparkles,
  Calendar,
  AlertCircle,
  RefreshCw,
  X,
  Check,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import {
  Coupon,
  CouponRedemption,
  normalizeCouponCode,
  fetchCoupons,
  saveCoupon,
  toggleCouponActive,
  deleteCoupon,
  fetchCouponRedemptions,
} from '../lib/coupons';

export default function AdminCouponsManager() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [redemptions, setRedemptions] = useState<CouponRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'discount_percent' | 'trial_extension' | 'free_access'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  // Modal de Criação de Cupom
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    type: 'discount_percent' as 'discount_percent' | 'trial_extension' | 'free_access',
    benefit_value: 20,
    product_target: 'all' as 'all' | '21_dias' | 'cafe_com_letras' | 'ciclo_aprofundamento',
    max_uses: '' as string,
    expires_at: '',
  });

  // Modal de Inspeção de Resgates
  const [inspectCoupon, setInspectCoupon] = useState<Coupon | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    loadCouponsData();
  }, []);

  const loadCouponsData = async () => {
    setLoading(true);
    try {
      // 1. Carregar cupons via serviço resiliente
      const couponsList = await fetchCoupons();
      setCoupons(couponsList);

      // 2. Carregar resgates
      const redemptionsList = await fetchCouponRedemptions();
      setRedemptions(redemptionsList);
    } catch (err) {
      console.error('erro ao carregar cupons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const newStatus = !coupon.active;
      const res = await toggleCouponActive(coupon.id, newStatus);
      if (!res.success) {
        alert(`erro ao atualizar cupom: ${res.error || 'falha'}`);
        return;
      }

      setCoupons((prev) =>
        prev.map((c) => (c.id === coupon.id ? { ...c, active: newStatus } : c))
      );
    } catch (err: any) {
      alert(`erro: ${err.message}`);
    }
  };

  const handleDeleteCoupon = async (coupon: Coupon) => {
    if (!window.confirm(`deseja realmente excluir o cupom ${coupon.code}? esta ação não poderá ser desfeita.`)) {
      return;
    }

    try {
      const res = await deleteCoupon(coupon.id);
      if (!res.success) {
        alert(`erro ao excluir cupom: ${res.error || 'falha'}`);
        return;
      }
      setCoupons((prev) => prev.filter((c) => c.id !== coupon.id));
    } catch (err: any) {
      alert(`erro: ${err.message}`);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    const cleanCode = normalizeCouponCode(formData.code);
    if (!cleanCode) {
      setCreateError('por favor, informe o código do cupom.');
      return;
    }

    if (formData.benefit_value <= 0) {
      setCreateError('o valor do benefício deve ser maior que zero.');
      return;
    }

    setCreating(true);

    try {
      const payload: any = {
        code: cleanCode,
        description: formData.description.trim() || null,
        type: formData.type,
        benefit_value: Number(formData.benefit_value),
        product_target: formData.product_target,
        max_uses: formData.max_uses ? parseInt(formData.max_uses, 10) : null,
        expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
        active: true,
      };

      const result = await saveCoupon(payload);

      if (!result.success || !result.coupon) {
        setCreateError(result.error || 'erro ao criar cupom.');
        setCreating(false);
        return;
      }

      setCoupons((prev) => [result.coupon!, ...prev.filter((c) => c.id !== result.coupon!.id)]);
      setShowCreateModal(false);
      setFormData({
        code: '',
        description: '',
        type: 'discount_percent',
        benefit_value: 20,
        product_target: 'all',
        max_uses: '',
        expires_at: '',
      });
    } catch (err: any) {
      setCreateError(err.message || 'erro inesperado ao criar cupom.');
    } finally {
      setCreating(false);
    }
  };

  // Filtragem
  const filteredCoupons = coupons.filter((c) => {
    // Busca
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const codeMatch = c.code.toLowerCase().includes(q);
      const descMatch = (c.description || '').toLowerCase().includes(q);
      if (!codeMatch && !descMatch) return false;
    }

    // Tipo
    if (typeFilter !== 'all' && c.type !== typeFilter) {
      return false;
    }

    // Status
    if (statusFilter === 'active') {
      if (!c.active) return false;
      if (c.expires_at && new Date(c.expires_at).getTime() < Date.now()) return false;
      if (c.max_uses !== null && c.used_count >= c.max_uses) return false;
    } else if (statusFilter === 'inactive') {
      if (c.active) return false;
    } else if (statusFilter === 'expired') {
      const isExpired = c.expires_at && new Date(c.expires_at).getTime() < Date.now();
      const isExhausted = c.max_uses !== null && c.used_count >= c.max_uses;
      if (!isExpired && !isExhausted) return false;
    }

    return true;
  });

  // Estatísticas
  const totalCouponsCount = coupons.length;
  const activeCouponsCount = coupons.filter(
    (c) =>
      c.active &&
      (!c.expires_at || new Date(c.expires_at).getTime() >= Date.now()) &&
      (c.max_uses === null || c.used_count < c.max_uses)
  ).length;
  const totalRedemptionsCount = redemptions.length;
  const freeGrantsCount = coupons.filter((c) => c.type === 'free_access').length;

  return (
    <div className="space-y-6">
      {/* CABEÇALHO DA SEÇÃO */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/40 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-acentoTerracota/10 text-acentoTerracota">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="font-editorial text-2xl font-bold text-acentoAzul lowercase">
              cupons & bolsas comunitárias
            </h2>
          </div>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase mt-1">
            gestão de códigos de desconto, períodos extras de degustação e bolsas de acesso integral
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>criar novo cupom</span>
        </button>
      </div>

      {/* CARDS DE MÉTRICAS / BENTO STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-tintaCarvao/60 uppercase tracking-wider block font-corpo">
            total de cupons
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul">
            {totalCouponsCount}
          </p>
          <span className="text-[11px] text-tintaCarvao/60 font-corpo lowercase block">
            códigos cadastrados
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-tintaCarvao/60 uppercase tracking-wider block font-corpo">
            cupons ativos
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-editorial text-emerald-600">
            {activeCouponsCount}
          </p>
          <span className="text-[11px] text-tintaCarvao/60 font-corpo lowercase block">
            disponíveis para alunas
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-tintaCarvao/60 uppercase tracking-wider block font-corpo">
            utilizações totais
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-editorial text-acentoTerracota">
            {totalRedemptionsCount}
          </p>
          <span className="text-[11px] text-tintaCarvao/60 font-corpo lowercase block">
            resgates concluídos
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-tintaCarvao/60 uppercase tracking-wider block font-corpo">
            bolsas comunitárias
          </span>
          <p className="text-2xl sm:text-3xl font-bold font-editorial text-acentoAzul">
            {freeGrantsCount}
          </p>
          <span className="text-[11px] text-tintaCarvao/60 font-corpo lowercase block">
            códigos de gratuidade 100%
          </span>
        </div>
      </div>

      {/* FILTROS E BUSCA */}
      <div className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Busca */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tintaCarvao/40" />
            <input
              type="text"
              placeholder="buscar por código ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul uppercase"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tintaCarvao/40 hover:text-tintaCarvao"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro por Tipo */}
          <div className="w-full sm:w-auto">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
            >
              <option value="all">todos os tipos de benefício</option>
              <option value="discount_percent">desconto percentual (%)</option>
              <option value="trial_extension">extensão de degustação (+dias)</option>
              <option value="free_access">bolsa integral (100% livre)</option>
            </select>
          </div>

          {/* Filtro por Status */}
          <div className="w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
            >
              <option value="all">todos os status</option>
              <option value="active">apenas ativos</option>
              <option value="inactive">desativados</option>
              <option value="expired">expirados ou esgotados</option>
            </select>
          </div>
        </div>
      </div>

      {/* LISTAGEM DE CUPONS */}
      {loading ? (
        <div className="p-12 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
          carregando cupons e bolsas...
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className="bg-white/80 p-10 rounded-3xl border border-papelKraft/40 text-center space-y-3">
          <Ticket className="w-10 h-10 text-papelKraft mx-auto" />
          <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
            nenhum cupom encontrado com os filtros aplicados.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
              setStatusFilter('all');
            }}
            className="text-xs font-bold font-corpo text-acentoAzul hover:underline lowercase cursor-pointer"
          >
            limpar filtros
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-papelKraft/40 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-corpo">
              <thead>
                <tr className="bg-papelClaro border-b border-papelKraft/40 text-tintaCarvao/70 lowercase text-[11px]">
                  <th className="p-4 font-bold">código</th>
                  <th className="p-4 font-bold">tipo de benefício</th>
                  <th className="p-4 font-bold">produto destino</th>
                  <th className="p-4 font-bold">utilizações</th>
                  <th className="p-4 font-bold">validade</th>
                  <th className="p-4 font-bold">status</th>
                  <th className="p-4 font-bold text-right">ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-papelKraft/20">
                {filteredCoupons.map((coupon) => {
                  const isExpired =
                    coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now();
                  const isExhausted =
                    coupon.max_uses !== null && coupon.used_count >= coupon.max_uses;
                  const isLive = coupon.active && !isExpired && !isExhausted;

                  return (
                    <tr key={coupon.id} className="hover:bg-papelClaro/40 transition-colors">
                      {/* Código & Descrição */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm tracking-wider font-corpo text-acentoAzul uppercase bg-acentoAzul/5 border border-acentoAzul/20 px-2 py-0.5 rounded-lg inline-flex items-center gap-1">
                              {coupon.code}
                            </span>
                            <button
                              onClick={() => handleCopyCode(coupon.code)}
                              className="text-tintaCarvao/40 hover:text-acentoAzul transition-colors cursor-pointer"
                              title="copiar código"
                            >
                              {copiedCode === coupon.code ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                          {coupon.description && (
                            <p className="text-[11px] text-tintaCarvao/60 lowercase italic max-w-xs truncate">
                              {coupon.description}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Tipo & Valor */}
                      <td className="p-4">
                        {coupon.type === 'discount_percent' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold lowercase">
                            <Tag className="w-3 h-3 text-amber-600" />
                            <span>{coupon.benefit_value}% de desconto</span>
                          </span>
                        )}
                        {coupon.type === 'trial_extension' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold lowercase">
                            <Clock className="w-3 h-3 text-blue-600" />
                            <span>+{coupon.benefit_value} dias de teste</span>
                          </span>
                        )}
                        {coupon.type === 'free_access' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold lowercase">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            <span>bolsa integral (100%)</span>
                          </span>
                        )}
                      </td>

                      {/* Destino */}
                      <td className="p-4 text-tintaCarvao/80 lowercase">
                        {coupon.product_target === 'all'
                          ? 'todos os produtos'
                          : coupon.product_target === '21_dias'
                          ? '21 dias de escrita'
                          : coupon.product_target === 'cafe_com_letras'
                          ? 'café com letras'
                          : 'ciclo de aprofundamento'}
                      </td>

                      {/* Usos */}
                      <td className="p-4">
                        <button
                          onClick={() => setInspectCoupon(coupon)}
                          className="hover:underline text-acentoAzul font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>{coupon.used_count}</span>
                          <span className="text-tintaCarvao/50">
                            / {coupon.max_uses !== null ? coupon.max_uses : '∞'}
                          </span>
                        </button>
                      </td>

                      {/* Validade */}
                      <td className="p-4 text-tintaCarvao/70">
                        {coupon.expires_at ? (
                          <span className={isExpired ? 'text-acentoTerracota font-bold' : ''}>
                            {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}
                          </span>
                        ) : (
                          <span className="text-tintaCarvao/40 italic">sem expiração</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isLive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>ativo</span>
                          </span>
                        ) : !coupon.active ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-tintaCarvao/50">
                            <XCircle className="w-3 h-3" />
                            <span>desativado</span>
                          </span>
                        ) : isExhausted ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600">
                            <AlertCircle className="w-3 h-3" />
                            <span>esgotado</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-acentoTerracota">
                            <Clock className="w-3 h-3" />
                            <span>expirado</span>
                          </span>
                        )}
                      </td>

                      {/* Ações */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold lowercase transition-all cursor-pointer ${
                              coupon.active
                                ? 'bg-papelKraft/30 text-tintaCarvao/70 hover:bg-papelKraft/50'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {coupon.active ? 'desativar' : 'ativar'}
                          </button>

                          <button
                            onClick={() => setInspectCoupon(coupon)}
                            className="p-1 text-tintaCarvao/50 hover:text-acentoAzul transition-colors cursor-pointer"
                            title="ver histórico de resgates"
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteCoupon(coupon)}
                            className="p-1 text-tintaCarvao/40 hover:text-acentoTerracota transition-colors cursor-pointer"
                            title="excluir cupom"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL DE CRIAÇÃO DE CUPOM */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-xs flex items-center justify-center z-[99999] p-4">
          <div className="bg-papelClaro rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-kraft-lg border border-papelKraft/60 max-h-[90vh] overflow-y-auto custom-scrollbar space-y-5 animate-fade-in">
            <div className="flex items-start justify-between border-b border-papelKraft/40 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-acentoTerracota font-corpo block">
                  gestão de acessos
                </span>
                <h3 className="font-editorial text-2xl font-bold text-acentoAzul lowercase">
                  criar novo cupom poético
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-papelKraft/40 rounded-full transition-colors text-tintaCarvao/70 hover:text-tintaCarvao cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-acentoTerracota/10 border border-acentoTerracota/30 rounded-xl text-acentoTerracota text-xs font-corpo lowercase">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-corpo">
              {/* Código */}
              <div>
                <label className="block text-[11px] font-bold text-tintaCarvao/80 lowercase mb-1">
                  código do cupom (sempre maiúsculas) *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="ex: LIRICA2026, COLETIVOAFETO"
                  className="w-full px-3.5 py-2.5 bg-white border border-papelKraft/50 rounded-xl text-sm font-corpo uppercase tracking-wider text-tintaCarvao focus:outline-none focus:border-acentoAzul"
                  required
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[11px] font-bold text-tintaCarvao/80 lowercase mb-1">
                  finalidade / descrição interna
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="ex: bolsa comunitária para o ciclo de outono"
                  className="w-full px-3.5 py-2.5 bg-white border border-papelKraft/50 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                />
              </div>

              {/* Tipo de Benefício */}
              <div>
                <label className="block text-[11px] font-bold text-tintaCarvao/80 lowercase mb-1">
                  tipo de benefício *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'discount_percent', benefit_value: 20 })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.type === 'discount_percent'
                        ? 'bg-acentoAzul text-white border-acentoAzul shadow-xs'
                        : 'bg-white text-tintaCarvao/80 border-papelKraft/50 hover:bg-papelClaro'
                    }`}
                  >
                    <span className="font-bold block text-xs">desconto %</span>
                    <span className="text-[10px] opacity-80 block mt-0.5">percentual off</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'trial_extension', benefit_value: 30 })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.type === 'trial_extension'
                        ? 'bg-acentoAzul text-white border-acentoAzul shadow-xs'
                        : 'bg-white text-tintaCarvao/80 border-papelKraft/50 hover:bg-papelClaro'
                    }`}
                  >
                    <span className="font-bold block text-xs">+ dias teste</span>
                    <span className="text-[10px] opacity-80 block mt-0.5">degustação</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'free_access', benefit_value: 100 })}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.type === 'free_access'
                        ? 'bg-acentoAzul text-white border-acentoAzul shadow-xs'
                        : 'bg-white text-tintaCarvao/80 border-papelKraft/50 hover:bg-papelClaro'
                    }`}
                  >
                    <span className="font-bold block text-xs">bolsa 100%</span>
                    <span className="text-[10px] opacity-80 block mt-0.5">acesso livre</span>
                  </button>
                </div>
              </div>

              {/* Valor do Benefício (Se não for bolsa 100%) */}
              {formData.type !== 'free_access' && (
                <div>
                  <label className="block text-[11px] font-bold text-tintaCarvao/80 lowercase mb-1">
                    {formData.type === 'discount_percent'
                      ? 'porcentagem de desconto (%)'
                      : 'dias extras de degustação (+dias)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.type === 'discount_percent' ? '99' : '365'}
                    value={formData.benefit_value}
                    onChange={(e) => setFormData({ ...formData, benefit_value: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-white border border-papelKraft/50 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul"
                    required
                  />
                </div>
              )}

              {/* Produto de Destino */}
              <div>
                <label className="block text-[11px] font-bold text-tintaCarvao/80 lowercase mb-1">
                  produto aplicável
                </label>
                <select
                  value={formData.product_target}
                  onChange={(e) => setFormData({ ...formData, product_target: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-white border border-papelKraft/50 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
                >
                  <option value="all">todos os produtos e jornadas</option>
                  <option value="21_dias">oficina 21 dias de escrita</option>
                  <option value="cafe_com_letras">café com letras</option>
                  <option value="ciclo_aprofundamento">ciclo de aprofundamento</option>
                </select>
              </div>

              {/* Limite de Usos e Expiração */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-tintaCarvao/80 lowercase mb-1">
                    limite máximo de usos (vazio = ilimitado)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="ex: 10"
                    className="w-full px-3.5 py-2.5 bg-white border border-papelKraft/50 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-tintaCarvao/80 lowercase mb-1">
                    data de expiração (opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-papelKraft/50 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-papelKraft/30 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-papelKraft/50 text-tintaCarvao/70 hover:text-tintaCarvao font-corpo text-xs font-bold lowercase transition-all cursor-pointer"
                >
                  cancelar
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-corpo text-xs font-bold lowercase transition-all shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                >
                  {creating ? 'criando...' : 'salvar cupom'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE HISTÓRICO DE RESGATES DO CUPOM */}
      {inspectCoupon && (
        <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-xs flex items-center justify-center z-[99999] p-4">
          <div className="bg-papelClaro rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-kraft-lg border border-papelKraft/60 max-h-[85vh] overflow-y-auto custom-scrollbar space-y-4 animate-fade-in">
            <div className="flex items-start justify-between border-b border-papelKraft/40 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-acentoTerracota font-corpo block">
                  histórico de resgates
                </span>
                <h3 className="font-editorial text-xl font-bold text-acentoAzul lowercase">
                  cupom: <span className="uppercase">{inspectCoupon.code}</span>
                </h3>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  {inspectCoupon.used_count} de {inspectCoupon.max_uses || 'ilimitadas'} utilizações realizadas
                </p>
              </div>
              <button
                onClick={() => setInspectCoupon(null)}
                className="p-2 hover:bg-papelKraft/40 rounded-full transition-colors text-tintaCarvao/70 hover:text-tintaCarvao cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(() => {
              const couponRedemptions = redemptions.filter(
                (r) => r.coupon_id === inspectCoupon.id || r.coupon_code === inspectCoupon.code
              );

              if (couponRedemptions.length === 0) {
                return (
                  <div className="p-8 text-center bg-white rounded-2xl border border-papelKraft/30 text-xs font-corpo text-tintaCarvao/60 lowercase">
                    nenhuma aluna resgatou este cupom até o momento.
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {couponRedemptions.map((red) => (
                    <div
                      key={red.id}
                      className="bg-white p-3.5 rounded-xl border border-papelKraft/30 flex items-center justify-between text-xs font-corpo"
                    >
                      <div>
                        <p className="font-bold text-tintaCarvao lowercase">
                          {red.user_email || 'aluna autenticada'}
                        </p>
                        <p className="text-[11px] text-tintaCarvao/50 lowercase mt-0.5">
                          produto: {red.product_slug || 'plano geral'} • {new Date(red.redeemed_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full lowercase">
                        resgatado
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
