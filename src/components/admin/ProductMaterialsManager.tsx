import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { ProductSlug, ProductMaterial, MaterialCategory } from '../../types/productHubs';
import {
  FileText,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  Search,
  X,
  BookOpen,
  Headphones,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

interface ProductMaterialsManagerProps {
  productSlug: ProductSlug;
  productName: string;
}

export default function ProductMaterialsManager({
  productSlug,
  productName,
}: ProductMaterialsManagerProps) {
  const [materials, setMaterials] = useState<ProductMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<ProductMaterial | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MaterialCategory>('pdf_guia');
  const [fileUrl, setFileUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, [productSlug]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_materials')
        .select('*')
        .eq('product_slug', productSlug)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('product_materials table fallback:', error.message);
        const stored = localStorage.getItem(`materials_${productSlug}`);
        if (stored) {
          setMaterials(JSON.parse(stored));
        } else {
          // Default initial demo materials according to product
          const demoMaterials: ProductMaterial[] =
            productSlug === 'programa_ciclo'
              ? [
                  {
                    id: 'm-ciclo-1',
                    product_slug: productSlug,
                    title: 'guia de aprofundamento poético • módulo 01.pdf',
                    category: 'pdf_guia',
                    file_url: 'https://www.soltaoverbocoletivo.com/materiais/guia-ciclo-mod1.pdf',
                    description: 'apostila com referências bibliográficas, ensaios e provocações de escrita reflexiva.',
                    is_published: true,
                  },
                  {
                    id: 'm-ciclo-2',
                    product_slug: productSlug,
                    title: 'exercício prático: escrita de escuta interna.pdf',
                    category: 'exercicio',
                    file_url: 'https://www.soltaoverbocoletivo.com/materiais/exercicio-escuta.pdf',
                    description: 'roteiro de 5 passos para a prática diária de soltar o verbo.',
                    is_published: true,
                  },
                  {
                    id: 'm-ciclo-3',
                    product_slug: productSlug,
                    title: 'leitura recomendada: ensaios de virginia woolf',
                    category: 'link_recomendado',
                    file_url: 'https://www.soltaoverbocoletivo.com/blog/virginia-woolf-ensaio',
                    description: 'link de referência sobre o ato de escrever com coragem e ritmo.',
                    is_published: true,
                  },
                ]
              : [
                  {
                    id: 'm-cafe-1',
                    product_slug: productSlug,
                    title: 'caderno de provocações do café com letras #24.pdf',
                    category: 'pdf_guia',
                    file_url: 'https://www.soltaoverbocoletivo.com/materiais/cafe-24-provocacoes.pdf',
                    description: 'guia com o tema da terça-feira, citações poéticas e espaço para escrita.',
                    is_published: true,
                  },
                  {
                    id: 'm-cafe-2',
                    product_slug: productSlug,
                    title: 'áudio de sintonização e silêncio guiado (10 min).mp3',
                    category: 'audio',
                    file_url: 'https://www.soltaoverbocoletivo.com/audio/sintonizacao-cafe.mp3',
                    description: 'áudio para reproduzir antes de iniciar a escrita ao vivo nas manhãs.',
                    is_published: true,
                  },
                ];

          setMaterials(demoMaterials);
          localStorage.setItem(`materials_${productSlug}`, JSON.stringify(demoMaterials));
        }
      } else if (data) {
        setMaterials(data as ProductMaterial[]);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingMaterial(null);
    setTitle('');
    setCategory('pdf_guia');
    setFileUrl('');
    setDescription('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (material: ProductMaterial) => {
    setEditingMaterial(material);
    setTitle(material.title);
    setCategory(material.category);
    setFileUrl(material.file_url);
    setDescription(material.description || '');
    setIsPublished(material.is_published);
    setIsModalOpen(true);
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !fileUrl.trim()) return;

    setSaving(true);

    const payload: Omit<ProductMaterial, 'id'> = {
      product_slug: productSlug,
      title: title.trim().toLowerCase(),
      category,
      file_url: fileUrl.trim(),
      description: description.trim().toLowerCase() || undefined,
      is_published: isPublished,
    };

    try {
      if (editingMaterial) {
        // Update
        const updated = materials.map((m) =>
          m.id === editingMaterial.id ? { ...m, ...payload } : m
        );
        setMaterials(updated);
        localStorage.setItem(`materials_${productSlug}`, JSON.stringify(updated));

        await supabase
          .from('product_materials')
          .update(payload as any)
          .eq('id', editingMaterial.id);
      } else {
        // Insert
        const { data, error } = await supabase
          .from('product_materials')
          .insert([payload])
          .select();

        if (!error && data && data.length > 0) {
          setMaterials((prev) => [data[0] as ProductMaterial, ...prev]);
        } else {
          const newMaterial: ProductMaterial = {
            id: `local-mat-${Date.now()}`,
            ...payload,
          };
          const updated = [newMaterial, ...materials];
          setMaterials(updated);
          localStorage.setItem(`materials_${productSlug}`, JSON.stringify(updated));
        }
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving material:', err);
    } finally {
      setSaving(false);
    }
  };

  const togglePublishStatus = async (material: ProductMaterial) => {
    const updated = materials.map((m) =>
      m.id === material.id ? { ...m, is_published: !m.is_published } : m
    );
    setMaterials(updated);
    localStorage.setItem(`materials_${productSlug}`, JSON.stringify(updated));

    try {
      await supabase
        .from('product_materials')
        .update({ is_published: !material.is_published })
        .eq('id', material.id);
    } catch (err) {
      console.error('Error toggling publish status:', err);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    const updated = materials.filter((m) => m.id !== id);
    setMaterials(updated);
    localStorage.setItem(`materials_${productSlug}`, JSON.stringify(updated));

    try {
      await supabase.from('product_materials').delete().eq('id', id);
    } catch (err) {
      console.error('Error deleting material:', err);
    }
  };

  const getCategoryBadge = (cat: MaterialCategory) => {
    switch (cat) {
      case 'pdf_guia':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul border border-acentoAzul/30 text-[11px] font-bold font-corpo flex items-center gap-1">
            <FileText className="w-3 h-3 text-acentoAzul" />
            <span>pdf / guia de leitura</span>
          </span>
        );
      case 'exercicio':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-acentoTerracota/10 text-acentoTerracota border border-acentoTerracota/30 text-[11px] font-bold font-corpo flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-acentoTerracota" />
            <span>exercício prático</span>
          </span>
        );
      case 'link_recomendado':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-acentoOliva/15 text-acentoOliva border border-acentoOliva/40 text-[11px] font-bold font-corpo flex items-center gap-1">
            <LinkIcon className="w-3 h-3 text-acentoOliva" />
            <span>link de referência</span>
          </span>
        );
      case 'audio':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-papelKraft/40 text-tintaCarvao border border-papelKraft/60 text-[11px] font-bold font-corpo flex items-center gap-1">
            <Headphones className="w-3 h-3 text-tintaCarvao" />
            <span>áudio de apoio</span>
          </span>
        );
      default:
        return null;
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-7 shadow-kraft space-y-6">
      {/* CABEÇALHO DA BIBLIOTECA DE MATERIAIS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
              materiais de apoio • {productName}
            </span>
          </div>
          <h3 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            biblioteca de materiais & arquivos de apoio
          </h3>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            gestão de guias em pdf, exercícios práticos, áudios e links para download das alunas
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ adicionar material</span>
        </button>
      </div>

      {/* BARRA DE FILTROS E BUSCA DE MATERIAIS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs font-corpo lowercase">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 sidebar-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'all'
                ? 'bg-acentoAzul text-white font-bold'
                : 'bg-white text-tintaCarvao/70 border border-papelKraft/40 hover:bg-papelKraft/20'
            }`}
          >
            todos ({materials.length})
          </button>
          <button
            onClick={() => setFilterCategory('pdf_guia')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'pdf_guia'
                ? 'bg-acentoAzul text-white font-bold'
                : 'bg-white text-tintaCarvao/70 border border-papelKraft/40 hover:bg-papelKraft/20'
            }`}
          >
            guias pdf
          </button>
          <button
            onClick={() => setFilterCategory('exercicio')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'exercicio'
                ? 'bg-acentoAzul text-white font-bold'
                : 'bg-white text-tintaCarvao/70 border border-papelKraft/40 hover:bg-papelKraft/20'
            }`}
          >
            exercícios
          </button>
          <button
            onClick={() => setFilterCategory('link_recomendado')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'link_recomendado'
                ? 'bg-acentoAzul text-white font-bold'
                : 'bg-white text-tintaCarvao/70 border border-papelKraft/40 hover:bg-papelKraft/20'
            }`}
          >
            links
          </button>
          <button
            onClick={() => setFilterCategory('audio')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              filterCategory === 'audio'
                ? 'bg-acentoAzul text-white font-bold'
                : 'bg-white text-tintaCarvao/70 border border-papelKraft/40 hover:bg-papelKraft/20'
            }`}
          >
            áudios
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-tintaCarvao/50 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="buscar por nome do material..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao text-xs font-corpo lowercase focus:outline-none focus:border-acentoAzul shadow-xs"
          />
        </div>
      </div>

      {/* LISTAGEM DE MATERIAIS */}
      {loading ? (
        <div className="py-8 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
          carregando materiais de apoio...
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-papelKraft/30 p-6 space-y-2">
          <FileText className="w-8 h-8 text-acentoAzul/40 mx-auto" />
          <p className="text-sm font-editorial font-bold text-acentoAzul lowercase">
            nenhum material encontrado
          </p>
          <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
            clique em "+ adicionar material" para disponibilizar um novo pdf, áudio ou guia de exercícios.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((material) => (
            <div
              key={material.id}
              className="bg-white p-5 rounded-2xl border border-papelKraft/40 shadow-xs space-y-3 flex flex-col justify-between hover:border-acentoAzul/60 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div>{getCategoryBadge(material.category)}</div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => togglePublishStatus(material)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        material.is_published
                          ? 'text-acentoOliva hover:bg-acentoOliva/10'
                          : 'text-tintaCarvao/40 hover:bg-black/5'
                      }`}
                      title={material.is_published ? 'disponível para alunas' : 'rascunho oculto'}
                    >
                      {material.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => openEditModal(material)}
                      className="p-1 rounded-lg text-tintaCarvao/60 hover:text-acentoAzul hover:bg-acentoAzul/10 transition-colors cursor-pointer"
                      title="editar material"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteMaterial(material.id)}
                      className="p-1 rounded-lg text-tintaCarvao/40 hover:text-acentoTerracota hover:bg-acentoTerracota/10 transition-colors cursor-pointer"
                      title="excluir material"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase leading-snug">
                  {material.title}
                </h4>

                {material.description && (
                  <p className="text-xs font-corpo text-tintaCarvao/70 lowercase line-clamp-2">
                    {material.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-papelKraft/30 flex items-center justify-between gap-2">
                <span className="text-[11px] font-corpo text-tintaCarvao/60 lowercase">
                  status:{' '}
                  <strong
                    className={
                      material.is_published ? 'text-acentoOliva' : 'text-tintaCarvao/50'
                    }
                  >
                    {material.is_published ? 'publicado' : 'rascunho'}
                  </strong>
                </span>

                <a
                  href={material.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-acentoAzul text-white font-corpo text-xs font-bold lowercase flex items-center gap-1.5 hover:bg-acentoAzul/90 transition-colors"
                >
                  <span>acessar arquivo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE ADICIONAR/EDITAR MATERIAL DE APOIO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-tintaCarvao/40 backdrop-blur-xs"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-papelClaro rounded-3xl border border-papelKraft/60 shadow-2xl p-6 space-y-5 z-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
              <div>
                <h4 className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                  {editingMaterial ? 'editar material' : 'novo material de apoio'} • {productName}
                </h4>
                <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
                  disponibilizar pdf, roteiro de exercício ou link de referência para a comunidade
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-tintaCarvao/60 hover:text-acentoAzul"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMaterial} className="space-y-4 text-xs font-corpo lowercase">
              <div>
                <label className="block font-bold text-tintaCarvao mb-1">
                  título do material *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ex: guia de aprofundamento poético • módulo 01.pdf"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">categoria *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MaterialCategory)}
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                >
                  <option value="pdf_guia">pdf / guia de leitura</option>
                  <option value="exercicio">exercício prático</option>
                  <option value="link_recomendado">link de referência</option>
                  <option value="audio">áudio de apoio</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">url do arquivo ou link *</label>
                <input
                  type="url"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://www.soltaoverbocoletivo.com/materiais/arquivo.pdf"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div>
                <label className="block font-bold text-tintaCarvao mb-1">
                  descrição e orientações de estudo
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="explicação sobre como a aluna deve utilizar este material..."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-papelKraft/50 text-tintaCarvao focus:outline-none focus:border-acentoAzul text-xs font-corpo lowercase"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublishedMaterial"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded border-papelKraft/60 text-acentoAzul focus:ring-acentoAzul"
                />
                <label
                  htmlFor="isPublishedMaterial"
                  className="text-xs font-corpo text-tintaCarvao lowercase cursor-pointer"
                >
                  publicar e disponibilizar para download na área das alunas
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-papelKraft/30">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-2xl border border-papelKraft/50 text-tintaCarvao/70 hover:bg-papelKraft/20 font-corpo text-xs lowercase transition-colors cursor-pointer"
                >
                  cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'salvando...' : editingMaterial ? 'salvar alterações' : 'adicionar material'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
