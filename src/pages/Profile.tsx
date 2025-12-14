import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import ImageCropModal from '../components/ImageCropModal';
import InstallPromptPopup from '../components/InstallPromptPopup';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import {
  User,
  Edit,
  Instagram,
  Linkedin,
  Mail,
  ExternalLink,
  Save,
  Camera,
  Trash2,
  Smartphone,
} from 'lucide-react';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users_profiles']['Row'];

export default function Profile() {
  const { userId } = useParams();
  const { profile: currentUserProfile, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    instagram_url: '',
    linkedin_url: '',
    substack_url: '',
    email_public: '',
  });

  const isOwnProfile = !userId || userId === currentUserProfile?.id;
  const { isInstalled, triggerInstallPrompt, showPrompt: showManualPrompt, isIOS, isAndroid, handleInstall, handleDismiss } = useInstallPrompt();

  useEffect(() => {
    loadProfile();
  }, [userId, currentUserProfile]);

  const loadProfile = async () => {
    try {
      const targetUserId = userId || currentUserProfile?.id;
      if (!targetUserId) return;

      const { data, error } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        display_name: data.display_name,
        bio: data.bio || '',
        instagram_url: data.instagram_url || '',
        linkedin_url: data.linkedin_url || '',
        substack_url: data.substack_url || '',
        email_public: data.email_public || '',
      });
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!isOwnProfile || !currentUserProfile) return;

    setSaving(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas imagens.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!currentUserProfile) return;

    const sizeInKB = Math.round(croppedImageBlob.size / 1024);
    console.log(`Starting upload: ${sizeInKB}KB image for user ${currentUserProfile.id}`);

    setUploading(true);
    try {
      if (profile?.profile_picture_url) {
        const oldFileName = profile.profile_picture_url.split('/').pop()?.split('?')[0];
        if (oldFileName) {
          console.log(`Removing old profile picture: ${oldFileName}`);
          const { error: deleteError } = await supabase.storage
            .from('profile-pictures')
            .remove([`${currentUserProfile.id}/${oldFileName}`]);

          if (deleteError) {
            console.warn('Failed to delete old image:', deleteError);
          }
        }
      }

      const fileName = `avatar-${Date.now()}.jpg`;
      const filePath = `${currentUserProfile.id}/${fileName}`;

      console.log(`Uploading to: ${filePath}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, croppedImageBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error('Upload error details:', {
          message: uploadError.message,
          statusCode: uploadError.statusCode,
          error: uploadError,
        });
        throw new Error(`Falha no upload: ${uploadError.message}`);
      }

      console.log('Upload successful:', uploadData);

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      console.log(`Public URL: ${publicUrl}`);

      const { error: updateError } = await supabase
        .from('users_profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', currentUserProfile.id);

      if (updateError) {
        console.error('Database update error:', updateError);
        throw new Error(`Falha ao atualizar perfil: ${updateError.message}`);
      }

      console.log('Profile updated successfully');
      await loadProfile();
      setImageToCrop(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('Erro completo ao fazer upload:', error);
      const errorMessage = error?.message || 'Erro desconhecido';
      alert(`Erro ao fazer upload da foto: ${errorMessage}\n\nVerifique o console para mais detalhes.`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!currentUserProfile || !profile?.profile_picture_url) return;

    if (!confirm('Tem certeza que deseja remover sua foto de perfil?')) return;

    setUploading(true);
    try {
      const fileName = profile.profile_picture_url.split('/').pop()?.split('?')[0];
      if (fileName) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`${currentUserProfile.id}/${fileName}`]);
      }

      const { error } = await supabase
        .from('users_profiles')
        .update({ profile_picture_url: null })
        .eq('id', currentUserProfile.id);

      if (error) throw error;

      await loadProfile();
    } catch (error) {
      console.error('Erro ao remover foto:', error);
      alert('Erro ao remover foto. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-paper">
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">Perfil não encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0e6d1' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 h-32"></div>

          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-16 mb-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl border-4 border-white overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500">
                  {profile.profile_picture_url ? (
                    <img
                      src={`${profile.profile_picture_url}?v=${Date.now()}`}
                      alt={profile.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    profile.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                {isOwnProfile && isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={uploading}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-32 h-32 rounded-full bg-black bg-opacity-50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    >
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-xs font-medium">
                        {uploading ? 'Enviando...' : profile.profile_picture_url ? 'Alterar' : 'Adicionar'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {isOwnProfile && (
                <div className="mt-4 sm:mt-0 sm:ml-auto">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar Perfil
                    </button>
                  ) : (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            display_name: profile.display_name,
                            bio: profile.bio || '',
                            instagram_url: profile.instagram_url || '',
                            linkedin_url: profile.linkedin_url || '',
                            substack_url: profile.substack_url || '',
                            email_public: profile.email_public || '',
                          });
                        }}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {profile.profile_picture_url && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleDeleteProfilePicture}
                      disabled={uploading}
                      className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remover foto de perfil
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome de exibição
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) =>
                      setFormData({ ...formData, display_name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                    placeholder="Conte um pouco sobre você..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="url"
                      value={formData.instagram_url}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram_url: e.target.value })
                      }
                      placeholder="https://instagram.com/..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin_url}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin_url: e.target.value })
                      }
                      placeholder="https://linkedin.com/in/..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Substack
                    </label>
                    <input
                      type="url"
                      value={formData.substack_url}
                      onChange={(e) =>
                        setFormData({ ...formData, substack_url: e.target.value })
                      }
                      placeholder="https://seunome.substack.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail público
                    </label>
                    <input
                      type="email"
                      value={formData.email_public}
                      onChange={(e) =>
                        setFormData({ ...formData, email_public: e.target.value })
                      }
                      placeholder="seu@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profile.display_name}
                  </h1>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      profile.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : profile.role === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {profile.role === 'admin'
                      ? 'Administrador'
                      : profile.role === 'paid'
                      ? 'Membro Premium'
                      : 'Membro Gratuito'}
                  </span>
                </div>

                {profile.bio && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Sobre</h3>
                    <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {(profile.instagram_url ||
                  profile.linkedin_url ||
                  profile.substack_url ||
                  profile.email_public) && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Links</h3>
                    <div className="space-y-2">
                      {profile.instagram_url && (
                        <a
                          href={profile.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-amber-600 transition group"
                        >
                          <Instagram className="w-5 h-5 mr-3 text-pink-600" />
                          <span className="group-hover:underline">Instagram</span>
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition" />
                        </a>
                      )}

                      {profile.linkedin_url && (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-amber-600 transition group"
                        >
                          <Linkedin className="w-5 h-5 mr-3 text-blue-600" />
                          <span className="group-hover:underline">LinkedIn</span>
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition" />
                        </a>
                      )}

                      {profile.substack_url && (
                        <a
                          href={profile.substack_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-gray-700 hover:text-amber-600 transition group"
                        >
                          <User className="w-5 h-5 mr-3 text-orange-600" />
                          <span className="group-hover:underline">Substack</span>
                          <ExternalLink className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition" />
                        </a>
                      )}

                      {profile.email_public && (
                        <a
                          href={`mailto:${profile.email_public}`}
                          className="flex items-center text-gray-700 hover:text-amber-600 transition group"
                        >
                          <Mail className="w-5 h-5 mr-3 text-gray-600" />
                          <span className="group-hover:underline">{profile.email_public}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {isOwnProfile && !isInstalled && !isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={triggerInstallPrompt}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white rounded-lg font-medium transition-all shadow-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Instalar app no seu dispositivo</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {imageToCrop && (
        <ImageCropModal
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => {
            setImageToCrop(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
          }}
        />
      )}

      {showManualPrompt && (
        <InstallPromptPopup
          onInstall={handleInstall}
          onDismiss={handleDismiss}
          isIOS={isIOS}
          isAndroid={isAndroid}
        />
      )}
    </div>
  );
}
