import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Download, Video, Calendar } from 'lucide-react';
import YouTubeEmbed from './YouTubeEmbed';
import AudioPlayer from './AudioPlayer';
import { isYouTubeUrl } from '../lib/youtubeUtils';
import type { Database } from '../lib/database.types';

type Lesson = Database['public']['Tables']['course_lessons']['Row'];
type Material = Database['public']['Tables']['course_materials']['Row'];
type AudioFile = Database['public']['Tables']['lesson_audio_files']['Row'];

interface MobileLessonAccordionProps {
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  onLessonSelect: (lesson: Lesson) => void;
  courseType: string;
  materials: Material[];
  audioFiles: AudioFile[];
  children: React.ReactNode;
}

export default function MobileLessonAccordion({
  lessons,
  selectedLesson,
  onLessonSelect,
  courseType,
  materials,
  audioFiles,
  children,
}: MobileLessonAccordionProps) {
  const lessonRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const previousLessonId = useRef<string | null>(null);

  useEffect(() => {
    if (selectedLesson && previousLessonId.current && previousLessonId.current !== selectedLesson.id) {
      const lessonElement = lessonRefs.current.get(selectedLesson.id);
      if (lessonElement) {
        setTimeout(() => {
          lessonElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 350);
      }
    }
    previousLessonId.current = selectedLesson?.id || null;
  }, [selectedLesson]);

  const handleLessonClick = (lesson: Lesson) => {
    if (selectedLesson?.id === lesson.id) {
      return;
    }
    onLessonSelect(lesson);
  };

  return (
    <div className="space-y-2">
      {lessons.map((lesson, index) => {
        const isExpanded = selectedLesson?.id === lesson.id;

        return (
          <div
            key={lesson.id}
            ref={(el) => {
              if (el) {
                lessonRefs.current.set(lesson.id, el);
              }
            }}
            className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => handleLessonClick(lesson)}
              className={`w-full flex items-center justify-between px-4 py-2 transition-colors ${
                isExpanded
                  ? 'text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              style={
                isExpanded
                  ? { backgroundColor: '#f0e6d1', color: '#1f008f' }
                  : {}
              }
            >
              <div className="flex-1 text-left">
                {lesson.tags && lesson.tags.length > 0 && (
                  <div className="flex gap-1 flex-wrap mb-1">
                    {lesson.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: '#b6c700' }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <span className={`font-semibold text-base ${isExpanded ? '' : 'text-gray-900'}`}
                  style={isExpanded ? { color: '#1f008f' } : {}}
                >
                  {lesson.title}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 flex-shrink-0 ml-2 ${
                  isExpanded ? 'rotate-180' : 'text-gray-500'
                }`}
                style={isExpanded ? { color: '#1f008f' } : {}}
              />
            </button>

            <div
              className={`transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
              } overflow-hidden`}
            >
              {isExpanded && selectedLesson && (
                <div className="p-3 space-y-3" style={{ backgroundColor: '#f0e6d1' }}>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h2>
                    <div
                      className="text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: selectedLesson.description || '' }}
                    />
                  </div>

                  {audioFiles.length > 0 && (
                    <div className="bg-white rounded-lg p-2">
                      <AudioPlayer
                        audioFiles={audioFiles.map(a => ({
                          id: a.id,
                          title: a.title,
                          audio_file_url: a.audio_file_url,
                          duration_seconds: a.duration_seconds
                        }))}
                        className="!p-4"
                      />
                    </div>
                  )}

                  {!audioFiles.length && selectedLesson.audio_url && (
                    <div className="bg-white rounded-lg p-2">
                      <AudioPlayer
                        audioFiles={[{
                          id: 'legacy',
                          title: 'Áudio da Aula',
                          audio_file_url: selectedLesson.audio_url,
                          duration_seconds: 0
                        }]}
                        className="!p-4"
                      />
                    </div>
                  )}

                  {(selectedLesson.zoom_link || selectedLesson.recording_url) && (
                    <div className="space-y-2">
                      {selectedLesson.zoom_link && (
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Video className="w-4 h-4 text-blue-600" />
                            <h3 className="text-base font-semibold text-gray-900">
                              Aula ao Vivo
                            </h3>
                          </div>
                          <a
                            href={selectedLesson.zoom_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-block text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                          >
                            Entrar na Aula
                          </a>
                        </div>
                      )}

                      {selectedLesson.recording_url && (
                        <div className="bg-white rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <h3 className="text-base font-semibold text-gray-900">Gravação</h3>
                          </div>
                          {isYouTubeUrl(selectedLesson.recording_url) ? (
                            <div className="-mx-4">
                              <YouTubeEmbed
                                videoUrl={selectedLesson.recording_url}
                                title={`Gravação - ${selectedLesson.title}`}
                              />
                            </div>
                          ) : (
                            <a
                              href={selectedLesson.recording_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full inline-block text-center bg-gray-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition"
                            >
                              Assistir Gravação
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {materials.length > 0 && (
                    <div className="bg-white rounded-lg p-3">
                      <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center">
                        <Download className="w-4 h-4 mr-2 text-amber-600" />
                        Materiais
                      </h3>
                      <div className="space-y-1">
                        {materials.map((material) => (
                          <a
                            key={material.id}
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                          >
                            <span className="font-medium text-gray-900 group-hover:text-amber-600 transition text-sm">
                              {material.title}
                            </span>
                            <Download className="w-4 h-4 text-gray-400 group-hover:text-amber-600 transition flex-shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-white rounded-lg p-3">
                    {children}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
