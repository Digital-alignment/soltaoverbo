import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageCircle, User, Calendar, Edit2, Trash2 } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import { getWordPreview } from '../utils/textProcessing';
import type { Database } from '../lib/database.types';

type CommunityPost = Database['public']['Tables']['community_posts']['Row'] & {
  writing_exercise: Database['public']['Tables']['writing_exercises']['Row'];
  user_profile: Database['public']['Tables']['users_profiles']['Row'];
  user_liked: boolean;
};

type Comment = Database['public']['Tables']['comments']['Row'] & {
  user_profile: Database['public']['Tables']['users_profiles']['Row'];
  replies?: Comment[];
};

export default function NossaFogueira() {
  const { profile } = useAuth();
  const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set());
  const [commentingPost, setCommentingPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyToName, setReplyToName] = useState<string>('');
  const [animatingHeart, setAnimatingHeart] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    loadPosts();

    const channel = supabase
      .channel('fogueira-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments' }, (payload) => {
        if (payload.eventType === 'DELETE' && payload.old.post_id) {
          loadComments(payload.old.post_id);
          loadPosts();
        } else if (payload.eventType === 'INSERT' && payload.new.post_id) {
          loadComments(payload.new.post_id);
          loadPosts();
        } else if (payload.eventType === 'UPDATE' && payload.new.post_id) {
          loadComments(payload.new.post_id);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        loadPosts();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'post_likes' }, () => {
        loadPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const loadPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('community_posts')
        .select(
          `
          *,
          writing_exercise:writing_exercises(*),
          user_profile:users_profiles(*)
        `
        )
        .eq('hidden_from_fogueira', false)
        .order('published_at', { ascending: false });

      if (postsError) throw postsError;

      let postsWithLikes: CommunityPost[] = [];

      if (profile) {
        postsWithLikes = await Promise.all(
          (postsData || []).map(async (post) => {
            const { data: likeData } = await supabase
              .from('post_likes')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', profile.id)
              .maybeSingle();

            return {
              ...post,
              user_liked: !!likeData,
            };
          })
        ) as CommunityPost[];
      } else {
        postsWithLikes = (postsData || []).map((post) => ({ ...post, user_liked: false })) as CommunityPost[];
      }

      setAllPosts(postsWithLikes);
      setDisplayedPosts(postsWithLikes.slice(0, postsPerPage));
      setCurrentPage(1);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePosts = () => {
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * postsPerPage;
      setDisplayedPosts(allPosts.slice(startIndex, endIndex));
      setCurrentPage(nextPage);
      setLoadingMore(false);
    }, 300);
  };

  const loadComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(
        `
        *,
        user_profile:users_profiles(*)
      `
      )
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const commentsWithReplies = await Promise.all(
        data.map(async (comment) => {
          const { data: replies } = await supabase
            .from('comments')
            .select(
              `
              *,
              user_profile:users_profiles(*)
            `
            )
            .eq('parent_comment_id', comment.id)
            .order('created_at', { ascending: true });

          return { ...comment, replies: replies || [] };
        })
      );
      setPostComments((prev) => ({ ...prev, [postId]: commentsWithReplies as Comment[] }));
    }
  };

  const toggleExpand = (postId: string) => {
    const newExpanded = new Set(expandedPosts);
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
    }
    setExpandedPosts(newExpanded);
  };

  const toggleComments = async (postId: string) => {
    if (commentingPost === postId) {
      setCommentingPost(null);
    } else {
      setCommentingPost(postId);
      if (!postComments[postId]) {
        await loadComments(postId);
      }
    }
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!profile) return;

    try {
      setAnimatingHeart(postId);
      setTimeout(() => setAnimatingHeart(null), 600);

      if (currentlyLiked) {
        await supabase.from('post_likes').delete().eq('post_id', postId).eq('user_id', profile.id);
      } else {
        await supabase.from('post_likes').insert({
          post_id: postId,
          user_id: profile.id,
        });
      }

      await loadPosts();
    } catch (error) {
      console.error('Erro ao curtir:', error);
    }
  };

  const handleCommentSubmit = async (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !profile) return;

    try {
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: profile.id,
        parent_comment_id: replyTo,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment('');
      setReplyTo(null);
      setReplyToName('');
      await loadComments(postId);
      await loadPosts();
    } catch (error) {
      console.error('Erro ao comentar:', error);
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) {
      return;
    }

    const previousComments = { ...postComments };
    const previousPosts = [...posts];

    const removeCommentFromState = (comments: Comment[]): Comment[] => {
      return comments.filter(c => {
        if (c.id === commentId) return false;
        if (c.replies) {
          c.replies = removeCommentFromState(c.replies);
        }
        return true;
      });
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: removeCommentFromState(prev[postId] || [])
    }));

    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, comment_count: Math.max(0, (p.comment_count || 0) - 1) } : p
    ));

    if (editingComment === commentId) {
      setEditingComment(null);
      setEditContent('');
    }

    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);

      if (error) {
        console.error('Delete error:', error);
        setPostComments(previousComments);
        setPosts(previousPosts);

        if (error.message.includes('permission')) {
          alert('Você não tem permissão para excluir este comentário.');
        } else {
          alert('Erro ao excluir comentário: ' + error.message);
        }
        return;
      }

      await loadComments(postId);
      await loadPosts();
    } catch (error: any) {
      console.error('Erro ao excluir comentário:', error);
      setPostComments(previousComments);
      setPosts(previousPosts);
      alert('Erro ao excluir comentário. Tente novamente.');
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditComment = () => {
    setEditingComment(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId: string, postId: string) => {
    if (!editContent.trim()) {
      alert('O comentário não pode estar vazio.');
      return;
    }

    const previousComments = { ...postComments };
    const newContent = editContent.trim();

    const updateCommentInState = (comments: Comment[]): Comment[] => {
      return comments.map(c => {
        if (c.id === commentId) {
          return { ...c, content: newContent };
        }
        if (c.replies) {
          return { ...c, replies: updateCommentInState(c.replies) };
        }
        return c;
      });
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: updateCommentInState(prev[postId] || [])
    }));
    setEditingComment(null);
    setEditContent('');

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: newContent })
        .eq('id', commentId);

      if (error) {
        console.error('Update error:', error);
        setPostComments(previousComments);

        if (error.message.includes('permission')) {
          alert('Você não tem permissão para editar este comentário.');
        } else {
          alert('Erro ao atualizar comentário: ' + error.message);
        }
        return;
      }

      await loadComments(postId);
    } catch (error: any) {
      console.error('Erro ao atualizar comentário:', error);
      setPostComments(previousComments);
      alert('Erro ao atualizar comentário. Tente novamente.');
    }
  };


  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0e6d1' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Nossa Fogueira</h1>
          <p className="text-gray-600">
            Compartilhe suas histórias e se conecte com outros escritores
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : allPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Nenhuma história ainda</h3>
            <p className="text-gray-600 mb-6">
              Seja o primeiro a compartilhar suas criações com a comunidade!
            </p>
            <Link
              to="/exercises"
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition shadow-lg"
            >
              Começar a Escrever
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedPosts.filter(post => post.writing_exercise && post.user_profile).map((post) => {
              const isExpanded = expandedPosts.has(post.id);
              const isCommenting = commentingPost === post.id;
              const textarea = document.createElement('textarea');
              textarea.innerHTML = post.writing_exercise.content;
              const plainText = textarea.value.replace(/<[^>]*>/g, '');
              const wordCount = plainText.trim().split(/\s+/).filter(word => word.length > 0).length;
              const needsExpand = wordCount > 35;

              return (
                <div key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start space-x-4 mb-6">
                      <Link to={`/profile/${post.user_profile.id}`}>
                        {post.user_profile.profile_picture_url ? (
                          <img
                            src={post.user_profile.profile_picture_url}
                            alt={post.user_profile.display_name}
                            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                            {post.user_profile.display_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/profile/${post.user_profile.id}`}
                          className="font-bold text-gray-900 hover:text-amber-600 transition"
                        >
                          {post.user_profile.display_name}
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.published_at).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {post.writing_exercise.title}
                    </h2>

                    <div className="prose max-w-none text-gray-700 leading-relaxed">
                      {isExpanded ? (
                        <div dangerouslySetInnerHTML={{ __html: post.writing_exercise.content }} />
                      ) : (
                        <p>{getWordPreview(post.writing_exercise.content)}</p>
                      )}
                    </div>

                    {needsExpand && (
                      <button
                        onClick={() => toggleExpand(post.id)}
                        className="text-amber-600 hover:text-amber-700 font-medium mt-4 transition"
                      >
                        {isExpanded ? 'Ver menos' : 'Ler mais'}
                      </button>
                    )}

                    <div className="flex items-center space-x-6 mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => handleLike(post.id, post.user_liked)}
                        className={`flex items-center space-x-2 transition ${
                          post.user_liked
                            ? 'text-red-600'
                            : 'text-gray-600 hover:text-red-600'
                        }`}
                      >
                        <Heart
                          className={`w-6 h-6 transition-transform duration-300 ${
                            post.user_liked ? 'fill-current' : ''
                          } ${
                            animatingHeart === post.id ? 'animate-heart-bounce' : ''
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => toggleComments(post.id)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 transition"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="font-medium">{post.comments_count}</span>
                      </button>
                    </div>

                    {isCommenting && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <form
                          onSubmit={(e) => handleCommentSubmit(post.id, e)}
                          className="mb-6"
                        >
                          {replyTo && (
                            <div className="mb-3 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-700">
                                  Respondendo a <span className="font-semibold text-amber-700">{replyToName}</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReplyTo(null);
                                    setReplyToName('');
                                  }}
                                  className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                                >
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          )}
                          <RichTextEditor
                            value={newComment}
                            onChange={setNewComment}
                            placeholder="Deixe seu comentário..."
                          />
                          <button
                            type="submit"
                            className="mt-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition"
                          >
                            Comentar
                          </button>
                        </form>

                        <div className="space-y-4">
                          {postComments[post.id]?.map((comment) => (
                            <div key={comment.id} className="space-y-4">
                              <div className="flex space-x-3">
                                {comment.user_profile?.profile_picture_url ? (
                                  <img
                                    src={comment.user_profile.profile_picture_url}
                                    alt={comment.user_profile?.display_name}
                                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                                    {comment.user_profile?.display_name?.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                <div className="flex-1">
                                  {editingComment === comment.id ? (
                                    <div className="space-y-3">
                                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                                        <p className="text-sm text-gray-700 font-medium">Modo de edição (Admin)</p>
                                      </div>
                                      <RichTextEditor
                                        value={editContent}
                                        onChange={setEditContent}
                                        placeholder="Edite o comentário..."
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleUpdateComment(comment.id, post.id)}
                                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
                                        >
                                          Salvar
                                        </button>
                                        <button
                                          onClick={cancelEditComment}
                                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                                        >
                                          Cancelar
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <span className="font-semibold text-gray-900">
                                            {comment.user_profile?.display_name}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">
                                              {new Date(comment.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                            {profile?.role === 'admin' && (
                                              <div className="flex items-center gap-1 ml-2">
                                                <button
                                                  onClick={() => startEditComment(comment)}
                                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                  title="Editar (Admin)"
                                                >
                                                  <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                  onClick={() => handleDeleteComment(comment.id, post.id)}
                                                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                  title="Excluir (Admin)"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        <div
                                          className="text-gray-700 prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ __html: comment.content }}
                                        />
                                      </div>
                                      <button
                                        onClick={() => {
                                          setReplyTo(comment.id);
                                          setReplyToName(comment.user_profile?.display_name || 'Usuário');
                                        }}
                                        className="text-sm text-amber-600 hover:text-amber-700 mt-2"
                                      >
                                        Responder
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>

                              {comment.replies && comment.replies.length > 0 && (
                                <div className="ml-12 space-y-4">
                                  {comment.replies.map((reply) => (
                                    <div key={reply.id} className="flex space-x-3">
                                      {reply.user_profile?.profile_picture_url ? (
                                        <img
                                          src={reply.user_profile.profile_picture_url}
                                          alt={reply.user_profile?.display_name}
                                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                        />
                                      ) : (
                                        <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                          {reply.user_profile?.display_name?.charAt(0).toUpperCase()}
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        {editingComment === reply.id ? (
                                          <div className="space-y-3">
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-2">
                                              <p className="text-xs text-gray-700 font-medium">Modo de edição (Admin)</p>
                                            </div>
                                            <RichTextEditor
                                              value={editContent}
                                              onChange={setEditContent}
                                              placeholder="Edite a resposta..."
                                            />
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => handleUpdateComment(reply.id, post.id)}
                                                className="px-3 py-1.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-xs font-medium"
                                              >
                                                Salvar
                                              </button>
                                              <button
                                                onClick={cancelEditComment}
                                                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-xs font-medium"
                                              >
                                                Cancelar
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <>
                                            <div className="bg-gray-50 rounded-lg p-4">
                                              <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-gray-900 text-sm">
                                                  {reply.user_profile?.display_name}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                  <span className="text-xs text-gray-500">
                                                    {new Date(reply.created_at).toLocaleDateString('pt-BR')}
                                                  </span>
                                                  {profile?.role === 'admin' && (
                                                    <div className="flex items-center gap-1 ml-2">
                                                      <button
                                                        onClick={() => startEditComment(reply)}
                                                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                                        title="Editar (Admin)"
                                                      >
                                                        <Edit2 className="w-3 h-3" />
                                                      </button>
                                                      <button
                                                        onClick={() => handleDeleteComment(reply.id, post.id)}
                                                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                                        title="Excluir (Admin)"
                                                      >
                                                        <Trash2 className="w-3 h-3" />
                                                      </button>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                              <div
                                                className="text-gray-700 text-sm prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: reply.content }}
                                              />
                                            </div>
                                            <button
                                              onClick={() => {
                                                setReplyTo(comment.id);
                                                setReplyToName(reply.user_profile?.display_name || 'Usuário');
                                              }}
                                              className="text-xs text-amber-600 hover:text-amber-700 mt-2"
                                            >
                                              Responder
                                            </button>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {displayedPosts.length < allPosts.length && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Carregando...
                    </>
                  ) : (
                    'Carregar Mais'
                  )}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
