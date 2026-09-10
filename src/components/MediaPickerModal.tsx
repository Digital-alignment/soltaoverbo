import React from 'react';
import { X, ImageIcon } from 'lucide-react';
import MediaGalleryManagement from './MediaGalleryManagement';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (url: string) => void;
}

export default function MediaPickerModal({ isOpen, onClose, onSelectUrl }: MediaPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-tintaCarvao/70 backdrop-blur-sm flex items-center justify-center z-[999999] p-4 animate-fadeIn">
      <div className="bg-papelClaro rounded-3xl border border-papelKraft/60 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-kraft-lg flex flex-col">
        {/* CABEÇALHO DO MODAL */}
        <div className="sticky top-0 bg-papelClaro border-b border-papelKraft/30 px-6 py-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-acentoTerracota" />
            <h2 className="font-editorial font-bold text-xl sm:text-2xl text-acentoAzul lowercase">
              selecionar foto do banco de mídias
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-tintaCarvao/50 hover:text-tintaCarvao transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTEÚDO DA GALERIA EM MODO DE SELEÇÃO */}
        <div className="p-6">
          <MediaGalleryManagement
            isPickerMode={true}
            onSelectUrl={(url) => {
              onSelectUrl(url);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
}
