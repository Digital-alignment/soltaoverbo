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
    <div className={`bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 ${className}`}>
      <audio ref={audioRef} src={currentAudio.audio_file_url} preload="metadata" />

      {/* Audio Title */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{currentAudio.title}</h3>
        {hasMultiple && (
          <p className="text-xs sm:text-sm text-gray-500">
            Áudio {currentIndex + 1} de {audioFiles.length}
          </p>
        )}
      </div>

      {/* Waveform Visual */}
      <div className="mb-3 sm:mb-4 h-16 sm:h-20 rounded-lg flex items-center justify-center overflow-hidden relative" style={{ background: 'linear-gradient(to right, rgba(252, 94, 50, 0.1), rgba(252, 94, 50, 0.2), rgba(252, 94, 50, 0.1))' }}>
        {isPlaying && (
          <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 h-full">
            {[...Array(window.innerWidth < 640 ? 25 : 40)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 sm:w-1 rounded-full animate-pulse"
                style={{
                  background: 'linear-gradient(to top, #fc5e32, rgba(252, 94, 50, 0.6))',
                  height: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${0.8 + Math.random() * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}
        {!isPlaying && (
          <div className="flex items-center justify-center space-x-0.5 sm:space-x-1 h-full opacity-40">
            {[...Array(window.innerWidth < 640 ? 25 : 40)].map((_, i) => (
              <div
                key={i}
                className="w-0.5 sm:w-1 rounded-full"
                style={{
                  background: '#fc5e32',
                  height: `${Math.random() * 60 + 20}%`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-3 sm:mb-4">
        <div
          ref={progressRef}
          onClick={handleProgressClick}
          className="h-3 sm:h-2 bg-gray-200 rounded-full cursor-pointer relative overflow-hidden group"
        >
          <div
            className="h-full rounded-full transition-all duration-100"
            style={{ background: '#fc5e32', width: `${progressPercent}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ borderColor: '#fc5e32', left: `calc(${progressPercent}% - 8px)` }}
          />
        </div>
        <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-gray-600">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center hover:shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          style={{ backgroundColor: '#fc5e32' }}
          title={isPlaying ? 'Pausar' : 'Reproduzir'}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <Play className="w-5 h-5 sm:w-6 sm:h-6 ml-0.5 sm:ml-1" />
          )}
        </button>
      </div>

      {/* Volume and Speed Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleMute}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition active:scale-95"
            title={isMuted ? 'Ativar som' : 'Silenciar'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              handleVolumeChange(e);
              const target = e.target as HTMLInputElement;
              target.style.setProperty('--value', `${(parseFloat(target.value) / 1) * 100}%`);
            }}
            className="w-16 sm:w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{ '--value': `${(isMuted ? 0 : volume) * 100}%` } as React.CSSProperties}
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
