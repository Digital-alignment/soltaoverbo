import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Loader, Grid, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { compressImage } from '../lib/imageCompressor';
import RichTextEditor from './RichTextEditor';
import MediaPickerModal from './MediaPickerModal';
import {
  AVAILABLE_PRODUCTS,
  getCourseLinkedProducts,
  serializeCourseLinkedProducts,
  cacheCourseProductLinks,
} from '../lib/courseProductLinks';
import type { Database } from '../lib/database.types';

type Course = Database['public']['Tables']['courses']['Row'];

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  course?: Course | null;
  initialProductSlug?: string;
}

export default function CourseModal({
  isOpen,
  onClose,
  onSuccess,
  course,
  initialProductSlug,
}: CourseModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [accessModel, setAccessModel] = useState<'free' | 'products'>('products');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(['cafe_com_letras']);
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
      if (course.course_type === 'free') {
        setAccessModel('free');
        setSelectedProducts([]);
      } else {
        setAccessModel('products');
        const linked = getCourseLinkedProducts(course);
        setSelectedProducts(linked.length > 0 ? linked : ['cafe_com_letras']);
      }
    } else {
      setTitle('');
      setDescription('');
      setThumbnailUrl('');
      setPreviewUrl('');
      setAccessModel('products');
      setSelectedProducts(initialProductSlug ? [initialProductSlug] : ['cafe_com_letras']);
    }
    setError('');
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
  }, [course, isOpen, initialProductSlug]);

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
    const fileToUpload = await compressImage(file, {
      maxWidth: 1200,
      quality: 0.82,
      outputFormat: 'image/webp',
    });

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `course-thumbnails/${fileName}`;

    setUploadProgress(30);

    const { error: uploadError } = await supabase.storage
      .from('banners')
      .upload(filePath, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileToUpload.type,
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
      setError('título da oficina é obrigatório');
      return;
    }

    if (!description.trim()) {
      setError('descrição da oficina é obrigatória');
      return;
    }

    if (accessModel === 'products' && selectedProducts.length === 0) {
      setError('por favor, selecione ao menos um produto para vincular a esta oficina.');
      return;
    }

    setLoading(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;

      if (uploadMode === 'file' && selectedFile) {
        setUploading(true);
        finalThumbnailUrl = await uploadFileToSupabase(selectedFile);
      }

      const finalCourseType = accessModel === 'free' ? 'free' : 'paid';
      const finalLink = accessModel === 'free' ? null : serializeCourseLinkedProducts(selectedProducts);

      if (course) {
        const { error: updateError } = await supabase
          .from('courses')
          .update({
            title: title.trim(),
            description: description.trim(),
            thumbnail_url: finalThumbnailUrl || null,
            course_type: finalCourseType,
            stripe_payment_link: finalLink,
            updated_at: new Date().toISOString(),
          })
          .eq('id', course.id);

        if (updateError) throw updateError;

        cacheCourseProductLinks(course.id, selectedProducts);
        fetch('/api/courses/product-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId: course.id, products: selectedProducts }),
        }).catch(() => {});
      } else {
        const { data: insertedData, error: insertError } = await supabase
          .from('courses')
          .insert({
            title: title.trim(),
            description: description.trim(),
            thumbnail_url: finalThumbnailUrl || null,
            course_type: finalCourseType,
            stripe_payment_link: finalLink,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        if (insertedData) {
          cacheCourseProductLinks(insertedData.id, selectedProducts);
          fetch('/api/courses/product-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseId: insertedData.id, products: selectedProducts }),
          }).catch(() => {});
        }
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

          {/* TIPO DE ACESSO & VINCULAÇÃO A PRODUTOS */}
          <div className="space-y-3 pt-2 border-t border-papelKraft/30">
            <div>
              <label className="block text-xs font-bold text-acentoAzul mb-1 lowercase font-corpo">
                modelo de acesso à oficina *
              </label>
              <p className="text-[11px] font-corpo text-tintaCarvao/60 lowercase mb-2.5">
                defina se a oficina é aberta gratuitamente a toda a comunidade ou se requer vínculo com os produtos da plataforma.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAccessModel('products')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    accessModel === 'products'
                      ? 'bg-white border-acentoAzul shadow-xs ring-1 ring-acentoAzul/30'
                      : 'bg-white/60 border-papelKraft/40 hover:bg-white text-tintaCarvao/70'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      accessModel === 'products' ? 'border-acentoAzul bg-acentoAzul' : 'border-papelKraft'
                    }`}>
                      {accessModel === 'products' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-xs font-bold font-corpo text-acentoAzul lowercase">
                      vinculada a produtos
                    </span>
                  </div>
                  <p className="text-[11px] font-corpo text-tintaCarvao/60 lowercase pl-5.5">
                    exclusiva para alunas dos produtos selecionados
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAccessModel('free');
                    setSelectedProducts([]);
                  }}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    accessModel === 'free'
                      ? 'bg-white border-acentoAzul shadow-xs ring-1 ring-acentoAzul/30'
                      : 'bg-white/60 border-papelKraft/40 hover:bg-white text-tintaCarvao/70'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                      accessModel === 'free' ? 'border-acentoAzul bg-acentoAzul' : 'border-papelKraft'
                    }`}>
                      {accessModel === 'free' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="text-xs font-bold font-corpo text-acentoAzul lowercase">
                      oficina gratuita
                    </span>
                  </div>
                  <p className="text-[11px] font-corpo text-tintaCarvao/60 lowercase pl-5.5">
                    acesso livre para todas as alunas cadastradas
                  </p>
                </button>
              </div>
            </div>

            {/* SELEÇÃO MULTI-PRODUTO */}
            {accessModel === 'products' && (
              <div className="bg-white rounded-2xl border border-papelKraft/40 p-4 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-acentoAzul lowercase font-corpo">
                    vincular a quais produtos? (selecione um ou mais) *
                  </label>
                  <span className="text-[10px] font-corpo text-tintaCarvao/50 lowercase">
                    {selectedProducts.length} selecionado(s)
                  </span>
                </div>

                <p className="text-[11px] font-corpo text-tintaCarvao/60 lowercase leading-relaxed">
                  quem tiver acesso ativo a qualquer um dos produtos marcados poderá acessar esta oficina. alunas do ciclo de aprofundamento têm acesso a todos os produtos.
                </p>

                <div className="space-y-2 pt-1">
                  {AVAILABLE_PRODUCTS.map((prod) => {
                    const isChecked = selectedProducts.includes(prod.slug);
                    return (
                      <label
                        key={prod.slug}
                        className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-papelClaro border-acentoAzul/50 shadow-2xs'
                            : 'bg-white border-papelKraft/30 hover:border-papelKraft/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedProducts((prev) => [...prev, prod.slug]);
                            } else {
                              setSelectedProducts((prev) => prev.filter((s) => s !== prod.slug));
                            }
                          }}
                          className="mt-0.5 w-4 h-4 rounded text-acentoAzul focus:ring-acentoAzul border-papelKraft/60 cursor-pointer"
                        />
                        <div className="flex-1">
                          <span className="text-xs font-bold font-editorial text-acentoAzul lowercase block">
                            {prod.label}
                          </span>
                          <span className="text-[11px] font-corpo text-tintaCarvao/60 lowercase block">
                            {prod.description}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

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
