
import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({ isPlaying, onToggle, disabled }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`pointer-events-auto p-6 rounded-full bg-[#8B5CF6] text-white shadow-xl transform transition-transform active:scale-95 hover:scale-110 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'opacity-90 hover:opacity-100'
        }`}
        aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}
      >
        {isPlaying ? (
          <Pause size={48} fill="currentColor" />
        ) : (
          <Play size={48} className="ml-1" fill="currentColor" />
        )}
      </button>
    </div>
  );
};

export default PlayerControls;
