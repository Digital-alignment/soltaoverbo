import { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, List, FolderOpen, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import CourseModal from './CourseModal';
import LessonModal from './LessonModal';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];
type Lesson = Database['public']['Tables']['course_lessons']['Row'];
type Material = Database['public']['Tables']['course_materials']['Row'];

interface CourseManagementProps {
  courses: Course[];
  onRefresh: () => void;
}

export default function CourseManagement({ courses, onRefresh }: CourseManagementProps) {
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Record<string, Lesson[]>>({});
  const [materials, setMaterials] = useState<Record<string, Material[]>>({});
  const [materialCounts, setMaterialCounts] = useState<Record<string, number>>({});

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setCourseModalOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('tem certeza que deseja excluir esta oficina? esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);

      if (error) throw error;

      onRefresh();
    } catch (error) {
      console.error('erro ao excluir oficina:', error);
      alert('erro ao excluir oficina. tente novamente.');
    }
  };

  const handleToggleCourse = async (courseId: string) => {
    if (expandedCourse === courseId) {
      setExpandedCourse(null);
      return;
    }

    setExpandedCourse(courseId);

    if (!lessons[courseId]) {
      await loadLessons(courseId);
    }
  };

  const loadLessons = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      setLessons((prev) => ({ ...prev, [courseId]: data || [] }));

      if (data) {
        const counts: Record<string, number> = {};
        for (const lesson of data) {
          const { count } = await supabase
            .from('course_materials')
            .select('*', { count: 'exact', head: true })
            .eq('lesson_id', lesson.id);

          counts[lesson.id] = count || 0;
        }
        setMaterialCounts((prev) => ({ ...prev, ...counts }));
      }
    } catch (error) {
      console.error('erro ao carregar aulas:', error);
    }
  };

  const loadMaterials = async (lessonId: string) => {
    try {
      const { data, error } = await supabase
        .from('course_materials')
        .select('*')
        .eq('lesson_id', lessonId);

      if (error) throw error;

      setMaterials((prev) => ({ ...prev, [lessonId]: data || [] }));
      setMaterialCounts((prev) => ({ ...prev, [lessonId]: data?.length || 0 }));
    } catch (error) {
      console.error('erro ao carregar materiais:', error);
    }
  };

  const handleCreateLesson = (courseId: string) => {
    setSelectedCourse(courses.find((c) => c.id === courseId) || null);
    setSelectedLesson(null);
    setLessonModalOpen(true);
  };

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setSelectedCourse(courses.find((c) => c.id === lesson.course_id) || null);
    setLessonModalOpen(true);
  };

  const handleDeleteLesson = async (lessonId: string, courseId: string) => {
    if (!confirm('tem certeza que deseja excluir esta aula?')) {
      return;
    }

    try {
      const { error } = await supabase.from('course_lessons').delete().eq('id', lessonId);

      if (error) throw error;

      await loadLessons(courseId);
    } catch (error) {
      console.error('erro ao excluir aula:', error);
      alert('erro ao excluir aula. tente novamente.');
    }
  };

  const handleDeleteMaterial = async (materialId: string, lessonId: string) => {
    if (!confirm('tem certeza que deseja excluir este material?')) {
      return;
    }

    try {
      const material = materials[lessonId]?.find((m) => m.id === materialId);

      if (material && material.is_uploaded && material.file_url) {
        const filePath = material.file_url.split('/').pop();
        if (filePath) {
          await supabase.storage.from('course-materials').remove([filePath]);
        }
      }

      const { error } = await supabase.from('course_materials').delete().eq('id', materialId);

      if (error) throw error;

      await loadMaterials(lessonId);
    } catch (error) {
      console.error('erro ao excluir material:', error);
      alert('erro ao excluir material. tente novamente.');
    }
  };

  const handleLessonSuccess = async () => {
    if (expandedCourse) {
      await loadLessons(expandedCourse);
    }
  };

  const handleMoveLessonUp = async (lesson: Lesson, courseId: string) => {
    const courseLessons = lessons[courseId] || [];
    const currentIndex = courseLessons.findIndex((l) => l.id === lesson.id);

    if (currentIndex <= 0) return;

    const previousLesson = courseLessons[currentIndex - 1];

    try {
      await supabase
        .from('course_lessons')
        .update({ order_index: previousLesson.order_index })
        .eq('id', lesson.id);

      await supabase
        .from('course_lessons')
        .update({ order_index: lesson.order_index })
        .eq('id', previousLesson.id);

      await loadLessons(courseId);
    } catch (error) {
      console.error('erro ao reordenar aula:', error);
    }
  };

  const handleMoveLessonDown = async (lesson: Lesson, courseId: string) => {
    const courseLessons = lessons[courseId] || [];
    const currentIndex = courseLessons.findIndex((l) => l.id === lesson.id);

    if (currentIndex >= courseLessons.length - 1) return;

    const nextLesson = courseLessons[currentIndex + 1];

    try {
      await supabase
        .from('course_lessons')
        .update({ order_index: nextLesson.order_index })
        .eq('id', lesson.id);

      await supabase
        .from('course_lessons')
        .update({ order_index: lesson.order_index })
        .eq('id', nextLesson.id);

      await loadLessons(courseId);
    } catch (error) {
      console.error('erro ao reordenar aula:', error);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
          <div>
            <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
              gerenciar oficinas & cursos
            </h2>
            <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
              criação de oficinas autorais, organização de leções e materiais de apoio
            </p>
          </div>

          <button
            onClick={handleCreateCourse}
            className="px-4 py-2 rounded-2xl bg-acentoTerracota hover:bg-acentoTerracota/90 text-white font-gesto text-[19px] lowercase shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ criar oficina</span>
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 bg-white p-8 rounded-2xl border border-papelKraft/30 space-y-3">
            <BookOpen className="w-10 h-10 text-tintaCarvao/30 mx-auto" />
            <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
              nenhuma oficina criada ainda. clique em criar oficina para começar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => {
              const isExpanded = expandedCourse === course.id;
              const courseLessons = lessons[course.id] || [];

              return (
                <div key={course.id} className="bg-white rounded-2xl border border-papelKraft/40 shadow-xs overflow-hidden">
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-editorial font-bold text-lg text-acentoAzul lowercase leading-tight">
                            {course.title}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[10px] font-bold font-corpo lowercase">
                            {course.course_type === 'free' ? 'gratuito' : 'premium'}
                          </span>
                        </div>

                        <div
                          className="text-xs font-corpo text-tintaCarvao/75 lowercase line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: course.description || '' }}
                        />

                        <div className="flex items-center gap-2 text-[11px] font-corpo text-tintaCarvao/50">
                          <List className="w-3.5 h-3.5 text-tintaCarvao/40" />
                          <span>{courseLessons.length} leções cadastradas</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        <button
                          onClick={() => handleToggleCourse(course.id)}
                          className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors cursor-pointer"
                          title={isExpanded ? 'recolher leções' : 'expandir leções'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-2 rounded-xl bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/40 transition-colors cursor-pointer"
                          title="editar oficina"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 rounded-xl bg-papelClaro hover:bg-red-50 text-red-600 border border-papelKraft/40 transition-colors cursor-pointer"
                          title="excluir oficina"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 bg-bgPlataforma border-t border-papelKraft/40 space-y-4">
                      <div className="flex items-center justify-between border-b border-papelKraft/30 pb-3">
                        <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase">
                          leções da oficina
                        </h4>
                        <button
                          onClick={() => handleCreateLesson(course.id)}
                          className="px-3 py-1.5 rounded-xl bg-acentoTerracota text-white font-gesto text-[17px] lowercase shadow-xs hover:bg-acentoTerracota/90 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>adicionar leção</span>
                        </button>
                      </div>

                      {courseLessons.length === 0 ? (
                        <p className="text-xs font-corpo text-tintaCarvao/60 italic text-center py-4">
                          nenhuma leção criada nesta oficina ainda.
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {courseLessons.map((lesson, index) => {
                            const lessonMaterials = materials[lesson.id] || [];
                            const hasMaterials = lessonMaterials.length > 0;
                            const isFirst = index === 0;
                            const isLast = index === courseLessons.length - 1;

                            return (
                              <div
                                key={lesson.id}
                                className="bg-white p-3.5 rounded-xl border border-papelKraft/40 space-y-2 shadow-xs"
                              >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                  
                                  <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-[10px] font-bold font-corpo text-acentoTerracota bg-acentoTerracota/10 px-2 py-0.5 rounded-full">
                                        leção #{lesson.order_index}
                                      </span>
                                      {lesson.tags && lesson.tags.map((tag, tagIndex) => (
                                        <span
                                          key={tagIndex}
                                          className="px-2 py-0.5 rounded-full bg-papelKraft/25 text-tintaCarvao/80 text-[10px] font-corpo lowercase"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                    </div>

                                    <h5 className="font-editorial font-bold text-sm text-acentoAzul lowercase">
                                      {lesson.title}
                                    </h5>

                                    <div className="flex items-center gap-3 text-[10px] font-corpo text-tintaCarvao/60 pt-1">
                                      {lesson.audio_url && <span className="text-acentoOliva font-bold">✓ áudio gravado</span>}
                                      {lesson.zoom_link && <span className="text-acentoAzul font-bold">✓ encontro zoom</span>}
                                      {lesson.recording_url && <span className="text-acentoTerracota font-bold">✓ vídeo gravado</span>}

                                      {(materialCounts[lesson.id] ?? 0) > 0 && (
                                        <button
                                          onClick={() => {
                                            if (!hasMaterials) {
                                              loadMaterials(lesson.id);
                                            }
                                          }}
                                          className="flex items-center gap-1 text-acentoAzul hover:underline cursor-pointer"
                                        >
                                          <FolderOpen className="w-3 h-3" />
                                          <span>
                                            {hasMaterials ? `${lessonMaterials.length} materiais` : `${materialCounts[lesson.id]} materiais`}
                                          </span>
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 self-end sm:self-center">
                                    <button
                                      onClick={() => handleMoveLessonUp(lesson, course.id)}
                                      disabled={isFirst}
                                      className="p-1.5 rounded-lg bg-papelClaro hover:bg-papelKraft/20 text-tintaCarvao/70 disabled:opacity-30 border border-papelKraft/30 transition-colors cursor-pointer"
                                      title="mover para cima"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveLessonDown(lesson, course.id)}
                                      disabled={isLast}
                                      className="p-1.5 rounded-lg bg-papelClaro hover:bg-papelKraft/20 text-tintaCarvao/70 disabled:opacity-30 border border-papelKraft/30 transition-colors cursor-pointer"
                                      title="mover para baixo"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleEditLesson(lesson)}
                                      className="p-1.5 rounded-lg bg-papelClaro hover:bg-papelKraft/20 text-acentoAzul border border-papelKraft/30 transition-colors cursor-pointer"
                                      title="editar leção"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLesson(lesson.id, course.id)}
                                      className="p-1.5 rounded-lg bg-papelClaro hover:bg-red-50 text-red-600 border border-papelKraft/30 transition-colors cursor-pointer"
                                      title="excluir leção"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                </div>

                                {hasMaterials && lessonMaterials.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-papelKraft/30 space-y-1">
                                    <span className="text-[10px] font-bold text-tintaCarvao/60 font-corpo lowercase block">
                                      materiais de apoio:
                                    </span>
                                    <div className="space-y-1">
                                      {lessonMaterials.map((material) => (
                                        <div
                                          key={material.id}
                                          className="flex items-center justify-between text-xs bg-bgPlataforma rounded-lg px-2.5 py-1 border border-papelKraft/30 font-corpo lowercase"
                                        >
                                          <span className="text-tintaCarvao/80">{material.title}</span>
                                          <button
                                            onClick={() => handleDeleteMaterial(material.id, lesson.id)}
                                            className="text-red-600 hover:text-red-700 cursor-pointer"
                                            title="excluir material"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CourseModal
        isOpen={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        onSuccess={() => {
          onRefresh();
          setCourseModalOpen(false);
        }}
        course={selectedCourse}
      />

      <LessonModal
        isOpen={lessonModalOpen}
        onClose={() => setLessonModalOpen(false)}
        onSuccess={handleLessonSuccess}
        courseId={selectedCourse?.id || ''}
        lesson={selectedLesson}
        maxOrderIndex={
          selectedCourse
            ? (lessons[selectedCourse.id] || []).reduce(
                (max, l) => Math.max(max, l.order_index),
                -1
              )
            : 0
        }
      />
    </>
  );
}
