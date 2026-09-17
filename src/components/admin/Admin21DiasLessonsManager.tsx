import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import LessonModal from '../LessonModal';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Video,
  Music,
  FileText,
  CheckCircle,
  ExternalLink,
  Layers,
} from 'lucide-react';
import type { Database } from '../../lib/database.types';

import { LESSONS_21_DIAS_DATA } from '../../data/lessons21DiasData';

type Lesson = Database['public']['Tables']['course_lessons']['Row'];
type Course = Database['public']['Tables']['courses']['Row'];

export default function Admin21DiasLessonsManager() {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    fetch21DiasCourseAndLessons();
  }, []);

  const fetch21DiasCourseAndLessons = async () => {
    setLoading(true);
    try {
      // Find course matching 21 dias
      let { data: courses, error } = await supabase
        .from('courses')
        .select('*')
        .or('slug.eq.21-dias-de-escrita,title.ilike.%21 dias%')
        .limit(1);

      let currentCourse = courses && courses.length > 0 ? courses[0] : null;

      if (!currentCourse) {
        // Create 21 dias course if not exists
        const { data: newCourse, error: createError } = await supabase
          .from('courses')
          .insert([
            {
              title: '21 dias de escrita sem cobrança',
              slug: '21-dias-de-escrita',
              description: 'programa guiado de 21 dias de escrita autoral e presença.',
              is_published: true,
            },
          ])
          .select();

        if (newCourse && newCourse.length > 0) {
          currentCourse = newCourse[0];
        }
      }

      setCourse(currentCourse);

      if (currentCourse) {
        const { data: lessonsData, error: lessonsError } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', currentCourse.id)
          .order('order_index', { ascending: true });

        if (!lessonsError && lessonsData && lessonsData.length > 0) {
          setLessons(lessonsData);
        } else if (currentCourse) {
          // Auto-seed with canonical 21 lessons data
          const lessonsToInsert = LESSONS_21_DIAS_DATA.map((l) => ({
            course_id: currentCourse!.id,
            title: `Dia ${l.day}: ${l.title}`,
            description: `${l.opening}\n\nExercício:\n${l.exercise}`,
            order_index: l.day,
            tags: [l.week === 1 ? 'semana 1: olhar para dentro' : l.week === 2 ? 'semana 2: olhar para fora' : 'semana 3: olhar para o entre'],
          }));

          const { data: seeded, error: seedErr } = await supabase
            .from('course_lessons')
            .insert(lessonsToInsert)
            .select();

          if (!seedErr && seeded) {
            setLessons(seeded);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching 21 dias course/lessons:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setLessonModalOpen(true);
  };

  const handleCreateLesson = () => {
    setSelectedLesson(null);
    setLessonModalOpen(true);
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('tem certeza que deseja excluir esta lição dos 21 dias?')) return;

    try {
      await supabase.from('course_lessons').delete().eq('id', lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (err) {
      console.error('Error deleting lesson:', err);
    }
  };

  return (
    <div className="bg-papelClaro rounded-3xl border border-papelKraft/40 p-5 sm:p-7 shadow-kraft space-y-6">
      {/* CABEÇALHO DE GESTÃO DAS AULAS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-papelKraft/30 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-acentoAzul/10 text-acentoAzul text-[11px] font-bold font-corpo lowercase">
              conteúdo pedagógico • 21 dias de escrita
            </span>
          </div>
          <h3 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            gestão de aulas & áudios binaurais
          </h3>
          <p className="text-xs font-corpo text-tintaCarvao/70 lowercase">
            edição das 22 lições diárias, vídeos do youtube, arquivos de áudio binaural e guias em pdf
          </p>
        </div>

        <button
          onClick={handleCreateLesson}
          disabled={!course}
          className="px-4 py-2.5 rounded-2xl bg-acentoAzul hover:bg-acentoAzul/90 text-white font-gesto text-[20px] lowercase shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          <span>+ nova lição</span>
        </button>
      </div>

      {/* LISTAGEM DAS 22 LIÇÕES */}
      {loading ? (
        <div className="py-8 text-center text-xs font-corpo text-tintaCarvao/60 lowercase">
          carregando lições dos 21 dias...
        </div>
      ) : lessons.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-2xl border border-papelKraft/30 p-6 space-y-2">
          <BookOpen className="w-8 h-8 text-acentoAzul/40 mx-auto" />
          <p className="text-sm font-editorial font-bold text-acentoAzul lowercase">
            nenhuma lição cadastrada no banco de dados
          </p>
          <p className="text-xs font-corpo text-tintaCarvao/60 lowercase">
            clique em "+ nova lição" para cadastrar os temas diários.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-papelKraft/40 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-acentoAzul/60 transition-all"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-acentoAzul/10 border border-acentoAzul/30 text-acentoAzul font-gesto text-xl font-normal flex items-center justify-center shrink-0">
                  {String(lesson.order_index || idx + 1).padStart(2, '0')}
                </div>

                <div className="space-y-1 min-w-0">
                  <h4 className="font-editorial font-bold text-base text-acentoAzul lowercase truncate">
                    {lesson.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-corpo text-tintaCarvao/60 lowercase">
                    {lesson.video_url && (
                      <span className="px-2 py-0.5 rounded-md bg-acentoTerracota/10 text-acentoTerracota border border-acentoTerracota/30 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        <span>vídeo youtube</span>
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded-md bg-acentoOliva/10 text-acentoOliva border border-acentoOliva/30 flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      <span>áudio binaural</span>
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-papelClaro border border-papelKraft/40 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-tintaCarvao/60" />
                      <span>guia em pdf</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleEditLesson(lesson)}
                  className="px-3.5 py-1.5 rounded-xl bg-acentoAzul/10 hover:bg-acentoAzul/20 text-acentoAzul font-corpo text-xs font-bold lowercase flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>editar aula</span>
                </button>

                <button
                  onClick={() => handleDeleteLesson(lesson.id)}
                  className="p-1.5 rounded-xl text-tintaCarvao/40 hover:text-acentoTerracota hover:bg-acentoTerracota/10 transition-colors cursor-pointer"
                  title="excluir aula"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE EDIÇÃO DE AULA (LESSON MODAL) */}
      {lessonModalOpen && course && (
        <LessonModal
          isOpen={lessonModalOpen}
          onClose={() => setLessonModalOpen(false)}
          courseId={course.id}
          lesson={selectedLesson}
          onSuccess={() => {
            setLessonModalOpen(false);
            fetch21DiasCourseAndLessons();
          }}
        />
      )}
    </div>
  );
}
