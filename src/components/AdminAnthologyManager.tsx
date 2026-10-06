import { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Sparkles,
  Plus,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Flame,
  User,
  Heart,
  MessageSquare,
  Search,
  Filter,
  X,
  Send,
  BookMarked,
  Layers,
  ArrowRight,
  Check,
} from 'lucide-react';
import {
  Anthology,
  AnthologyPost,
  fetchAnthologies,
  fetchMonthPostCandidates,
  saveAnthology,
  togglePublishAnthology,
  deleteAnthology,
  getMonthName,
} from '../lib/anthology';

export default function AdminAnthologyManager() {
  const [anthologies, setAnthologies] = useState<Anthology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filtros da lista
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal de Criação / Edição
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingAnthologyId, setEditingAnthologyId] = useState<string | null>(null);

  // Form State
  const now = new Date();
  const [formMonth, setFormMonth] = useState<number>(now.getMonth() + 1);
  const [formYear, setFormYear] = useState<number>(now.getFullYear());
  const [formTitle, setFormTitle] = useState<string>('');
  const [formCuratorNote, setFormCuratorNote] = useState<string>('');
  const [formCoverUrl, setFormCoverUrl] = useState<string>('');
  const [formPublishImmediate, setFormPublishImmediate] = useState<boolean>(false);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  // Candidatos do mês no modal
  const [candidates, setCandidates] = useState<AnthologyPost[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal de Prévia Editorial
  const [previewAnthology, setPreviewAnthology] = useState<Anthology | null>(null);

  useEffect(() => {
    loadAnthologiesList();
  }, []);

  const loadAnthologiesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAnthologies({ includeDrafts: true });
      setAnthologies(data);
    } catch (err: any) {
      console.warn('[AdminAnthology] Erro ao carregar:', err.message);
      setError('ainda não foi possível carregar as antologias ou a tabela precisa ser criada no banco.');
    } finally {
      setLoading(false);
    }
  };

  // Carregar candidatos quando mês/ano mudam no formulário
  useEffect(() => {
    if (isEditorOpen) {
      loadCandidates(formMonth, formYear);
    }
  }, [formMonth, formYear, isEditorOpen]);

  const loadCandidates = async (month: number, year: number) => {
    setLoadingCandidates(true);
    try {
      const data = await fetchMonthPostCandidates(month, year);
      setCandidates(data);
    } catch (err) {
      console.warn('[AdminAnthology] Erro ao carregar candidatos:', err);
      setCandidates([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleOpenCreateModal = () => {
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    setEditingAnthologyId(null);
    setFormMonth(currentMonth);
    setFormYear(currentYear);
    setFormTitle(`antologia de ${getMonthName(currentMonth)} · as palavras que dançam`);
    setFormCuratorNote(
      'uma seleção de textos colhidos do fogo e da escuta mútua deste mês. que cada linha continue acesa no peito de quem lê.'
    );
    setFormCoverUrl('');
    setFormPublishImmediate(false);
    setSelectedPostIds([]);
    setIsEditorOpen(true);
  };

  const handleOpenEditModal = (ant: Anthology) => {
    setEditingAnthologyId(ant.id);
    setFormMonth(ant.month);
    setFormYear(ant.year);
    setFormTitle(ant.title);
    setFormCuratorNote(ant.curator_note || '');
    setFormCoverUrl(ant.cover_image_url || '');
    setFormPublishImmediate(ant.published);
    setSelectedPostIds(ant.featured_post_ids || []);
    setIsEditorOpen(true);
  };

  const handleSelectTop = (count: number) => {
    const topIds = candidates.slice(0, count).map((p) => p.id);
    setSelectedPostIds(topIds);
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const handleSave = async () => {
    if (!formTitle.trim()) {
      alert('por favor, dê um título poético para a edição.');
      return;
    }
    if (selectedPostIds.length === 0) {
      if (!confirm('você não selecionou nenhum texto da fogueira ainda. deseja salvar assim mesmo?')) {
        return;
      }
    }

    setSaving(true);
    try {
      const res = await saveAnthology({
        id: editingAnthologyId || undefined,
        title: formTitle,
        month: formMonth,
        year: formYear,
        curator_note: formCuratorNote,
        cover_image_url: formCoverUrl,
        featured_post_ids: selectedPostIds,
        published: formPublishImmediate,
      });

      if (!res.success) {
        alert('erro ao salvar: ' + (res.error || 'tente novamente'));
        return;
      }

      setSuccessMessage(
        editingAnthologyId
          ? 'antologia atualizada com afeto ✓'
          : 'nova edição de antologia criada com sucesso ✓'
      );
      setTimeout(() => setSuccessMessage(null), 4000);
      setIsEditorOpen(false);
      await loadAnthologiesList();
    } catch (err: any) {
      alert('erro ao salvar: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (ant: Anthology) => {
    const nextState = !ant.published;
    const confirmText = nextState
      ? `deseja publicar a "${ant.title}"? ela ficará visível para todo o coletivo na fogueira.`
      : `deseja despublicar a "${ant.title}" e transformá-la em rascunho?`;

    if (!confirm(confirmText)) return;

    const res = await togglePublishAnthology(ant.id, nextState);
    if (!res.success) {
      alert('erro ao alterar status: ' + (res.error || 'tente novamente'));
      return;
    }

    setSuccessMessage(nextState ? 'edição publicada com sucesso ✨' : 'edição convertida em rascunho ✓');
    setTimeout(() => setSuccessMessage(null), 3000);
    await loadAnthologiesList();
  };

  const handleDelete = async (ant: Anthology) => {
    if (!confirm(`tem certeza que deseja excluir permanentemente a "${ant.title}"?`)) return;

    const res = await deleteAnthology(ant.id);
    if (!res.success) {
      alert('erro ao excluir: ' + (res.error || 'tente novamente'));
      return;
    }

    setSuccessMessage('antologia removida com sucesso');
    setTimeout(() => setSuccessMessage(null), 3000);
    await loadAnthologiesList();
  };

  // Estatísticas Bento
  const stats = useMemo(() => {
    const totalEditions = anthologies.length;
    const publishedEditions = anthologies.filter((a) => a.published).length;
    const totalPoems = anthologies.reduce((sum, a) => sum + (a.featured_post_ids?.length || 0), 0);
    return { totalEditions, publishedEditions, totalPoems };
  }, [anthologies]);

  // Lista Filtrada
  const filteredAnthologies = useMemo(() => {
    return anthologies.filter((ant) => {
      const matchesSearch =
        ant.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getMonthName(ant.month).includes(searchQuery.toLowerCase()) ||
        ant.year.toString().includes(searchQuery);

      if (!matchesSearch) return false;

      if (filterStatus === 'published') return ant.published;
      if (filterStatus === 'draft') return !ant.published;
      return true;
    });
  }, [anthologies, searchQuery, filterStatus]);

  return (
    <div className="space-y-6">
      {/* CABEÇALHO & NOTIFICAÇÕES */}
      <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-8 shadow-kraft space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-acentoTerracota/10 border border-acentoTerracota/20 text-acentoTerracota text-xs font-bold font-corpo lowercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>fase 4 • antologia mensal da fogueira</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-acentoAzul lowercase">
              curadoria & antologia da fogueira
            </h2>
            <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase max-w-2xl">
              seleção mensal dos textos mais acolhidos, aplaudidos e marcantes da comunidade. as edições publicadas
              são apresentadas em formato de livro digital aberto para todas as alunas.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] lowercase shadow-xs hover:bg-acentoTerracota/90 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>nova antologia</span>
          </button>
        </div>

        {/* FEEDBACKS VISUAIS */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-corpo lowercase flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-corpo lowercase flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* BENTO CARDS DE MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-papelKraft/40 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-corpo text-tintaCarvao/60 uppercase tracking-wider font-semibold">
                edições publicadas
              </p>
              <p className="font-editorial text-2xl font-bold text-acentoAzul mt-0.5">
                {stats.publishedEditions} <span className="text-xs font-corpo font-normal text-tintaCarvao/50">/ {stats.totalEditions} criadas</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-acentoAzul/10 text-acentoAzul flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-papelKraft/40 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-corpo text-tintaCarvao/60 uppercase tracking-wider font-semibold">
                poemas imortalizados
              </p>
              <p className="font-editorial text-2xl font-bold text-acentoTerracota mt-0.5">
                {stats.totalPoems}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center">
              <Flame className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-papelKraft/40 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-corpo text-tintaCarvao/60 uppercase tracking-wider font-semibold">
                formato editorial
              </p>
              <p className="font-corpo text-xs text-tintaCarvao/80 mt-1 font-medium">
                livreto digital na fogueira
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-acentoOliva/10 text-acentoOliva flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* FILTROS & BUSCADOR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-corpo lowercase transition-all cursor-pointer ${
                filterStatus === 'all'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white text-tintaCarvao/70 hover:bg-papelClaro border border-papelKraft/40'
              }`}
            >
              todas ({anthologies.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('published')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-corpo lowercase transition-all cursor-pointer ${
                filterStatus === 'published'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white text-tintaCarvao/70 hover:bg-papelClaro border border-papelKraft/40'
              }`}
            >
              publicadas ({stats.publishedEditions})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('draft')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold font-corpo lowercase transition-all cursor-pointer ${
                filterStatus === 'draft'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white text-tintaCarvao/70 hover:bg-papelClaro border border-papelKraft/40'
              }`}
            >
              rascunhos ({anthologies.length - stats.publishedEditions})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-tintaCarvao/40 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="buscar por mês, ano ou título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs font-corpo bg-white rounded-xl border border-papelKraft/40 focus:outline-hidden focus:border-acentoAzul text-tintaCarvao placeholder:text-tintaCarvao/40 lowercase"
            />
          </div>
        </div>

        {/* LISTA DE EDIÇÕES */}
        {loading ? (
          <div className="py-12 text-center text-xs font-corpo text-tintaCarvao/50 lowercase">
            carregando edições da antologia...
          </div>
        ) : filteredAnthologies.length === 0 ? (
          <div className="py-12 text-center space-y-2 border border-dashed border-papelKraft/60 rounded-2xl bg-white/50">
            <BookMarked className="w-8 h-8 text-tintaCarvao/30 mx-auto" />
            <p className="text-sm font-editorial font-bold text-tintaCarvao/70 lowercase">
              nenhuma edição encontrada
            </p>
            <p className="text-xs font-corpo text-tintaCarvao/50 lowercase">
              clique em "+ nova antologia" para iniciar a curadoria dos textos mais curtidos deste mês.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAnthologies.map((ant) => (
              <div
                key={ant.id}
                className="p-4 sm:p-5 rounded-2xl bg-white border border-papelKraft/40 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-papelKraft transition-all"
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-editorial text-lg sm:text-xl font-bold text-acentoAzul lowercase">
                      {ant.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-corpo lowercase ${
                        ant.published
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {ant.published ? 'publicada ✓' : 'rascunho'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-papelKraft/40 text-tintaCarvao/70 text-[10px] font-mono lowercase">
                      {getMonthName(ant.month)} / {ant.year}
                    </span>
                  </div>

                  <p className="text-xs font-corpo text-tintaCarvao/70 line-clamp-1 italic">
                    "{ant.curator_note || 'sem nota de curadoria'}"
                  </p>

                  <div className="flex items-center gap-4 text-[11px] font-corpo text-tintaCarvao/60 pt-0.5">
                    <span className="flex items-center gap-1 font-medium">
                      <Flame className="w-3.5 h-3.5 text-acentoTerracota" />
                      {ant.featured_post_ids?.length || 0} textos selecionados
                    </span>
                    {ant.published_at && (
                      <span className="hidden sm:inline">
                        publicada em {new Date(ant.published_at).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>

                {/* BOTÕES DE AÇÃO */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => setPreviewAnthology(ant)}
                    className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/30 text-tintaCarvao/80 border border-papelKraft/40 text-xs font-corpo flex items-center gap-1.5 transition-all cursor-pointer"
                    title="ver prévia da edição"
                  >
                    <Eye className="w-4 h-4 text-acentoAzul" />
                    <span className="hidden sm:inline">prévia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePublish(ant)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-corpo lowercase transition-all cursor-pointer ${
                      ant.published
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {ant.published ? 'despublicar' : 'publicar agora'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(ant)}
                    className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/30 text-tintaCarvao/80 border border-papelKraft/40 transition-all cursor-pointer"
                    title="editar curadoria"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(ant)}
                    className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all cursor-pointer"
                    title="excluir edição"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE CRIAÇÃO / EDIÇÃO */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-tintaCarvao/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-papelClaro rounded-3xl border border-papelKraft/50 max-w-3xl w-full p-5 sm:p-7 shadow-2xl space-y-6 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-4">
              <div>
                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-acentoAzul lowercase">
                  {editingAnthologyId ? 'editar antologia mensal' : 'nova edição de antologia'}
                </h3>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  defina a data, a nota de abertura e selecione os textos mais aplaudidos da fogueira
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 rounded-full hover:bg-papelKraft/30 text-tintaCarvao/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SEÇÃO 1: METADADOS BÁSICOS */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold font-corpo text-tintaCarvao/80 lowercase mb-1">
                    mês de referência
                  </label>
                  <select
                    value={formMonth}
                    onChange={(e) => setFormMonth(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-corpo bg-white rounded-xl border border-papelKraft/40 focus:outline-hidden focus:border-acentoAzul lowercase"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                      <option key={m} value={m}>
                        {m.toString().padStart(2, '0')} · {getMonthName(m)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold font-corpo text-tintaCarvao/80 lowercase mb-1">
                    ano
                  </label>
                  <input
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 text-xs font-corpo bg-white rounded-xl border border-papelKraft/40 focus:outline-hidden focus:border-acentoAzul"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-corpo text-tintaCarvao/80 lowercase mb-1">
                  título poético da edição
                </label>
                <input
                  type="text"
                  placeholder="ex: antologia de outubro · as palavras que dançam"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-corpo bg-white rounded-xl border border-papelKraft/40 focus:outline-hidden focus:border-acentoAzul text-tintaCarvao lowercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-corpo text-tintaCarvao/80 lowercase mb-1">
                  prefácio / nota da facilitadora (abertura do livro)
                </label>
                <textarea
                  rows={3}
                  placeholder="escreva as palavras de abertura para esta edição especial..."
                  value={formCuratorNote}
                  onChange={(e) => setFormCuratorNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-corpo bg-white rounded-xl border border-papelKraft/40 focus:outline-hidden focus:border-acentoAzul text-tintaCarvao lowercase"
                />
              </div>
            </div>

            {/* SEÇÃO 2: CURADORIA DE TEXTOS DA FOGUEIRA */}
            <div className="space-y-3 pt-2 border-t border-papelKraft/30">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-editorial text-base font-bold text-acentoAzul lowercase flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-acentoTerracota" />
                    <span>textos candidatos de {getMonthName(formMonth)} / {formYear}</span>
                  </h4>
                  <p className="text-[11px] font-corpo text-tintaCarvao/60 lowercase">
                    {selectedPostIds.length} selecionados para a edição
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-corpo text-tintaCarvao/60 lowercase mr-1">atalho:</span>
                  <button
                    type="button"
                    onClick={() => handleSelectTop(5)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-papelKraft/30 border border-papelKraft/40 text-[11px] font-corpo text-acentoAzul font-bold lowercase transition-all cursor-pointer"
                  >
                    top 5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectTop(10)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-papelKraft/30 border border-papelKraft/40 text-[11px] font-corpo text-acentoAzul font-bold lowercase transition-all cursor-pointer"
                  >
                    top 10
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPostIds([])}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-papelKraft/30 border border-papelKraft/40 text-[11px] font-corpo text-rose-700 font-bold lowercase transition-all cursor-pointer"
                  >
                    limpar
                  </button>
                </div>
              </div>

              {loadingCandidates ? (
                <div className="py-8 text-center text-xs font-corpo text-tintaCarvao/50 lowercase">
                  buscando textos do mês...
                </div>
              ) : candidates.length === 0 ? (
                <div className="p-4 rounded-xl bg-white border border-dashed border-papelKraft/60 text-center space-y-1">
                  <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
                    nenhum texto publicado na fogueira neste mês de referência.
                  </p>
                  <p className="text-[11px] font-corpo text-tintaCarvao/50 lowercase">
                    você pode selecionar outro mês acima ou esperar novas publicações das alunas.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {candidates.map((post) => {
                    const isSelected = selectedPostIds.includes(post.id);
                    return (
                      <div
                        key={post.id}
                        onClick={() => togglePostSelection(post.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-acentoTerracota/10 border-acentoTerracota/50'
                            : 'bg-white border-papelKraft/40 hover:border-papelKraft'
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-editorial text-sm font-bold text-acentoAzul lowercase truncate">
                              {post.writing_exercise?.title || 'sem título'}
                            </span>
                            <span className="text-[11px] font-corpo text-tintaCarvao/60 lowercase">
                              por {post.user_profile?.display_name || 'anônima'}
                            </span>
                          </div>
                          <p className="text-[11px] font-corpo text-tintaCarvao/60 line-clamp-1 italic">
                            "{post.writing_exercise?.content?.slice(0, 90) || ''}..."
                          </p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-corpo font-bold text-acentoTerracota flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5 fill-acentoTerracota" />
                            {post.likes_count || 0}
                          </span>

                          <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-acentoTerracota border-acentoTerracota text-white'
                                : 'border-papelKraft/60 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SEÇÃO 3: OPÇÃO DE PUBLICAR IMEDIATAMENTE & AÇÕES */}
            <div className="pt-2 border-t border-papelKraft/30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-corpo text-tintaCarvao/80 lowercase">
                <input
                  type="checkbox"
                  checked={formPublishImmediate}
                  onChange={(e) => setFormPublishImmediate(e.target.checked)}
                  className="rounded-sm border-papelKraft text-acentoTerracota focus:ring-acentoTerracota cursor-pointer"
                />
                <span>publicar imediatamente na fogueira ao salvar</span>
              </label>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-papelKraft/30 border border-papelKraft/40 text-xs font-corpo text-tintaCarvao/80 lowercase transition-all cursor-pointer"
                >
                  cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white text-xs font-gesto text-[18px] lowercase shadow-xs transition-all cursor-pointer"
                >
                  {saving ? 'salvando...' : editingAnthologyId ? 'salvar alterações' : 'criar antologia'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE PRÉVIA EDITORIAL (LIVRETO DIGITAL) */}
      {previewAnthology && (
        <div className="fixed inset-0 z-50 bg-tintaCarvao/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-bgPlataforma rounded-3xl border border-papelKraft/60 max-w-2xl w-full p-6 sm:p-10 shadow-2xl space-y-8 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-papelKraft/40 pb-4">
              <span className="text-[11px] font-corpo font-bold text-acentoTerracota uppercase tracking-widest">
                prévia editorial • solta o verbo
              </span>
              <button
                type="button"
                onClick={() => setPreviewAnthology(null)}
                className="p-1.5 rounded-full hover:bg-papelKraft/30 text-tintaCarvao/60 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CABEÇALHO DO LIVRETO */}
            <div className="text-center space-y-3 pt-2">
              <span className="px-3 py-1 rounded-full bg-acentoTerracota/10 border border-acentoTerracota/20 text-acentoTerracota text-xs font-bold font-corpo lowercase">
                edição curada • {getMonthName(previewAnthology.month)} de {previewAnthology.year}
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-acentoAzul lowercase leading-tight">
                {previewAnthology.title}
              </h2>
            </div>

            {/* PREFÁCIO DA CURADORA */}
            {previewAnthology.curator_note && (
              <div className="p-5 sm:p-6 rounded-2xl bg-papelClaro border border-papelKraft/40 space-y-3">
                <p className="text-[11px] font-corpo text-tintaCarvao/60 uppercase tracking-wider font-semibold">
                  nota de abertura da curadoria
                </p>
                <p className="font-editorial text-base sm:text-lg text-tintaCarvao/90 italic leading-relaxed whitespace-pre-wrap">
                  "{previewAnthology.curator_note}"
                </p>
                <p className="text-right text-xs font-corpo text-acentoTerracota font-bold lowercase">
                  — com afeto, curadoria solta o verbo
                </p>
              </div>
            )}

            {/* TEXTOS SELECIONADOS */}
            <div className="space-y-6 pt-2">
              <h3 className="font-editorial text-xl font-bold text-acentoAzul text-center lowercase">
                palavras colhidas da fogueira
              </h3>

              {(!previewAnthology.featured_posts || previewAnthology.featured_posts.length === 0) ? (
                <p className="text-center text-xs font-corpo text-tintaCarvao/60 lowercase italic">
                  nenhum texto carregado nesta edição.
                </p>
              ) : (
                <div className="space-y-6">
                  {previewAnthology.featured_posts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="p-6 rounded-2xl bg-white border border-papelKraft/40 space-y-4 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2 border-b border-papelKraft/20 pb-3">
                        <span className="text-xs font-mono font-bold text-acentoTerracota lowercase">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-corpo font-bold text-acentoAzul lowercase">
                            {post.user_profile?.display_name || 'autora'}
                          </span>
                          <span className="text-[11px] font-corpo text-tintaCarvao/50 lowercase">
                            • {post.likes_count || 0} aplausos
                          </span>
                        </div>
                      </div>

                      <h4 className="font-editorial text-xl font-bold text-tintaCarvao lowercase">
                        {post.writing_exercise?.title || 'sem título'}
                      </h4>

                      <div className="font-editorial text-sm sm:text-base text-tintaCarvao/85 leading-relaxed whitespace-pre-wrap pl-3 border-l-2 border-acentoTerracota/30 italic">
                        {post.writing_exercise?.content || 'sem conteúdo'}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-center pt-4 border-t border-papelKraft/30">
              <button
                type="button"
                onClick={() => setPreviewAnthology(null)}
                className="px-6 py-2.5 rounded-2xl bg-acentoAzul text-white text-xs font-corpo lowercase font-bold hover:bg-acentoAzul/90 transition-all cursor-pointer"
              >
                fechar prévia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
