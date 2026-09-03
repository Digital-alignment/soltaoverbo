import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Megaphone, Send, Image as ImageIcon, Trash2, Users, Calendar, X, AlertCircle } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Broadcast = Database['public']['Tables']['admin_broadcasts']['Row'];

interface BroadcastWithStats extends Broadcast {
  recipient_count?: number;
  read_count?: number;
}

export default function BroadcastManagement() {
  const { profile } = useAuth();
  const [broadcasts, setBroadcasts] = useState<BroadcastWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string[]>(['free', 'paid']);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBroadcasts();
  }, []);

  const loadBroadcasts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_broadcasts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const broadcastsWithStats = await Promise.all(
        (data || []).map(async (broadcast) => {
          const { count: recipientCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('broadcast_id', broadcast.id);

          const { count: readCount } = await supabase
            .from('notifications')
            .select('*', { count: 'exact', head: true })
            .eq('broadcast_id', broadcast.id)
            .eq('is_read', true);

          return {
            ...broadcast,
            recipient_count: recipientCount || 0,
            read_count: readCount || 0,
          };
        })
      );

      setBroadcasts(broadcastsWithStats);
    } catch (err) {
      console.error('erro ao carregar broadcasts:', err);
      setError('erro ao carregar broadcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('imagem muito grande. tamanho máximo: 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('apenas arquivos de imagem são permitidos');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const toggleAudience = (role: string) => {
    if (targetAudience.includes(role)) {
      setTargetAudience(targetAudience.filter((r) => r !== role));
    } else {
      setTargetAudience([...targetAudience, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('título é obrigatório');
      return;
    }
    if (!message.trim()) {
      setError('mensagem é obrigatória');
      return;
    }
    if (targetAudience.length === 0) {
      setError('selecione pelo menos um público-alvo');
      return;
    }

    const confirmed = window.confirm(
      `enviar broadcast para ${getRoleLabels(targetAudience).join(', ')}?\n\nesta ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    setSubmitting(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `broadcast-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('banners')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { error: insertError } = await supabase
        .from('admin_broadcasts')
        .insert({
          title,
          message,
          image_url: imageUrl,
          target_audience: targetAudience,
          created_by: profile?.id,
        });

      if (insertError) throw insertError;

      setTitle('');
      setMessage('');
      setImageFile(null);
      setImagePreview('');
      setTargetAudience(['free', 'paid']);

      await loadBroadcasts();
      alert('broadcast enviado com sucesso!');
    } catch (err: any) {
      console.error('erro ao criar broadcast:', err);
      setError(err?.message || 'erro ao enviar broadcast. tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBroadcast = async (broadcastId: string) => {
    const confirmed = window.confirm('excluir este broadcast?');
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('admin_broadcasts')
        .update({ is_active: false })
        .eq('id', broadcastId);

      if (error) throw error;

      await loadBroadcasts();
    } catch (err) {
      console.error('erro ao excluir broadcast:', err);
    }
  };

  const getRoleLabels = (roles: string[]) => {
    const labels: Record<string, string> = {
      free: 'gratuitos',
      paid: 'premium',
      admin: 'administradores',
    };
    return roles.map((role) => labels[role] || role);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-papelKraft/30 pb-4">
        <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
          transmissões & broadcasts
        </h2>
        <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
          envio de avisos e notificações em tempo real para grupos de alunas
        </p>
      </div>

      {/* FORMULÁRIO DE ENVIO */}
      <form onSubmit={handleSubmit} className="bg-white p-5 sm:p-6 rounded-2xl border border-papelKraft/40 shadow-xs space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-corpo flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
            título da transmissão *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: nova aula gravada disponível na plataforma!"
            maxLength={200}
            className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
            mensagem da transmissão *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="digite o texto da notificação..."
            maxLength={2000}
            rows={3}
            className="w-full px-3.5 py-2 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul resize-none lowercase"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
            imagem da notificação (opcional)
          </label>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-papelKraft/40 max-h-48">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full hover:bg-red-700 transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <label className="border border-dashed border-papelKraft/60 rounded-xl p-4 text-center cursor-pointer hover:border-acentoAzul block bg-bgPlataforma">
              <ImageIcon className="w-8 h-8 text-acentoAzul/50 mx-auto mb-1" />
              <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">clique para selecionar uma imagem (até 5MB)</p>
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-acentoAzul mb-2 lowercase font-corpo">
            público-alvo *
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'free', label: 'alunas gratuitas' },
              { value: 'paid', label: 'alunas premium' },
              { value: 'admin', label: 'administradoras' },
            ].map((option) => {
              const checked = targetAudience.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggleAudience(option.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold font-corpo lowercase border cursor-pointer transition-all ${
                    checked
                      ? 'bg-acentoAzul text-white border-acentoAzul shadow-xs'
                      : 'bg-white text-tintaCarvao/70 border-papelKraft/40 hover:bg-papelKraft/20'
                  }`}
                >
                  {checked ? '✓ ' : ''}{option.label}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-2.5 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4 text-white" />
          <span>{submitting ? 'enviando...' : 'enviar broadcast'}</span>
        </button>
      </form>

      {/* HISTÓRICO DE BROADCASTS */}
      <div className="space-y-3">
        <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase border-b border-papelKraft/30 pb-2">
          broadcasts enviados
        </h3>

        {loading ? (
          <p className="text-xs font-corpo text-tintaCarvao/60 italic text-center py-6">carregando histórico...</p>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-2xl border border-papelKraft/30 space-y-2">
            <Megaphone className="w-8 h-8 text-tintaCarvao/30 mx-auto" />
            <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">nenhum broadcast enviado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broadcasts.filter((b) => b.is_active).map((broadcast) => (
              <div key={broadcast.id} className="bg-white rounded-2xl border border-papelKraft/40 p-4 shadow-xs space-y-2 flex flex-col justify-between">
                {broadcast.image_url && (
                  <img src={broadcast.image_url} alt={broadcast.title} className="w-full h-32 object-cover rounded-xl border border-papelKraft/30" />
                )}
                <div className="space-y-1">
                  <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">{broadcast.title}</h4>
                  <p className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2">{broadcast.message}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-papelKraft/30 text-[10px] font-corpo text-tintaCarvao/60">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-acentoAzul" />
                    <span>{broadcast.recipient_count} enviadas ({broadcast.read_count} lidas)</span>
                  </span>

                  <button
                    onClick={() => deleteBroadcast(broadcast.id)}
                    className="p-1 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer"
                    title="excluir broadcast"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
