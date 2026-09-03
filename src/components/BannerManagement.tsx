import { useState, useEffect } from 'react';
import { Image, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Link as LinkIcon, Users, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Banner {
  id: string;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  visible_to_roles: string[];
  created_at: string;
  updated_at: string;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [visibleToRoles, setVisibleToRoles] = useState<string[]>(['free', 'paid', 'admin']);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('erro ao buscar banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (banners.length >= 3) {
      alert('máximo de 3 banners permitido. exclua um banner existente primeiro.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('por favor, envie apenas imagens.');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `home-banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(filePath);

      const nextOrder = banners.length + 1;

      const { error: insertError } = await supabase
        .from('banners')
        .insert({
          image_url: publicUrl,
          display_order: nextOrder,
          is_active: true,
          visible_to_roles: ['free', 'paid', 'admin'],
        });

      if (insertError) throw insertError;

      await fetchBanners();
    } catch (error) {
      console.error('erro ao enviar banner:', error);
      alert('erro ao enviar banner. tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const deleteBanner = async (banner: Banner) => {
    if (!confirm(`tem certeza que deseja excluir o banner ${banner.display_order}?`)) {
      return;
    }

    try {
      const fileName = banner.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('banners')
          .remove([`home-banners/${fileName}`]);
      }

      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', banner.id);

      if (error) throw error;

      await fetchBanners();
    } catch (error) {
      console.error('erro ao excluir banner:', error);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({
          is_active: !banner.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', banner.id);

      if (error) throw error;
      await fetchBanners();
    } catch (error) {
      console.error('erro ao alterar status do banner:', error);
    }
  };

  const reorderBanner = async (banner: Banner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= banners.length) return;

    const targetBanner = banners[targetIndex];

    try {
      await supabase
        .from('banners')
        .update({ display_order: targetBanner.display_order })
        .eq('id', banner.id);

      await supabase
        .from('banners')
        .update({ display_order: banner.display_order })
        .eq('id', targetBanner.id);

      await fetchBanners();
    } catch (error) {
      console.error('erro ao reordenar banner:', error);
    }
  };

  const updateBannerButton = async () => {
    if (!editingBanner) return;

    try {
      const { error } = await supabase
        .from('banners')
        .update({
          button_text: buttonText.trim() || null,
          button_link: buttonLink.trim() || null,
          link_url: linkUrl.trim() || null,
          visible_to_roles: visibleToRoles,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingBanner.id);

      if (error) throw error;

      await fetchBanners();
      setEditingBanner(null);
    } catch (error) {
      console.error('erro ao atualizar banner:', error);
    }
  };

  const toggleRole = (role: string) => {
    setVisibleToRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const getRoleLabel = (roles: string[]) => {
    if (roles.length === 3) return 'todas as alunas';
    if (roles.length === 0) return 'ninguém';
    const labels = {
      free: 'gratuitas',
      paid: 'premium',
      admin: 'admins'
    };
    return roles.map(r => labels[r as keyof typeof labels]).join(', ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-papelKraft/30 pb-4">
        <div>
          <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            gerenciar banners da home
          </h2>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            configuração dos destaques visuais do carrossel principal
          </p>
        </div>
        <span className="text-xs font-bold font-corpo text-acentoAzul bg-acentoAzul/10 px-3 py-1 rounded-full lowercase">
          {banners.length}/3 banners ativos
        </span>
      </div>

      {banners.length < 3 && (
        <div className="border border-dashed border-papelKraft/60 rounded-2xl p-6 text-center hover:border-acentoAzul transition bg-white shadow-xs">
          <input
            type="file"
            id="banner-upload"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor="banner-upload" className="cursor-pointer block space-y-2">
            <Plus className="w-8 h-8 text-acentoAzul/50 mx-auto" />
            <p className="text-xs font-bold font-corpo text-acentoAzul lowercase">
              {uploading ? 'enviando...' : '+ adicionar novo banner'}
            </p>
            <p className="text-[10px] font-corpo text-tintaCarvao/50 lowercase">
              recomendado: 1920x600px (PNG ou JPG)
            </p>
          </label>
        </div>
      )}

      <div className="space-y-3">
        {banners.map((banner, index) => (
          <div key={banner.id} className="bg-white rounded-2xl border border-papelKraft/40 p-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 flex-1">
                <div className="w-32 h-20 rounded-xl overflow-hidden bg-bgPlataforma border border-papelKraft/30 shrink-0 relative">
                  <img src={`${banner.image_url}?v=${Date.now()}`} alt="" className="w-full h-full object-cover" />
                  {!banner.is_active && (
                    <div className="absolute inset-0 bg-tintaCarvao/60 flex items-center justify-center text-white text-[10px] font-bold font-corpo lowercase">
                      inativo
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                    banner #{banner.display_order}
                  </h3>
                  {banner.button_text && (
                    <p className="text-xs font-corpo text-tintaCarvao/75 lowercase flex items-center gap-1">
                      <LinkIcon className="w-3 h-3 text-acentoTerracota" />
                      <span>botão: "{banner.button_text}"</span>
                    </p>
                  )}
                  <p className="text-[11px] font-corpo text-tintaCarvao/50 lowercase flex items-center gap-1">
                    <Users className="w-3 h-3 text-acentoAzul" />
                    <span>visível para: {getRoleLabel(banner.visible_to_roles || ['free', 'paid', 'admin'])}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-center">
                <button
                  onClick={() => reorderBanner(banner, 'up')}
                  disabled={index === 0}
                  className="p-1.5 rounded-lg bg-papelClaro hover:bg-papelKraft/20 text-tintaCarvao/70 disabled:opacity-30 border border-papelKraft/30 transition cursor-pointer"
                  title="mover para cima"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => reorderBanner(banner, 'down')}
                  disabled={index === banners.length - 1}
                  className="p-1.5 rounded-lg bg-papelClaro hover:bg-papelKraft/20 text-tintaCarvao/70 disabled:opacity-30 border border-papelKraft/30 transition cursor-pointer"
                  title="mover para baixo"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setEditingBanner(banner);
                    setButtonText(banner.button_text || '');
                    setButtonLink(banner.button_link || '');
                    setLinkUrl(banner.link_url || '');
                    setVisibleToRoles(banner.visible_to_roles || ['free', 'paid', 'admin']);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 text-xs font-corpo lowercase transition cursor-pointer"
                >
                  editar
                </button>
                <button
                  onClick={() => toggleActive(banner)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-corpo lowercase border transition cursor-pointer ${
                    banner.is_active
                      ? 'bg-acentoOliva/20 text-acentoOliva border-acentoOliva/40'
                      : 'bg-papelKraft/20 text-tintaCarvao/60 border-papelKraft/40'
                  }`}
                >
                  {banner.is_active ? 'ativo' : 'inativo'}
                </button>
                <button
                  onClick={() => deleteBanner(banner)}
                  className="p-1.5 rounded-xl bg-papelClaro hover:bg-red-50 text-red-600 border border-papelKraft/40 transition cursor-pointer"
                  title="excluir banner"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL DE EDIÇÃO DO BANNER */}
      {editingBanner && (
        <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 p-6 shadow-kraft-lg max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-papelKraft/30 pb-2">
              <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase">
                editar banner #{editingBanner.display_order}
              </h3>
              <button onClick={() => setEditingBanner(null)} className="text-tintaCarvao/50 hover:text-tintaCarvao cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                  visível para
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'free', label: 'gratuitas' },
                    { value: 'paid', label: 'premium' },
                    { value: 'admin', label: 'admins' },
                  ].map((role) => {
                    const checked = visibleToRoles.includes(role.value);
                    return (
                      <button
                        key={role.value}
                        type="button"
                        onClick={() => toggleRole(role.value)}
                        className={`px-3 py-1 rounded-xl text-xs font-corpo lowercase border transition cursor-pointer ${
                          checked ? 'bg-acentoAzul text-white border-acentoAzul' : 'bg-white text-tintaCarvao/70 border-papelKraft/40'
                        }`}
                      >
                        {checked ? '✓ ' : ''}{role.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                  link do banner completo (opcional)
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="ex: /courses ou https://..."
                  className="w-full px-3 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                  texto do botão (opcional)
                </label>
                <input
                  type="text"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  placeholder="ex: conhecer oficinas →"
                  className="w-full px-3 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                  link do botão (opcional)
                </label>
                <input
                  type="text"
                  value={buttonLink}
                  onChange={(e) => setButtonLink(e.target.value)}
                  placeholder="ex: /courses"
                  className="w-full px-3 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-papelKraft/30">
              <button
                onClick={() => setEditingBanner(null)}
                className="flex-1 py-2 rounded-xl bg-white border border-papelKraft/40 text-tintaCarvao/70 text-xs font-corpo lowercase cursor-pointer"
              >
                cancelar
              </button>
              <button
                onClick={updateBannerButton}
                className="flex-1 py-2 rounded-xl bg-acentoTerracota text-white font-gesto text-[18px] lowercase shadow-xs cursor-pointer"
              >
                salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
