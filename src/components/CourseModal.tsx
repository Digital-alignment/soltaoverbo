import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: Course | null;
}

export default function CourseModal({ isOpen, onClose, onSuccess, course }: CourseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [courseType, setCourseType] = useState<'free' | 'paid'>('free');
  const [stripePaymentLink, setStripePaymentLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setThumbnailUrl(course.thumbnail_url || '');
      setPreviewUrl(course.thumbnail_url || '');
      setCourseType(course.course_type);
      setStripePaymentLink(course.stripe_payment_link || '');
    } else {
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setPreviewUrl('');
      setCourseType('free');
      setStripePaymentLink('');
    }
    setError('');
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
  }, [course, isOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Por favor, selecione uma imagem válida (JPG, PNG, WebP ou GIF)');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('A imagem deve ter no máximo 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Create a synthetic event to reuse validation logic
    const syntheticEvent = {
      target: { files: [file] }
    } as React.ChangeEvent<HTMLInputElement>;
    handleFileSelect(syntheticEvent);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return thumbnailUrl || null;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `course-${crypto.randomUUID()}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('course-thumbnails')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      setUploadProgress(100);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('course-thumbnails')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err: any) {
      console.error('Upload error:', err);
      throw new Error('Erro ao fazer upload da imagem: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setThumbnailUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error('O título é obrigatório');
      }

      if (!description.trim()) {
        throw new Error('A descrição é obrigatória');
      }

      // Upload image if a file was selected
      let finalThumbnailUrl = thumbnailUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          finalThumbnailUrl = uploadedUrl;
        }
      } else if (uploadMode === 'url') {
        finalThumbnailUrl = thumbnailUrl;
      }

      const courseData = {
        title: title.trim(),
        description: description.trim(),
        thumbnail_url: finalThumbnailUrl.trim() || null,
        course_type: courseType,
        stripe_payment_link: stripePaymentLink.trim() || null,
      };

      if (course) {
        const { error: updateError } = await supabase
          .from('courses')
          .update(courseData as any)
          .eq('id', course.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('courses')
          .insert(courseData as any);

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar curso');
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
            {course ? 'Editar Curso' : 'Criar Novo Curso'}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título do Curso *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ex: Curso de Escrita Criativa"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descrição *
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="Descreva o curso e o que os alunos aprenderão"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem de Capa do Curso
            </label>

            {/* Toggle between upload and URL */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  uploadMode === 'file'
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                }`}
              >
                <Upload className="w-4 h-4 inline mr-1" />
                Fazer Upload
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('url')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  uploadMode === 'url'
                    ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                    : 'bg-gray-100 text-gray-600 border-2 border-gray-200 hover:bg-gray-200'
                }`}
              >
                URL Externa
              </button>
            </div>

            {uploadMode === 'file' ? (
              <div>
                {/* File Upload Area */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 rounded-lg mx-auto object-cover"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {selectedFile && (
                        <div className="text-sm text-gray-600">
                          <p className="font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      )}
                      {uploading && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center text-amber-600">
                            <Loader className="w-5 h-5 animate-spin mr-2" />
                            <span className="text-sm font-medium">Enviando imagem...</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-gray-700 font-medium">
                          Clique para selecionar ou arraste uma imagem
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          JPG, PNG, WebP ou GIF (máx. 10MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => {
                    setThumbnailUrl(e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Cole o URL de uma imagem hospedada externamente
                </p>
                {thumbnailUrl && (
                  <div className="mt-3">
                    <img
                      src={thumbnailUrl}
                      alt="Preview"
                      className="max-h-48 rounded-lg object-cover"
                      onError={() => setError('URL da imagem inválida')}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Curso *
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="free"
                  checked={courseType === 'free'}
                  onChange={(e) => setCourseType(e.target.value as 'free' | 'paid')}
                  className="mr-2"
                />
                <span className="text-gray-700">Gratuito</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="paid"
                  checked={courseType === 'paid'}
                  onChange={(e) => setCourseType(e.target.value as 'free' | 'paid')}
                  className="mr-2"
                />
                <span className="text-gray-700">Premium</span>
              </label>
            </div>
          </div>

          {courseType === 'paid' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Link de Pagamento Stripe
              </label>
              <input
                type="url"
                value={stripePaymentLink}
                onChange={(e) => setStripePaymentLink(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="https://buy.stripe.com/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Link de pagamento do Stripe para este curso premium
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              disabled={loading || uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition disabled:opacity-50 flex items-center"
              disabled={loading || uploading}
            >
              {loading || uploading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  {uploading ? 'Enviando...' : 'Salvando...'}
                </>
              ) : (
                course ? 'Atualizar Curso' : 'Criar Curso'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
