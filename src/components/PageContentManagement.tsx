import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  fetchCMSDataFromSupabase,
  saveCMSDataToSupabase,
  SiteCMSData,
  SectionContent,
} from '../hooks/usePageContent';
import {
  FileText,
  Save,
  Image as ImageIcon,
  Upload,
  Sparkles,
  Layers,
  Link as LinkIcon,
  CheckCircle,
  HelpCircle,
  X,
  Eye,
} from 'lucide-react';

interface PageOption {
  slug: string;
  name: string;
  sections: { key: string; name: string; hasImage?: boolean; hasButton?: boolean }[];
}

const PAGE_OPTIONS: PageOption[] = [
  {
    slug: 'landing',
    name: 'Home / Landing Page',
    sections: [
      { key: 'hero', name: 'Seção Hero / Abertura Principal', hasImage: true, hasButton: true },
      { key: 'manifesto', name: 'Seção Manifesto & Prosa', hasImage: true, hasButton: false },
      { key: 'experiencias', name: 'Seção de Experiências & Rituais', hasImage: true, hasButton: true },
      { key: 'comunidade', name: 'Seção Comunidade & Fogueira', hasImage: true, hasButton: true },
    ],
  },
  {
    slug: 'about',
    name: 'Sobre Nós (Nossa História)',
    sections: [
      { key: 'hero', name: 'Cabeçalho Principal', hasImage: true, hasButton: false },
      { key: 'origem', name: 'História & Fundação', hasImage: true, hasButton: false },
      { key: 'pilares', name: 'Pilares & Ritual Autoral', hasImage: true, hasButton: true },
    ],
  },
  {
    slug: 'programs',
    name: 'Catálogo de Programas',
    sections: [
      { key: 'hero', name: 'Abertura das Oficinas', hasImage: true, hasButton: false },
      { key: 'chamada', name: 'Bloco de Chamada Poética', hasImage: true, hasButton: true },
    ],
  },
  {
    slug: 'programa_21_dias',
    name: 'Oficina 21 Dias de Escrita',
    sections: [
      { key: 'hero', name: 'Hero da Oficina de 21 Dias', hasImage: true, hasButton: true },
      { key: 'detalhes', name: 'Metodologia & Prosa', hasImage: true, hasButton: true },
    ],
  },
  {
    slug: 'programa_cafe_com_letras',
    name: 'Café com Letras',
    sections: [
      { key: 'hero', name: 'Hero do Encontro Café com Letras', hasImage: true, hasButton: true },
      { key: 'detalhes', name: 'Prosa & Detalhes do Evento', hasImage: true, hasButton: true },
    ],
  },
  {
    slug: 'programa_ciclo',
    name: 'O Ciclo',
    sections: [
      { key: 'hero', name: 'Hero da Imersão O Ciclo', hasImage: true, hasButton: true },
      { key: 'detalhes', name: 'Experiência & Rituais', hasImage: true, hasButton: true },
    ],
  },
  {
    slug: 'contrate_experiencia',
    name: 'Contrate uma Experiência',
    sections: [
      { key: 'hero', name: 'Hero para Marcas & Empresas', hasImage: true, hasButton: true },
      { key: 'proposta', name: 'Proposta de Rituais Corporativos', hasImage: true, hasButton: true },
    ],
  },
];

