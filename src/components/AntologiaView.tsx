import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Flame,
  Heart,
  Calendar,
  User,
  Share2,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  ArrowRight,
} from 'lucide-react';
import {
  Anthology,
  fetchAnthologies,
  getMonthName,
} from '../lib/anthology';

interface AntologiaViewProps {
  onBackToFogueira?: () => void;
}

export default function AntologiaView({ onBackToFogueira }: AntologiaViewProps) {
  const [anthologies, setAnthologies] = useState<Anthology[]>([]);
  const [selectedAnthologyIndex, setSelectedAnthologyIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadPublishedAnthologies();
  }, []);

  const loadPublishedAnthologies = async () => {
    setLoading(true);
    try {
      const data = await fetchAnthologies({ includeDrafts: false });
      setAnthologies(data);
      if (data.length > 0) {
        setSelectedAnthologyIndex(0);
      }
    } catch (err) {
      console.warn('[AntologiaView] Erro ao carregar:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentAnthology = anthologies[selectedAnthologyIndex] || null;

  const handleShareEdition = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('link da antologia copiado para a área de transferência ✓');
    } else {
      alert(`link da edição: ${url}`);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Sparkles className="w-8 h-8 text-acentoTerracota/50 animate-pulse mx-auto" />
        <p className="font-editorial text-lg text-acentoAzul lowercase">
          abrindo a gaveta da antologia...
        </p>
      </div>
    );
  }

  if (!currentAnthology || anthologies.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-papelClaro border border-papelKraft/40 text-center space-y-4 max-w-2xl mx-auto shadow-kraft">
        <div className="w-14 h-14 rounded-2xl bg-acentoTerracota/10 text-acentoTerracota flex items-center justify-center mx-auto">
          <BookMarked className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-editorial text-2xl font-bold text-acentoAzul lowercase">
            a antologia está sendo tecida
          </h3>
          <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase leading-relaxed">
            as facilitadoras estão reunindo os textos mais acolhidos e aplaudidos da fogueira para compor o
            livreto especial deste mês. continue escrevendo e partilhando!
          </p>
        </div>

        {onBackToFogueira && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onBackToFogueira}
              className="px-5 py-2.5 rounded-2xl bg-acentoAzul text-white text-xs font-corpo font-bold lowercase hover:bg-acentoAzul/90 transition-all cursor-pointer"
            >
              voltar para as partilhas da fogueira →
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in max-w-3xl mx-auto">
      {/* SELETOR DE EDIÇÕES (ARQUIVO HISTÓRICO SE HOUVER MAIS DE UMA) */}
      {anthologies.length > 1 && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white border border-papelKraft/40 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] font-corpo text-tintaCarvao/50 uppercase tracking-wider font-semibold pl-1">
              edições:
            </span>
            {anthologies.map((ant, idx) => (
              <button
                key={ant.id}
                type="button"
                onClick={() => setSelectedAnthologyIndex(idx)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-corpo lowercase transition-all shrink-0 cursor-pointer ${
                  selectedAnthologyIndex === idx
                    ? 'bg-acentoAzul text-white shadow-xs'
                    : 'bg-papelClaro text-tintaCarvao/70 hover:bg-papelKraft/30 border border-papelKraft/40'
                }`}
              >
                {getMonthName(ant.month)} / {ant.year}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleShareEdition}
            className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/30 text-tintaCarvao/70 border border-papelKraft/40 transition-all cursor-pointer shrink-0"
            title="partilhar esta edição"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CAPA & CABEÇALHO DO LIVRETO DIGITAL */}
      <div className="relative text-center space-y-4 p-8 sm:p-12 rounded-3xl bg-papelClaro border border-papelKraft/50 shadow-kraft overflow-hidden">
        {/* Fita Washi decorativa no topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-3.5 bg-acentoTerracota/20 border-b border-acentoTerracota/30 -rotate-1 rounded-b-sm" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-acentoTerracota/10 border border-acentoTerracota/25 text-acentoTerracota text-xs font-bold font-corpo lowercase">
          <Sparkles className="w-3.5 h-3.5" />
          <span>antologia mensal • {getMonthName(currentAnthology.month)} de {currentAnthology.year}</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-5xl font-bold text-acentoAzul lowercase leading-tight">
          {currentAnthology.title}
        </h1>

        <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase max-w-lg mx-auto">
          uma compilação dos textos mais celebrados do coletivo durante a travessia deste mês
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-corpo text-tintaCarvao/60 pt-2">
          <span className="flex items-center gap-1 font-medium">
            <Flame className="w-4 h-4 text-acentoTerracota" />
            {currentAnthology.featured_posts?.length || currentAnthology.featured_post_ids?.length || 0} poemas selecionados
          </span>
          <span>•</span>
          <span className="font-medium">
            curadoria oficial solta o verbo
          </span>
        </div>
      </div>

      {/* PREFÁCIO / NOTA DA CURADORA */}
      {currentAnthology.curator_note && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-papelKraft/40 shadow-xs space-y-4 relative">
          <div className="flex items-center gap-2 text-xs font-corpo font-bold text-acentoTerracota uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>prefácio das facilitadoras</span>
          </div>

          <p className="font-editorial text-base sm:text-lg text-tintaCarvao/90 italic leading-relaxed whitespace-pre-wrap pl-2 border-l-2 border-acentoTerracota/40">
            "{currentAnthology.curator_note}"
          </p>

          <p className="text-right text-xs font-corpo text-acentoAzul font-bold lowercase">
            — bruna riedel & júlia alvim • curadoria
          </p>
        </div>
      )}

      {/* POEMAS IMORTALIZADOS NA ANTOLOGIA */}
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-papelKraft/40 pb-3">
          <h2 className="font-editorial text-2xl font-bold text-acentoAzul lowercase flex items-center gap-2">
            <Flame className="w-5 h-5 text-acentoTerracota" />
            <span>os textos da edição</span>
          </h2>
          <span className="text-xs font-corpo text-tintaCarvao/50 lowercase">
            ordem de acolhimento na fogueira
          </span>
        </div>

        {(!currentAnthology.featured_posts || currentAnthology.featured_posts.length === 0) ? (
          <div className="p-8 rounded-2xl bg-white border border-papelKraft/40 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
            carregando os textos da edição...
          </div>
        ) : (
          <div className="space-y-8">
            {currentAnthology.featured_posts.map((post, index) => (
              <article
                key={post.id}
                className="p-6 sm:p-10 rounded-3xl bg-white border border-papelKraft/40 shadow-kraft space-y-6 relative hover:border-papelKraft transition-all"
              >
                {/* CABEÇALHO DO POEMA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-papelKraft/20 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-acentoTerracota/10 text-acentoTerracota font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        {post.user_profile?.profile_picture_url ? (
                          <img
                            src={post.user_profile.profile_picture_url}
                            alt={post.user_profile.display_name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-full bg-papelKraft/40 flex items-center justify-center text-[10px] font-bold text-tintaCarvao">
                            {(post.user_profile?.display_name || 'a')[0].toLowerCase()}
                          </div>
                        )}
                        <span className="text-xs font-bold font-corpo text-acentoAzul lowercase">
                          {post.user_profile?.display_name || 'escritora da comunidade'}
                        </span>
                      </div>
                      {post.published_at && (
                        <p className="text-[11px] font-corpo text-tintaCarvao/50 lowercase">
                          partilhado em {new Date(post.published_at).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-acentoTerracota/10 border border-acentoTerracota/20 text-acentoTerracota text-xs font-bold font-corpo">
                    <Heart className="w-3.5 h-3.5 fill-acentoTerracota" />
                    <span>{post.likes_count || 0} aplausos da fogueira</span>
                  </div>
                </div>

                {/* TÍTULO DO POEMA */}
                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-tintaCarvao lowercase leading-tight">
                  {post.writing_exercise?.title || 'sem título'}
                </h3>

                {/* CORPO DO TEXTO COM FORMATAÇÃO POÉTICA */}
                <div className="font-editorial text-base sm:text-lg text-tintaCarvao/90 leading-relaxed whitespace-pre-wrap pl-3 sm:pl-5 border-l-2 border-acentoTerracota/40 py-1">
                  {post.writing_exercise?.content || 'conteúdo indisponível'}
                </div>

                {/* RODAPÉ DO POEMA */}
                <div className="flex items-center justify-between text-xs font-corpo text-tintaCarvao/50 pt-2 border-t border-papelKraft/20">
                  <span className="italic">
                    solta o verbo coletivo • antologia {getMonthName(currentAnthology.month)}/{currentAnthology.year}
                  </span>
                  <Link
                    to={`/profile/${post.user_id}`}
                    className="hover:text-acentoAzul transition-colors font-medium lowercase"
                  >
                    ver caderno da autora →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* BANNER FINAL DE CONVITE */}
      <div className="p-8 rounded-3xl bg-papelClaro border border-papelKraft/50 text-center space-y-3 shadow-xs">
        <Sparkles className="w-6 h-6 text-acentoTerracota mx-auto" />
        <h3 className="font-editorial text-xl font-bold text-acentoAzul lowercase">
          o próximo texto da antologia pode ser o seu
        </h3>
        <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase max-w-md mx-auto">
          escreva com honestidade, partilhe suas verdades na fogueira e celebre as palavras das suas colegas.
        </p>
        <div className="pt-2">
          <Link
            to="/exercises?new=true"
            className="px-5 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] lowercase shadow-xs hover:bg-acentoTerracota/90 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>escrever nova partilha</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
