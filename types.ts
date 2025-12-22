
export enum CodecType {
  H264 = 'H.264/AVC',
  H265 = 'H.265/HEVC'
}

export interface VideoSource {
  codec: CodecType;
  url: string;
}
