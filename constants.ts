
import { CodecType, VideoSource } from './types';

// These are public test URLs. H.265 is notoriously hard to find persistent public links for,
// so these are standard test samples. 
// Note: If the H.265 link fails, the UI will correctly report an error.
export const VIDEO_SOURCES: Record<CodecType, VideoSource> = {
  [CodecType.H264]: {
    codec: CodecType.H264,
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  [CodecType.H265]: {
    codec: CodecType.H265,
    // HEVC sample from bitmovin or similar public sources
    url: 'https://bitmovin-a.akamaihd.net/content/dataset/multi-codec-hevc/stream_hevc.mp4'
  }
};

export const COLORS = {
  PRIMARY: '#8B5CF6', // violet-500
};
