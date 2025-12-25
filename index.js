import React from 'https://esm.sh/react@19?dev';
import ReactDOM from 'https://esm.sh/react-dom@19/client?dev';
import htm from 'https://esm.sh/htm';
import { Play, Pause, ShieldAlert } from 'https://esm.sh/lucide-react';

const html = htm.bind(React.createElement);

const CodecType = {
  H264: 'H.264/AVC',
  H265: 'H.265/HEVC'
};

const CodecSwitch = ({ activeCodec, onToggle }) => {
  return html`
    <div className="flex items-center justify-center space-x-1 bg-gray-200/50 p-1 rounded-full w-fit mx-auto mb-8 shadow-inner border border-gray-300/30">
      ${[CodecType.H264, CodecType.H265].map((codec) => html`
        <button
          key=${codec}
          onClick=${() => onToggle(codec)}
          className=${`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
            activeCodec === codec ? 'bg-white text-[#8B5CF6] shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ${codec === CodecType.H264 ? 'H.264' : 'H.265'}
        </button>
      `)}
    </div>
  `;
};

const PlayerControls = ({ isPlaying, disabled }) => {
  return html`
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className=${`p-8 rounded-full bg-[#8B5CF6]/90 text-white shadow-2xl backdrop-blur-sm transform transition-all duration-300 ${
          isPlaying ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        } ${disabled ? 'hidden' : ''}`}
      >
        ${isPlaying 
          ? html`<${Pause} size=${48} fill="currentColor" />` 
          : html`<${Play} size=${48} className="ml-1" fill="currentColor" />`}
      </div>
    </div>
  `;
};

const App = () => {
  const [activeCodec, setActiveCodec] = React.useState(CodecType.H264);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [error, setError] = React.useState(null);
  const videoRef = React.useRef(null);

  const videoUrls = {
    [CodecType.H264]: './video_h264.mp4',
    [CodecType.H265]: './video_h265.mp4'
  };

  const handleCodecChange = (codec) => {
    setActiveCodec(codec);
    setIsPlaying(false);
    setError(null);
  };

  const togglePlayback = () => {
    if (!videoRef.current || error) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((e) => {
        console.error("Playback error:", e);
        setError("Этот формат не поддерживается вашим устройством или браузером.");
      });
    }
  };

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeCodec]);

  return html`
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black mb-3 text-gray-900 tracking-tight">
            Воспроизведение видео в разных форматах
          </h1>
          <p className="text-base md:text-lg text-gray-500 font-medium">
            Проверьте работу кодека HEVC (H.265) на вашем устройстве
          </p>
        </div>

        <${CodecSwitch} activeCodec=${activeCodec} onToggle=${handleCodecChange} />

        <div 
          onClick=${togglePlayback}
          className="relative bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden border-[8px] md:border-[16px] border-white video-container flex items-center justify-center cursor-pointer group transition-transform active:scale-[0.99]"
        >
          ${error && html`
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 text-white p-8 text-center backdrop-blur-md">
              <${ShieldAlert} size=${64} className="text-red-500 mb-6" />
              <h2 className="text-xl md:text-2xl font-bold mb-3">Ошибка воспроизведения</h2>
              <p className="text-sm text-gray-400 max-w-md">${error}</p>
            </div>
          `}

          <video
            ref=${videoRef}
            className="w-full h-full object-cover"
            onPlay=${() => setIsPlaying(true)}
            onPause=${() => setIsPlaying(false)}
            playsInline
            muted
            onError=${() => setError(`Ваше устройство не может воспроизвести этот файл.`)}
            key=${activeCodec}
          >
            <source src=${videoUrls[activeCodec]} type="video/mp4" />
          </video>

          <${PlayerControls} isPlaying=${isPlaying} disabled=${!!error} />
          
          <div className="absolute top-6 left-6 flex items-center space-x-2 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase">
            <div className=${`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span>${activeCodec.split('/')[0]}</span>
          </div>
        </div>
      </div>
    </div>
  `;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
