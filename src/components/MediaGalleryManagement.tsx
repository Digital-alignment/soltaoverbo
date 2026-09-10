import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  CheckCircle,
  Copy,
  Trash2,
  ExternalLink,
  Eye,
  Layers,
  BookOpen,
  Filter,
  RefreshCw,
  X,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { fetchCMSDataFromSupabase, SiteCMSData } from '../hooks/usePageContent';

export interface MediaItem {
  id: string;
  name: string;
  publicUrl: string;
  folderPath: string;
  sizeBytes?: number;
  createdAt?: string;
  isSupabase: boolean;
  usedIn: { type: 'cms' | 'course' | 'banner'; label: string }[];
}

const BRAND_STATIC_ASSETS: { name: string; url: string; folder: string }[] = [
  { name: 'oficinas-presenciais-1.jpg', url: '/brand-assets/gallery/events/13062026-IMG_6581-2.jpg', folder: 'galeria-eventos' },
  { name: 'rodas-de-partilha-2.jpg', url: '/brand-assets/gallery/events/13062026-IMG_5364-2.jpg', folder: 'galeria-eventos' },
  { name: 'experiencias-sob-medida-3.jpg', url: '/brand-assets/gallery/events/13062026-IMG_6666-2.jpg', folder: 'galeria-eventos' },
  { name: 'curadoria-de-ambiente-4.jpg', url: '/brand-assets/gallery/events/_MG_0015.jpg', folder: 'galeria-eventos' },
  { name: 'conexoes-autenticas-5.jpg', url: '/brand-assets/gallery/events/_MG_9849.jpg', folder: 'galeria-eventos' },
  { name: 'rituais-de-presenca-6.jpg', url: '/brand-assets/gallery/events/_MG_9991.jpg', folder: 'galeria-eventos' },
  { name: 'writes-torn-out-sheets.png', url: '/brand-assets/stickers/writes-torn-out-sheets.png', folder: 'elementos-graficos' },
  { name: 'fitas-washi-terracota.png', url: '/brand-assets/elements/stickers/fitas-washi-flores-terracota.png', folder: 'elementos-graficos' },
  { name: 'fitas-washi-azul.png', url: '/brand-assets/elements/stickers/fitas-washi-flores-azul.png', folder: 'elementos-graficos' },
  { name: 'icone-chama-63.svg', url: '/brand-assets/icons/icone_63.svg', folder: 'icones' },
  { name: 'foto-vivencia-equipe.jpeg', url: '/whatsapp_image_2025-12-11_at_3.24.18_pm.jpeg', folder: 'galeria-eventos' },
];

const PAGE_NAMES: { [slug: string]: string } = {
  landing: 'Home / Landing Page',
  about: 'Sobre Nós',
  programs: 'Catálogo de Programas',
  programa_21_dias: '21 Dias de Escrita',
  programa_cafe_com_letras: 'Café com Letras',
  programa_ciclo: 'O Ciclo',
  contrate_experiencia: 'Contrate uma Experiência',
  contacts: 'Canais de Contato',
};

interface MediaGalleryManagementProps {
  onSelectUrl?: (url: string) => void;
  isPickerMode?: boolean;
}

