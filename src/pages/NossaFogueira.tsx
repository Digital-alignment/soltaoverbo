import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import {
  Heart,
  MessageSquare,
  Share2,
  Search,
  Plus,
  Calendar,
  User,
  Trash2,
  Edit2,
  Feather,
  Flame,
  Sparkles,
  BookOpen,
  Send,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getWordPreview, stripHtmlTags } from '../utils/textProcessing';
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

  // Filtros de Categoria e Busca
  const [selectedFilter, setSelectedFilter] = useState<'todos' | '21dias' | 'livres' | 'poesia' | 'rituais'>('todos');
  const [searchQuery, setSearchQuery] = useState('');

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
      console.error('erro ao carregar posts:', error);
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
      console.error('erro ao curtir:', error);
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
      console.error('erro ao comentar:', error);
    }
  };

  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!confirm('tem certeza que deseja excluir este comentário?')) {
      return;
    }

    const previousComments = { ...postComments };
    const previousPosts = [...displayedPosts];

    const removeCommentFromState = (comments: Comment[]): Comment[] => {
      return comments.filter((c) => {
        if (c.id === commentId) return false;
        if (c.replies) {
          c.replies = removeCommentFromState(c.replies);
        }
        return true;
      });
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: removeCommentFromState(prev[postId] || []),
    }));

    setDisplayedPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments_count: Math.max(0, (p.comments_count || 0) - 1) } : p
      )
    );

    if (editingComment === commentId) {
      setEditingComment(null);
      setEditContent('');
    }

    try {
      const { error } = await supabase.from('comments').delete().eq('id', commentId);

      if (error) {
        console.error('erro ao deletar:', error);
        setPostComments(previousComments);
        setDisplayedPosts(previousPosts);
        alert('erro ao excluir comentário: ' + error.message);
        return;
      }

      await loadComments(postId);
      await loadPosts();
    } catch (error: any) {
      console.error('erro ao excluir comentário:', error);
      setPostComments(previousComments);
      setDisplayedPosts(previousPosts);
      alert('erro ao excluir comentário. tente novamente.');
    }
  };

  const startEditComment = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleUpdateComment = async (commentId: string, postId: string) => {
    if (!editContent.trim()) {
      alert('o comentário não pode estar vazio.');
      return;
    }

    const previousComments = { ...postComments };
    const newContent = editContent.trim();

    const updateCommentInState = (comments: Comment[]): Comment[] => {
      return comments.map((c) => {
        if (c.id === commentId) {
          return { ...c, content: newContent };
        }
        if (c.replies) {
          return { ...c, replies: updateCommentInState(c.replies) };
        }
        return c;
      });
    };

    setPostComments((prev) => ({
      ...prev,
      [postId]: updateCommentInState(prev[postId] || []),
    }));
    setEditingComment(null);
    setEditContent('');

    try {
      const { error } = await supabase.from('comments').update({ content: newContent }).eq('id', commentId);

      if (error) {
        console.error('erro ao atualizar:', error);
        setPostComments(previousComments);
        alert('erro ao atualizar comentário: ' + error.message);
        return;
      }

      await loadComments(postId);
    } catch (error: any) {
      console.error('erro ao atualizar comentário:', error);
      setPostComments(previousComments);
      alert('erro ao atualizar comentário. tente novamente.');
    }
  };

  const handleShareLink = (postId: string) => {
    const shareUrl = `${window.location.origin}/fogueira#post-${postId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert('link do texto copiado para a área de transferência!');
    } else {
      alert(`link para partilhar: ${shareUrl}`);
    }
  };

  // Filtragem Dinâmica de Posts por Categoria e Busca
  const filteredPosts = useMemo(() => {
    return displayedPosts.filter((post) => {
      if (!post.writing_exercise || !post.user_profile) return false;

      const title = post.writing_exercise.title.toLowerCase();
      const content = post.writing_exercise.content.toLowerCase();
      const author = post.user_profile.display_name.toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase()) || content.includes(searchQuery.toLowerCase()) || author.includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (selectedFilter === '21dias') {
        return title.includes('21 dias') || title.includes('dia ');
      } else if (selectedFilter === 'poesia') {
        return title.includes('poema') || title.includes('poesia') || content.includes('estrofe');
      } else if (selectedFilter === 'rituais') {
        return title.includes('ritual') || title.includes('convite');
      } else if (selectedFilter === 'livres') {
        return !title.includes('21 dias') && !title.includes('dia ');
      }

      return true;
    });
  }, [displayedPosts, searchQuery, selectedFilter]);

  return (
    <div className="min-h-screen bg-bgPlataforma text-tintaCarvao py-6 sm:py-8 pb-28 lg:pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* CABEÇALHO DA PÁGINA: nossa fogueira (Muthazle Sem Bold 34px-44px) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/40 pb-4">
          <div className="space-y-1">
            <h1 className="font-gesto font-normal text-[34px] sm:text-[44px] text-acentoAzul lowercase leading-tight">
              nossa fogueira
            </h1>
            <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
              partilhas e textos da nossa comunidade de escritoras
            </p>
          </div>

          <Link
            to="/exercises?new=true"
            className="px-5 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] sm:text-[22px] lowercase shadow-xs hover:bg-acentoTerracota/90 hover:scale-102 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4.5 h-4.5 text-white" />
            <span>partilhar novo texto</span>
          </Link>
        </div>

        {/* BARRA DE FILTROS & CAMPO DE BUSCA (MOBILE SAFE ROLAGEM) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-papelClaro p-3 rounded-2xl border border-papelKraft/40 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full">
            <button
              onClick={() => setSelectedFilter('todos')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-corpo lowercase transition-all shrink-0 cursor-pointer ${
                selectedFilter === 'todos'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              todos ({allPosts.length})
            </button>

            <button
              onClick={() => setSelectedFilter('21dias')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-corpo lowercase transition-all shrink-0 cursor-pointer ${
                selectedFilter === '21dias'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              21 dias de escrita
            </button>

            <button
              onClick={() => setSelectedFilter('livres')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-corpo lowercase transition-all shrink-0 cursor-pointer ${
                selectedFilter === 'livres'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              textos livres
            </button>

            <button
              onClick={() => setSelectedFilter('poesia')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-corpo lowercase transition-all shrink-0 cursor-pointer ${
                selectedFilter === 'poesia'
                  ? 'bg-acentoAzul text-white shadow-xs'
                  : 'bg-white/80 text-tintaCarvao/70 hover:text-tintaCarvao border border-papelKraft/40'
              }`}
            >
              poesia
            </button>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-tintaCarvao/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="buscar histórias..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul transition-colors placeholder:text-tintaCarvao/40 lowercase shadow-xs"
            />
          </div>
        </div>

        {/* FEED DE HISTÓRIAS E TEXTOS DA COMUNIDADE */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-papelKraft/40 rounded-full"></div>
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 bg-papelKraft/40 rounded w-1/4"></div>
                    <div className="h-3 bg-papelKraft/30 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-6 bg-papelKraft/40 rounded w-2/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-papelKraft/30 rounded"></div>
                  <div className="h-4 bg-papelKraft/30 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-10 sm:p-12 text-center space-y-4 shadow-kraft">
            <Flame className="w-12 h-12 text-acentoTerracota/60 mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold font-editorial text-acentoAzul lowercase">
                nenhuma história encontrada
              </h3>
              <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
                {searchQuery
                  ? 'nenhum texto atende aos critérios da sua busca.'
                  : 'seja a primeira a partilhar suas criações com a nossa fogueira!'}
              </p>
            </div>
            <Link
              to="/exercises?new=true"
              className="inline-flex items-center gap-2 bg-acentoTerracota text-white px-6 py-3 rounded-2xl font-gesto text-[22px] lowercase shadow-xs hover:bg-acentoTerracota/90 transition-all cursor-pointer"
            >
              <Feather className="w-5 h-5 text-white" />
              <span>partilhar o seu texto</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const isExpanded = expandedPosts.has(post.id);
              const isCommenting = commentingPost === post.id;
              const rawContent = post.writing_exercise.content || '';
              const plainText = stripHtmlTags(rawContent);
              const wordCount = plainText.trim().split(/\s+/).filter((word) => word.length > 0).length;
              const needsExpand = wordCount > 35;

              return (
                <div
                  id={`post-${post.id}`}
                  key={post.id}
                  className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-6 sm:p-8 shadow-kraft space-y-5 select-text focus:outline-none transition-shadow hover:shadow-md"
                >
                  {/* CABEÇALHO DO AUTOR */}
                  <div className="flex items-center justify-between border-b border-papelKraft/30 pb-4">
                    <div className="flex items-center gap-3.5">
                      <Link to={`/profile/${post.user_profile.id}`}>
                        {post.user_profile.profile_picture_url ? (
                          <img
                            src={post.user_profile.profile_picture_url}
                            alt={post.user_profile.display_name}
                            className="w-11 h-11 rounded-full object-cover shrink-0 border border-papelKraft/40"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-acentoAzul text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                            {post.user_profile.display_name.charAt(0)}
                          </div>
                        )}
                      </Link>

                      <div className="space-y-0.5">
                        <Link
                          to={`/profile/${post.user_profile.id}`}
                          className="font-bold font-editorial text-lg sm:text-xl text-acentoAzul hover:text-acentoTerracota transition-colors lowercase block leading-tight"
                        >
                          {post.user_profile.display_name}
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs font-corpo text-tintaCarvao/55">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(post.published_at).toLocaleDateString('pt-BR', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="px-3.5 py-1 rounded-full bg-acentoAzul/10 text-acentoAzul text-xs font-bold font-corpo lowercase">
                      fogueira • partilha
                    </span>
                  </div>

                  {/* TÍTULO EDITORIAL DO TEXTO */}
                  <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-acentoAzul lowercase leading-snug">
                    “{post.writing_exercise.title}”
                  </h2>

                  {/* CARTÃO DE LEITURA EDITORIAL DO TEXTO (FOLHA DE MANUSCRITO) */}
                  <div className="bg-white/95 p-5 sm:p-7 rounded-2xl border border-papelKraft/30 border-l-4 border-l-acentoTerracota/80 font-corpo text-sm sm:text-base text-tintaCarvao/90 leading-relaxed lowercase space-y-3 shadow-xs">
                    {isExpanded ? (
                      <div
                        className="prose prose-sm max-w-none font-corpo text-tintaCarvao/90 lowercase leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{ __html: rawContent }}
                      />
                    ) : (
                      <p className="font-corpo text-tintaCarvao/90 lowercase leading-relaxed italic">
                        "{getWordPreview(rawContent, 38)}"
                      </p>
                    )}
                  </div>

                  {/* BOTÃO LER MAIS / RECOLHER TEXTO */}
                  {needsExpand && (
                    <div className="pt-1">
                      <button
                        onClick={() => toggleExpand(post.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-papelClaro border border-papelKraft/40 text-xs font-bold font-corpo text-acentoTerracota lowercase transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>{isExpanded ? 'recolher texto' : 'ler texto completo'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {/* BARRA DE AÇÕES SOCIAIS */}
                  <div className="flex items-center justify-between pt-4 border-t border-papelKraft/30">
                    <div className="flex items-center gap-3">
                      {/* BOTÃO CURTIR / LIKES */}
                      <button
                        onClick={() => handleLike(post.id, post.user_liked)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold font-corpo transition-all cursor-pointer border ${
                          post.user_liked
                            ? 'bg-red-50 text-red-600 border-red-200 shadow-xs'
                            : 'bg-white text-tintaCarvao/70 border-papelKraft/40 hover:bg-papelClaro hover:text-red-600'
                        }`}
                        title={post.user_liked ? 'descurtir' : 'curtir'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            post.user_liked ? 'fill-current text-red-600' : ''
                          } ${animatingHeart === post.id ? 'scale-125' : ''}`}
                        />
                        <span>{post.likes_count || 0} curtidas</span>
                      </button>

                      {/* BOTÃO COMENTÁRIOS */}
                      <button
                        onClick={() => toggleComments(post.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold font-corpo transition-all cursor-pointer border ${
                          isCommenting
                            ? 'bg-acentoAzul/10 text-acentoAzul border-acentoAzul/30'
                            : 'bg-white text-tintaCarvao/70 border-papelKraft/40 hover:bg-papelClaro hover:text-acentoAzul'
                        }`}
                        title="ver partilhas e comentários"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments_count || 0} comentários</span>
                      </button>
                    </div>

                    {/* BOTÃO COMPARTILHAR LINK */}
                    <button
                      onClick={() => handleShareLink(post.id)}
                      className="p-2 text-tintaCarvao/50 hover:text-acentoAzul hover:bg-white rounded-xl border border-transparent hover:border-papelKraft/40 transition-all cursor-pointer"
                      title="copiar link da partilha"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* SEÇÃO DE COMENTÁRIOS ANINHALDOS */}
                  {isCommenting && (
                    <div className="pt-4 border-t border-papelKraft/30 space-y-4 animate-fadeIn">
                      {/* FORMULÁRIO DE NOVO COMENTÁRIO */}
                      <form onSubmit={(e) => handleCommentSubmit(post.id, e)} className="space-y-2">
                        {replyTo && (
                          <div className="flex items-center justify-between px-3 py-1.5 bg-acentoAzul/10 rounded-xl text-xs text-acentoAzul font-corpo">
                            <span>
                              respondendo a <span className="font-bold">{replyToName}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setReplyTo(null);
                                setReplyToName('');
                              }}
                              className="text-acentoTerracota font-bold hover:underline"
                            >
                              cancelar
                            </button>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="escreva seu comentário na fogueira..."
                            className="flex-1 px-4 py-2.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul placeholder:text-tintaCarvao/40 lowercase shadow-xs"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2.5 bg-acentoAzul hover:bg-acentoAzul/90 text-white rounded-xl font-gesto text-[18px] lowercase transition-colors cursor-pointer shadow-xs shrink-0 flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">comentar</span>
                          </button>
                        </div>
                      </form>

                      {/* LISTA DE COMENTÁRIOS */}
                      <div className="space-y-3 bg-white p-4 rounded-2xl border border-papelKraft/30 max-h-80 overflow-y-auto">
                        {(postComments[post.id] || []).length === 0 ? (
                          <p className="text-xs text-tintaCarvao/50 font-editorial italic text-center py-2">
                            nenhum comentário ainda. seja a primeira a partilhar uma reflexão!
                          </p>
                        ) : (
                          postComments[post.id]?.map((comment) => (
                            <div key={comment.id} className="space-y-2 pb-2.5 border-b border-papelKraft/20 last:border-0 last:pb-0">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2">
                                  {comment.user_profile?.profile_picture_url ? (
                                    <img
                                      src={comment.user_profile.profile_picture_url}
                                      alt={comment.user_profile?.display_name}
                                      className="w-7 h-7 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-7 h-7 bg-acentoAzul text-white rounded-full flex items-center justify-center text-[10px] font-bold uppercase">
                                      {comment.user_profile?.display_name?.charAt(0)}
                                    </div>
                                  )}
                                  <span className="font-editorial font-bold text-xs text-acentoAzul lowercase">
                                    {comment.user_profile?.display_name}
                                  </span>
                                </div>

                                {profile?.id === comment.user_id && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => startEditComment(comment)}
                                      className="p-1 text-tintaCarvao/40 hover:text-acentoAzul"
                                      title="editar"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment.id, post.id)}
                                      className="p-1 text-tintaCarvao/40 hover:text-red-600"
                                      title="excluir"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {editingComment === comment.id ? (
                                <div className="space-y-2 pt-1">
                                  <input
                                    type="text"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-papelClaro border border-papelKraft/40 rounded-lg text-xs font-corpo text-tintaCarvao focus:outline-none lowercase"
                                  />
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setEditingComment(null)}
                                      className="px-2.5 py-1 text-[11px] font-corpo text-tintaCarvao/60 hover:text-tintaCarvao"
                                    >
                                      cancelar
                                    </button>
                                    <button
                                      onClick={() => handleUpdateComment(comment.id, post.id)}
                                      className="px-3 py-1 bg-acentoAzul text-white rounded-lg text-[11px] font-corpo"
                                    >
                                      salvar
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-xs font-corpo text-tintaCarvao/85 lowercase leading-relaxed pl-9">
                                  {comment.content}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* BOTÃO LER MAIS POSTS / CARREGAR MAIS */}
            {displayedPosts.length < allPosts.length && (
              <div className="text-center pt-4">
                <button
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                  className="px-6 py-2.5 rounded-2xl bg-white hover:bg-papelClaro border border-papelKraft/40 text-acentoAzul font-gesto text-[20px] lowercase transition-all cursor-pointer shadow-xs"
                >
                  {loadingMore ? 'carregando...' : 'carregar mais histórias'}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
