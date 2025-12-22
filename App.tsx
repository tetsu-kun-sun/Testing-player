
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ShieldAlert } from 'lucide-react';

enum CodecType {
  H264 = 'H.264/AVC',
  H265 = 'H.265/HEVC'
}

const CodecSwitch: React.FC<{ activeCodec: CodecType; onToggle: (codec: CodecType) => void }> = ({ activeCodec, onToggle }) => (
  <div className="flex items-center justify-center space-x-2 bg-gray-100 p-1 rounded-full w-fit mx-auto mb-8 shadow-inner">
    {[CodecType.H264, CodecType.H265].map((codec) => (
      <button
        key={codec}
        onClick={() => onToggle(codec)}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          activeCodec === codec
            ? 'bg-[#8B5CF6] text-white shadow-md'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        {codec === CodecType.H264 ? 'H.264' : 'H.265'}
      </button>
    ))}
  </div>
);

const PlayerControls: React.FC<{ isPlaying: boolean; onToggle: () => void; disabled?: boolean }> = ({ isPlaying, onToggle, disabled }) => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`pointer-events-auto p-6 rounded-full bg-[#8B5CF6] text-white shadow-xl transform transition-transform active:scale-95 hover:scale-110 ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
      }`}
    >
      {isPlaying ? <Pause size={48} fill="currentColor" /> : <Play size={48} className="ml-1" fill="currentColor" />}
    </button>
  </div>
);

const App: React.FC = () => {
  const [activeCodec, setActiveCodec] = useState<CodecType>(CodecType.H264);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoUrls = {
    [CodecType.H264]: './h264.mp4',
    [CodecType.H265]: './h265.mp4'
  };

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
      videoRef.current.play().catch(() => {
        setError("Ошибка: браузер или устройство не поддерживает этот кодек.");
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeCodec]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-900">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Тест H.265</h1>
          <p className="text-gray-500 text-sm">Проверьте поддержку HEVC вручную</p>
        </div>

        <CodecSwitch activeCodec={activeCodec} onToggle={handleCodecChange} />

        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-white aspect-video flex items-center justify-center">
          {error ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900 text-white p-6 text-center">
              <ShieldAlert size={64} className="text-red-500 mb-4" />
              <p className="max-w-sm mb-4">{error}</p>
              <button onClick={() => handleCodecChange(CodecType.H264)} className="px-4 py-2 bg-white/10 rounded-lg text-sm">На H.264</button>
            </div>
          ) : null}

          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setError(`Формат ${activeCodec} не поддерживается или файл отсутствует.`)}
            key={activeCodec}
          >
            <source src={videoUrls[activeCodec]} type="video/mp4" />
          </video>

          {!error && <PlayerControls isPlaying={isPlaying} onToggle={togglePlayback} />}
          
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium">
            {activeCodec}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center text-center">
          <div className="px-6 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl flex items-center space-x-3">
            <span className="text-gray-400 text-sm">Статус:</span>
            <span className="font-bold text-[#8B5CF6]">
              {isPlaying ? `Воспроизведение...` : error ? "Ошибка" : `Готов к тесту`}
            </span>
          </div>
          <p className="mt-4 text-xs text-gray-400 italic">
            Для работы теста положите файлы h264.mp4 и h265.mp4 в корень проекта.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
