import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  fetchCMSDataFromSupabase,
  saveCMSDataToSupabase,
  SiteCMSData,
  SectionContent,
  DEFAULT_CMS_DATA,
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
  Grid,
} from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';

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
      { key: 'hero', name: '01. Hero / Abertura Principal', hasImage: true, hasButton: true },
      { key: 'produtos_header', name: '02. Cabeçalho da Seção de Programas', hasImage: false, hasButton: false },
      { key: 'produto_21dias', name: '03. Card Produto 21 Dias de Escrita', hasImage: true, hasButton: true },
      { key: 'produto_ciclo', name: '04. Card Produto Ciclo de Aprofundamento', hasImage: true, hasButton: true },
      { key: 'produto_cafe', name: '05. Card Produto Café com Letras', hasImage: true, hasButton: true },
      { key: 'fundamentos', name: '06. Seção Fundamentos & 6 Pilares', hasImage: false, hasButton: false },
      { key: 'depoimentos', name: '07. Seção Depoimentos & Seleção por Página', hasImage: false, hasButton: false },
      { key: 'b2b_section', name: '08. Seção B2B / Experiências Corporativas', hasImage: false, hasButton: false },
      { key: 'palavras_sob_medida', name: '09. Seção Palavras Sob Medida', hasImage: false, hasButton: true },
      { key: 'teoria_pratica', name: '10. Seção Teoria + Prática (Pennebaker & Ebbinghaus)', hasImage: false, hasButton: true },
      { key: 'final_cta', name: '11. Seção Banner CTA Final', hasImage: false, hasButton: true },
      { key: 'faq', name: '12. Seção Dúvidas Frequentes (FAQ)', hasImage: false, hasButton: false },
    ],
  },
  {
    slug: 'founders',
    name: 'Co-Criadoras (Bruna & Júlia)',
    sections: [
      { key: 'bruna', name: 'Bruna Riedel (Foto & Trajetória)', hasImage: true, hasButton: false },
      { key: 'julia', name: 'Júlia Alvim (Foto & Trajetória)', hasImage: true, hasButton: false },
    ],
  },
  {
    slug: 'testimonials_pool',
    name: 'Banco Global de Depoimentos',
    sections: [
      { key: 't1', name: 'Depoimento 1 (Bárbara - Babi)', hasImage: false, hasButton: false },
      { key: 't2', name: 'Depoimento 2 (Bárbara - Troca)', hasImage: false, hasButton: false },
      { key: 't3', name: 'Depoimento 3 (Tom Vitralli - Sangha)', hasImage: false, hasButton: false },
      { key: 't4', name: 'Depoimento 4 (Tom Vitralli - Fluxo)', hasImage: false, hasButton: false },
      { key: 't5', name: 'Depoimento 5 (Jess - Resgate)', hasImage: false, hasButton: false },
      { key: 't6', name: 'Depoimento 6 (Jess - Fio de Vida)', hasImage: false, hasButton: false },
    ],
  },
  {
    slug: 'about',
    name: 'Sobre Nós (Nossa História)',
    sections: [
      { key: 'hero', name: '01. Hero / Nossa Essência & Manifesto', hasImage: true, hasButton: true },
      { key: 'manifesto', name: '02. Seção Manifesto (O Que Acreditamos)', hasImage: false, hasButton: false },
      { key: 'pilares', name: '03. Seção 5 Pilares (O Que Nos Move)', hasImage: false, hasButton: false },
      { key: 'galeria', name: '04. Seção Diário Visual (Galeria de Encontros)', hasImage: true, hasButton: false },
      { key: 'eventos_criados', name: '05. Seção Os Eventos Que Criamos (Feira Fatto & Experienciar)', hasImage: true, hasButton: true },
      { key: 'ecossistema_digital', name: '06. Seção Ecossistema Digital & Membros', hasImage: true, hasButton: true },
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
  {
    slug: 'contacts',
    name: 'Canais de Contato & Redes',
    sections: [
      { key: 'info', name: 'Informações Globais de Contato & Redes Sociais', hasImage: false, hasButton: false },
    ],
  },
  {
    slug: 'tour_modal',
    name: 'Modo Observador / Tour Virtual',
    sections: [
      { key: 'header', name: 'Cabeçalho Superior & Configurações Globais', hasImage: false, hasButton: true },
      { key: 'tab_acervo', name: 'Aba 1: Acervo de Prompts', hasImage: true, hasButton: false },
      { key: 'tab_encontros', name: 'Aba 2: Rodas ao Vivo & Café com Letras', hasImage: true, hasButton: false },
      { key: 'tab_comunidade', name: 'Aba 3: Mural da Comunidade', hasImage: true, hasButton: false },
      { key: 'tab_cadernos', name: 'Aba 4: Cadernos Guiados em PDF', hasImage: true, hasButton: false },
    ],
  },
];

interface PageContentManagementProps {
  selectedSubPage?: string;
}

export default function PageContentManagement({ selectedSubPage }: PageContentManagementProps) {
  const [selectedPageSlug, setSelectedPageSlug] = useState<string>(selectedSubPage || 'landing');
  const [cmsData, setCmsData] = useState<SiteCMSData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [activePickerSecKey, setActivePickerSecKey] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSubPage) {
      const match = PAGE_OPTIONS.find(p => p.slug === selectedSubPage);
      if (match) {
        setSelectedPageSlug(match.slug);
      }
    }
  }, [selectedSubPage]);

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
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
              cms de páginas
            </span>
            <span className="text-tintaCarvao/40 text-xs">•</span>
            <span className="font-editorial font-bold text-sm text-acentoTerracota lowercase">
              {currentPage.name}
            </span>
          </div>
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

      {/* BARRA DE SELEÇÃO RÁPIDA DE PÁGINA (SEM SCROLLBAR HORIZONTAL NATIVO) */}
      <div className="bg-white p-3 rounded-2xl border border-papelKraft/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-acentoAzul" />
          <span className="text-xs font-bold font-corpo text-tintaCarvao lowercase">
            página em edição:
          </span>
        </div>

        <select
          value={selectedPageSlug}
          onChange={(e) => setSelectedPageSlug(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 bg-papelClaro border border-papelKraft/40 rounded-xl text-xs font-bold font-corpo text-acentoAzul focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
        >
          {PAGE_OPTIONS.map((page) => (
            <option key={page.slug} value={page.slug}>
              {page.name}
            </option>
          ))}
        </select>
      </div>

      {/* PAINEL DE SEÇÕES DA PÁGINA SELECIONADA */}
      <div className="space-y-6">
        {currentPage.sections.map((sec) => {
          const defaultSec = (DEFAULT_CMS_DATA[selectedPageSlug] || {})[sec.key] || {};
          const customSec = (cmsData[selectedPageSlug] || {})[sec.key] || {};
          const sectionData = { ...defaultSec, ...customSec };

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

              {/* CAMPOS ESPECÍFICOS PARA CANAIS DE CONTATO & REDES */}
              {selectedPageSlug === 'contacts' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-papelKraft/30">
                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      link do whatsapp (URL)
                    </label>
                    <input
                      type="url"
                      value={sectionData.whatsapp || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'whatsapp', e.target.value)}
                      placeholder="https://wa.link/w67ibp ou https://wa.me/55..."
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      número ou texto de exibição whatsapp
                    </label>
                    <input
                      type="text"
                      value={sectionData.whatsapp_number || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'whatsapp_number', e.target.value)}
                      placeholder="ex: +55 (31) 99999-9999"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      link do instagram (URL)
                    </label>
                    <input
                      type="url"
                      value={sectionData.instagram || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'instagram', e.target.value)}
                      placeholder="https://www.instagram.com/soltaoverbo.coletivo/"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      usuário / handle instagram (@)
                    </label>
                    <input
                      type="text"
                      value={sectionData.instagram_handle || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'instagram_handle', e.target.value)}
                      placeholder="ex: @soltaoverbo.coletivo"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      e-mail de contato principal
                    </label>
                    <input
                      type="email"
                      value={sectionData.email || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'email', e.target.value)}
                      placeholder="soltaoverbocoletivo@gmail.com"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      slogan / frase do rodapé (footer)
                    </label>
                    <input
                      type="text"
                      value={sectionData.footer_phrase || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'footer_phrase', e.target.value)}
                      placeholder="autodesenvolvimento em coletivo através da escrita..."
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>
                </div>
              )}

              {/* CAMPOS ESPECÍFICOS PARA MODO OBSERVADOR / TOUR VIRTUAL */}
              {selectedPageSlug === 'tour_modal' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-papelKraft/30">
                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      selo / etiqueta (badge)
                    </label>
                    <input
                      type="text"
                      value={sectionData.badge || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'badge', e.target.value)}
                      placeholder="ex: modo observador • tour virtual ou +120 exercícios"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>

                  {sec.key !== 'header' && (
                    <div>
                      <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                        nome da aba na navegação
                      </label>
                      <input
                        type="text"
                        value={sectionData.label || ''}
                        onChange={(e) => handleSectionChange(sec.key, 'label', e.target.value)}
                        placeholder="ex: acervo de prompts, rodas ao vivo..."
                        className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      ícone da aba / header (lucide)
                    </label>
                    <select
                      value={sectionData.icon || 'sparkles'}
                      onChange={(e) => handleSectionChange(sec.key, 'icon', e.target.value)}
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    >
                      <option value="sparkles">✨ sparkles / brilho</option>
                      <option value="book-open">📖 book-open / livro aberto</option>
                      <option value="coffee">☕ coffee / café</option>
                      <option value="users">👥 users / comunidade</option>
                      <option value="file-text">📄 file-text / cadernos guiados</option>
                      <option value="flame">🔥 flame / fogueira</option>
                      <option value="heart">❤️ heart / afeto</option>
                      <option value="star">⭐ star / destaque</option>
                    </select>
                  </div>

                  {sec.key === 'header' ? (
                    <div>
                      <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                        aviso de garantia / rodapé do modal
                      </label>
                      <input
                        type="text"
                        value={sectionData.footer_notice || ''}
                        onChange={(e) => handleSectionChange(sec.key, 'footer_notice', e.target.value)}
                        placeholder="ex: acesso imediato após a inscrição"
                        className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                      />
                    </div>
                  ) : (
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                        itens de destaque da aba (digite 1 por linha)
                      </label>
                      <textarea
                        value={sectionData.items || ''}
                        onChange={(e) => handleSectionChange(sec.key, 'items', e.target.value)}
                        rows={3}
                        placeholder="item 1&#10;item 2&#10;item 3"
                        className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* CAMPOS ESPECÍFICOS DA LANDING PAGE */}
              {selectedPageSlug === 'landing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-papelKraft/30">
                  {/* Hero badge & secondary button */}
                  {sec.key === 'hero' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          selo / etiqueta superior (badge)
                        </label>
                        <input
                          type="text"
                          value={sectionData.badge_text || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)}
                          placeholder="comunidade de autodesenvolvimento através da escrita"
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          texto botão secundário ("saiba mais")
                        </label>
                        <input
                          type="text"
                          value={sectionData.button_secondary_text || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'button_secondary_text', e.target.value)}
                          placeholder="saiba mais"
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                    </>
                  )}

                  {/* Produto 21 Dias */}
                  {sec.key === 'produto_21dias' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">preço do investimento</label>
                        <input type="text" value={sectionData.price || ''} onChange={(e) => handleSectionChange(sec.key, 'price', e.target.value)} placeholder="R$ 77,00" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">subtexto parcelamento</label>
                        <input type="text" value={sectionData.price_subtext || ''} onChange={(e) => handleSectionChange(sec.key, 'price_subtext', e.target.value)} placeholder="(ou 2x R$ 38,50)" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">benefícios (3 itens)</label>
                        <input type="text" value={sectionData.bullet_1 || ''} onChange={(e) => handleSectionChange(sec.key, 'bullet_1', e.target.value)} placeholder="item 1" className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase mb-1" />
                        <input type="text" value={sectionData.bullet_2 || ''} onChange={(e) => handleSectionChange(sec.key, 'bullet_2', e.target.value)} placeholder="item 2" className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase mb-1" />
                        <input type="text" value={sectionData.bullet_3 || ''} onChange={(e) => handleSectionChange(sec.key, 'bullet_3', e.target.value)} placeholder="item 3" className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">título caixa direita ("para quem é")</label>
                        <input type="text" value={sectionData.for_who_title || ''} onChange={(e) => handleSectionChange(sec.key, 'for_who_title', e.target.value)} placeholder="para quem é este programa?" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">descrição caixa direita ("para quem é")</label>
                        <input type="text" value={sectionData.for_who_text || ''} onChange={(e) => handleSectionChange(sec.key, 'for_who_text', e.target.value)} placeholder="ideal para quem deseja..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                    </>
                  )}

                  {/* Produto Ciclo */}
                  {sec.key === 'produto_ciclo' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge superior</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="travessia de 3 meses..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">preço da assinatura</label>
                        <input type="text" value={sectionData.price || ''} onChange={(e) => handleSectionChange(sec.key, 'price', e.target.value)} placeholder="R$ 597,00" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">subtexto parcelamento</label>
                        <input type="text" value={sectionData.price_subtext || ''} onChange={(e) => handleSectionChange(sec.key, 'price_subtext', e.target.value)} placeholder="/ trimestre (ou 3x R$ 225,67 sem juros)" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta travessia em curso</label>
                        <input type="text" value={sectionData.journey_badge || ''} onChange={(e) => handleSectionChange(sec.key, 'journey_badge', e.target.value)} placeholder="travessia em curso: a coragem de não agradar" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">livro-guia</label>
                        <input type="text" value={sectionData.book_info || ''} onChange={(e) => handleSectionChange(sec.key, 'book_info', e.target.value)} placeholder="a coragem de não agradar..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">convidada especial</label>
                        <input type="text" value={sectionData.guest_info || ''} onChange={(e) => handleSectionChange(sec.key, 'guest_info', e.target.value)} placeholder="jout jout" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">sinopse da travessia</label>
                        <input type="text" value={sectionData.synopsis || ''} onChange={(e) => handleSectionChange(sec.key, 'synopsis', e.target.value)} placeholder="três meses para se libertar..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                    </>
                  )}

                  {/* Produto Café com Letras */}
                  {sec.key === 'produto_cafe' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">preço mensal</label>
                        <input type="text" value={sectionData.price || ''} onChange={(e) => handleSectionChange(sec.key, 'price', e.target.value)} placeholder="R$ 97,00 / mês" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">destaque incluso no ciclo</label>
                        <input type="text" value={sectionData.highlight || ''} onChange={(e) => handleSectionChange(sec.key, 'highlight', e.target.value)} placeholder="incluído para quem já faz parte do ciclo..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">título cartão direito</label>
                        <input type="text" value={sectionData.card_title || ''} onChange={(e) => handleSectionChange(sec.key, 'card_title', e.target.value)} placeholder="seu ritual semanal de escrita" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">tag de informação horário</label>
                        <input type="text" value={sectionData.card_info || ''} onChange={(e) => handleSectionChange(sec.key, 'card_info', e.target.value)} placeholder="terças, 8h às 8h30 · ao vivo no zoom..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                    </>
                  )}

                  {/* Depoimentos */}
                  {sec.key === 'depoimentos' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge ("vozes da nossa comunidade")</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="vozes da nossa comunidade" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">IDs dos Depoimentos Exibidos nesta Página (separados por vírgula)</label>
                        <input type="text" value={sectionData.selected_ids || ''} onChange={(e) => handleSectionChange(sec.key, 'selected_ids', e.target.value)} placeholder="ex: t1,t3,t5" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase font-mono" />
                        <span className="text-[10px] text-tintaCarvao/60 lowercase mt-1 block">
                          cadastre e edite depoimentos completos no 'Banco Global de Depoimentos' no menu de seleção de páginas.
                        </span>
                      </div>
                    </>
                  )}

                  {/* Seção B2B */}
                  {sec.key === 'b2b_section' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge superior</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="experiências sob medida" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">card 1 (empresas)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={sectionData.card1_badge || ''} onChange={(e) => handleSectionChange(sec.key, 'card1_badge', e.target.value)} placeholder="badge card 1..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.card1_title || ''} onChange={(e) => handleSectionChange(sec.key, 'card1_title', e.target.value)} placeholder="título card 1..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                        <input type="text" value={sectionData.card1_desc || ''} onChange={(e) => handleSectionChange(sec.key, 'card1_desc', e.target.value)} placeholder="descrição card 1..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">card 2 (eventos)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={sectionData.card2_badge || ''} onChange={(e) => handleSectionChange(sec.key, 'card2_badge', e.target.value)} placeholder="badge card 2..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.card2_title || ''} onChange={(e) => handleSectionChange(sec.key, 'card2_title', e.target.value)} placeholder="título card 2..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                        <input type="text" value={sectionData.card2_desc || ''} onChange={(e) => handleSectionChange(sec.key, 'card2_desc', e.target.value)} placeholder="descrição card 2..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">card 3 (escolas)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={sectionData.card3_badge || ''} onChange={(e) => handleSectionChange(sec.key, 'card3_badge', e.target.value)} placeholder="badge card 3..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.card3_title || ''} onChange={(e) => handleSectionChange(sec.key, 'card3_title', e.target.value)} placeholder="título card 3..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                        <input type="text" value={sectionData.card3_desc || ''} onChange={(e) => handleSectionChange(sec.key, 'card3_desc', e.target.value)} placeholder="descrição card 3..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                    </>
                  )}

                  {/* Palavras sob medida */}
                  {sec.key === 'palavras_sob_medida' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="palavras sob medida" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                    </>
                  )}

                  {/* Teoria + Prática */}
                  {sec.key === 'teoria_pratica' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge superior</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="teoria + prática / o que sustenta..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">frase em destaque azul (conclusão)</label>
                        <input type="text" value={sectionData.highlight_final || ''} onChange={(e) => handleSectionChange(sec.key, 'highlight_final', e.target.value)} placeholder="é por isso que não entregamos só uma oficina bonita..." className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                    </>
                  )}

                  {/* FAQ Header & Perguntas Frequentes */}
                  {sec.key === 'faq' && (
                    <>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge superior</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="dúvidas frequentes" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <div key={num} className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                          <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">pergunta #{num}</label>
                          <input type="text" value={sectionData[`q${num}`] || ''} onChange={(e) => handleSectionChange(sec.key, `q${num}`, e.target.value)} placeholder={`pergunta ${num}...`} className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase font-semibold" />
                          <textarea value={sectionData[`a${num}`] || ''} onChange={(e) => handleSectionChange(sec.key, `a${num}`, e.target.value)} rows={2} placeholder={`resposta ${num}...`} className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* CAMPOS ESPECÍFICOS DA PÁGINA SOBRE NÓS (about) */}
              {selectedPageSlug === 'about' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-papelKraft/30">
                  {sec.key === 'hero' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          selo / etiqueta superior (badge)
                        </label>
                        <input
                          type="text"
                          value={sectionData.badge_text || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)}
                          placeholder="nossa essência & manifesto"
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          prefixo do título ("solta o verbo:")
                        </label>
                        <input
                          type="text"
                          value={sectionData.title_prefix || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'title_prefix', e.target.value)}
                          placeholder="solta o verbo:"
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          frase em itálico (abaixo da descrição)
                        </label>
                        <input
                          type="text"
                          value={sectionData.italic_quote || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'italic_quote', e.target.value)}
                          placeholder="reescreva sua história ao ampliar a perspectiva..."
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          citação do card scrapbook (direita)
                        </label>
                        <input
                          type="text"
                          value={sectionData.card_quote || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'card_quote', e.target.value)}
                          placeholder="escrever é encarar com verdade..."
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          texto do 2º botão ("ver nossos encontros")
                        </label>
                        <input
                          type="text"
                          value={sectionData.button_secondary_text || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'button_secondary_text', e.target.value)}
                          placeholder="ver nossos encontros"
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          link do 2º botão
                        </label>
                        <input
                          type="text"
                          value={sectionData.button_secondary_link || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'button_secondary_link', e.target.value)}
                          placeholder="#encontros"
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                    </>
                  )}

                  {sec.key === 'manifesto' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          etiqueta badge ("manifesto")
                        </label>
                        <input
                          type="text"
                          value={sectionData.badge_text || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)}
                          placeholder="manifesto"
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">parágrafos do manifesto (p1, p2, p3)</label>
                        <textarea value={sectionData.p1 || ''} onChange={(e) => handleSectionChange(sec.key, 'p1', e.target.value)} rows={2} placeholder="parágrafo 1..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                        <textarea value={sectionData.p2 || ''} onChange={(e) => handleSectionChange(sec.key, 'p2', e.target.value)} rows={2} placeholder="parágrafo 2..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                        <textarea value={sectionData.p3 || ''} onChange={(e) => handleSectionChange(sec.key, 'p3', e.target.value)} rows={2} placeholder="parágrafo 3..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                          frase destacada em terracota (conclusão do manifesto)
                        </label>
                        <input
                          type="text"
                          value={sectionData.highlight_quote || ''}
                          onChange={(e) => handleSectionChange(sec.key, 'highlight_quote', e.target.value)}
                          placeholder="solta o verbo é um convite para..."
                          className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase font-semibold"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">textos do quadro inferior</label>
                        <textarea value={sectionData.box_p1 || ''} onChange={(e) => handleSectionChange(sec.key, 'box_p1', e.target.value)} rows={2} placeholder="texto do quadro parágrafo 1..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                        <textarea value={sectionData.box_p2 || ''} onChange={(e) => handleSectionChange(sec.key, 'box_p2', e.target.value)} rows={2} placeholder="texto destacado do quadro..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase font-semibold" />
                      </div>
                    </>
                  )}

                  {sec.key === 'pilares' && (
                    <>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div key={num} className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                          <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">pilar #{num}</label>
                          <input type="text" value={sectionData[`pilar_${num}_title`] || ''} onChange={(e) => handleSectionChange(sec.key, `pilar_${num}_title`, e.target.value)} placeholder={`título pilar ${num}...`} className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase font-semibold" />
                          <textarea value={sectionData[`pilar_${num}_desc`] || ''} onChange={(e) => handleSectionChange(sec.key, `pilar_${num}_desc`, e.target.value)} rows={2} placeholder={`descrição pilar ${num}...`} className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                        </div>
                      ))}
                    </>
                  )}

                  {sec.key === 'galeria' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge ("diário visual")</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="diário visual" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <div key={num} className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                          <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">foto da galeria #{num}</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" value={sectionData[`photo_${num}_title`] || ''} onChange={(e) => handleSectionChange(sec.key, `photo_${num}_title`, e.target.value)} placeholder={`título foto ${num}...`} className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                            <input type="text" value={sectionData[`photo_${num}_subtitle`] || ''} onChange={(e) => handleSectionChange(sec.key, `photo_${num}_subtitle`, e.target.value)} placeholder={`subtítulo foto ${num}...`} className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          </div>
                          <input type="text" value={sectionData[`photo_${num}_image`] || ''} onChange={(e) => handleSectionChange(sec.key, `photo_${num}_image`, e.target.value)} placeholder={`URL da foto ${num}...`} className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase font-mono" />
                        </div>
                      ))}
                    </>
                  )}

                  {sec.key === 'eventos_criados' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge ("presenciais")</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="presenciais" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>

                      {/* Evento 1 */}
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">evento #1 (ex: feira fatto à femme)</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" value={sectionData.evt1_title || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_title', e.target.value)} placeholder="título..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt1_location || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_location', e.target.value)} placeholder="cidade..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt1_year || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_year', e.target.value)} placeholder="ano..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                        <input type="text" value={sectionData.evt1_short || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_short', e.target.value)} placeholder="descrição curta no card..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        <textarea value={sectionData.evt1_full || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_full', e.target.value)} rows={2} placeholder="descrição completa no modal..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                        <input type="text" value={sectionData.evt1_image || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_image', e.target.value)} placeholder="URL da foto do evento..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase font-mono" />
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-acentoAzul lowercase">destaques do evento 1 (3 itens)</label>
                          <input type="text" value={sectionData.evt1_hl1 || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_hl1', e.target.value)} placeholder="destaque 1..." className="w-full px-3 py-1 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt1_hl2 || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_hl2', e.target.value)} placeholder="destaque 2..." className="w-full px-3 py-1 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt1_hl3 || ''} onChange={(e) => handleSectionChange(sec.key, 'evt1_hl3', e.target.value)} placeholder="destaque 3..." className="w-full px-3 py-1 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                      </div>

                      {/* Evento 2 */}
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">evento #2 (ex: o experienciar)</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input type="text" value={sectionData.evt2_title || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_title', e.target.value)} placeholder="título..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt2_location || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_location', e.target.value)} placeholder="cidade..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt2_year || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_year', e.target.value)} placeholder="ano..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                        <input type="text" value={sectionData.evt2_short || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_short', e.target.value)} placeholder="descrição curta no card..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        <textarea value={sectionData.evt2_full || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_full', e.target.value)} rows={2} placeholder="descrição completa no modal..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase" />
                        <input type="text" value={sectionData.evt2_image || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_image', e.target.value)} placeholder="URL da foto do evento..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase font-mono" />
                        <div className="space-y-1">
                          <label className="block text-[10px] font-bold text-acentoAzul lowercase">destaques do evento 2 (3 itens)</label>
                          <input type="text" value={sectionData.evt2_hl1 || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_hl1', e.target.value)} placeholder="destaque 1..." className="w-full px-3 py-1 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt2_hl2 || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_hl2', e.target.value)} placeholder="destaque 2..." className="w-full px-3 py-1 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.evt2_hl3 || ''} onChange={(e) => handleSectionChange(sec.key, 'evt2_hl3', e.target.value)} placeholder="destaque 3..." className="w-full px-3 py-1 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                      </div>

                      {/* Card 3: Próximo em breve */}
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">card #3 (próximo evento em breve)</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={sectionData.next_badge || ''} onChange={(e) => handleSectionChange(sec.key, 'next_badge', e.target.value)} placeholder="em breve" className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.next_title || ''} onChange={(e) => handleSectionChange(sec.key, 'next_title', e.target.value)} placeholder="o próximo, em breve" className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                        <input type="text" value={sectionData.next_text || ''} onChange={(e) => handleSectionChange(sec.key, 'next_text', e.target.value)} placeholder="estamos preparando os próximos..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={sectionData.next_button_text || ''} onChange={(e) => handleSectionChange(sec.key, 'next_button_text', e.target.value)} placeholder="quero saber quando abrir" className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.next_button_link || ''} onChange={(e) => handleSectionChange(sec.key, 'next_button_link', e.target.value)} placeholder="https://wa.me/..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                      </div>

                      {/* Quadro Rodapé B2B */}
                      <div className="md:col-span-2 space-y-2 pt-2 border-t border-papelKraft/20">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">faixa inferior (convite para eventos sob medida)</label>
                        <input type="text" value={sectionData.footer_text || ''} onChange={(e) => handleSectionChange(sec.key, 'footer_text', e.target.value)} placeholder="quer levar a solta o verbo para o seu evento..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        <div className="grid grid-cols-2 gap-2">
                          <input type="text" value={sectionData.footer_button_text || ''} onChange={(e) => handleSectionChange(sec.key, 'footer_button_text', e.target.value)} placeholder="falar com a gente" className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                          <input type="text" value={sectionData.footer_button_link || ''} onChange={(e) => handleSectionChange(sec.key, 'footer_button_link', e.target.value)} placeholder="https://wa.me/..." className="w-full px-3 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        </div>
                      </div>
                    </>
                  )}

                  {sec.key === 'ecossistema_digital' && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">etiqueta badge ("o nosso ecossistema digital")</label>
                        <input type="text" value={sectionData.badge_text || ''} onChange={(e) => handleSectionChange(sec.key, 'badge_text', e.target.value)} placeholder="o nosso ecossistema digital" className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">lista de diferenciais (3 itens)</label>
                        <input type="text" value={sectionData.bullet_1 || ''} onChange={(e) => handleSectionChange(sec.key, 'bullet_1', e.target.value)} placeholder="item 1..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        <input type="text" value={sectionData.bullet_2 || ''} onChange={(e) => handleSectionChange(sec.key, 'bullet_2', e.target.value)} placeholder="item 2..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                        <input type="text" value={sectionData.bullet_3 || ''} onChange={(e) => handleSectionChange(sec.key, 'bullet_3', e.target.value)} placeholder="item 3..." className="w-full px-3.5 py-1.5 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase" />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* CAMPOS ESPECÍFICOS DE CO-CRIADORAS (founders) */}
              {selectedPageSlug === 'founders' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-papelKraft/30">
                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      nome da criadora
                    </label>
                    <input
                      type="text"
                      value={sectionData.name || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'name', e.target.value)}
                      placeholder="ex: bruna riedel"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      função / cargo
                    </label>
                    <input
                      type="text"
                      value={sectionData.role || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'role', e.target.value)}
                      placeholder="ex: co-criadora & facilitadora"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      resumo curto (card principal)
                    </label>
                    <textarea
                      value={sectionData.summary || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'summary', e.target.value)}
                      rows={2}
                      placeholder="resumo de apresentação da criadora..."
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      biografia completa / trajetória (parágrafos separados por linha dupla)
                    </label>
                    <textarea
                      value={typeof sectionData.bio === 'string' ? sectionData.bio : (Array.isArray(sectionData.bio) ? sectionData.bio.join('\n\n') : '')}
                      onChange={(e) => handleSectionChange(sec.key, 'bio', e.target.value)}
                      rows={6}
                      placeholder="digite a trajetória completa da criadora..."
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase"
                    />
                  </div>
                </div>
              )}

              {/* CAMPOS ESPECÍFICOS DO BANCO GLOBAL DE DEPOIMENTOS (testimonials_pool) */}
              {selectedPageSlug === 'testimonials_pool' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-papelKraft/30">
                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      autor(a) do depoimento
                    </label>
                    <input
                      type="text"
                      value={sectionData.author || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'author', e.target.value)}
                      placeholder="ex: bárbara alcântara (babi)"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      cargo / programa vivenciado / tag
                    </label>
                    <input
                      type="text"
                      value={sectionData.role || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'role', e.target.value)}
                      placeholder="ex: café com letras & ciclo"
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                      depoimento / citação poética (quote)
                    </label>
                    <textarea
                      value={sectionData.quote || ''}
                      onChange={(e) => handleSectionChange(sec.key, 'quote', e.target.value)}
                      rows={3}
                      placeholder="escreva o depoimento real da participante..."
                      className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase"
                    />
                  </div>
                </div>
              )}

              {/* FOTO E BOTÕES (SE APLICÁVEL) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-papelKraft/30">
                
                {/* GERENCIAMENTO DA IMAGEM DA SEÇÃO */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">
                      foto da seção
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePickerSecKey(sec.key);
                        setIsPickerOpen(true);
                      }}
                      className="px-3 py-1 rounded-xl bg-acentoAzul/10 hover:bg-acentoAzul hover:text-white text-acentoAzul text-xs font-bold font-corpo lowercase transition cursor-pointer flex items-center gap-1"
                    >
                      <Grid className="w-3.5 h-3.5" />
                      <span>escolher da galeria</span>
                    </button>
                  </div>

                  {sectionData.image_url ? (
                    <div className="relative rounded-2xl overflow-hidden border border-papelKraft/40 max-h-48 group">
                      <img
                        src={sectionData.image_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-tintaCarvao/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setActivePickerSecKey(sec.key);
                            setIsPickerOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-acentoTerracota text-white font-bold text-xs cursor-pointer lowercase"
                        >
                          galeria
                        </button>
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
                    <div className="space-y-2">
                      <label className="border border-dashed border-papelKraft/60 rounded-2xl p-4 text-center cursor-pointer hover:border-acentoAzul block bg-bgPlataforma">
                        <Upload className="w-5 h-5 text-acentoAzul/50 mx-auto mb-1" />
                        <span className="text-xs font-bold font-corpo text-acentoAzul lowercase block">
                          {uploadingImage === sec.key ? 'enviando foto...' : '+ fazer upload de foto'}
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
                    </div>
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

      {/* MODAL DE SELEÇÃO DE MÍDIA DA GALERIA */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectUrl={(url) => {
          if (activePickerSecKey) {
            handleSectionChange(activePickerSecKey, 'image_url', url);
          }
        }}
      />

    </div>
  );
}
