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
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase.from('courses').delete().eq('id', courseId);

      if (error) throw error;

      onRefresh();
    } catch (error) {
      console.error('Erro ao excluir curso:', error);
      alert('Erro ao excluir curso. Tente novamente.');
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
      console.error('Erro ao carregar aulas:', error);
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
      console.error('Erro ao carregar materiais:', error);
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
    if (!confirm('Tem certeza que deseja excluir esta aula?')) {
      return;
    }

    try {
      const { error } = await supabase.from('course_lessons').delete().eq('id', lessonId);

      if (error) throw error;

      await loadLessons(courseId);
    } catch (error) {
      console.error('Erro ao excluir aula:', error);
      alert('Erro ao excluir aula. Tente novamente.');
    }
  };

  const handleDeleteMaterial = async (materialId: string, lessonId: string) => {
    if (!confirm('Tem certeza que deseja excluir este material?')) {
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
      console.error('Erro ao excluir material:', error);
      alert('Erro ao excluir material. Tente novamente.');
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
      console.error('Erro ao reordenar aula:', error);
      alert('Erro ao reordenar aula. Tente novamente.');
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
      console.error('Erro ao reordenar aula:', error);
      alert('Erro ao reordenar aula. Tente novamente.');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-amber-600" />
            Gerenciar Cursos
          </h2>
          <button
            onClick={handleCreateCourse}
            className="flex items-center px-4 py-2 text-white rounded-lg font-medium transition shadow-lg"
            style={{ backgroundColor: '#1f008f' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#160069'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1f008f'}
          >
            <Plus className="w-5 h-5 mr-2" />
            Criar Curso
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhum curso criado ainda</p>
            <p className="text-sm mt-2">Clique em "Criar Curso" para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course) => {
              const isExpanded = expandedCourse === course.id;
              const courseLessons = lessons[course.id] || [];

              return (
                <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              course.course_type === 'free'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {course.course_type === 'free' ? 'Gratuito' : 'Premium'}
                          </span>
                        </div>
                        <div
                          className="text-sm text-gray-600 mb-3 prose prose-sm max-w-none line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: course.description || '' }}
                        />
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <List className="w-4 h-4" />
                          <span>{courseLessons.length} aulas</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={() => handleToggleCourse(course.id)}
                          className="p-2 text-gray-600 hover:bg-gray-200 rounded-lg transition"
                          title={isExpanded ? 'Recolher' : 'Expandir'}
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Editar curso"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Excluir curso"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">Aulas do Curso</h4>
                        <button
                          onClick={() => handleCreateLesson(course.id)}
                          className="flex items-center px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-200 transition"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Aula
                        </button>
                      </div>

                      {courseLessons.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Nenhuma aula criada ainda
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {courseLessons.map((lesson, index) => {
                            const lessonMaterials = materials[lesson.id] || [];
                            const hasMaterials = lessonMaterials.length > 0;
                            const isFirst = index === 0;
                            const isLast = index === courseLessons.length - 1;

                            return (
                              <div
                                key={lesson.id}
                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1 flex-wrap">
                                      <span className="text-xs font-medium text-gray-500">
                                        #{lesson.order_index}
                                      </span>
                                      {lesson.tags && lesson.tags.length > 0 && (
                                        <>
                                          {lesson.tags.map((tag, tagIndex) => (
                                            <span
                                              key={tagIndex}
                                              className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium"
                                            >
                                              {tag}
                                            </span>
                                          ))}
                                        </>
                                      )}
                                    </div>
                                    <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                        {lesson.description}
                                      </p>
                                    )}
                                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                      {lesson.audio_url && (
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                          Áudio
                                        </span>
                                      )}
                                      {lesson.zoom_link && (
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                                          Zoom
                                        </span>
                                      )}
                                      {lesson.recording_url && (
                                        <span className="flex items-center">
                                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-1"></span>
                                          Gravação
                                        </span>
                                      )}
                                      {(materialCounts[lesson.id] ?? 0) > 0 && (
                                        <button
                                          onClick={() => {
                                            if (!hasMaterials) {
                                              loadMaterials(lesson.id);
                                            }
                                          }}
                                          className="flex items-center hover:text-amber-600"
                                        >
                                          <FolderOpen className="w-3 h-3 mr-1" />
                                          {hasMaterials
                                            ? `${lessonMaterials.length} materiais`
                                            : `${materialCounts[lesson.id]} materiais`}
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={() => handleMoveLessonUp(lesson, course.id)}
                                      disabled={isFirst}
                                      className={`p-1 rounded transition ${
                                        isFirst
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-gray-600 hover:bg-gray-200'
                                      }`}
                                      title="Mover para cima"
                                    >
                                      <ArrowUp className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleMoveLessonDown(lesson, course.id)}
                                      disabled={isLast}
                                      className={`p-1 rounded transition ${
                                        isLast
                                          ? 'text-gray-300 cursor-not-allowed'
                                          : 'text-gray-600 hover:bg-gray-200'
                                      }`}
                                      title="Mover para baixo"
                                    >
                                      <ArrowDown className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleEditLesson(lesson)}
                                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                                      title="Editar aula"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLesson(lesson.id, course.id)}
                                      className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                                      title="Excluir aula"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {hasMaterials && lessonMaterials.length > 0 && (
                                  <div className="mt-3 pt-3 border-t border-gray-200">
                                    <p className="text-xs font-medium text-gray-700 mb-2">
                                      Materiais:
                                    </p>
                                    <div className="space-y-1">
                                      {lessonMaterials.map((material) => (
                                        <div
                                          key={material.id}
                                          className="flex items-center justify-between text-xs bg-white rounded px-2 py-1"
                                        >
                                          <span className="text-gray-700">{material.title}</span>
                                          <button
                                            onClick={() =>
                                              handleDeleteMaterial(material.id, lesson.id)
                                            }
                                            className="text-red-600 hover:text-red-700"
                                            title="Excluir material"
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