export default function MediaGalleryManagement({ onSelectUrl, isPickerMode = false }: MediaGalleryManagementProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'used' | 'unused' | 'courses' | 'cms'>('all');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadAllMedia();
  }, []);

  const loadAllMedia = async () => {
    setLoading(true);
    try {
      // 1. Fetch CMS data and Courses to track usage
      const cmsData: SiteCMSData = await fetchCMSDataFromSupabase();
      
      const { data: coursesData } = await supabase
        .from('courses')
        .select('id, title, thumbnail_url');

      const { data: bannersData } = await supabase
        .from('banners')
        .select('id, image_url');

      // Helper to compute where an image is used
      const calculateUsage = (url: string) => {
        const usage: { type: 'cms' | 'course' | 'banner'; label: string }[] = [];
        if (!url) return usage;

        const cleanTarget = url.trim().toLowerCase();

        // Check CMS pages
        for (const pageSlug in cmsData) {
          const pageName = PAGE_NAMES[pageSlug] || pageSlug;
          for (const secKey in cmsData[pageSlug]) {
            const sec = cmsData[pageSlug][secKey];
            if (sec.image_url && sec.image_url.trim().toLowerCase().includes(cleanTarget)) {
              usage.push({
                type: 'cms',
                label: `${pageName} > ${secKey}`,
              });
            }
          }
        }

        // Check Courses
        if (coursesData) {
          for (const course of coursesData) {
            if (course.thumbnail_url && course.thumbnail_url.trim().toLowerCase().includes(cleanTarget)) {
              usage.push({
                type: 'course',
                label: `Oficina: ${course.title}`,
              });
            }
          }
        }

        // Check Banners
        if (bannersData) {
          for (const b of bannersData) {
            if (b.image_url && b.image_url.trim().toLowerCase().includes(cleanTarget)) {
              usage.push({
                type: 'banner',
                label: `Banner Ativo`,
              });
            }
          }
        }

        return usage;
      };

      const fetchedItems: MediaItem[] = [];

      // 2. Fetch Storage Bucket files from folders
      const foldersToScan = ['page-photos', 'course-thumbnails', 'media-gallery', ''];

      for (const folder of foldersToScan) {
        const { data: fileList, error } = await supabase.storage
          .from('banners')
          .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

        if (!error && fileList) {
          for (const f of fileList) {
            // Skip folder items or non-image json files like cms_site_pages.json
            if (f.name.endsWith('.json') || !f.id) continue;

            const filePath = folder ? `${folder}/${f.name}` : f.name;
            const { data: publicUrlData } = supabase.storage
              .from('banners')
              .getPublicUrl(filePath);

            const url = publicUrlData.publicUrl;
            const usage = calculateUsage(url);

            fetchedItems.push({
              id: f.id || filePath,
              name: f.name,
              publicUrl: url,
              folderPath: filePath,
              sizeBytes: f.metadata?.size,
              createdAt: f.created_at,
              isSupabase: true,
              usedIn: usage,
            });
          }
        }
      }

      // 3. Add static brand assets
      for (const staticItem of BRAND_STATIC_ASSETS) {
        const usage = calculateUsage(staticItem.url);
        fetchedItems.push({
          id: `static-${staticItem.name}`,
          name: staticItem.name,
          publicUrl: staticItem.url,
          folderPath: staticItem.folder,
          isSupabase: false,
          usedIn: usage,
        });
      }

      setMediaItems(fetchedItems);
    } catch (err) {
      console.error('erro ao carregar galeria de mídias:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          alert(`O arquivo ${file.name} não é uma imagem válida.`);
          continue;
        }

        if (file.size > 10 * 1024 * 1024) {
          alert(`A imagem ${file.name} excede o limite de 10MB.`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
        const filePath = `media-gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;
      }

      setToastMessage('imagem(ns) enviada(s) com sucesso para a galeria!');
      setTimeout(() => setToastMessage(null), 4000);
      await loadAllMedia();
    } catch (err: any) {
      console.error('erro no upload de fotos para a galeria:', err);
      alert('erro ao fazer upload das imagens. tente novamente.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDeleteItem = async (item: MediaItem) => {
    if (!item.isSupabase) {
      alert('Imagens nativas do repositório não podem ser excluídas via painel.');
      return;
    }

    if (item.usedIn.length > 0) {
      const confirmDelete = window.confirm(
        `ATENÇÃO: Esta imagem está sendo usada em:\n${item.usedIn.map((u) => `• ${u.label}`).join('\n')}\n\nTem certeza de que deseja excluí-la? O link ficará quebrado nos locais onde é usada.`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = window.confirm(`Deseja excluir a foto "${item.name}" da galeria?`);
      if (!confirmDelete) return;
    }

    try {
      const { error } = await supabase.storage.from('banners').remove([item.folderPath]);
      if (error) throw error;

      setToastMessage('imagem excluída da galeria.');
      setTimeout(() => setToastMessage(null), 3000);
      setMediaItems(mediaItems.filter((i) => i.id !== item.id));
    } catch (err: any) {
      console.error('erro ao excluir imagem:', err);
      alert('erro ao excluir imagem. tente novamente.');
    }
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Filter items
  const filteredItems = mediaItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.usedIn.some((u) => u.label.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterType === 'used') return item.usedIn.length > 0;
    if (filterType === 'unused') return item.usedIn.length === 0;
    if (filterType === 'courses') return item.usedIn.some((u) => u.type === 'course');
    if (filterType === 'cms') return item.usedIn.some((u) => u.type === 'cms');

    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-acentoAzul text-white px-5 py-3 rounded-2xl shadow-kraft-lg z-[99999] text-xs font-bold font-corpo flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-acentoOliva" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODAL DE PRÉ-VISUALIZAÇÃO DE IMAGEM */}
      {previewItem && (
        <div
          className="fixed inset-0 bg-tintaCarvao/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-papelClaro p-4 sm:p-6 rounded-3xl border border-papelKraft/60 max-w-3xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-kraft-lg relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
              <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase truncate">
                {previewItem.name}
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-tintaCarvao/50 hover:text-tintaCarvao transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-papelKraft/40 max-h-96 bg-white flex items-center justify-center">
              <img src={previewItem.publicUrl} alt={previewItem.name} className="max-h-96 w-auto object-contain" />
            </div>

            <div className="space-y-2 text-xs font-corpo text-tintaCarvao">
              <p><strong>URL pública:</strong> <code className="bg-bgPlataforma px-2 py-0.5 rounded text-[11px] select-all">{previewItem.publicUrl}</code></p>
              {previewItem.sizeBytes && <p><strong>Tamanho:</strong> {formatFileSize(previewItem.sizeBytes)}</p>}
              
              <div className="pt-2">
                <strong className="block text-acentoAzul mb-1">Onde está sendo usada:</strong>
                {previewItem.usedIn.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {previewItem.usedIn.map((u, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold lowercase">
                        {u.label}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-tintaCarvao/50 italic lowercase">esta imagem não está em uso em nenhuma página ou curso.</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-3 border-t border-papelKraft/30">
              <button
                onClick={() => handleCopyUrl(previewItem.publicUrl)}
                className="flex-1 py-2.5 rounded-xl bg-acentoAzul text-white text-xs font-bold font-corpo lowercase transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedUrl === previewItem.publicUrl ? 'copiado!' : 'copiar url'}</span>
              </button>
              {onSelectUrl && (
                <button
                  onClick={() => {
                    onSelectUrl(previewItem.publicUrl);
                    setPreviewItem(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-acentoTerracota text-white text-xs font-bold font-corpo lowercase transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>usar esta foto</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CABEÇALHO DA GALERIA */}
      {!isPickerMode && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
          <div>
            <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
              banco de fotos & galeria de mídias
            </h2>
            <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
              veja todas as imagens salvas no storage, saiba onde estão sendo usadas e reutilize em qualquer página ou curso
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllMedia}
              className="p-2.5 rounded-xl bg-white border border-papelKraft/40 text-acentoAzul hover:bg-bgPlataforma transition cursor-pointer"
              title="recarregar galeria"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <label className="px-5 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[19px] lowercase shadow-xs flex items-center gap-2 transition cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'enviando...' : '+ enviar fotos'}</span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      )}

      {/* BARRA DE BUSCA E FILTROS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tintaCarvao/40" />
          <input
            type="text"
            placeholder="buscar foto por nome ou local onde é usada..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-tintaCarvao/40">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {[
            { id: 'all', label: `todas (${mediaItems.length})` },
            { id: 'used', label: `em uso (${mediaItems.filter((i) => i.usedIn.length > 0).length})` },
            { id: 'unused', label: `não usadas (${mediaItems.filter((i) => i.usedIn.length === 0).length})` },
            { id: 'courses', label: 'oficinas' },
            { id: 'cms', label: 'páginas cms' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterType(f.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-corpo lowercase transition cursor-pointer whitespace-nowrap ${
                filterType === f.id
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-bgPlataforma text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* GRID DE CARDS DE FOTOS */}
      {loading ? (
        <div className="py-16 text-center text-xs font-corpo text-tintaCarvao/60 italic">
          carregando banco de mídias e rastreando usos...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white p-8 rounded-3xl border border-papelKraft/40 space-y-3">
          <ImageIcon className="w-10 h-10 text-tintaCarvao/30 mx-auto" />
          <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
            nenhuma imagem encontrada com os filtros selecionados.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const isUsed = item.usedIn.length > 0;
            const isJustCopied = copiedUrl === item.publicUrl;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-papelKraft/40 shadow-xs overflow-hidden flex flex-col justify-between group hover:border-acentoAzul/60 hover:shadow-md transition-all"
              >
                {/* THUMBNAIL DA FOTO */}
                <div className="relative h-44 bg-bgPlataforma overflow-hidden">
                  <img
                    src={item.publicUrl}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* OVERLAY DE AÇÕES RÁPIDAS NO HOVER */}
                  <div className="absolute inset-0 bg-tintaCarvao/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="p-2 rounded-xl bg-white text-acentoAzul hover:bg-papelClaro transition cursor-pointer"
                      title="ver detalhes e pré-visualizar"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleCopyUrl(item.publicUrl)}
                      className="p-2 rounded-xl bg-white text-acentoAzul hover:bg-papelClaro transition cursor-pointer"
                      title="copiar url"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {item.isSupabase && (
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition cursor-pointer"
                        title="excluir foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* BADGE DE STATUS: EM USO VS NÃO UTILIZADA */}
                  <div className="absolute top-2.5 left-2.5">
                    {isUsed ? (
                      <span className="px-2.5 py-1 rounded-full bg-acentoOliva text-tintaCarvao text-[10px] font-bold font-corpo lowercase shadow-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-tintaCarvao block" />
                        <span>em uso ({item.usedIn.length})</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-tintaCarvao/60 text-white text-[10px] font-medium font-corpo lowercase shadow-xs">
                        não utilizada
                      </span>
                    )}
                  </div>
                </div>

                {/* INFORMAÇÕES DA FOTO */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-editorial font-bold text-xs text-acentoAzul lowercase truncate" title={item.name}>
                      {item.name}
                    </h4>

                    {/* LOCAIS DE USO */}
                    {isUsed ? (
                      <div className="mt-1 space-y-0.5 max-h-12 overflow-y-auto">
                        {item.usedIn.map((u, idx) => (
                          <span
                            key={idx}
                            className="block text-[10px] text-acentoAzul font-corpo font-bold lowercase truncate"
                            title={u.label}
                          >
                            • {u.label}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-tintaCarvao/50 font-corpo lowercase mt-1">
                        disponível para uso
                      </p>
                    )}
                  </div>

                  {/* BOTÃO DE AÇÃO PRINCIPAL */}
                  <div className="pt-2 border-t border-papelKraft/30 flex gap-2">
                    {onSelectUrl ? (
                      <button
                        onClick={() => onSelectUrl(item.publicUrl)}
                        className="w-full py-1.5 rounded-xl bg-acentoTerracota text-white text-xs font-bold font-corpo lowercase transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>selecionar foto</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCopyUrl(item.publicUrl)}
                        className={`w-full py-1.5 rounded-xl text-xs font-bold font-corpo lowercase transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          isJustCopied
                            ? 'bg-acentoOliva text-tintaCarvao'
                            : 'bg-bgPlataforma hover:bg-papelKraft/30 text-acentoAzul border border-papelKraft/40'
                        }`}
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isJustCopied ? 'url copiada!' : 'copiar url'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
