import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader, Grid } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RichTextEditor from './RichTextEditor';
import MediaPickerModal from './MediaPickerModal';
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
  const [isPickerOpen, setIsPickerOpen] = useState(false);
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

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('por favor, selecione uma imagem válida (JPG, PNG, WebP ou GIF)');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('a imagem deve ter no máximo 10MB');
      return;
    }

    setSelectedFile(file);
    setError('');

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
    if (file) {
      const fakeEvent = {
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileSelect(fakeEvent);
    }
  };

  const uploadFileToSupabase = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `course-thumbnails/${fileName}`;

    setUploadProgress(30);

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`erro no upload: ${uploadError.message}`);
    }

    setUploadProgress(70);

    const { data } = supabase.storage.from('banners').getPublicUrl(filePath);

    setUploadProgress(100);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('título do curso é obrigatório');
      return;
    }

    if (!description.trim()) {
      setError('descrição do curso é obrigatória');
      return;
    }

    setLoading(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;

      if (uploadMode === 'file' && selectedFile) {
        setUploading(true);
        finalThumbnailUrl = await uploadFileToSupabase(selectedFile);
      }

      if (course) {
        const { error: updateError } = await supabase
          .from('courses')
          .update({
            title: title.trim(),
            description: description.trim(),
            thumbnail_url: finalThumbnailUrl || null,
            course_type: courseType,
            stripe_payment_link: stripePaymentLink.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', course.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('courses').insert({
          title: title.trim(),
          description: description.trim(),
          thumbnail_url: finalThumbnailUrl || null,
          course_type: courseType,
          stripe_payment_link: stripePaymentLink.trim() || null,
        });

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'erro ao salvar oficina');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-tintaCarvao/60 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-fadeIn">
      <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-kraft-lg">
        
        {/* CABEÇALHO DO MODAL */}
        <div className="sticky top-0 bg-papelClaro border-b border-papelKraft/30 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
            {course ? 'editar oficina' : 'criar nova oficina'}
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

          <div>
            <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
              título da oficina *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
              placeholder="ex: 21 dias de escrita autoral"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
              descrição *
            </label>
            <RichTextEditor
              value={description}
              onChange={setDescription}
              placeholder="descreva a oficina e o que as alunas aprenderão..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
              imagem de capa da oficina
            </label>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`px-3 py-1.5 rounded-xl text-xs font-corpo lowercase transition cursor-pointer ${
                  uploadMode === 'file'
                    ? 'bg-acentoAzul text-white font-bold'
                    : 'bg-white text-tintaCarvao/70 border border-papelKraft/40'
                }`}
              >
                <Upload className="w-3.5 h-3.5 inline mr-1" />
                fazer upload
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
                url externa
              </button>
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-acentoAzul/10 hover:bg-acentoAzul hover:text-white text-acentoAzul text-xs font-bold font-corpo lowercase transition cursor-pointer flex items-center gap-1"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>escolher da galeria</span>
              </button>
            </div>

            {uploadMode === 'file' ? (
              <div>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="border border-dashed border-papelKraft/60 rounded-2xl p-6 text-center hover:border-acentoAzul transition cursor-pointer bg-white"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <ImageIcon className="w-8 h-8 text-acentoAzul/50 mx-auto mb-2" />
                  <p className="text-xs font-bold text-acentoAzul lowercase font-corpo">
                    clique ou arraste uma imagem aqui
                  </p>
                  <p className="text-[10px] text-tintaCarvao/50 lowercase mt-1 font-corpo">
                    PNG, JPG, WebP ou GIF (máx 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => {
                  setThumbnailUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            )}

            {previewUrl && (
              <div className="mt-3 relative rounded-2xl overflow-hidden border border-papelKraft/40 max-h-40">
                <img src={previewUrl} alt="pré-visualização" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setThumbnailUrl('');
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 p-1 bg-tintaCarvao/70 text-white rounded-full hover:bg-tintaCarvao transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
              tipo de acesso
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-corpo lowercase text-tintaCarvao">
                <input
                  type="radio"
                  name="courseType"
                  value="free"
                  checked={courseType === 'free'}
                  onChange={() => setCourseType('free')}
                  className="text-acentoAzul focus:ring-acentoAzul"
                />
                <span>gratuito (todas as alunas)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-corpo lowercase text-tintaCarvao">
                <input
                  type="radio"
                  name="courseType"
                  value="paid"
                  checked={courseType === 'paid'}
                  onChange={() => setCourseType('paid')}
                  className="text-acentoAzul focus:ring-acentoAzul"
                />
                <span>exclusivo premium</span>
              </label>
            </div>
          </div>

          {courseType === 'paid' && (
            <div>
              <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                link de checkout / pagamento (opcional)
              </label>
              <input
                type="url"
                value={stripePaymentLink}
                onChange={(e) => setStripePaymentLink(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-papelKraft/40 rounded-xl text-xs font-corpo text-tintaCarvao focus:outline-none focus:border-acentoAzul lowercase"
                placeholder="https://checkout.stripe.com/..."
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-papelKraft/30">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-white border border-papelKraft/40 text-tintaCarvao/70 text-xs font-corpo lowercase transition cursor-pointer"
            >
              cancelar
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="flex-1 py-2.5 rounded-2xl bg-acentoTerracota text-white font-gesto text-[20px] lowercase shadow-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>salvando...</span>
                </>
              ) : (
                <span>salvar oficina</span>
              )}
            </button>
          </div>
        </form>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectUrl={(url) => {
          setThumbnailUrl(url);
          setPreviewUrl(url);
          setSelectedFile(null);
          setUploadMode('url');
        }}
      />
    </div>
  );
}
