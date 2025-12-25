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
    <div className="flex items-center justify-center space-x-1 bg-gray-200/50 p-1 rounded-full w-fit mx-auto mb-6 md:mb-8 shadow-inner border border-gray-300/30">
      ${[CodecType.H264, CodecType.H265].map((codec) => html`
        <button
          key=${codec}
          onClick=${() => onToggle(codec)}
          className=${`px-4 py-2 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
            activeCodec === codec ? 'bg-white text-[#8B5CF6] shadow-sm' : 'text-gray-500 hover:text-gray-700'
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
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        className=${`p-6 md:p-8 rounded-full bg-[#8B5CF6]/90 text-white shadow-2xl backdrop-blur-sm transform transition-all duration-300 ${
          isPlaying ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
        } ${disabled ? 'hidden' : ''}`}
      >
        ${isPlaying 
          ? html`<${Pause} size=${40} className="md:w-12 md:h-12" fill="currentColor" />` 
          : html`<${Play} size=${40} className="md:w-12 md:h-12 ml-1" fill="currentColor" />`}
      </div>
    </div>
  `;
};

const App = () => {
  const [activeCodec, setActiveCodec] = React.useState(CodecType.H264);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [error, setError] = React.useState(null);
  const videoRef = React.useRef(null);

  // Для Safari критически важно указывать codecs="hvc1" в типе источника
  const videoData = {
    [CodecType.H264]: {
      url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_20MB.mp4',
      mime: 'video/mp4; codecs="avc1.42E01E"'
    },
    [CodecType.H265]: {
      url: 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h265/1080/Big_Buck_Bunny_1080_10s_20MB.mp4',
      mime: 'video/mp4; codecs="hvc1"' // Явная метка для Safari
    }
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
        setError(activeCodec === CodecType.H265 
          ? "Safari/Браузер отклонил этот H.265 поток. Возможно, требуется кодировка hvc1 вместо hev1." 
          : "Ошибка воспроизведения.");
      });
    }
  };

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [activeCodec]);

  return html`
    <div className="min-h-screen flex flex-col items-center justify-start md:justify-center p-4 bg-[#F8FAFC]">
      <div className="max-w-4xl w-full mt-4 md:mt-0">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-black mb-2 text-gray-900 tracking-tight">HEVC TESTER</h1>
          <p className="text-sm md:text-base text-gray-500 font-medium">Проверка аппаратной поддержки H.265</p>
        </div>

        <${CodecSwitch} activeCodec=${activeCodec} onToggle=${handleCodecChange} />

        <div 
          onClick=${togglePlayback}
          className="relative bg-white rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl overflow-hidden border-[6px] md:border-[12px] border-white video-container flex items-center justify-center cursor-pointer group"
        >
          ${error && html`
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/95 text-white p-6 text-center backdrop-blur-md">
              <${ShieldAlert} size=${48} className="text-red-500 mb-4 md:mb-6 md:w-20 md:h-20" />
              <h2 className="text-lg md:text-2xl font-bold mb-2">Ошибка кодека</h2>
              <p className="text-xs md:text-sm mb-6 text-gray-400 max-w-xs md:max-w-md">${error}</p>
              <button 
                onClick=${(e) => { e.stopPropagation(); handleCodecChange(CodecType.H264); }} 
                className="px-6 py-2 md:px-8 md:py-3 bg-white text-slate-900 rounded-full font-bold text-sm transition-transform active:scale-95"
              >
                Вернуться к H.264
              </button>
            </div>
          `}

          <video
            ref=${videoRef}
            className="w-full h-full object-cover"
            onPlay=${() => setIsPlaying(true)}
            onPause=${() => setIsPlaying(false)}
            playsInline
            muted
            onError=${() => setError(`Ваше устройство не может декодировать этот ${activeCodec} файл.`)}
            key=${activeCodec}
          >
            <source src=${videoData[activeCodec].url} type=${videoData[activeCodec].mime} />
          </video>

          <${PlayerControls} isPlaying=${isPlaying} disabled=${!!error} />
          
          <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center space-x-2 bg-black/60 backdrop-blur-md text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase">
            <div className=${`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
            <span>${activeCodec}</span>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-6">
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Статус</span>
              <span className=${`text-sm font-extrabold ${isPlaying ? 'text-green-500' : 'text-[#8B5CF6]'}`}>
                ${isPlaying ? 'PLAY' : 'STOP'}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 uppercase font-bold">Кодек</span>
              <span className="text-sm font-extrabold text-slate-700">${activeCodec.split('/')[0]}</span>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 max-w-md bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <${Info} className="text-[#8B5CF6] shrink-0" size=${20} />
            <div className="text-[11px] md:text-xs text-gray-600 leading-relaxed">
              <p className="font-bold text-gray-800 mb-1">Заметка для Apple/Safari:</p>
              Safari требует тега <code className="bg-gray-100 px-1 rounded text-red-500">hvc1</code>. Если видео не идет, значит сервер отдает файл с меткой <code className="bg-gray-100 px-1 rounded text-red-500">hev1</code>, которую Apple считает "нестандартной". В этом случае поможет только перекодирование файла с флагом <code className="bg-gray-100 px-1 rounded">-vtag hvc1</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
