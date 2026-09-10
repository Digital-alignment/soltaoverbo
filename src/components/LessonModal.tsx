import { useState, useEffect, useRef } from 'react';
import { X, Upload, FileText, File, Trash2, Link as LinkIcon, ExternalLink, CheckCircle2, AlertCircle, Music, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';
import YouTubeEmbed from './YouTubeEmbed';
import { isYouTubeUrl } from '../lib/youtubeUtils';
import RichTextEditor from './RichTextEditor';
import type { Database } from '../lib/database.types';

type Lesson = Database['public']['Tables']['course_lessons']['Row'];
type Material = Database['public']['Tables']['course_materials']['Row'];
type AudioFile = Database['public']['Tables']['lesson_audio_files']['Row'];

interface StagedAudioFile {
  id?: string;
  file?: File;
  title: string;
  audioFileUrl?: string;
  durationSeconds?: number;
  fileSizeBytes?: number;
  originalFilename?: string;
  mimeType?: string;
  orderIndex: number;
  isNew: boolean;
  toDelete: boolean;
}

interface StagedMaterial {
  id?: string;
  file?: File;
  title: string;
  fileType: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  originalFilename?: string;
  isUploaded: boolean;
  isNew: boolean;
  toDelete: boolean;
}

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseId: string;
  lesson?: Lesson | null;
  maxOrderIndex?: number;
}

