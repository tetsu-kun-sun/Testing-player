import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ShieldAlert, Info } from 'lucide-react';

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
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none group">
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`pointer-events-auto p-8 rounded-full bg-[#8B5CF6] text-white shadow-2xl transform transition-all duration-300 active:scale-95 hover:scale-110 ${
        disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
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
    [CodecType.H264]: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_20MB.mp4',
    [CodecType.H265]: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h265/1080/Big_Buck_Bunny_1080_10s_20MB.mp4'
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
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((e) => {
          console.error("Playback error:", e);
          setError(activeCodec === CodecType.H265 
            ? "Ваш браузер или ОС не поддерживают кодек H.265 (HEVC)." 
            : "Ошибка при попытке воспроизведения.");
        });
      }
    }
  }, [isPlaying, activeCodec]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeCodec]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F3F4F6] text-gray-900">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-gray-800">Тест H.265/HEVC</h1>
          <p className="text-gray-500 text-lg">Проверьте, воспроизводит ли ваш браузер современный формат</p>
        </div>

        <CodecSwitch activeCodec={activeCodec} onToggle={handleCodecChange} />

        <div className="relative bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border-[10px] border-white aspect-video flex items-center justify-center group">
          {error ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/95 text-white p-8 text-center backdrop-blur-sm">
              <ShieldAlert size={80} className="text-red-500 mb-6" />
              <h2 className="text-2xl font-bold mb-2">Не поддерживается</h2>
              <p className="max-w-md mb-8 text-gray-300 leading-relaxed">{error}</p>
              <button 
                onClick={() => handleCodecChange(CodecType.H264)} 
                className="px-8 py-3 bg-[#8B5CF6] rounded-xl font-bold hover:bg-[#7C3AED] transition-all transform hover:scale-105 active:scale-95"
              >
                На переключатель H.264
              </button>
            </div>
          ) : null}

          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-2xl"
            playsInline
            crossOrigin="anonymous"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setError(`Браузер не смог загрузить видео. Возможно, ${activeCodec} не поддерживается.`)}
            key={activeCodec}
          >
            <source src={videoUrls[activeCodec]} type="video/mp4" />
          </video>

          {!error && <PlayerControls isPlaying={isPlaying} onToggle={togglePlayback} />}
          
          <div className="absolute top-6 left-6 flex items-center space-x-2 bg-black/40 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/20">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span>{activeCodec}</span>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center">
          <div className="px-8 py-5 bg-white border border-gray-100 shadow-xl rounded-[1.5rem] flex flex-col items-center space-y-2 min-w-[300px]">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Статус плеера</span>
            <span className="text-xl font-black text-[#8B5CF6]">
              {isPlaying ? `ИДЕТ ПОКАЗ` : error ? "ОШИБКА" : `ГОТОВ`}
            </span>
          </div>
          
          <div className="mt-8 flex items-start space-x-3 max-w-lg bg-indigo-50 p-4 rounded-xl border border-indigo-100">
            <Info className="text-indigo-500 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-indigo-700 leading-relaxed">
              Если видео <b>H.265</b> не запускается или выдает ошибку, это означает, что ваш браузер (или операционная система) не умеет декодировать этот формат. Для Chrome на Windows часто требуется расширение «Расширения для видео HEVC» из Microsoft Store.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;