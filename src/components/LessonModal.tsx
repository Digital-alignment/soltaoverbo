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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {lesson ? 'Editar Aula' : 'Criar Nova Aula'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Ex: Dia 1, Intro, Avançado"
              />
              <p className="text-sm text-gray-500 mt-1">
                Separe múltiplas tags com vírgulas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ordem *
              </label>
              <input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="0"
                min="0"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Use as setas para reordenar
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Aula *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ex: Introdução à Narrativa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Descreva o conteúdo desta aula"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Áudio
            </label>
            <input
              type="url"
              value={audioUrl}
              onChange={(e) => setAudioUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="https://exemplo.com/audio.mp3"
            />
            <p className="text-sm text-gray-500 mt-1">
              Link para o áudio da aula (opcional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link do Zoom
            </label>
            <input
              type="url"
              value={zoomLink}
              onChange={(e) => setZoomLink(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="https://zoom.us/j/..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Link para aula ao vivo (opcional)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL da Gravação
            </label>
            <div className="relative">
              <input
                type="url"
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {recordingUrl && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {isYouTubeUrl(recordingUrl) ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {isYouTubeUrl(recordingUrl)
                ? 'Link do YouTube válido detectado'
                : 'Cole o link do YouTube (ex: https://www.youtube.com/watch?v=... ou https://youtu.be/...)'}
            </p>

            {recordingUrl && isYouTubeUrl(recordingUrl) && (
              <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">
                    Preview da Gravação
                  </label>
                </div>
                <div className="max-w-md mx-auto">
                  <YouTubeEmbed videoUrl={recordingUrl} title="Preview" />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivos de Áudio (Máx. 10 minutos)
              </label>
              <p className="text-sm text-gray-500 mb-3">
                Faça upload de arquivos de áudio para esta aula. Duração máxima: 10 minutos por arquivo.
              </p>

              {audioError && (
                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {audioError}
                </div>
              )}

              <div
                onClick={() => audioInputRef.current?.click()}
                className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center cursor-pointer transition hover:border-purple-400 hover:bg-purple-50"
              >
                <Music className="w-10 h-10 mx-auto mb-3 text-purple-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Clique para selecionar arquivos de áudio
                </p>
                <p className="text-xs text-gray-500">
                  MP3, WAV, M4A, OGG (máx. 50MB, até 10 minutos)
                </p>
                <input
                  ref={audioInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleAudioFileSelect(e.target.files)}
                  className="hidden"
                  accept="audio/*"
                  disabled={audioUploading}
                />
              </div>

              {audioUploading && (
                <div className="mt-3 text-center text-sm text-gray-600">
                  <div className="inline-block w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mr-2" />
                  Processando arquivos de áudio...
                </div>
              )}

              {audioFiles.filter((a) => !a.toDelete).length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Áudios Adicionados ({audioFiles.filter((a) => !a.toDelete).length})
                  </p>
                  {audioFiles.map((audio, index) => {
                    if (audio.toDelete) return null;

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {audio.title}
                            </p>
                            <p className="text-xs text-gray-600">
                              {formatDuration(audio.durationSeconds)} • {formatFileSize(audio.fileSizeBytes)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAudio(index)}
                          className="text-red-500 hover:text-red-700 transition p-2 rounded-lg hover:bg-red-50"
                          title="Remover áudio"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Materiais para Download
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-3 py-1 text-sm rounded-lg transition ${
                    uploadMode === 'file'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Arquivo
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-3 py-1 text-sm rounded-lg transition ${
                    uploadMode === 'url'
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  URL Externa
                </button>
              </div>
            </div>

            {uploadMode === 'file' ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
                  isDragging
                    ? 'border-amber-500 bg-amber-50'
                    : 'border-gray-300 hover:border-amber-400 hover:bg-gray-50'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  Arraste arquivos ou clique para selecionar
                </p>
                <p className="text-xs text-gray-500">
                  PDF, áudio, imagem, vídeo, documentos (máx. 50MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={(e) => handleFileSelect(e.target.files)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp3,.mp4,.wav,.jpg,.jpeg,.png,.gif"
                />
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={urlTitle}
                  onChange={(e) => setUrlTitle(e.target.value)}
                  placeholder="Título do material (opcional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/arquivo.pdf"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleUrlAdd}
                    className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            )}

            {materials.filter((m) => !m.toDelete).length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-gray-700">
                  Materiais Adicionados ({materials.filter((m) => !m.toDelete).length})
                </p>
                {materials.map((material, index) => {
                  if (material.toDelete) return null;

                  const getIcon = () => {
                    switch (material.fileType) {
                      case 'pdf':
                        return <FileText className="w-5 h-5 text-red-500" />;
                      case 'audio':
                        return <FileText className="w-5 h-5 text-blue-500" />;
                      case 'image':
                        return <FileText className="w-5 h-5 text-green-500" />;
                      case 'link':
                        return <ExternalLink className="w-5 h-5 text-gray-500" />;
                      default:
                        return <File className="w-5 h-5 text-gray-500" />;
                    }
                  };

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {getIcon()}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {material.title}
                          </p>
                          {material.fileSize && (
                            <p className="text-xs text-gray-500">
                              {formatFileSize(material.fileSize)}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMaterial(index)}
                        className="text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Salvando...' : lesson ? 'Atualizar Aula' : 'Criar Aula'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
