import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import CourseModal from '../CourseModal';
import {
  AVAILABLE_PRODUCTS,
  getCourseLinkedProducts,
  serializeCourseLinkedProducts,
  getCourseProductLabels,
  cacheCourseProductLinks,
} from '../../lib/courseProductLinks';
import type { Database } from '../../lib/database.types';
import {
  BookOpen,
  Plus,
  Edit3,
  ExternalLink,
  Check,
  Link2,
  Unlink,
  Search,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

type Course = Database['public']['Tables']['courses']['Row'] & {
  lessonCount?: number;
};

interface ProductLinkedCoursesManagerProps {
  productSlug: string;
  productName: string;
}

export default function ProductLinkedCoursesManager({
  productSlug,
  productName,
}: ProductLinkedCoursesManagerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showOtherCourses, setShowOtherCourses] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, [productSlug]);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const coursesWithStats = await Promise.all(
        (data || []).map(async (c) => {
          const { count } = await supabase
            .from('course_lessons')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', c.id);

          return {
            ...c,
            lessonCount: count || 0,
          };
        })
      );

      setCourses(coursesWithStats);
    } catch (err) {
      console.warn('[ProductLinkedCoursesManager] Erro ao carregar oficinas:', err);
    } finally {
      setLoading(false);
    }
  };

  // Oficinas vinculadas a este produto específico
  const linkedCourses = courses.filter((c) => {
    const linked = getCourseLinkedProducts(c);
    return linked.includes(productSlug);
  });

  // Outras oficinas do catálogo que NÃO estão vinculadas a este produto
  const otherCourses = courses.filter((c) => {
    const linked = getCourseLinkedProducts(c);
    return !linked.includes(productSlug);
  });

  // Filtro de busca
  const filterBySearch = (list: Course[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  };

  const handleToggleLink = async (course: Course) => {
    setUpdatingId(course.id);
    try {
      const currentLinked = getCourseLinkedProducts(course);
      const isAlreadyLinked = currentLinked.includes(productSlug);
      const nextLinked = isAlreadyLinked
        ? currentLinked.filter((p) => p !== productSlug)
        : [...currentLinked, productSlug];

      const serialized = serializeCourseLinkedProducts(nextLinked);
      const courseType = nextLinked.length === 0 ? 'free' : 'paid';

      // Atualiza Supabase
      const { error } = await supabase
        .from('courses')
        .update({
          stripe_payment_link: serialized,
          course_type: courseType,
        })
        .eq('id', course.id);

      if (error) throw error;

      // Atualiza cache local
      cacheCourseProductLinks(course.id, nextLinked);

      // Sincroniza com API backend
      try {
        await fetch('/api/courses/product-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseId: course.id,
            products: nextLinked,
          }),
        });
      } catch {}

      await loadCourses();
    } catch (err) {
      console.error('[ProductLinkedCoursesManager] Erro ao alterar vínculo:', err);
      alert('erro ao alterar vínculo da oficina. tente novamente.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateNew = () => {
    setEditingCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  const totalLessonsInProduct = linkedCourses.reduce(
    (acc, c) => acc + (c.lessonCount || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* CABEÇALHO COM MÉTRICAS E BOTÃO DE CRIAR */}
      <div className="bg-papelClaro p-5 sm:p-6 rounded-2xl border border-papelKraft/40 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-acentoAzul" />
            <h2 className="font-gesto font-normal text-2xl sm:text-3xl text-acentoAzul lowercase">
              oficinas vinculadas ao {productName.toLowerCase()}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-corpo text-tintaCarvao/70 lowercase">
            todas as alunas com acesso ativo a este produto têm liberação imediata para as oficinas abaixo.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-corpo text-xs font-semibold lowercase shadow-xs transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ criar oficina para este produto</span>
        </button>
      </div>

      {/* CARDS DE RESUMO */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-papelKraft/40 space-y-1 shadow-2xs">
          <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
            oficinas inclusas
          </span>
          <span className="font-gesto font-normal text-3xl text-acentoAzul">
            {linkedCourses.length}
          </span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">neste produto</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-papelKraft/40 space-y-1 shadow-2xs">
          <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
            total de aulas & rituais
          </span>
          <span className="font-gesto font-normal text-3xl text-acentoOliva">
            {totalLessonsInProduct}
          </span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">aulas gravadas/textos</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-papelKraft/40 space-y-1 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
            outras disponíveis
          </span>
          <span className="font-gesto font-normal text-3xl text-acentoTerracota">
            {otherCourses.length}
          </span>
          <span className="text-[10px] text-tintaCarvao/50 font-corpo block">podem ser vinculadas</span>
        </div>
      </div>

      {/* BARRA DE PESQUISA */}
      <div className="relative">
        <Search className="w-4 h-4 text-tintaCarvao/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="buscar oficina por título ou tema..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-papelKraft/40 text-xs font-corpo lowercase focus:outline-none focus:border-acentoAzul"
        />
      </div>

      {/* LISTAGEM DE OFICINAS VINCULADAS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-corpo font-bold text-xs text-tintaCarvao/80 lowercase">
            oficinas ativas neste produto ({linkedCourses.length})
          </h3>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-papelKraft/40 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
            carregando oficinas...
          </div>
        ) : filterBySearch(linkedCourses).length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-dashed border-papelKraft/60 text-center space-y-3">
            <BookOpen className="w-8 h-8 text-acentoAzul/40 mx-auto" />
            <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
              nenhuma oficina vinculada a este produto no momento.
            </p>
            <button
              onClick={handleCreateNew}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-acentoAzul text-white text-xs font-corpo font-semibold lowercase shadow-xs hover:bg-acentoAzul/90 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>criar primeira oficina</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filterBySearch(linkedCourses).map((course) => {
              const linked = getCourseLinkedProducts(course);
              const labels = getCourseProductLabels(linked);
              const isUpdating = updatingId === course.id;

              return (
                <div
                  key={course.id}
                  className="bg-white p-4 rounded-2xl border border-papelKraft/40 shadow-xs flex flex-col justify-between space-y-4 hover:border-acentoAzul transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-papelKraft/30"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-papelKraft/30 flex items-center justify-center shrink-0">
                        <BookOpen className="w-6 h-6 text-acentoAzul/60" />
                      </div>
                    )}

                    <div className="space-y-1 flex-1 min-w-0">
                      <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase truncate">
                        {course.title}
                      </h4>
                      <p className="text-xs font-corpo text-tintaCarvao/70 lowercase line-clamp-2 leading-relaxed">
                        {course.description || 'sem descrição cadastrada.'}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="px-2 py-0.5 rounded-full bg-acentoOliva/10 text-acentoOliva text-[10px] font-corpo font-semibold lowercase border border-acentoOliva/20">
                          {course.lessonCount || 0} {course.lessonCount === 1 ? 'aula' : 'aulas'}
                        </span>
                        {labels.map((lbl, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-full bg-papelKraft/40 text-tintaCarvao/80 text-[10px] font-corpo lowercase border border-papelKraft/70"
                          >
                            {lbl}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-papelKraft/30 text-xs font-corpo">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(course)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-papelKraft/20 hover:bg-papelKraft/40 text-tintaCarvao text-xs font-corpo lowercase transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-acentoAzul" />
                        <span>editar</span>
                      </button>

                      <a
                        href={`/course/${course.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-papelKraft/20 hover:bg-papelKraft/40 text-tintaCarvao text-xs font-corpo lowercase transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-acentoTerracota" />
                        <span>visualizar</span>
                      </a>
                    </div>

                    <button
                      disabled={isUpdating}
                      onClick={() => handleToggleLink(course)}
                      className="inline-flex items-center gap-1 text-[11px] font-corpo text-acentoTerracota hover:underline cursor-pointer disabled:opacity-50"
                      title="remover vínculo com este produto"
                    >
                      <Unlink className="w-3 h-3" />
                      <span>{isUpdating ? 'atualizando...' : 'desvincular'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SEÇÃO COLAPSÁVEL: VINCULAR OUTRAS OFICINAS DO CATÁLOGO */}
      {otherCourses.length > 0 && (
        <div className="bg-papelClaro rounded-2xl border border-papelKraft/40 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setShowOtherCourses(!showOtherCourses)}
            className="w-full p-4 flex items-center justify-between hover:bg-papelKraft/20 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-acentoTerracota" />
              <span className="font-corpo font-bold text-xs text-tintaCarvao/90 lowercase">
                vincular outras oficinas do acervo ao {productName.toLowerCase()} ({otherCourses.length} disponíveis)
              </span>
            </div>
            {showOtherCourses ? (
              <ChevronUp className="w-4 h-4 text-tintaCarvao/60" />
            ) : (
              <ChevronDown className="w-4 h-4 text-tintaCarvao/60" />
            )}
          </button>

          {showOtherCourses && (
            <div className="p-4 pt-0 border-t border-papelKraft/30 space-y-3">
              <p className="text-xs font-corpo text-tintaCarvao/70 lowercase pt-3">
                clique em <strong className="font-bold">+ vincular</strong> para disponibilizar a oficina imediatamente às alunas deste produto.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherCourses.map((course) => {
                  const isUpdating = updatingId === course.id;
                  const currentLabels = getCourseProductLabels(getCourseLinkedProducts(course));

                  return (
                    <div
                      key={course.id}
                      className="bg-white p-3 rounded-xl border border-papelKraft/40 flex items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <h5 className="font-editorial font-bold text-sm text-acentoAzul lowercase truncate">
                          {course.title}
                        </h5>
                        <p className="text-[11px] font-corpo text-tintaCarvao/60 lowercase truncate">
                          {currentLabels.length > 0
                            ? `vinculada a: ${currentLabels.join(', ')}`
                            : 'oficina gratuita / sem produto'}
                        </p>
                      </div>

                      <button
                        disabled={isUpdating}
                        onClick={() => handleToggleLink(course)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-acentoAzul hover:bg-acentoAzul/90 text-white font-corpo text-xs font-semibold lowercase shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isUpdating ? 'salvando...' : 'vincular'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL DE CRIAÇÃO / EDIÇÃO DE OFICINA */}
      <CourseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setEditingCourse(null);
          loadCourses();
        }}
        course={editingCourse}
        initialProductSlug={productSlug}
      />
    </div>
  );
}