export default function PageContentManagement() {
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>('landing');
  const [cmsData, setCmsData] = useState<SiteCMSData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCMS();
  }, []);

  const loadCMS = async () => {
    setLoading(true);
    const data = await fetchCMSDataFromSupabase();
    setCmsData(data || {});
    setLoading(false);
  };

  const currentPage = PAGE_OPTIONS.find((p) => p.slug === selectedPageSlug) || PAGE_OPTIONS[0];

  const handleSectionChange = (sectionKey: string, field: keyof SectionContent, value: string) => {
    setCmsData((prev) => {
      const pageData = prev[selectedPageSlug] || {};
      const sectionData = pageData[sectionKey] || {};

      return {
        ...prev,
        [selectedPageSlug]: {
          ...pageData,
          [sectionKey]: {
            ...sectionData,
            [field]: value,
          },
        },
      };
    });
  };

  const handleImageUpload = async (sectionKey: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 10MB.');
      return;
    }

    setUploadingImage(sectionKey);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${selectedPageSlug}_${sectionKey}_${Date.now()}.${fileExt}`;
      const filePath = `page-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      handleSectionChange(sectionKey, 'image_url', publicUrlData.publicUrl);
    } catch (err: any) {
      console.error('erro no upload da imagem:', err);
      alert('erro ao fazer upload da foto. tente novamente.');
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    const success = await saveCMSDataToSupabase(cmsData);
    setSaving(false);

    if (success) {
      setToastMessage('alterações da página salvas com sucesso!');
      setTimeout(() => setToastMessage(null), 4000);
    } else {
      alert('erro ao salvar alterações. tente novamente.');
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs font-corpo text-tintaCarvao/60 italic">
        carregando gestão de páginas...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* TOAST DE SUCESSO */}
      {toastMessage && (
        <div className="fixed top-6 right-6 bg-acentoAzul text-white px-5 py-3 rounded-2xl shadow-kraft-lg z-[99999] text-xs font-bold font-corpo flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-acentoOliva" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO DA GESTÃO DE PÁGINAS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
        <div>
          <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            gestão de páginas & conteúdo (cms)
          </h2>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            edite textos, frases e faça upload de fotos das páginas do site público
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-5 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'salvando...' : 'salvar alterações'}</span>
        </button>
      </div>

      {/* SELETOR DE PÁGINAS (PÍLDORAS) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-papelKraft/40 pb-2">
        {PAGE_OPTIONS.map((page) => {
          const isActive = page.slug === selectedPageSlug;
          return (
            <button
              key={page.slug}
              onClick={() => setSelectedPageSlug(page.slug)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              {page.name}
            </button>
          );
        })}
      </div>

      {/* PAINEL DE SEÇÕES DA PÁGINA SELECIONADA */}
      <div className="space-y-6">
        {currentPage.sections.map((sec) => {
          const sectionData = (cmsData[selectedPageSlug] || {})[sec.key] || {};

          return (
            <div
              key={sec.key}
              className="bg-white p-5 sm:p-7 rounded-3xl border border-papelKraft/40 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-papelKraft/30 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-acentoTerracota" />
                  <h3 className="font-editorial font-bold text-base sm:text-lg text-acentoAzul lowercase">
                    {sec.name}
                  </h3>
                </div>
                <span className="text-[10px] font-bold font-corpo text-tintaCarvao/50 uppercase">
                  chave: {sec.key}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* TÍTULO DA SEÇÃO */}
                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                    título da seção
                  </label>
                  <input
                    type="text"
                    value={sectionData.title || ''}
                    onChange={(e) => handleSectionChange(sec.key, 'title', e.target.value)}
                    placeholder="título em destaque..."
                    className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                </div>

                {/* SUBTÍTULO / FRASE */}
                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                    subtítulo / frase de chamada
                  </label>
                  <input
                    type="text"
                    value={sectionData.subtitle || ''}
                    onChange={(e) => handleSectionChange(sec.key, 'subtitle', e.target.value)}
                    placeholder="subtítulo breve..."
                    className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                </div>

              </div>

              {/* CORPO DE TEXTO / PROSA */}
              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                  texto de apresentação & prosa da seção
                </label>
                <textarea
                  value={sectionData.body_text || ''}
                  onChange={(e) => handleSectionChange(sec.key, 'body_text', e.target.value)}
                  rows={3}
                  placeholder="digite o conteúdo ou prosa da seção..."
                  className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase"
                />
              </div>

              {/* FOTO E BOTÕES (SE APLICÁVEL) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-papelKraft/30">
                
                {/* GERENCIAMENTO DA IMAGEM DA SEÇÃO */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">
                    foto da seção
                  </label>

                  {sectionData.image_url ? (
                    <div className="relative rounded-2xl overflow-hidden border border-papelKraft/40 max-h-48 group">
                      <img
                        src={sectionData.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-tintaCarvao/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <label className="px-3 py-1.5 rounded-xl bg-white text-acentoAzul font-bold text-xs cursor-pointer lowercase">
                          alterar foto
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(sec.key, file);
                            }}
                            className="hidden"
                          />
                        </label>
                        <button
                          onClick={() => handleSectionChange(sec.key, 'image_url', '')}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs cursor-pointer lowercase"
                        >
                          remover
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="border border-dashed border-papelKraft/60 rounded-2xl p-5 text-center cursor-pointer hover:border-acentoAzul block bg-bgPlataforma">
                      <Upload className="w-6 h-6 text-acentoAzul/50 mx-auto mb-1" />
                      <span className="text-xs font-bold font-corpo text-acentoAzul lowercase block">
                        {uploadingImage === sec.key ? 'enviando foto...' : '+ fazer upload de foto'}
                      </span>
                      <span className="text-[10px] font-corpo text-tintaCarvao/50 lowercase block">
                        formatos recomendados: JPG, PNG, WebP (até 10MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(sec.key, file);
                        }}
                        className="hidden"
                        disabled={uploadingImage === sec.key}
                      />
                    </label>
                  )}
                </div>

                {/* BOTÃO CTA (SE APLICÁVEL) */}
                {sec.hasButton !== false && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                        texto do botão cta
                      </label>
                      <input
                        type="text"
                        value={sectionData.button_text || ''}
                        onChange={(e) => handleSectionChange(sec.key, 'button_text', e.target.value)}
                        placeholder="ex: conhecer oficinas →"
                        className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                        link de destino do botão
                      </label>
                      <input
                        type="text"
                        value={sectionData.button_link || ''}
                        onChange={(e) => handleSectionChange(sec.key, 'button_link', e.target.value)}
                        placeholder="ex: /programs ou /checkout"
                        className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                      />
                    </div>
                  </div>
                )}

              </div>

            </div>
          );
        })}
      </div>

      {/* BOTÃO SALVAR RODAPÉ */}
      <div className="flex justify-end pt-4 border-t border-papelKraft/40">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-3 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[22px] lowercase shadow-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'salvando alterações...' : 'salvar todas as alterações da página'}</span>
        </button>
      </div>

    </div>
  );
}
