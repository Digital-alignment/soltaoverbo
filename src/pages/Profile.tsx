import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import LoadingPage from '../components/LoadingPage';
import ImageCropModal from '../components/ImageCropModal';
import PoeticCertificateModal from '../components/PoeticCertificateModal';
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
  BookOpen,
  Feather,
  Flame,
  Award,
  Sparkles,
  Heart,
  MessageSquare,
  Quote,
  FileText,
  Calendar,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import { getWordPreview, stripHtmlTags } from '../utils/textProcessing';
import type { Database } from '../lib/database.types';

type UserProfile = Database['public']['Tables']['users_profiles']['Row'];
type CommunityPost = Database['public']['Tables']['community_posts']['Row'] & {
  writing_exercise: Database['public']['Tables']['writing_exercises']['Row'];
};
type WritingExercise = Database['public']['Tables']['writing_exercises']['Row'];

interface SavedQuote {
  id: string;
  text: string;
  lessonTitle: string;
  createdAt: string;
}

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

  // ABAS DO PORTFÓLIO: 'fogueira' | 'rascunhos' | 'citacoes' | 'certificados'
  const [activeTab, setActiveTab] = useState<'fogueira' | 'rascunhos' | 'citacoes' | 'certificados'>('fogueira');

  // DADOS DO PORTFÓLIO & ESTATÍSTICAS
  const [userPosts, setUserPosts] = useState<CommunityPost[]>([]);
  const [userDrafts, setUserDrafts] = useState<WritingExercise[]>([]);
  const [userQuotes, setUserQuotes] = useState<SavedQuote[]>([]);
  const [stats, setStats] = useState({
    totalWords: 0,
    fogueiraCount: 0,
    completedLessons: 0,
    streakDays: 5,
  });

  // MODAL DE CERTIFICADO POÉTICO
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  const [formData, setFormData] = useState({
    display_name: '',
    bio: '',
    instagram_url: '',
    linkedin_url: '',
    substack_url: '',
    email_public: '',
  });

  const isOwnProfile = !userId || userId === currentUserProfile?.id;

  useEffect(() => {
    loadProfileAndPortfolio();
  }, [userId, currentUserProfile]);

  const loadProfileAndPortfolio = async () => {
    try {
      const targetUserId = userId || currentUserProfile?.id;
      if (!targetUserId) return;

      // 1. Carregar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('users_profiles')
        .select('*')
        .eq('id', targetUserId)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);
      setFormData({
        display_name: profileData.display_name,
        bio: profileData.bio || '',
        instagram_url: profileData.instagram_url || '',
        linkedin_url: profileData.linkedin_url || '',
        substack_url: profileData.substack_url || '',
        email_public: profileData.email_public || '',
      });

      // 2. Carregar rascunhos e calcular palavras escritas
      const { data: exercisesData } = await supabase
        .from('writing_exercises')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false });

      if (exercisesData) {
        setUserDrafts(exercisesData);
        let words = 0;
        exercisesData.forEach((ex) => {
          const plain = stripHtmlTags(ex.content || '');
          words += plain.trim().split(/\s+/).filter((w) => w.length > 0).length;
        });
        setStats((prev) => ({ ...prev, totalWords: words }));
      }

      // 3. Carregar obras partilhadas na Fogueira
      const { data: postsData } = await supabase
        .from('community_posts')
        .select(`
          *,
          writing_exercise:writing_exercises(*)
        `)
        .eq('user_id', targetUserId)
        .eq('hidden_from_fogueira', false)
        .order('published_at', { ascending: false });

      if (postsData) {
        setUserPosts(postsData as CommunityPost[]);
        setStats((prev) => ({ ...prev, fogueiraCount: postsData.length }));
      }

      // 4. Carregar citações guardadas do localStorage
      const courseId = 'e9b442b1-2043-4985-80ae-6265ddeb047b';
      const rawQuotes = localStorage.getItem(`soltaoverbo_quotes_${courseId}`);
      if (rawQuotes) {
        try {
          setUserQuotes(JSON.parse(rawQuotes));
        } catch (e) {
          console.error(e);
        }
      }

      // 5. Carregar leções concluídas (do localStorage)
      const savedCompleted = localStorage.getItem('soltaoverbo_completed_lessons');
      if (savedCompleted) {
        try {
          const parsed = JSON.parse(savedCompleted);
          setStats((prev) => ({ ...prev, completedLessons: parsed.length }));
        } catch (e) {
          console.error(e);
        }
      } else {
        setStats((prev) => ({ ...prev, completedLessons: 5 }));
      }
    } catch (error) {
      console.error('erro ao carregar perfil:', error);
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
      await loadProfileAndPortfolio();
    } catch (error) {
      console.error('erro ao salvar perfil:', error);
      alert('erro ao salvar perfil. tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('por favor, selecione apenas imagens.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('a imagem deve ter no máximo 5MB.');
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

    setUploading(true);
    try {
      if (profile?.profile_picture_url) {
        const oldFileName = profile.profile_picture_url.split('/').pop()?.split('?')[0];
        if (oldFileName) {
          await supabase.storage
            .from('profile-pictures')
            .remove([`${currentUserProfile.id}/${oldFileName}`]);
        }
      }

      const fileName = `avatar-${Date.now()}.jpg`;
      const filePath = `${currentUserProfile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, croppedImageBlob, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      await supabase
        .from('users_profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('id', currentUserProfile.id);

      await loadProfileAndPortfolio();
      setImageToCrop(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      console.error('erro ao fazer upload:', error);
      alert('erro ao atualizar foto de perfil.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!currentUserProfile || !profile?.profile_picture_url) return;
    if (!confirm('tem certeza que deseja remover sua foto de perfil?')) return;

    setUploading(true);
    try {
      const fileName = profile.profile_picture_url.split('/').pop()?.split('?')[0];
      if (fileName) {
        await supabase.storage
          .from('profile-pictures')
          .remove([`${currentUserProfile.id}/${fileName}`]);
      }

      await supabase
        .from('users_profiles')
        .update({ profile_picture_url: null })
        .eq('id', currentUserProfile.id);

      await loadProfileAndPortfolio();
    } catch (error) {
      console.error('erro ao remover foto:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-bgPlataforma text-tintaCarvao flex items-center justify-center p-4">
        <div className="bg-papelClaro p-8 rounded-3xl border border-papelKraft/40 text-center max-w-md">
          <h2 className="text-xl font-editorial font-bold text-acentoAzul lowercase">perfil não encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8 pb-28 lg:pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 lg:pl-28">
        
        {/* CABEÇALHO EDITORIAL: portfólio poético */}
        <div className="flex items-center justify-between border-b border-papelKraft/40 pb-4">
          <div className="space-y-0.5">
            <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
              portfólio poético
            </h1>
            <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
              seu acervo de voz, escritas e presença na comunidade
            </p>
          </div>

          {isOwnProfile && (
            <div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4.5 py-2 rounded-2xl bg-white hover:bg-papelKraft/25 text-acentoAzul border border-papelKraft/40 text-xs font-bold font-corpo lowercase transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>editar perfil</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
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
                    className="px-3.5 py-2 rounded-xl bg-white text-tintaCarvao/70 hover:bg-papelKraft/20 text-xs font-corpo lowercase transition-colors cursor-pointer border border-papelKraft/40"
                  >
                    cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[19px] lowercase transition-colors cursor-pointer shadow-xs flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'salvando...' : 'salvar'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CARTÃO BIO EDITORIAL DA ALUNA */}
        <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            
            {/* Foto de Perfil + Informações */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              
              {/* Foto com Crop Trigger */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-white text-3xl font-bold border-2 border-papelKraft/60 overflow-hidden bg-acentoAzul shadow-xs">
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
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-tintaCarvao/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Camera className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-corpo lowercase">
                        {uploading ? 'enviando...' : 'alterar foto'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Informações do Perfil */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="font-editorial font-bold text-2xl sm:text-3xl text-acentoAzul lowercase leading-tight">
                    {profile.display_name}
                  </h2>
                  <span className="px-3 py-1 rounded-full bg-acentoAzul text-white text-[11px] font-bold font-corpo lowercase">
                    {profile.role === 'admin' ? 'administradora' : profile.role === 'paid' ? 'aluna premium' : 'aluna coletivo'}
                  </span>
                </div>

                {profile.bio ? (
                  <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/85 leading-relaxed lowercase max-w-2xl">
                    "{profile.bio}"
                  </p>
                ) : (
                  <p className="text-xs font-editorial italic text-tintaCarvao/50 lowercase">
                    sem biografia definida. clique em editar perfil para adicionar.
                  </p>
                )}

                {/* Badges de Links Sociais */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {profile.substack_url && (
                    <a
                      href={profile.substack_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl bg-white hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3 text-acentoTerracota" />
                      <span>substack</span>
                    </a>
                  )}

                  {profile.instagram_url && (
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl bg-white hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors"
                    >
                      <Instagram className="w-3 h-3 text-acentoTerracota" />
                      <span>instagram</span>
                    </a>
                  )}

                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-xl bg-white hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors"
                    >
                      <Linkedin className="w-3 h-3 text-acentoTerracota" />
                      <span>linkedin</span>
                    </a>
                  )}

                  {profile.email_public && (
                    <a
                      href={`mailto:${profile.email_public}`}
                      className="px-3 py-1 rounded-xl bg-white hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 text-[11px] font-corpo lowercase flex items-center gap-1 transition-colors"
                    >
                      <Mail className="w-3 h-3 text-acentoTerracota" />
                      <span>{profile.email_public}</span>
                    </a>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* MODO EDIÇÃO DO PERFIL */}
          {isOwnProfile && isEditing && (
            <div className="pt-6 border-t border-papelKraft/40 space-y-4 animate-fadeIn">
              {profile.profile_picture_url && (
                <div className="flex justify-start">
                  <button
                    onClick={handleDeleteProfilePicture}
                    disabled={uploading}
                    className="text-xs text-red-600 hover:underline font-corpo lowercase flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>remover foto de perfil</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                    nome de exibição
                  </label>
                  <input
                    type="text"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                    e-mail público de contato
                  </label>
                  <input
                    type="email"
                    value={formData.email_public}
                    onChange={(e) => setFormData({ ...formData, email_public: e.target.value })}
                    placeholder="seu@email.com"
                    className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                  biografia autoral
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  placeholder="escreva uma breve apresentação sobre sua jornada com as palavras..."
                  className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                    substack
                  </label>
                  <input
                    type="url"
                    value={formData.substack_url}
                    onChange={(e) => setFormData({ ...formData, substack_url: e.target.value })}
                    placeholder="https://suanewsletter.substack.com"
                    className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                    instagram
                  </label>
                  <input
                    type="url"
                    value={formData.instagram_url}
                    onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/seuusuario"
                    className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                    linkedin
                  </label>
                  <input
                    type="url"
                    value={formData.linkedin_url}
                    onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                    placeholder="https://linkedin.com/in/seuusuario"
                    className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BLOCOS DE MÉTRICAS DO RITUAL (RITUAL STATS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
            <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
              palavras escritas
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoAzul">
                {stats.totalWords}
              </span>
              <span className="text-[10px] text-tintaCarvao/50 font-corpo">palavras</span>
            </div>
          </div>

          <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
            <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
              obras na fogueira
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoTerracota">
                {stats.fogueiraCount}
              </span>
              <span className="text-[10px] text-tintaCarvao/50 font-corpo">partilhas</span>
            </div>
          </div>

          <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
            <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
              leções concluídas
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoAzul">
                {stats.completedLessons}
              </span>
              <span className="text-[10px] text-tintaCarvao/50 font-corpo">aulas</span>
            </div>
          </div>

          <div className="bg-papelClaro p-4 sm:p-5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
            <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
              sequência poética
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-gesto font-normal text-2xl sm:text-3xl text-acentoOliva">
                {stats.streakDays}
              </span>
              <span className="text-[10px] text-tintaCarvao/50 font-corpo">dias seguidos</span>
            </div>
          </div>
        </div>

        {/* ABAS DO PORTFÓLIO: obras na fogueira | meus rascunhos | citação | certificados */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-papelKraft/40 pb-2">
            <button
              onClick={() => setActiveTab('fogueira')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'fogueira'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              obras na fogueira ({userPosts.length})
            </button>

            <button
              onClick={() => setActiveTab('rascunhos')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'rascunhos'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              meus rascunhos & notas ({userDrafts.length})
            </button>

            <button
              onClick={() => setActiveTab('citacoes')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'citacoes'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              coleção de citações ({userQuotes.length})
            </button>

            <button
              onClick={() => setActiveTab('certificados')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-corpo lowercase transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'certificados'
                  ? 'bg-acentoTerracota text-white shadow-xs'
                  : 'bg-white/80 text-acentoTerracota hover:text-acentoTerracota/90 border border-papelKraft/40'
              }`}
            >
              certificados poéticos
            </button>
          </div>

          {/* CONTEÚDO DA ABA 1: OBRAS NA FOGUEIRA */}
          {activeTab === 'fogueira' && (
            <div className="space-y-4">
              {userPosts.length === 0 ? (
                <div className="bg-papelClaro p-8 rounded-3xl border border-papelKraft/40 text-center space-y-3">
                  <Flame className="w-10 h-10 text-acentoTerracota/60 mx-auto" />
                  <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
                    você ainda não partilhou nenhum texto na fogueira.
                  </p>
                  <Link
                    to="/exercises?new=true"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-acentoTerracota text-white font-gesto text-[18px] lowercase"
                  >
                    <Feather className="w-4 h-4" />
                    <span>escrever e partilhar</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-3 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-tintaCarvao/50 font-corpo">
                          <span>{new Date(post.published_at).toLocaleDateString('pt-BR')}</span>
                          <span className="text-acentoAzul font-bold">fogueira</span>
                        </div>

                        <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase leading-tight">
                          “{post.writing_exercise?.title}”
                        </h3>

                        <p className="text-xs font-corpo text-tintaCarvao/80 leading-relaxed lowercase italic bg-white p-3 rounded-xl border border-papelKraft/30">
                          "{getWordPreview(post.writing_exercise?.content || '', 25)}"
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-papelKraft/30 text-xs font-corpo text-tintaCarvao/60">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                          <span>{post.likes_count} curtidas</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-acentoAzul" />
                          <span>{post.comments_count} comentários</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTEÚDO DA ABA 2: MEUS RASCUNHOS & NOTAS */}
          {activeTab === 'rascunhos' && (
            <div className="space-y-4">
              {userDrafts.length === 0 ? (
                <div className="bg-papelClaro p-8 rounded-3xl border border-papelKraft/40 text-center space-y-3">
                  <FileText className="w-10 h-10 text-acentoAzul/60 mx-auto" />
                  <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
                    nenhum rascunho salvo no seu atelier ainda.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userDrafts.map((draft) => (
                    <div
                      key={draft.id}
                      className="bg-papelClaro p-5 rounded-2xl border border-papelKraft/40 space-y-3 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] text-tintaCarvao/50 font-corpo">
                          <span>{new Date(draft.created_at).toLocaleDateString('pt-BR')}</span>
                          <span className="text-acentoTerracota font-bold">rascunho</span>
                        </div>

                        <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase leading-tight">
                          {draft.title}
                        </h3>

                        <p className="text-xs font-corpo text-tintaCarvao/80 leading-relaxed lowercase bg-white p-3 rounded-xl border border-papelKraft/30">
                          {getWordPreview(draft.content || '', 25)}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-papelKraft/30 flex justify-end">
                        <Link
                          to="/exercises"
                          className="text-xs font-bold font-corpo text-acentoTerracota hover:underline lowercase flex items-center gap-1"
                        >
                          <span>abrir no atelier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTEÚDO DA ABA 3: COLEÇÃO DE CITAÇÕES */}
          {activeTab === 'citacoes' && (
            <div className="space-y-4">
              {userQuotes.length === 0 ? (
                <div className="bg-papelClaro p-8 rounded-3xl border border-papelKraft/40 text-center space-y-3">
                  <Quote className="w-10 h-10 text-acentoTerracota/60 mx-auto" />
                  <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
                    nenhuma citação guardada ainda. selecione qualquer trecho durante as aulas para guardar no acervo!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userQuotes.map((q) => (
                    <div
                      key={q.id}
                      className="bg-white p-5 rounded-2xl border border-papelKraft/40 space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-tintaCarvao/50 font-corpo">
                        <span className="font-bold text-acentoAzul lowercase">{q.lessonTitle}</span>
                        <span>{q.createdAt}</span>
                      </div>
                      <p className="text-xs font-corpo text-tintaCarvao/90 leading-relaxed lowercase italic border-l-2 border-acentoTerracota pl-3">
                        “{q.text}”
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTEÚDO DA ABA 4: CERTIFICADOS POÉTICOS */}
          {activeTab === 'certificados' && (
            <div className="bg-papelClaro p-6 sm:p-8 rounded-3xl border border-papelKraft/40 space-y-4 text-center max-w-xl mx-auto shadow-kraft">
              <Award className="w-12 h-12 text-acentoTerracota mx-auto" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                  oficina 21 dias de escrita autoral
                </h3>
                <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/75 lowercase">
                  seu certificado de presença, dedicação e conclução do ritual diário de escrita está disponível.
                </p>
              </div>

              <button
                onClick={() => setShowCertificateModal(true)}
                className="px-6 py-3 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[22px] lowercase shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-5 h-5 text-white" />
                <span>ver meu certificado poético</span>
              </button>
            </div>
          )}

        </div>

      </div>

      {/* MODAL DO CERTIFICADO POÉTICO DE CONCLUSÃO */}
      <PoeticCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        studentName={profile.display_name}
      />

      {/* MODAL DE CORTE DE IMAGEM DE PERFIL */}
      {imageToCrop && (
        <ImageCropModal
          imageSrc={imageToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => setImageToCrop(null)}
        />
      )}
    </div>
  );
}
