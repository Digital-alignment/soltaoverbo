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

  useEffect(() => {
    console.log('Current user profile:', profile);
    console.log('User role:', profile?.role);
  }, [profile]);

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

      if (error) {
        console.error('Error loading broadcasts:', error);
        throw error;
      }

      // Get recipient and read counts for each broadcast
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
      console.error('Error loading broadcasts:', err);
      setError('Erro ao carregar broadcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Imagem muito grande. Tamanho máximo: 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Apenas arquivos de imagem são permitidos');
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

    // Validation
    if (!title.trim()) {
      setError('Título é obrigatório');
      return;
    }
    if (!message.trim()) {
      setError('Mensagem é obrigatória');
      return;
    }
    if (targetAudience.length === 0) {
      setError('Selecione pelo menos um público-alvo');
      return;
    }

    const confirmed = window.confirm(
      `Enviar broadcast para ${getRoleLabels(targetAudience).join(', ')}?\n\nEsta ação não pode ser desfeita.`
    );

    if (!confirmed) return;

    setSubmitting(true);
    try {
      let imageUrl = null;

      // Upload image if present
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

      // Create broadcast
      const { error: insertError, data: insertedData } = await supabase
        .from('admin_broadcasts')
        .insert({
          title,
          message,
          image_url: imageUrl,
          target_audience: targetAudience,
          created_by: profile?.id,
        })
        .select();

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw new Error(insertError.message || 'Erro ao criar broadcast');
      }

      // Reset form
      setTitle('');
      setMessage('');
      setImageFile(null);
      setImagePreview('');
      setTargetAudience(['free', 'paid']);

      // Reload broadcasts
      await loadBroadcasts();

      alert('Broadcast enviado com sucesso!');
    } catch (err: any) {
      console.error('Error creating broadcast:', err);
      setError(err?.message || 'Erro ao enviar broadcast. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteBroadcast = async (broadcastId: string) => {
    const confirmed = window.confirm(
      'Excluir este broadcast?\n\nIsso também removerá as notificações de todos os usuários.'
    );

    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from('admin_broadcasts')
        .update({ is_active: false })
        .eq('id', broadcastId);

      if (error) throw error;

      await loadBroadcasts();
      alert('Broadcast excluído com sucesso!');
    } catch (err) {
      console.error('Error deleting broadcast:', err);
      alert('Erro ao excluir broadcast. Tente novamente.');
    }
  };

  const getRoleLabels = (roles: string[]) => {
    const labels: Record<string, string> = {
      free: 'Usuários Gratuitos',
      paid: 'Usuários Premium',
      admin: 'Administradores',
    };
    return roles.map((role) => labels[role] || role);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'free':
        return 'bg-gray-100 text-gray-800';
      case 'paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <Megaphone className="w-6 h-6 mr-2 text-amber-600" />
          Enviar Broadcast
        </h2>
        <p className="text-gray-600">Envie mensagens para grupos de usuários</p>
      </div>

      {/* Create Broadcast Form */}
      <form onSubmit={handleSubmit} className="rounded-xl p-6 space-y-6" style={{ backgroundColor: '#f0e6d1' }}>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Nova aula disponível!"
            maxLength={200}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/200 caracteres</p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mensagem *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem aqui..."
            maxLength={2000}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/2000 caracteres</p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagem (opcional)
          </label>
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-amber-500 transition block">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Clique para adicionar uma imagem</p>
              <p className="text-xs text-gray-500">PNG, JPG, WebP até 5MB</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Público-alvo *
          </label>
          <div className="space-y-2">
            {[
              { value: 'free', label: 'Usuários Gratuitos' },
              { value: 'paid', label: 'Usuários Premium' },
              { value: 'admin', label: 'Administradores' },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-white transition"
              >
                <input
                  type="checkbox"
                  checked={targetAudience.includes(option.value)}
                  onChange={() => toggleAudience(option.value)}
                  className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                />
                <span className="text-gray-700 font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>Enviando...</>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Enviar Broadcast
            </>
          )}
        </button>
      </form>

      {/* Broadcasts List */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Broadcasts Enviados</h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-6 h-48" />
            ))}
          </div>
        ) : broadcasts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <Megaphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Nenhum broadcast enviado</h4>
            <p className="text-gray-600">Crie seu primeiro broadcast usando o formulário acima.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {broadcasts.filter((b) => b.is_active).map((broadcast) => (
              <div
                key={broadcast.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                {broadcast.image_url && (
                  <img
                    src={broadcast.image_url}
                    alt={broadcast.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2">{broadcast.title}</h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{broadcast.message}</p>

                  {/* Target Audience Badges */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {broadcast.target_audience.map((role) => (
                      <span
                        key={role}
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleBadgeColor(role)}`}
                      >
                        {getRoleLabels([role])[0]}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {broadcast.recipient_count} receberam
                    </div>
                    <div>
                      {broadcast.read_count}/{broadcast.recipient_count} leram
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(broadcast.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <button
                      onClick={() => deleteBroadcast(broadcast.id)}
                      className="text-red-600 hover:text-red-700 transition p-1"
                      title="Excluir broadcast"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
