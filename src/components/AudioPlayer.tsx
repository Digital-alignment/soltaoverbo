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
    <div className={`bg-bgPlataforma rounded-2xl border border-papelKraft/40 p-3.5 sm:p-4 shadow-sm space-y-3 ${className}`}>
      <audio ref={audioRef} src={currentAudio.audio_file_url} preload="metadata" />

      {/* Header do Player */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 truncate">
          <Volume2 className="w-4 h-4 text-acentoAzul shrink-0" />
          <h4 className="text-xs sm:text-sm font-bold font-editorial text-acentoAzul lowercase truncate">
            {currentAudio.title}
          </h4>
        </div>

        <button
          type="button"
          onClick={() => {
            const rates = [1, 1.25, 1.5, 2];
            const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
            setPlaybackRate(rates[nextIdx]);
          }}
          className="px-2.5 py-0.5 rounded-full bg-white border border-papelKraft/50 text-xs font-normal font-corpo text-acentoAzul hover:bg-papelKraft/30 transition-colors lowercase shrink-0 cursor-pointer shadow-sm"
          title="velocidade de reprodução"
        >
          {playbackRate}x
        </button>
      </div>

      {/* Player Minimalista de Onda Sonora */}
      <div className="flex items-center gap-3 bg-white p-2.5 sm:p-3 rounded-xl border border-papelKraft/40">
        <button
          type="button"
          onClick={togglePlay}
          disabled={isLoading}
          className="w-10 h-10 rounded-full bg-acentoTerracota text-white flex items-center justify-center shadow-sm hover:scale-105 transition-transform shrink-0 cursor-pointer disabled:opacity-50"
          aria-label={isPlaying ? 'pausar áudio' : 'reproduzir áudio'}
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white ml-0.5" />
          )}
        </button>

        <div className="flex-1 space-y-1 min-w-0">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="h-6 rounded-lg bg-bgPlataforma border border-papelKraft/40 flex items-center px-1.5 cursor-pointer relative overflow-hidden"
          >
            <div
              className="absolute left-0 top-0 bottom-0 bg-acentoTerracota/15 transition-all"
              style={{ width: `${progressPercent}%` }}
            />

            <div className="w-full flex items-center justify-between gap-0.5 z-10">
              {[...Array(30)].map((_, i) => {
                const isPast = (i / 30) * 100 <= progressPercent;
                return (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all ${
                      isPast ? 'bg-acentoTerracota' : 'bg-papelKraft/50'
                    } ${isPlaying && isPast ? 'animate-pulse' : ''}`}
                    style={{
                      height: `${8 + Math.abs(Math.sin(i * 0.7)) * 12}px`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-light font-corpo text-tintaCarvao/60">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {hasMultiple && (
        <div className="flex items-center justify-between text-xs font-light font-corpo text-tintaCarvao/70 pt-1">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-acentoAzul disabled:opacity-40 hover:underline lowercase"
          >
            ← anterior
          </button>
          <span className="text-tintaCarvao/50 text-[10px]">
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