export default function LessonModal({
  isOpen,
  onClose,
  onSuccess,
  courseId,
  lesson,
  maxOrderIndex = 0,
}: LessonModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [orderIndex, setOrderIndex] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState('');
  const [zoomLink, setZoomLink] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [materials, setMaterials] = useState<StagedMaterial[]>([]);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [audioFiles, setAudioFiles] = useState<StagedAudioFile[]>([]);
  const [audioUploading, setAudioUploading] = useState(false);
  const [audioError, setAudioError] = useState('');
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadData = async () => {
      if (lesson) {
        setTitle(lesson.title);
        setDescription(lesson.description || '');
        setTagsInput(lesson.tags?.join(', ') || '');
        setOrderIndex(lesson.order_index.toString());
        setAudioUrl(lesson.audio_url || '');
        setZoomLink(lesson.zoom_link || '');
        setRecordingUrl(lesson.recording_url || '');

        const { data: existingMaterials } = await supabase
          .from('course_materials')
          .select('*')
          .eq('lesson_id', lesson.id)
          .order('created_at', { ascending: true });

        if (existingMaterials) {
          setMaterials(
            existingMaterials.map((m) => ({
              id: m.id,
              title: m.title,
              fileType: m.file_type,
              fileUrl: m.file_url,
              fileSize: m.file_size ?? undefined,
              mimeType: m.mime_type ?? undefined,
              originalFilename: m.original_filename ?? undefined,
              isUploaded: m.is_uploaded,
              isNew: false,
              toDelete: false,
            }))
          );
        }

        const { data: existingAudioFiles } = await supabase
          .from('lesson_audio_files')
          .select('*')
          .eq('lesson_id', lesson.id)
          .order('order_index', { ascending: true });

        if (existingAudioFiles) {
          setAudioFiles(
            existingAudioFiles.map((a) => ({
              id: a.id,
              title: a.title,
              audioFileUrl: a.audio_file_url,
              durationSeconds: a.duration_seconds,
              fileSizeBytes: a.file_size_bytes,
              originalFilename: a.original_filename,
              mimeType: a.mime_type,
              orderIndex: a.order_index,
              isNew: false,
              toDelete: false,
            }))
          );
        }
      } else {
        setTitle('');
        setDescription('');
        setTagsInput('');
        setOrderIndex((maxOrderIndex + 1).toString());
        setAudioUrl('');
        setZoomLink('');
        setRecordingUrl('');
        setMaterials([]);
        setAudioFiles([]);
      }
      setError('');
      setAudioError('');
      setUrlInput('');
      setUrlTitle('');
      setUploadProgress({});
    };

    if (isOpen) {
      loadData();
    }
  }, [lesson, isOpen, maxOrderIndex]);

  const getFileType = (file: File): string => {
    const type = file.type.toLowerCase();
    if (type.includes('pdf')) return 'pdf';
    if (type.includes('audio')) return 'audio';
    if (type.includes('image')) return 'image';
    if (type.includes('video')) return 'video';
    if (type.includes('word') || type.includes('document')) return 'document';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'spreadsheet';
    return 'other';
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;

    const newMaterials: StagedMaterial[] = [];
    Array.from(files).forEach((file) => {
      if (file.size > 50 * 1024 * 1024) {
        setError(`Arquivo ${file.name} é muito grande. Máximo: 50MB`);
        return;
      }

      newMaterials.push({
        file,
        title: file.name,
        fileType: getFileType(file),
        fileSize: file.size,
        mimeType: file.type,
        originalFilename: file.name,
        isUploaded: true,
        isNew: true,
        toDelete: false,
      });
    });

    setMaterials([...materials, ...newMaterials]);
  };

  const handleUrlAdd = () => {
    if (!urlInput.trim()) {
      setError('Digite uma URL válida');
      return;
    }

    const newMaterial: StagedMaterial = {
      title: urlTitle.trim() || urlInput.trim(),
      fileType: 'link',
      fileUrl: urlInput.trim(),
      isUploaded: false,
      isNew: true,
      toDelete: false,
    };

    setMaterials([...materials, newMaterial]);
    setUrlInput('');
    setUrlTitle('');
    setError('');
  };

  const handleRemoveMaterial = (index: number) => {
    const material = materials[index];
    if (material.id) {
      setMaterials(
        materials.map((m, i) => (i === index ? { ...m, toDelete: true } : m))
      );
    } else {
      setMaterials(materials.filter((_, i) => i !== index));
    }
  };

  const getAudioDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        window.URL.revokeObjectURL(audio.src);
        resolve(audio.duration);
      };

      audio.onerror = () => {
        window.URL.revokeObjectURL(audio.src);
        reject(new Error('Não foi possível carregar o arquivo de áudio'));
      };

      audio.src = URL.createObjectURL(file);
    });
  };

  const handleAudioFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setAudioUploading(true);
    setAudioError('');

    try {
      const newAudioFiles: StagedAudioFile[] = [];

      for (const file of Array.from(files)) {
        if (!file.type.startsWith('audio/')) {
          setAudioError(`${file.name} não é um arquivo de áudio válido`);
          continue;
        }

        if (file.size > 50 * 1024 * 1024) {
          setAudioError(`${file.name} é muito grande. Máximo: 50MB`);
          continue;
        }

        try {
          const duration = await getAudioDuration(file);

          if (duration > 600) {
            setAudioError(`${file.name} excede o tempo máximo de 10 minutos (duração: ${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')})`);
            continue;
          }

          newAudioFiles.push({
            file,
            title: file.name.replace(/\.[^/.]+$/, ''),
            durationSeconds: Math.floor(duration),
            fileSizeBytes: file.size,
            originalFilename: file.name,
            mimeType: file.type,
            orderIndex: audioFiles.length + newAudioFiles.length,
            isNew: true,
            toDelete: false,
          });
        } catch (err) {
          setAudioError(`Erro ao processar ${file.name}: ${err instanceof Error ? err.message : 'erro desconhecido'}`);
        }
      }

      if (newAudioFiles.length > 0) {
        setAudioFiles([...audioFiles, ...newAudioFiles]);
      }
    } finally {
      setAudioUploading(false);
    }
  };

  const handleRemoveAudio = (index: number) => {
    const audio = audioFiles[index];
    if (audio.id) {
      setAudioFiles(
        audioFiles.map((a, i) => (i === index ? { ...a, toDelete: true } : a))
      );
    } else {
      setAudioFiles(audioFiles.filter((_, i) => i !== index));
    }
  };

  const formatDuration = (seconds?: number): string => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error('O título é obrigatório');
      }

      const tags = tagsInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const lessonData = {
        course_id: courseId,
        title: title.trim(),
        description: description.trim() || '',
        tags: tags,
        order_index: parseInt(orderIndex) || maxOrderIndex + 1,
        audio_url: audioUrl.trim() || null,
        zoom_link: zoomLink.trim() || null,
        recording_url: recordingUrl.trim() || null,
      };

      let lessonId: string;

      if (lesson) {
        const { error: updateError } = await supabase
          .from('course_lessons')
          .update(lessonData as any)
          .eq('id', lesson.id);

        if (updateError) throw updateError;
        lessonId = lesson.id;
      } else {
        const { data: newLesson, error: insertError } = await supabase
          .from('course_lessons')
          .insert(lessonData as any)
          .select()
          .single();

        if (insertError) throw insertError;
        lessonId = newLesson.id;
      }

      const materialsToDelete = materials.filter((m) => m.toDelete && m.id);
      for (const material of materialsToDelete) {
        if (material.isUploaded && material.fileUrl) {
          const filePath = material.fileUrl.split('/').pop();
          if (filePath) {
            await supabase.storage.from('course-materials').remove([filePath]);
          }
        }

        await supabase.from('course_materials').delete().eq('id', material.id!);
      }

      const newMaterials = materials.filter((m) => m.isNew && !m.toDelete);
      for (const material of newMaterials) {
        let fileUrl = material.fileUrl || '';

        if (material.file && material.isUploaded) {
          const fileExt = material.file.name.split('.').pop();
          const fileName = `${lessonId}-${Date.now()}.${fileExt}`;

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('course-materials')
            .upload(fileName, material.file, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from('course-materials').getPublicUrl(fileName);

          fileUrl = publicUrl;
        }

        await supabase.from('course_materials').insert({
          lesson_id: lessonId,
          title: material.title,
          file_url: fileUrl,
          file_type: material.fileType,
          file_size: material.fileSize ?? null,
          mime_type: material.mimeType ?? null,
          original_filename: material.originalFilename ?? null,
          is_uploaded: material.isUploaded,
        });
      }

      const audioFilesToDelete = audioFiles.filter((a) => a.toDelete && a.id);
      for (const audio of audioFilesToDelete) {
        if (audio.audioFileUrl) {
          const filePath = audio.audioFileUrl.split('/').pop();
          if (filePath) {
            await supabase.storage.from('lesson-audio').remove([filePath]);
          }
        }

        await supabase.from('lesson_audio_files').delete().eq('id', audio.id!);
      }

      const newAudioFiles = audioFiles.filter((a) => a.isNew && !a.toDelete);
      for (const audio of newAudioFiles) {
        if (!audio.file || !audio.durationSeconds || !audio.fileSizeBytes) continue;

        const fileExt = audio.file.name.split('.').pop();
        const fileName = `${lessonId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('lesson-audio')
          .upload(fileName, audio.file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('lesson-audio').getPublicUrl(fileName);

        await supabase.from('lesson_audio_files').insert({
          lesson_id: lessonId,
          title: audio.title,
          audio_file_url: publicUrl,
          duration_seconds: audio.durationSeconds,
          file_size_bytes: audio.fileSizeBytes,
          original_filename: audio.originalFilename!,
          mime_type: audio.mimeType!,
          order_index: audio.orderIndex,
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar aula');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn">
      <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-kraft-lg">
        <div className="sticky top-0 bg-papelClaro border-b border-papelKraft/30 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            {lesson ? 'editar leção' : 'criar nova leção'}
          </h2>
          <button
            onClick={onClose}
            className="text-tintaCarvao/50 hover:text-tintaCarvao transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-xs font-corpo lowercase">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                placeholder="ex: dia 1, intro, ritmos"
              />
              <p className="text-[10px] text-tintaCarvao/50 mt-1 font-corpo lowercase">
                separe múltiplas tags com vírgulas
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                ordem *
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
              título da leção *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
              placeholder="ex: aula 1 — o soltar da palavra"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
              descrição da leção *
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="descreva o conteúdo e o exercício da leção..."
            />
          </div>

          {/* ARQUIVOS DE ÁUDIO */}
          <div className="border-t border-papelKraft/30 pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo flex items-center gap-1.5">
                <Music className="w-4 h-4 text-acentoTerracota" />
                <span>áudios da leção</span>
              </label>

              <label className="px-3 py-1 rounded-xl bg-acentoAzul text-white text-xs font-corpo lowercase cursor-pointer hover:bg-acentoAzul/90 transition">
                + adicionar áudio
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleAudioFileSelect(e.target.files)}
                  className="hidden"
                  disabled={audioUploading}
                />
              </label>
            </div>

            {audioError && (
              <p className="text-xs text-red-600 font-corpo lowercase">{audioError}</p>
            )}

            {audioFiles.filter((a) => !a.toDelete).length > 0 && (
              <div className="space-y-2">
                {audioFiles.map((audio, index) => {
                  if (audio.toDelete) return null;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-papelKraft/40 rounded-2xl shadow-xs"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Music className="w-4 h-4 text-acentoAzul flex-shrink-0" />
                        <input
                          type="text"
                          value={audio.title}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAudioFiles(
                              audioFiles.map((a, i) => (i === index ? { ...a, title: val } : a))
                            );
                          }}
                          className="flex-1 px-2.5 py-1 bg-bgPlataforma border border-papelKraft/30 rounded-lg text-xs font-corpo text-tintaCarvao lowercase"
                          placeholder="título do áudio..."
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAudio(index)}
                        className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* MATERIAIS COMPLEMENTARES */}
          <div className="border-t border-papelKraft/30 pt-4 space-y-3">
            <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-acentoTerracota" />
              <span>materiais de apoio (PDFs, imagens e links)</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-3 py-1.5 rounded-xl text-xs font-corpo lowercase transition cursor-pointer ${
                  uploadMode === 'file'
                    ? 'bg-acentoAzul text-white font-bold'
                    : 'bg-white text-tintaCarvao/70 border border-papelKraft/40'
                }`}
              >
                upload de arquivo
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`px-3 py-1.5 rounded-xl text-xs font-corpo lowercase transition cursor-pointer ${
                  uploadMode === 'url'
                    ? 'bg-acentoAzul text-white font-bold'
                    : 'bg-white text-tintaCarvao/70 border border-papelKraft/40'
                }`}
              >
                link externo
              </button>
            </div>

            {uploadMode === 'file' ? (
              <label className="border border-dashed border-papelKraft/60 rounded-2xl p-5 text-center cursor-pointer hover:border-acentoAzul block bg-white">
                <Upload className="w-6 h-6 text-acentoAzul/50 mx-auto mb-1" />
                <span className="text-xs font-bold font-corpo text-acentoAzul lowercase block">
                  clique para anexar arquivos (PDF, Imagens, etc.)
                </span>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="título do link..."
                  className="w-full px-3.5 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 px-3.5 py-1.5 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                  />
                  <button
                    type="button"
                    onClick={handleUrlAdd}
                    className="px-4 py-1.5 bg-acentoAzul text-white rounded-xl text-xs font-corpo lowercase cursor-pointer"
                  >
                    adicionar
                  </button>
                </div>
              </div>
            )}

            {materials.filter((m) => !m.toDelete).length > 0 && (
              <div className="space-y-2">
                {materials.map((material, index) => {
                  if (material.toDelete) return null;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white border border-papelKraft/40 rounded-2xl shadow-xs"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <FileText className="w-4 h-4 text-acentoAzul flex-shrink-0" />
                        <span className="text-xs font-corpo text-tintaCarvao lowercase truncate">
                          {material.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(index)}
                        className="text-red-500 hover:text-red-700 ml-2 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-papelKraft/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-papelKraft/40 text-tintaCarvao/70 text-xs font-corpo lowercase cursor-pointer"
              disabled={loading}
            >
              cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] lowercase shadow-xs transition cursor-pointer disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'salvando...' : lesson ? 'salvar alterações' : 'criar leção'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
