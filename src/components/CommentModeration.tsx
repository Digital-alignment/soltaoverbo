import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Trash2, Edit2, Eye, Search, Filter, X, Calendar, User, EyeOff, AlertTriangle } from 'lucide-react';
import type { Database } from '../lib/database.types';
import RichTextEditor from './RichTextEditor';

type Comment = Database['public']['Tables']['comments']['Row'] & {
  user_profile: Database['public']['Tables']['users_profiles']['Row'];
  post_title?: string;
  is_reply: boolean;
};

type CommunityPost = Database['public']['Tables']['community_posts']['Row'] & {
  writing_exercise: Database['public']['Tables']['writing_exercises']['Row'];
  user_profile: Database['public']['Tables']['users_profiles']['Row'];
};

export default function CommentModeration() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'comments' | 'replies'>('all');
  const [contentFilter, setContentFilter] = useState<'all' | 'posts' | 'comments'>('all');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingComments, setDeletingComments] = useState<Set<string>>(new Set());
  const [hidingPosts, setHidingPosts] = useState<Set<string>>(new Set());
  const [deletingPosts, setDeletingPosts] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    totalComments: 0,
    todayComments: 0,
    thisWeekComments: 0,
    totalPosts: 0,
    hiddenPosts: 0,
    visiblePosts: 0,
  });

  useEffect(() => {
    loadComments();
    loadPosts();

    const channel = supabase
      .channel('comment-moderation-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, () => {
        loadComments();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    filterComments();
    filterPosts();
    calculateStats();
  }, [searchQuery, dateFilter, typeFilter, contentFilter, comments, posts]);

  const calculateStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = comments.filter(c => new Date(c.created_at) >= today).length;
    const weekCount = comments.filter(c => new Date(c.created_at) >= weekAgo).length;

    const hiddenCount = posts.filter(p => p.hidden_from_fogueira).length;
    const visibleCount = posts.filter(p => !p.hidden_from_fogueira).length;

    setStats({
      totalComments: comments.length,
      todayComments: todayCount,
      thisWeekComments: weekCount,
      totalPosts: posts.length,
      hiddenPosts: hiddenCount,
      visiblePosts: visibleCount,
    });
  };

  const loadComments = async () => {
    try {
      setLoading(true);

      const { data: commentsData, error } = await supabase
        .from('comments')
        .select(`
          *,
          user_profile:users_profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      const commentsWithDetails = await Promise.all(
        (commentsData || []).map(async (comment) => {
          let postTitle = 'Sem título';

          if (comment.post_id) {
            const { data: postData } = await supabase
              .from('community_posts')
              .select('writing_exercise:writing_exercises(title)')
              .eq('id', comment.post_id)
              .maybeSingle();

            if (postData?.writing_exercise) {
              postTitle = (postData.writing_exercise as any).title;
            }
          }

          return {
            ...comment,
            post_title: postTitle,
            is_reply: !!comment.parent_comment_id,
          };
        })
      );

      setComments(commentsWithDetails as Comment[]);
      setFilteredComments(commentsWithDetails as Comment[]);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      alert('Erro ao carregar comentários. Por favor, recarregue a página.');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const { data: postsData, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          writing_exercise:writing_exercises(*),
          user_profile:users_profiles(*)
        `)
        .order('published_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      setPosts((postsData || []) as CommunityPost[]);
      setFilteredPosts((postsData || []) as CommunityPost[]);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    }
  };

  const filterComments = () => {
    let filtered = [...comments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (comment) =>
          comment.content.toLowerCase().includes(query) ||
          comment.user_profile?.display_name.toLowerCase().includes(query) ||
          comment.post_title?.toLowerCase().includes(query)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter((comment) =>
        typeFilter === 'replies' ? comment.is_reply : !comment.is_reply
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0);
      } else if (dateFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      }

      filtered = filtered.filter((comment) => new Date(comment.created_at) >= filterDate);
    }

    setFilteredComments(filtered);
  };

  const filterPosts = () => {
    let filtered = [...posts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.writing_exercise?.title?.toLowerCase().includes(query) ||
          post.user_profile?.display_name.toLowerCase().includes(query)
      );
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      if (dateFilter === 'today') {
        filterDate.setHours(0, 0, 0, 0);
      } else if (dateFilter === '7days') {
        filterDate.setDate(now.getDate() - 7);
      } else if (dateFilter === '30days') {
        filterDate.setDate(now.getDate() - 30);
      }

      filtered = filtered.filter((post) => new Date(post.published_at) >= filterDate);
    }

    setFilteredPosts(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setTypeFilter('all');
    setContentFilter('all');
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário? Esta ação não pode ser desfeita.')) {
      return;
    }

    setDeletingComments(prev => new Set(prev).add(commentId));

    const previousComments = [...comments];
    const previousFiltered = [...filteredComments];

    setComments(prev => prev.filter(c => c.id !== commentId));
    setFilteredComments(prev => prev.filter(c => c.id !== commentId));

    if (editingComment === commentId) {
      setEditingComment(null);
      setEditContent('');
    }

    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);

      if (error) {
        console.error('Delete error:', error);
        setComments(previousComments);
        setFilteredComments(previousFiltered);

        if (error.message.includes('permission')) {
          alert('Você não tem permissão para excluir este comentário.');
        } else {
          alert('Erro ao excluir comentário: ' + error.message);
        }
        return;
      }

      await loadComments();
    } catch (error: any) {
      console.error('Erro ao excluir comentário:', error);
      setComments(previousComments);
      setFilteredComments(previousFiltered);
      alert('Erro ao excluir comentário. Tente novamente.');
    } finally {
      setDeletingComments(prev => {
        const newSet = new Set(prev);
        newSet.delete(commentId);
        return newSet;
      });
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) {
      alert('O comentário não pode estar vazio.');
      return;
    }

    const previousComments = [...comments];
    const previousFiltered = [...filteredComments];
    const newContent = editContent.trim();

    setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: newContent } : c));
    setFilteredComments(prev => prev.map(c => c.id === commentId ? { ...c, content: newContent } : c));
    setEditingComment(null);
    setEditContent('');

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: newContent })
        .eq('id', commentId);

      if (error) {
        console.error('Update error:', error);
        setComments(previousComments);
        setFilteredComments(previousFiltered);

        if (error.message.includes('permission')) {
          alert('Você não tem permissão para editar este comentário.');
        } else {
          alert('Erro ao atualizar comentário: ' + error.message);
        }
        return;
      }

      await loadComments();
    } catch (error: any) {
      console.error('Erro ao atualizar comentário:', error);
      setComments(previousComments);
      setFilteredComments(previousFiltered);
      alert('Erro ao atualizar comentário. Tente novamente.');
    }
  };

  const handleHidePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja ocultar este post da Fogueira? O post permanecerá visível para o autor, mas todos os comentários serão excluídos.')) {
      return;
    }

    setHidingPosts(prev => new Set(prev).add(postId));

    const previousPosts = [...posts];
    const previousFiltered = [...filteredPosts];

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, hidden_from_fogueira: true } : p));
    setFilteredPosts(prev => prev.map(p => p.id === postId ? { ...p, hidden_from_fogueira: true } : p));

    try {
      const { error } = await supabase
        .from('community_posts')
        .update({ hidden_from_fogueira: true })
        .eq('id', postId);

      if (error) {
        console.error('Hide error:', error);
        setPosts(previousPosts);
        setFilteredPosts(previousFiltered);

        if (error.message.includes('permission')) {
          alert('Você não tem permissão para ocultar este post.');
        } else {
          alert('Erro ao ocultar post: ' + error.message);
        }
        return;
      }

      await loadPosts();
      alert('Post ocultado da Fogueira com sucesso!');
    } catch (error: any) {
      console.error('Erro ao ocultar post:', error);
      setPosts(previousPosts);
      setFilteredPosts(previousFiltered);
      alert('Erro ao ocultar post. Tente novamente.');
    } finally {
      setHidingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja EXCLUIR PERMANENTEMENTE este post? Esta ação não pode ser desfeita e o post será removido inclusive do perfil do autor.')) {
      return;
    }

    setDeletingPosts(prev => new Set(prev).add(postId));

    const previousPosts = [...posts];
    const previousFiltered = [...filteredPosts];

    setPosts(prev => prev.filter(p => p.id !== postId));
    setFilteredPosts(prev => prev.filter(p => p.id !== postId));

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) {
        console.error('Delete error:', error);
        setPosts(previousPosts);
        setFilteredPosts(previousFiltered);

        if (error.message.includes('permission')) {
          alert('Você não tem permissão para excluir este post.');
        } else {
          alert('Erro ao excluir post: ' + error.message);
        }
        return;
      }

      await loadPosts();
      alert('Post excluído permanentemente com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir post:', error);
      setPosts(previousPosts);
      setFilteredPosts(previousFiltered);
      alert('Erro ao excluir post. Tente novamente.');
    } finally {
      setDeletingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const getContentPreview = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <MessageCircle className="w-6 h-6 mr-2 text-amber-600" />
        Moderação de Comentários
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-gray-600">Total Posts</h3>
            <MessageCircle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.totalPosts}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-gray-600">Posts Visíveis</h3>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.visiblePosts}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-gray-600">Posts Ocultos</h3>
            <EyeOff className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.hiddenPosts}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-gray-600">Comentários</h3>
            <MessageCircle className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.totalComments}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-gray-600">Hoje</h3>
            <Calendar className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.todayComments}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-4 border border-cyan-200">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-xs font-medium text-gray-600">Esta Semana</h3>
            <Calendar className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-xl font-bold text-gray-900">{stats.thisWeekComments}</p>
        </div>
      </div>

      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por conteúdo, autor ou post..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value as any)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white font-medium"
          >
            <option value="all">Posts e Comentários</option>
            <option value="posts">Apenas Posts</option>
            <option value="comments">Apenas Comentários</option>
          </select>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
              disabled={contentFilter === 'posts'}
            >
              <option value="all">Todos os tipos</option>
              <option value="comments">Comentários</option>
              <option value="replies">Respostas</option>
            </select>
          </div>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
          >
            <option value="all">Todo o período</option>
            <option value="today">Hoje</option>
            <option value="7days">Últimos 7 dias</option>
            <option value="30days">Últimos 30 dias</option>
          </select>
        </div>

        {(searchQuery || dateFilter !== 'all' || typeFilter !== 'all' || contentFilter !== 'all') && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">
              {contentFilter === 'posts' && (
                <>Mostrando <span className="font-semibold">{filteredPosts.length}</span> de{' '}
                <span className="font-semibold">{posts.length}</span> posts</>
              )}
              {contentFilter === 'comments' && (
                <>Mostrando <span className="font-semibold">{filteredComments.length}</span> de{' '}
                <span className="font-semibold">{comments.length}</span> comentários</>
              )}
              {contentFilter === 'all' && (
                <>Mostrando <span className="font-semibold">{filteredPosts.length}</span> posts e{' '}
                <span className="font-semibold">{filteredComments.length}</span> comentários</>
              )}
            </p>
            <button
              onClick={clearFilters}
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center"
            >
              <X className="w-4 h-4 mr-1" />
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-32"></div>
          ))}
        </div>
      ) : (contentFilter === 'all' || contentFilter === 'posts') && filteredPosts.length === 0 && (contentFilter === 'posts' || filteredComments.length === 0) ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum conteúdo encontrado</h3>
          <p className="text-gray-600 mb-4">Tente ajustar os filtros ou a busca.</p>
          {(searchQuery || dateFilter !== 'all' || typeFilter !== 'all' || contentFilter !== 'all') && (
            <button onClick={clearFilters} className="text-amber-600 hover:text-amber-700 font-medium">
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {(contentFilter === 'all' || contentFilter === 'posts') && filteredPosts.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-amber-600" />
                Posts da Fogueira ({filteredPosts.length})
              </h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {filteredPosts.map((post) => (
                  <div key={post.id} className={`border rounded-lg p-4 transition-colors bg-white ${
                    post.hidden_from_fogueira ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-amber-300'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1">
                        {post.user_profile?.profile_picture_url ? (
                          <img
                            src={post.user_profile.profile_picture_url}
                            alt={post.user_profile.display_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {post.user_profile?.display_name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{post.user_profile?.display_name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{new Date(post.published_at).toLocaleString('pt-BR')}</span>
                            {post.hidden_from_fogueira && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium flex items-center">
                                <EyeOff className="w-3 h-3 mr-1" />
                                Oculto da Fogueira
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => window.open('/fogueira', '_blank')}
                          className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Ver no contexto"
                          disabled={hidingPosts.has(post.id) || deletingPosts.has(post.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!post.hidden_from_fogueira && (
                          <button
                            onClick={() => handleHidePost(post.id)}
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title={hidingPosts.has(post.id) ? "Ocultando..." : "Ocultar da Fogueira"}
                            disabled={hidingPosts.has(post.id) || deletingPosts.has(post.id)}
                          >
                            <EyeOff className={`w-4 h-4 ${hidingPosts.has(post.id) ? 'animate-pulse' : ''}`} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                          title={deletingPosts.has(post.id) ? "Excluindo..." : "Excluir Permanentemente"}
                          disabled={hidingPosts.has(post.id) || deletingPosts.has(post.id)}
                        >
                          <Trash2 className={`w-4 h-4 ${deletingPosts.has(post.id) ? 'animate-pulse' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-2">
                      <h4 className="font-bold text-gray-900 mb-1">{post.writing_exercise?.title}</h4>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <div
                        className="text-gray-700 prose prose-sm max-w-none line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: getContentPreview(post.writing_exercise?.content || '') }}
                      />
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments_count} comentários
                      </span>
                      <span>❤️ {post.likes_count} curtidas</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(contentFilter === 'all' || contentFilter === 'comments') && filteredComments.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
                Comentários ({filteredComments.length})
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredComments.map((comment) => (
            <div key={comment.id} className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors bg-white">
              {editingComment === comment.id ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Editando Comentário</h4>
                    <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <RichTextEditor value={editContent} onChange={setEditContent} placeholder="Edite o comentário..." />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateComment(comment.id)}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {comment.user_profile?.profile_picture_url ? (
                        <img
                          src={comment.user_profile.profile_picture_url}
                          alt={comment.user_profile.display_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {comment.user_profile?.display_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{comment.user_profile?.display_name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{new Date(comment.created_at).toLocaleString('pt-BR')}</span>
                          {comment.is_reply && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                              Resposta
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.open('/fogueira', '_blank')}
                        className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                        title="Ver no contexto"
                        disabled={deletingComments.has(comment.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => startEditComment(comment)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Editar"
                        disabled={deletingComments.has(comment.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title={deletingComments.has(comment.id) ? "Excluindo..." : "Excluir"}
                        disabled={deletingComments.has(comment.id)}
                      >
                        <Trash2 className={`w-4 h-4 ${deletingComments.has(comment.id) ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Post:</span> {comment.post_title}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3">
                    <div
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: comment.content }}
                    />
                  </div>
                </>
              )}
            </div>
          ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
