import { useState } from 'react';
import { extractYouTubeVideoId, generateYouTubeEmbedUrl } from '../lib/youtubeUtils';
import { Loader2, AlertCircle } from 'lucide-react';

interface YouTubeEmbedProps {
  videoUrl: string;
  title?: string;
  className?: string;
}

export default function YouTubeEmbed({ videoUrl, title = 'YouTube Video', className = '' }: YouTubeEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const videoId = extractYouTubeVideoId(videoUrl);

  if (!videoId) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center space-x-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">URL de vídeo inválida. Por favor, use um link válido do YouTube.</p>
        </div>
      </div>
    );
  }

  const embedUrl = generateYouTubeEmbedUrl(videoId);

  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <div className="text-center px-4">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-700">Erro ao carregar o vídeo</p>
              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                className="mt-3 text-sm text-amber-600 hover:text-amber-700 font-medium"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        <iframe
          src={embedUrl}
          title={title}
          className={`absolute inset-0 w-full h-full rounded-xl shadow-lg transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          style={{
            border: 'none',
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none z-10 rounded-xl"
          onContextMenu={(e) => e.preventDefault()}
          style={{
            background: 'transparent',
          }}
        />
      </div>
    </div>
  );
}
