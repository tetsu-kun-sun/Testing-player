import React from 'https://esm.sh/react@19?dev';
import ReactDOM from 'https://esm.sh/react-dom@19/client?dev';
import htm from 'https://esm.sh/htm';
import { Play, Pause, ShieldAlert, Info } from 'https://esm.sh/lucide-react';

const html = htm.bind(React.createElement);

const CodecType = {
  H264: 'H.264/AVC',
  H265: 'H.265/HEVC'
};

const CodecSwitch = ({ activeCodec, onToggle }) => {
  return html`
    <div className="flex items-center justify-center space-x-2 bg-gray-100 p-1 rounded-full w-fit mx-auto mb-8 shadow-inner">
      ${[CodecType.H264, CodecType.H265].map((codec) => html`
        <button
          key=${codec}
          onClick=${() => onToggle(codec)}
          className=${`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            activeCodec === codec ? 'bg-[#8B5CF6] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          ${codec === CodecType.H264 ? 'H.264' : 'H.265'}
        </button>
      `)}
    </div>
  `;
};

const PlayerControls = ({ isPlaying, onToggle, disabled }) => {
  return html`
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none group">
      <button
        onClick=${onToggle}
        disabled=${disabled}
        className=${`pointer-events-auto p-8 rounded-full bg-[#8B5CF6] text-white shadow-2xl transform transition-all duration-300 active:scale-95 hover:scale-110 ${
          disabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
        }`}
      >
        ${isPlaying 
          ? html`<${Pause} size=${48} fill="currentColor" />` 
          : html`<${Play} size=${48} className="ml-1" fill="currentColor" />`}
      </button>
    </div>
  `;
};

const App = () => {
  const [activeCodec, setActiveCodec] = React.useState(CodecType.H264);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [error, setError] = React.useState(null);
  const videoRef = React.useRef(null);

  const videoUrls = {
    [CodecType.H264]: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_20MB.mp4',
    [CodecType.H265]: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h265/1080/Big_Buck_Bunny_1080_10s_20MB.mp4'
  };

  const handleCodecChange = (codec) => {
    setActiveCodec(codec);
    setIsPlaying(false);
    setError(null);
  };

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        setError(activeCodec === CodecType.H265 
          ? "Ваш браузер не поддерживает H.265." 
          : "Ошибка воспроизведения.");
      });
    }
  };

  React.useEffect(() => {
    if (videoRef.current) videoRef.current.load();
  }, [activeCodec]);

  return html`
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F3F4F6]">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold mb-3 text-gray-800">Тест H.265</h1>
          <p className="text-gray-500">Проверьте поддержку HEVC в вашем браузере</p>
        </div>

        <${CodecSwitch} activeCodec=${activeCodec} onToggle=${handleCodecChange} />

        <div className="relative bg-white rounded-[2rem] shadow-xl overflow-hidden border-[10px] border-white video-container flex items-center justify-center">
          ${error && html`
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-gray-900/95 text-white p-8 text-center backdrop-blur-sm">
              <${ShieldAlert} size=${80} className="text-red-500 mb-6" />
              <h2 className="text-2xl font-bold mb-2">Не поддерживается</h2>
              <p className="mb-8 text-gray-400">${error}</p>
              <button onClick=${() => handleCodecChange(CodecType.H264)} className="px-8 py-3 bg-[#8B5CF6] rounded-xl font-bold">Вернуться к H.264</button>
            </div>
          `}

          <video
            ref=${videoRef}
            className="w-full h-full object-cover rounded-2xl"
            onPlay=${() => setIsPlaying(true)}
            onPause=${() => setIsPlaying(false)}
            onError=${() => setError(`Формат ${activeCodec} не поддерживается.`)}
            key=${activeCodec}
          >
            <source src=${videoUrls[activeCodec]} type="video/mp4" />
          </video>

          ${!error && html`<${PlayerControls} isPlaying=${isPlaying} onToggle=${togglePlayback} />`}
          
          <div className="absolute top-6 left-6 flex items-center space-x-2 bg-black/40 text-white px-4 py-2 rounded-full text-sm font-bold">
            <div className=${`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span>${activeCodec}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="px-8 py-4 bg-white shadow-md rounded-2xl border border-gray-100 flex flex-col items-center">
            <span className="text-xs text-gray-400 uppercase tracking-widest font-bold">Статус</span>
            <span className="text-xl font-black text-[#8B5CF6]">${isPlaying ? 'ИГРАЕТ' : error ? 'ОШИБКА' : 'ПАУЗА'}</span>
          </div>
          
          <div className="mt-6 flex items-start space-x-3 max-w-md bg-blue-50 p-4 rounded-xl border border-blue-100">
            <${Info} className="text-blue-500 shrink-0 mt-0.5" size=${20} />
            <p className="text-xs text-blue-700">H.265 (HEVC) требует поддержки на уровне железа или ОС. В Chrome на Windows часто нужно ставить расширение из Microsoft Store.</p>
          </div>
        </div>
      </div>
    </div>
  `;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
