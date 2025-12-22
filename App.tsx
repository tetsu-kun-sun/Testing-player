
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import CodecSwitch from './components/CodecSwitch';
import PlayerControls from './components/PlayerControls';
import { CodecType } from './types';
import { VIDEO_SOURCES } from './constants';

const App: React.FC = () => {
  const [activeCodec, setActiveCodec] = useState<CodecType>(CodecType.H264);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleCodecChange = (codec: CodecType) => {
    setActiveCodec(codec);
    setIsPlaying(false);
    setError(null);
  };

  const togglePlayback = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => {
        console.error("Playback failed:", err);
        setError("Ошибка воспроизведения. Вероятно, этот кодек не поддерживается вашим браузером или файл недоступен.");
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeCodec]);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleError = () => {
    setError(`Браузер не может проиграть это видео в формате ${activeCodec}. Поддержка отсутствует.`);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8 bg-gray-50 text-gray-900">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
            Проверка H.265 в браузере
          </h1>
          <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base">
            Переключайтесь между кодеками, чтобы вручную проверить поддержку H.265 (HEVC) в вашей системе.
          </p>
        </div>

        {/* Codec Switcher */}
        <CodecSwitch activeCodec={activeCodec} onToggle={handleCodecChange} />

        {/* Video Player Container */}
        <div className="relative group bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white aspect-video flex items-center justify-center">
          {error ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
              <ShieldAlert size={64} className="text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Ошибка воспроизведения</h3>
              <p className="text-gray-400 max-w-sm">{error}</p>
              <button 
                onClick={() => handleCodecChange(CodecType.H264)}
                className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
              >
                Вернуться к H.264
              </button>
            </div>
          ) : null}

          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-opacity duration-500 ${error ? 'opacity-0' : 'opacity-100'}`}
            playsInline
            onPlay={handlePlay}
            onPause={handlePause}
            onError={handleError}
            key={activeCodec} // Force re-mount or reload on codec change
          >
            <source src={VIDEO_SOURCES[activeCodec].url} type="video/mp4" />
            Ваш браузер не поддерживает тег video.
          </video>

          {/* Central Control Button */}
          {!error && (
            <PlayerControls 
              isPlaying={isPlaying} 
              onToggle={togglePlayback} 
            />
          )}
          
          {/* Overlay info */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium pointer-events-none">
            {activeCodec}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-12 flex flex-col items-center space-y-6">
          <div className="flex items-center space-x-3 px-6 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl w-full max-w-sm justify-center">
            <span className="text-gray-400 text-sm font-medium">Статус:</span>
            <div className="flex items-center text-[#8B5CF6] font-bold">
              {isPlaying ? (
                <div className="flex items-center animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Играет {activeCodec}
                </div>
              ) : error ? (
                <div className="flex items-center text-red-500">
                  <AlertCircle size={18} className="mr-2" />
                  Не поддерживается
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  Готов ({activeCodec})
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
              <div className="flex items-center text-violet-700 font-semibold mb-1">
                <CheckCircle2 size={18} className="mr-2" />
                H.264 / AVC
              </div>
              <p className="text-xs text-violet-600/80 leading-relaxed">
                Отраслевой стандарт. Поддерживается практически всеми браузерами и устройствами.
              </p>
            </div>
            <div className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
              <div className="flex items-center text-violet-700 font-semibold mb-1">
                <ShieldAlert size={18} className="mr-2" />
                H.265 / HEVC
              </div>
              <p className="text-xs text-violet-600/80 leading-relaxed">
                Высокая эффективность. Требует аппаратной поддержки и определенных браузеров.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-16 text-gray-400 text-sm">
        Инструмент ручной проверки кодеков
      </footer>
    </div>
  );
};

export default App;
