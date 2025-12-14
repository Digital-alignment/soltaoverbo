import { useEffect } from 'react';
import { X, Megaphone } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Broadcast = Database['public']['Tables']['admin_broadcasts']['Row'];

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  broadcast: Broadcast | null;
}

export default function BroadcastModal({ isOpen, onClose, broadcast }: BroadcastModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !broadcast) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Image */}
          {broadcast.image_url && (
            <div className="w-full">
              <img
                src={broadcast.image_url}
                alt={broadcast.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Icon and Title */}
            <div className="flex items-start mb-4">
              <div className="bg-amber-100 rounded-full p-3 mr-4 flex-shrink-0">
                <Megaphone className="w-6 h-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {broadcast.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(broadcast.created_at).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="prose prose-sm sm:prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {broadcast.message}
              </p>
            </div>

            {/* Action Button */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="w-full bg-amber-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-600 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
