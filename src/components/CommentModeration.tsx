import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MessageCircle, Trash2, Edit2, Eye, Search, Filter, X, Calendar, User, EyeOff, AlertTriangle, Heart } from 'lucide-react';
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
          let postTitle = 'sem título';

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
      console.error('erro ao carregar comentários:', error);
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
      console.error('erro ao carregar posts:', error);
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
    if (!confirm('tem certeza que deseja excluir este comentário? esta ação não pode ser desfeita.')) {
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
        setComments(previousComments);
        setFilteredComments(previousFiltered);
        alert('erro ao excluir comentário: ' + error.message);
        return;
      }

      await loadComments();
    } catch (error: any) {
      setComments(previousComments);
      setFilteredComments(previousFiltered);
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
      alert('o comentário não pode estar vazio.');
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
        setComments(previousComments);
        setFilteredComments(previousFiltered);
        alert('erro ao atualizar comentário: ' + error.message);
        return;
      }

      await loadComments();
    } catch (error: any) {
      setComments(previousComments);
      setFilteredComments(previousFiltered);
    }
  };

  const handleHidePost = async (postId: string) => {
    if (!confirm('tem certeza que deseja ocultar este post da fogueira?')) {
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
        setPosts(previousPosts);
        setFilteredPosts(previousFiltered);
        alert('erro ao ocultar post: ' + error.message);
        return;
      }

      await loadPosts();
    } catch (error: any) {
      setPosts(previousPosts);
      setFilteredPosts(previousFiltered);
    } finally {
      setHidingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('tem certeza que deseja EXCLUIR PERMANENTEMENTE este post?')) {
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
        setPosts(previousPosts);
        setFilteredPosts(previousFiltered);
        alert('erro ao excluir post: ' + error.message);
        return;
      }

      await loadPosts();
    } catch (error: any) {
      setPosts(previousPosts);
      setFilteredPosts(previousFiltered);
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
    <div className="space-y-6">
      <div className="border-b border-papelKraft/30 pb-4">
        <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
          moderação de fogueira & comentários
        </h2>
        <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
          supervisão de histórias partilhadas na comunidade e moderação de comentários
        </p>
      </div>

      {/* MÉTRICAS DE MODERAÇÃO */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-bgPlataforma p-3.5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">total posts</span>
          <span className="font-gesto font-normal text-2xl text-acentoAzul block">{stats.totalPosts}</span>
        </div>

        <div className="bg-bgPlataforma p-3.5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">posts visíveis</span>
          <span className="font-gesto font-normal text-2xl text-acentoOliva block">{stats.visiblePosts}</span>
        </div>

        <div className="bg-bgPlataforma p-3.5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">posts ocultos</span>
          <span className="font-gesto font-normal text-2xl text-acentoTerracota block">{stats.hiddenPosts}</span>
        </div>

        <div className="bg-bgPlataforma p-3.5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">comentários</span>
          <span className="font-gesto font-normal text-2xl text-acentoAzul block">{stats.totalComments}</span>
        </div>

        <div className="bg-bgPlataforma p-3.5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">hoje</span>
          <span className="font-gesto font-normal text-2xl text-acentoTerracota block">{stats.todayComments}</span>
        </div>

        <div className="bg-bgPlataforma p-3.5 rounded-2xl border border-papelKraft/40 space-y-1 shadow-xs">
          <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">esta semana</span>
          <span className="font-gesto font-normal text-2xl text-acentoAzul block">{stats.thisWeekComments}</span>
        </div>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tintaCarvao/40" />
            <input
              type="text"
              placeholder="buscar por conteúdo, autor ou post..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-tintaCarvao/40 hover:text-tintaCarvao"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={contentFilter}
            onChange={(e) => setContentFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
          >
            <option value="all">posts e comentários</option>
            <option value="posts">apenas posts</option>
            <option value="comments">apenas comentários</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
            disabled={contentFilter === 'posts'}
          >
            <option value="all">todos os tipos</option>
            <option value="comments">comentários</option>
            <option value="replies">respostas</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="w-full sm:w-auto px-3 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase cursor-pointer"
          >
            <option value="all">todo o período</option>
            <option value="today">hoje</option>
            <option value="7days">últimos 7 dias</option>
            <option value="30days">últimos 30 dias</option>
          </select>
        </div>

        {(searchQuery || dateFilter !== 'all' || typeFilter !== 'all' || contentFilter !== 'all') && (
          <div className="flex items-center justify-between text-xs font-corpo text-tintaCarvao/70 pt-1">
            <span>
              exibindo resultados filtrados
            </span>
            <button
              onClick={clearFilters}
              className="text-acentoTerracota hover:underline flex items-center gap-1 font-bold lowercase"
            >
              <X className="w-3.5 h-3.5" />
              <span>limpar filtros</span>
            </button>
          </div>
        )}
      </div>

      {/* CONTEÚDO: POSTS DA FOGUEIRA E COMENTÁRIOS */}
      {loading ? (
        <p className="text-xs font-corpo text-tintaCarvao/60 italic text-center py-6">carregando moderação...</p>
      ) : (
        <div className="space-y-6">
          {(contentFilter === 'all' || contentFilter === 'posts') && filteredPosts.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase border-b border-papelKraft/30 pb-2">
                posts da fogueira ({filteredPosts.length})
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className={`bg-white p-4.5 rounded-2xl border ${
                      post.hidden_from_fogueira ? 'border-red-300 bg-red-50/50' : 'border-papelKraft/40'
                    } shadow-xs space-y-2`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-acentoAzul text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                          {post.user_profile?.profile_picture_url ? (
                            <img src={post.user_profile.profile_picture_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            post.user_profile?.display_name?.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                            {post.user_profile?.display_name}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] font-corpo text-tintaCarvao/50">
                            <span>{new Date(post.published_at).toLocaleString('pt-BR')}</span>
                            {post.hidden_from_fogueira && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">
                                oculto da fogueira
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => window.open('/fogueira', '_blank')}
                          className="p-1.5 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors cursor-pointer"
                          title="ver na fogueira"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!post.hidden_from_fogueira && (
                          <button
                            onClick={() => handleHidePost(post.id)}
                            className="p-1.5 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoTerracota border border-papelKraft/40 transition-colors cursor-pointer"
                            title="ocultar post"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-xl bg-papelClaro hover:bg-red-50 text-red-600 border border-papelKraft/40 transition-colors cursor-pointer"
                          title="excluir permanentemente"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                      “{post.writing_exercise?.title}”
                    </h4>

                    <p className="text-xs font-corpo text-tintaCarvao/80 italic bg-bgPlataforma p-3 rounded-xl border border-papelKraft/30 lowercase">
                      "{getContentPreview(post.writing_exercise?.content || '')}"
                    </p>

                    <div className="flex items-center gap-4 text-xs font-corpo text-tintaCarvao/60 pt-1">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
                        <span>{post.likes_count} curtidas</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-acentoAzul" />
                        <span>{post.comments_count} comentários</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(contentFilter === 'all' || contentFilter === 'comments') && filteredComments.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-editorial font-bold text-base text-acentoAzul lowercase border-b border-papelKraft/30 pb-2">
                comentários ({filteredComments.length})
              </h3>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {filteredComments.map((comment) => (
                  <div key={comment.id} className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs space-y-2">
                    {editingComment === comment.id ? (
                      <div className="space-y-3">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          rows={3}
                          className="w-full p-3 bg-bgPlataforma border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 rounded-xl bg-papelClaro text-tintaCarvao/70 text-xs font-corpo lowercase cursor-pointer"
                          >
                            cancelar
                          </button>
                          <button
                            onClick={() => handleUpdateComment(comment.id)}
                            className="px-4 py-1.5 rounded-xl bg-acentoAzul text-white font-gesto text-[18px] lowercase shadow-xs cursor-pointer"
                          >
                            salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-acentoAzul text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                              {comment.user_profile?.profile_picture_url ? (
                                <img src={comment.user_profile.profile_picture_url} alt="" className="w-full h-full object-cover" />
                              ) : (
                                comment.user_profile?.display_name?.charAt(0).toUpperCase()
                              )}
                            </div>
                            <div>
                              <p className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                                {comment.user_profile?.display_name}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] font-corpo text-tintaCarvao/50">
                                <span>{new Date(comment.created_at).toLocaleString('pt-BR')}</span>
                                {comment.is_reply && (
                                  <span className="px-2 py-0.5 bg-acentoAzul/10 text-acentoAzul rounded-full font-bold">
                                    resposta
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => startEditComment(comment)}
                              className="p-1.5 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors cursor-pointer"
                              title="editar comentário"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1.5 rounded-xl bg-papelClaro hover:bg-red-50 text-red-600 border border-papelKraft/40 transition-colors cursor-pointer"
                              title="excluir comentário"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs font-corpo text-tintaCarvao/80 bg-bgPlataforma p-3 rounded-xl border border-papelKraft/30 lowercase">
                          "{comment.content}"
                        </p>
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
