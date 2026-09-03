import { useState, useEffect } from 'react';
import { Mail, Eye, Archive, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export default function ContactMessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('erro ao buscar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id: string, status: ContactMessage['status']) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
    } catch (error) {
      console.error('erro ao atualizar status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('tem certeza que deseja excluir esta mensagem?')) return;

    try {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchMessages();
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('erro ao excluir mensagem:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusBadge = (status: ContactMessage['status']) => {
    const styles = {
      new: 'bg-acentoTerracota text-white',
      read: 'bg-acentoAzul/10 text-acentoAzul',
      replied: 'bg-acentoOliva/20 text-acentoOliva',
      archived: 'bg-papelKraft/30 text-tintaCarvao/70',
    };

    const labels = {
      new: 'nova',
      read: 'lida',
      replied: 'respondida',
      archived: 'arquivada',
    };

    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-corpo lowercase ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-papelKraft/30 pb-4">
        <div>
          <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            mensagens de contato
          </h2>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            mensagens recebidas pelo formulário do site institucional
          </p>
        </div>
        <span className="text-xs font-bold font-corpo text-acentoAzul bg-acentoAzul/10 px-3 py-1 rounded-full lowercase">
          {filteredMessages.length} mensagens
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-corpo lowercase transition cursor-pointer whitespace-nowrap ${
              filter === status
                ? 'bg-acentoAzul text-white shadow-xs'
                : 'bg-white text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
            }`}
          >
            {status === 'all' ? 'todas' : status === 'new' ? 'novas' : status === 'read' ? 'lidas' : status === 'replied' ? 'respondidas' : 'arquivadas'}
            {status !== 'all' && (
              <span className="ml-1 text-[10px] opacity-80">
                ({messages.filter(m => m.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {loading ? (
            <p className="text-xs font-corpo text-tintaCarvao/60 italic text-center py-6">carregando mensagens...</p>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-2xl border border-papelKraft/30 space-y-2">
              <Mail className="w-8 h-8 text-tintaCarvao/30 mx-auto" />
              <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">nenhuma mensagem encontrada.</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                onClick={() => {
                  setSelectedMessage(message);
                  if (message.status === 'new') {
                    updateMessageStatus(message.id, 'read');
                  }
                }}
                className={`bg-white rounded-2xl border ${
                  selectedMessage?.id === message.id ? 'border-acentoAzul ring-1 ring-acentoAzul' : 'border-papelKraft/40'
                } p-4 cursor-pointer transition shadow-xs space-y-2`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase">{message.name}</h3>
                    <p className="text-xs font-corpo text-tintaCarvao/70">{message.email}</p>
                  </div>
                  {getStatusBadge(message.status)}
                </div>
                <p className="text-xs font-corpo text-tintaCarvao/80 line-clamp-2 italic bg-bgPlataforma p-2.5 rounded-xl border border-papelKraft/30 lowercase">
                  "{message.message}"
                </p>
                <div className="flex items-center text-[10px] font-corpo text-tintaCarvao/50">
                  <Clock className="w-3 h-3 mr-1 text-tintaCarvao/40" />
                  {formatDate(message.created_at)}
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          {selectedMessage ? (
            <div className="bg-white rounded-2xl border border-papelKraft/40 p-5 shadow-xs space-y-4 sticky top-6">
              <div className="flex items-start justify-between border-b border-papelKraft/30 pb-3">
                <div>
                  <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase">{selectedMessage.name}</h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-xs font-corpo text-acentoTerracota hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {getStatusBadge(selectedMessage.status)}
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-corpo text-tintaCarvao/50 lowercase block">
                  recebida em {formatDate(selectedMessage.created_at)}
                </span>
                <div className="bg-bgPlataforma rounded-xl p-4 border border-papelKraft/30">
                  <p className="text-xs font-corpo text-tintaCarvao leading-relaxed whitespace-pre-wrap lowercase">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-papelKraft/30">
                <span className="text-xs font-bold text-acentoAzul lowercase font-corpo block">ações de gestão:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-corpo lowercase">
                  {selectedMessage.status === 'new' && (
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      className="py-2 px-3 bg-papelClaro border border-papelKraft/40 rounded-xl hover:bg-papelKraft/20 text-tintaCarvao/80 cursor-pointer"
                    >
                      marcar como lida
                    </button>
                  )}
                  {(selectedMessage.status === 'new' || selectedMessage.status === 'read') && (
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      className="py-2 px-3 bg-acentoOliva/20 text-acentoOliva border border-acentoOliva/40 rounded-xl hover:bg-acentoOliva/30 cursor-pointer"
                    >
                      marcar como respondida
                    </button>
                  )}
                  {selectedMessage.status !== 'archived' && (
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                      className="py-2 px-3 bg-papelClaro border border-papelKraft/40 rounded-xl hover:bg-papelKraft/20 text-tintaCarvao/80 cursor-pointer"
                    >
                      arquivar
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="py-2 px-3 bg-red-50 text-red-600 border border-red-200 rounded-xl hover:bg-red-100 col-span-2 cursor-pointer"
                  >
                    excluir mensagem
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-papelKraft/30 p-8 text-center space-y-2">
              <Mail className="w-10 h-10 text-tintaCarvao/30 mx-auto" />
              <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">selecione uma mensagem para visualizar os detalhes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
