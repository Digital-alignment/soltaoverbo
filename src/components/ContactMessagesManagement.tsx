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
      console.error('Error fetching messages:', error);
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
      console.error('Error updating message status:', error);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

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
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  const getStatusBadge = (status: ContactMessage['status']) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800',
      read: 'bg-yellow-100 text-yellow-800',
      replied: 'bg-green-100 text-green-800',
      archived: 'bg-gray-100 text-gray-800',
    };

    const labels = {
      new: 'Nova',
      read: 'Lida',
      replied: 'Respondida',
      archived: 'Arquivada',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
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
          <Mail className="w-6 h-6 mr-2 text-amber-600" />
          Mensagens de Contato
        </h2>
        <div className="text-sm text-gray-600">
          {filteredMessages.length} {filteredMessages.length === 1 ? 'mensagem' : 'mensagens'}
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === status
                ? 'bg-amber-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'Todas' : status === 'new' ? 'Novas' : status === 'read' ? 'Lidas' : status === 'replied' ? 'Respondidas' : 'Arquivadas'}
            {status !== 'all' && (
              <span className="ml-2 text-xs">
                ({messages.filter(m => m.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Nenhuma mensagem encontrada</p>
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
                className={`bg-white rounded-lg shadow-sm border-2 p-4 cursor-pointer transition hover:shadow-md ${
                  selectedMessage?.id === message.id ? 'border-amber-500' : 'border-transparent'
                } ${message.status === 'new' ? 'bg-blue-50' : ''}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{message.name}</h3>
                    <p className="text-sm text-gray-600">{message.email}</p>
                  </div>
                  {getStatusBadge(message.status)}
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{message.message}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(message.created_at)}
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          {selectedMessage ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h3>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-sm text-amber-600 hover:text-amber-700 transition"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {getStatusBadge(selectedMessage.status)}
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">
                  Recebida em {formatDate(selectedMessage.created_at)}
                </p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 mb-2">Ações:</div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedMessage.status === 'new' && (
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'read')}
                      className="flex items-center justify-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Marcar como Lida
                    </button>
                  )}
                  {(selectedMessage.status === 'new' || selectedMessage.status === 'read') && (
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'replied')}
                      className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar como Respondida
                    </button>
                  )}
                  {selectedMessage.status !== 'archived' && (
                    <button
                      onClick={() => updateMessageStatus(selectedMessage.id, 'archived')}
                      className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Arquivar
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition col-span-2"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Mensagem
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Selecione uma mensagem para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
