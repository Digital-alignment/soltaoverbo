import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Bell, Heart, MessageCircle, BookOpen, Megaphone, Check, Trash2 } from 'lucide-react';
import BroadcastModal from '../components/BroadcastModal';
import type { Database } from '../lib/database.types';

type Notification = Database['public']['Tables']['notifications']['Row'];
type Broadcast = Database['public']['Tables']['admin_broadcasts']['Row'];

export default function Notifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  useEffect(() => {
    if (profile) {
      loadNotifications();

      const channel = supabase
        .channel('notifications-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${profile.id}`,
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile]);

  const loadNotifications = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (!error) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      );
    }
  };

  const markAllAsRead = async () => {
    if (!profile) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', profile.id)
      .eq('is_read', false);

    if (!error) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const { error } = await supabase.from('notifications').delete().eq('id', notificationId);

    if (error) {
      console.error('Erro ao excluir notificação:', error);
      alert('Erro ao excluir notificação. Por favor, tente novamente.');
      return;
    }

    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
  };

  const deleteAllNotifications = async () => {
    if (!profile) return;

    const confirmDelete = window.confirm(
      'Tem certeza que deseja excluir todas as notificações? Esta ação não pode ser desfeita.'
    );

    if (!confirmDelete) return;

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('user_id', profile.id);

    if (error) {
      console.error('Erro ao excluir todas as notificações:', error);
      alert('Erro ao excluir notificações. Por favor, tente novamente.');
      return;
    }

    setNotifications([]);
  };

  const handleBroadcastClick = async (notification: Notification) => {
    if (!notification.broadcast_id) return;

    // Mark as read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Fetch the full broadcast details
    const { data, error } = await supabase
      .from('admin_broadcasts')
      .select('*')
      .eq('id', notification.broadcast_id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching broadcast:', error);
      return;
    }

    if (data) {
      setSelectedBroadcast(data);
      setShowBroadcastModal(true);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5" style={{ color: '#ef4444' }} />;
      case 'comment':
      case 'reply':
        return <MessageCircle className="w-5 h-5" style={{ color: '#3b82f6' }} />;
      case 'course_update':
        return <BookOpen className="w-5 h-5" style={{ color: '#1f008f' }} />;
      case 'announcement':
        return <Megaphone className="w-5 h-5" style={{ color: '#1f008f' }} />;
      default:
        return <Bell className="w-5 h-5" style={{ color: '#6b7280' }} />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0e6d1' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-2xl" style={{ backgroundColor: '#1f008f' }}>
              <Bell className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Notificações</h1>
              {unreadCount > 0 && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#1f008f' }}></div>
                  <p className="text-sm font-medium" style={{ color: '#1f008f' }}>
                    {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          {notifications.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-6">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm hover:shadow-md"
                  style={{
                    backgroundColor: '#1f008f',
                    color: '#fff7ed'
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar todas como lidas
                </button>
              )}
              <button
                onClick={deleteAllNotifications}
                className="flex items-center bg-white/80 backdrop-blur-sm text-red-600 px-4 py-2.5 rounded-xl font-medium hover:bg-white transition-all shadow-sm hover:shadow-md border border-red-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir todas
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 animate-pulse shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-lg p-16 text-center">
            <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#1f008f20' }}>
              <Bell className="w-10 h-10" style={{ color: '#1f008f' }} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhuma notificação</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Você será notificado sobre curtidas, comentários e atualizações aqui
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden transition-all hover:shadow-lg hover:bg-white/90 group"
                style={
                  !notification.is_read
                    ? {
                        boxShadow: `0 0 0 2px #1f008f20, 0 1px 3px 0 rgb(0 0 0 / 0.1)`,
                      }
                    : {}
                }
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className="p-3 rounded-2xl flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: !notification.is_read ? '#1f008f15' : '#f3f4f6'
                      }}
                    >
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: '#1f008f' }}></div>
                        )}
                      </div>

                      <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500 font-medium">
                          {new Date(notification.created_at).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>

                        <div className="flex items-center gap-2">
                          {/* View More Link */}
                          {notification.broadcast_id ? (
                            <button
                              onClick={() => handleBroadcastClick(notification)}
                              className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                              style={{ color: '#1f008f' }}
                            >
                              Ver mais →
                            </button>
                          ) : notification.link ? (
                            <Link
                              to={notification.link}
                              onClick={() => !notification.is_read && markAsRead(notification.id)}
                              className="text-sm font-semibold px-3 py-1.5 rounded-lg transition-all"
                              style={{ color: '#1f008f' }}
                            >
                              Ver mais →
                            </Link>
                          ) : null}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {!notification.is_read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                                title="Marcar como lida"
                              >
                                <Check className="w-4 h-4 text-gray-500" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      <BroadcastModal
        isOpen={showBroadcastModal}
        onClose={() => {
          setShowBroadcastModal(false);
          setSelectedBroadcast(null);
        }}
        broadcast={selectedBroadcast}
      />
    </div>
  );
}
