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
    <div className={`bg-white/80 rounded-2xl border border-papelKraft/35 p-3 sm:p-3.5 shadow-sm space-y-2 ${className}`}>
      <audio ref={audioRef} src={currentAudio.audio_file_url} preload="metadata" />

      {/* Linha Única Integrada de Áudio: Play + Título + Onda Sonora + Timers + Velocidade */}
      <div className="flex items-center gap-3">
        {/* Play Button */}
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          className="w-9 h-9 rounded-full bg-acentoTerracota text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform shrink-0 cursor-pointer disabled:opacity-50"
          aria-label={isPlaying ? 'pausar áudio' : 'reproduzir áudio'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          )}
        </button>

        {/* Título e Onda Sonora */}
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-bold font-editorial text-acentoAzul lowercase truncate">
              {currentAudio.title}
            </span>
            <span className="font-light font-corpo text-tintaCarvao/60 text-[11px] shrink-0">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Progress Waveform Bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-5 rounded-md bg-papelClaro/70 border border-papelKraft/30 flex items-center px-1.5 cursor-pointer relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-acentoTerracota/15 transition-all"
              style={{ width: `${progressPercent}%` }}
            />

            <div className="w-full flex items-center justify-between gap-0.5 z-10">
              {[...Array(28)].map((_, i) => {
                const isPast = (i / 28) * 100 <= progressPercent;
                return (
                  <div
                    key={i}
                    className={`w-0.5 sm:w-1 rounded-full transition-all ${
                      isPast ? 'bg-acentoTerracota' : 'bg-papelKraft/40'
                    } ${isPlaying && isPast ? 'animate-pulse' : ''}`}
                    style={{
                      height: `${6 + Math.abs(Math.sin(i * 0.7)) * 10}px`,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Velocidade (1x, 1.25x, 1.5x) */}
        <button
          type="button"
          onClick={() => {
            const rates = [1, 1.25, 1.5, 2];
            const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
            setPlaybackRate(rates[nextIdx]);
          }}
          className="px-2.5 py-1 rounded-full bg-white border border-papelKraft/40 text-[11px] font-normal font-corpo text-acentoAzul hover:bg-papelKraft/20 transition-colors lowercase shrink-0 cursor-pointer shadow-sm"
          title="velocidade de reprodução"
        >
          {playbackRate}x
        </button>
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-between text-[11px] font-light font-corpo text-tintaCarvao/60 pt-0.5 border-t border-papelKraft/20">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-acentoAzul disabled:opacity-40 hover:underline lowercase"
          >
            ← anterior
          </button>
          <span>
            {currentIndex + 1} de {audioFiles.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === audioFiles.length - 1}
            className="text-acentoAzul disabled:opacity-40 hover:underline lowercase"
          >
            próximo →
          </button>
        </div>
      )}
    </div>
  );
}
