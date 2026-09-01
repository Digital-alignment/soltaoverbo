import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioFile {
  id: string;
  title: string;
  audio_file_url: string;
  duration_seconds: number;
}

interface AudioPlayerProps {
  audioFiles: AudioFile[];
  autoPlay?: boolean;
  className?: string;
}

export default function AudioPlayer({ audioFiles, autoPlay = false, className = '' }: AudioPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const currentAudio = audioFiles[currentIndex];
  const hasMultiple = audioFiles.length > 1;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      if (hasMultiple && currentIndex < audioFiles.length - 1) {
        handleNext();
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        audio.currentTime = 0;
      }
    };

    const handleLoadStart = () => {
      setIsLoading(true);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentIndex, audioFiles.length, hasMultiple]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (autoPlay && audioRef.current && currentAudio) {
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  }, [currentAudio, autoPlay]);

  const togglePlay = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    if (currentIndex < audioFiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setCurrentTime(0);
      if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setCurrentTime(0);
      if (isPlaying && audioRef.current) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };


  if (!currentAudio) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`bg-white rounded-3xl border border-papelKraft/60 p-4 sm:p-6 shadow-kraft space-y-4 ${className}`}>
      <audio ref={audioRef} src={currentAudio.audio_file_url} preload="metadata" />

      {/* Título do Áudio & Contador de Playlist */}
      <div className="flex items-center justify-between gap-3 border-b border-papelKraft/30 pb-3">
        <div>
          <span className="text-xs font-light font-corpo text-tintaCarvao/60 lowercase block">
            {hasMultiple ? `áudio ${currentIndex + 1} de ${audioFiles.length}` : 'áudio da aula'}
          </span>
          <h4 className="text-base sm:text-lg font-bold font-editorial text-acentoAzul lowercase">
            {currentAudio.title}
          </h4>
        </div>

        {/* Velocidade de Reprodução (1x, 1.25x, 1.5x) */}
        <button
          type="button"
          onClick={() => {
            const rates = [1, 1.25, 1.5, 2];
            const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
            setPlaybackRate(rates[nextIdx]);
          }}
          className="px-3 py-1 rounded-full bg-bgPlataforma border border-papelKraft/50 text-xs font-normal font-corpo text-acentoAzul hover:bg-papelKraft/30 transition-colors lowercase"
          title="velocidade de reprodução"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Visual da Barra de Onda Sonora (Inspirado na Referência media_1788227772415.png) */}
      <div className="flex items-center gap-3 bg-bgPlataforma p-3 sm:p-4 rounded-2xl border border-papelKraft/40">
        {/* Botão Play/Pause Circular Minimalista */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          className="w-12 h-12 rounded-full bg-acentoTerracota text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform shrink-0 cursor-pointer disabled:opacity-50"
          aria-label={isPlaying ? 'pausar áudio' : 'reproduzir áudio'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white" />
          ) : (
            <Play className="w-5 h-5 fill-white ml-0.5" />
          )}
        </button>

        {/* Linha da Barra de Onda Sonora e Barra de Progresso Arrastável */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-7 rounded-xl bg-white border border-papelKraft/40 flex items-center px-2 cursor-pointer relative overflow-hidden group/bar"
          >
            {/* Preenchimento de Progresso */}
            <div
              className="absolute left-0 top-0 bottom-0 bg-acentoTerracota/15 transition-all"
              style={{ width: `${progressPercent}%` }}
            />

            {/* Barras de Onda Animadas */}
            <div className="w-full flex items-center justify-between gap-0.5 z-10">
              {[...Array(32)].map((_, i) => {
                const isPast = (i / 32) * 100 <= progressPercent;
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      isPast ? 'bg-acentoTerracota' : 'bg-papelKraft/60'
                    } ${isPlaying && isPast ? 'animate-pulse' : ''}`}
                    style={{
                      height: `${12 + Math.abs(Math.sin(i * 0.8)) * 14}px`,
                      animationDelay: `${i * 0.04}s`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Timers (Atual / Total) em Helvetica font-corpo min 14px */}
          <div className="flex justify-between items-center text-xs sm:text-sm font-light font-corpo text-tintaCarvao/70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Controles Adicionais: Avançar/Voltar 10s e Controle de Volume */}
      <div className="flex items-center justify-between pt-1 text-xs font-light font-corpo text-tintaCarvao/70">
        <div className="flex items-center gap-2">
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="px-3 py-1 rounded-xl bg-bgPlataforma border border-papelKraft/40 text-acentoAzul disabled:opacity-40 hover:bg-papelKraft/30 transition-colors lowercase"
              >
                ← áudio anterior
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={currentIndex === audioFiles.length - 1}
                className="px-3 py-1 rounded-xl bg-bgPlataforma border border-papelKraft/40 text-acentoAzul disabled:opacity-40 hover:bg-papelKraft/30 transition-colors lowercase"
              >
                próximo áudio →
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleMute}
            className="p-1.5 rounded-lg hover:bg-bgPlataforma text-tintaCarvao/70 transition-colors"
            title={isMuted ? 'ativar som' : 'silenciar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-acentoTerracota" />
            ) : (
              <Volume2 className="w-4 h-4 text-acentoAzul" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
          />
        </div>

        {/* Playback Speed */}
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-gray-600">Velocidade:</span>
          <select
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
            className="text-xs sm:text-sm px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
