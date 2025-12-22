
import React from 'react';
import { CodecType } from '../types';

interface CodecSwitchProps {
  activeCodec: CodecType;
  onToggle: (codec: CodecType) => void;
}

const CodecSwitch: React.FC<CodecSwitchProps> = ({ activeCodec, onToggle }) => {
  return (
    <div className="flex items-center justify-center space-x-2 bg-gray-100 p-1 rounded-full w-fit mx-auto mb-8 shadow-inner">
      <button
        onClick={() => onToggle(CodecType.H264)}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          activeCodec === CodecType.H264
            ? 'bg-[#8B5CF6] text-white shadow-md'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        H.264
      </button>
      <button
        onClick={() => onToggle(CodecType.H265)}
        className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          activeCodec === CodecType.H265
            ? 'bg-[#8B5CF6] text-white shadow-md'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        H.265
      </button>
    </div>
  );
};

export default CodecSwitch;
