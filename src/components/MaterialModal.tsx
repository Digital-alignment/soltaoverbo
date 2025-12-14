import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Material = Database['public']['Tables']['course_materials']['Row'];

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  lessonId: string;
  material?: Material | null;
}

export default function MaterialModal({
  isOpen,
  onClose,
  onSuccess,
  lessonId,
  material,
}: MaterialModalProps) {
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (material) {
      setTitle(material.title);
      setFileUrl(material.file_url);
      setFileType(material.file_type || '');
    } else {
      setTitle('');
      setFileUrl('');
      setFileType('');
    }
    setError('');
  }, [material, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!title.trim()) {
        throw new Error('O título é obrigatório');
      }

      if (!fileUrl.trim()) {
        throw new Error('O URL do arquivo é obrigatório');
      }

      const materialData = {
        lesson_id: lessonId,
        title: title.trim(),
        file_url: fileUrl.trim(),
        file_type: fileType.trim() || 'pdf',
      };

      if (material) {
        const { error: updateError } = await supabase
          .from('course_materials')
          .update(materialData as any)
          .eq('id', material.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('course_materials')
          .insert(materialData as any);

        if (insertError) throw insertError;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar material');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            {material ? 'Editar Material' : 'Adicionar Material'}
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
              Título do Material *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Ex: Guia de Exercícios - Parte 1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL do Arquivo *
            </label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="https://exemplo.com/arquivo.pdf"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Cole o URL do arquivo (PDF, DOC, etc)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Arquivo
            </label>
            <select
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="doc">Documento</option>
              <option value="video">Vídeo</option>
              <option value="audio">Áudio</option>
              <option value="image">Imagem</option>
              <option value="zip">Arquivo Compactado</option>
              <option value="other">Outro</option>
            </select>
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
              {loading ? 'Salvando...' : material ? 'Atualizar Material' : 'Adicionar Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
