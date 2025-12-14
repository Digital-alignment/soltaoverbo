import { useState, useEffect } from 'react';
import { Image, Plus, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Link as LinkIcon, Users } from 'lucide-react';
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
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (banners.length >= 3) {
      alert('Máximo de 3 banners permitido. Exclua um banner existente primeiro.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie apenas imagens.');
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('banners')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('banners')
        .getPublicUrl(fileName);

      const nextOrder = banners.length + 1;

      const { error: insertError } = await supabase
        .from('banners')
        .insert([{
          image_url: publicUrl,
          display_order: nextOrder,
          is_active: true,
          visible_to_roles: ['free', 'paid', 'admin'],
        }]);

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }

      await fetchBanners();
      event.target.value = '';
      alert('Banner enviado com sucesso!');
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert(`Erro ao fazer upload do banner: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ is_active: !banner.is_active, updated_at: new Date().toISOString() })
        .eq('id', banner.id);

      if (error) throw error;
      await fetchBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
    }
  };

  const deleteBanner = async (banner: Banner) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return;

    try {
      const fileName = banner.image_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('banners')
          .remove([fileName]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }

      const { error: deleteError } = await supabase
        .from('banners')
        .delete()
        .eq('id', banner.id);

      if (deleteError) throw deleteError;

      const remainingBanners = banners.filter(b => b.id !== banner.id);
      for (let i = 0; i < remainingBanners.length; i++) {
        await supabase
          .from('banners')
          .update({ display_order: i + 1 })
          .eq('id', remainingBanners[i].id);
      }

      await fetchBanners();
      alert('Banner excluído com sucesso!');
    } catch (error) {
      console.error('Error deleting banner:', error);
      alert(`Erro ao excluir banner: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const reorderBanner = async (banner: Banner, direction: 'up' | 'down') => {
    const currentIndex = banners.findIndex(b => b.id === banner.id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === banners.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
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
      console.error('Error reordering banners:', error);
    }
  };

  const updateBannerButton = async () => {
    if (!editingBanner) return;

    try {
      const { error } = await supabase
        .from('banners')
        .update({
          button_text: buttonText || null,
          button_link: buttonLink || null,
          link_url: linkUrl || null,
          visible_to_roles: visibleToRoles,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingBanner.id);

      if (error) throw error;

      await fetchBanners();
      setEditingBanner(null);
      setButtonText('');
      setButtonLink('');
      setLinkUrl('');
      setVisibleToRoles(['free', 'paid', 'admin']);
    } catch (error) {
      console.error('Error updating banner button:', error);
      alert('Erro ao atualizar botão do banner.');
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
    if (roles.length === 3) return 'Todos os usuários';
    if (roles.length === 0) return 'Ninguém';
    const labels = {
      free: 'Gratuitos',
      paid: 'Premium',
      admin: 'Admins'
    };
    return roles.map(r => labels[r as keyof typeof labels]).join(', ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Image className="w-6 h-6 mr-2 text-amber-600" />
          Gerenciar Banners da Home
        </h2>
        <div className="text-sm text-gray-600">
          {banners.length}/3 banners
        </div>
      </div>

      {banners.length < 3 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-amber-500 transition">
          <input
            type="file"
            id="banner-upload"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <label
            htmlFor="banner-upload"
            className={`cursor-pointer ${uploading ? 'opacity-50' : ''}`}
          >
            <Plus className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              {uploading ? 'Enviando...' : 'Clique para adicionar novo banner'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Recomendado: 1920x600px (PNG ou JPG)
            </p>
          </label>
        </div>
      )}

      <div className="space-y-4">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={`${banner.image_url}?v=${Date.now()}`}
                  alt={`Banner ${banner.display_order}`}
                  className="w-full h-full object-cover"
                />
                {!banner.is_active && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-medium text-sm">Inativo</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Banner {banner.display_order}</h3>
                    {banner.button_text && banner.button_link && (
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <LinkIcon className="w-3 h-3 mr-1" />
                        Botão: {banner.button_text}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Users className="w-3 h-3 mr-1" />
                      Visível: {getRoleLabel(banner.visible_to_roles || ['free', 'paid', 'admin'])}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => reorderBanner(banner, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ArrowUp className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => reorderBanner(banner, 'down')}
                      disabled={index === banners.length - 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    >
                      <ArrowDown className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:flex sm:flex-row gap-2">
                  <button
                    onClick={() => {
                      setEditingBanner(banner);
                      setButtonText(banner.button_text || '');
                      setButtonLink(banner.button_link || '');
                      setLinkUrl(banner.link_url || '');
                      setVisibleToRoles(banner.visible_to_roles || ['free', 'paid', 'admin']);
                    }}
                    className="flex items-center justify-center sm:px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition text-xs sm:text-sm"
                  >
                    <LinkIcon className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Editar</span>
                  </button>
                  <button
                    onClick={() => toggleActive(banner)}
                    className={`flex items-center justify-center sm:px-3 py-1.5 rounded-lg transition text-xs sm:text-sm ${
                      banner.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {banner.is_active ? (
                      <>
                        <Eye className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Ativo</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 sm:mr-1" />
                        <span className="hidden sm:inline">Inativo</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteBanner(banner)}
                    className="flex items-center justify-center sm:px-3 py-1.5 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition text-xs sm:text-sm"
                  >
                    <Trash2 className="w-4 h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-deepBlue mb-4">
              Editar Banner {editingBanner.display_order}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-darkNeutral mb-2">
                  Visível para
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleToRoles.includes('free')}
                      onChange={() => toggleRole('free')}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-darkNeutral">Usuários Gratuitos</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleToRoles.includes('paid')}
                      onChange={() => toggleRole('paid')}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-darkNeutral">Usuários Premium</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleToRoles.includes('admin')}
                      onChange={() => toggleRole('admin')}
                      className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm text-darkNeutral">Administradores</span>
                  </label>
                </div>
                <p className="text-xs text-darkNeutral/60 mt-2">
                  Selecione os tipos de usuário que poderão ver este banner
                </p>
              </div>

              <div className="border-t border-darkNeutral/10 pt-4"></div>
              <div>
                <label className="block text-sm font-medium text-darkNeutral mb-2">
                  Link do Banner Completo (opcional)
                </label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Ex: /programs ou https://example.com"
                  className="input-field"
                />
                <p className="text-xs text-darkNeutral/60 mt-1">
                  Se preenchido, o banner inteiro será clicável
                </p>
              </div>

              <div className="border-t border-darkNeutral/10 pt-4">
                <p className="text-sm font-medium text-darkNeutral mb-3">
                  Ou adicione apenas um botão:
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-darkNeutral mb-2">
                      Texto do Botão (opcional)
                    </label>
                    <input
                      type="text"
                      value={buttonText}
                      onChange={(e) => setButtonText(e.target.value)}
                      placeholder="Ex: Saiba Mais"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-darkNeutral mb-2">
                      Link do Botão (opcional)
                    </label>
                    <input
                      type="text"
                      value={buttonLink}
                      onChange={(e) => setButtonLink(e.target.value)}
                      placeholder="Ex: /dashboard"
                      className="input-field"
                    />
                    <p className="text-xs text-darkNeutral/60 mt-1">
                      Use caminhos internos (/dashboard) ou URLs completas (https://...)
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={updateBannerButton}
                  className="flex-1 btn-primary"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setButtonText('');
                    setButtonLink('');
                    setLinkUrl('');
                    setVisibleToRoles(['free', 'paid', 'admin']);
                  }}
                  className="flex-1 bg-darkNeutral/10 text-darkNeutral py-2 rounded-lg font-medium hover:bg-darkNeutral/20 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {banners.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">Nenhum banner cadastrado</p>
          <p className="text-sm text-gray-500">Adicione até 3 banners para o slider da home</p>
        </div>
      )}
    </div>
  );
}
