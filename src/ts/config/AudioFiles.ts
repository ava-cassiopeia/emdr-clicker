/**
 * Represents a list of options for audio files to represent clicks.
 */
export const AudioFiles: AudioFile[] = [
  {
    id: "chime",
    uiName: "Chime",
    sources: {
      left: "/clicks/chime-left.mp3",
      right: "/clicks/chime-right.mp3",
    }
  }
];

/**
 * Represents a single audio file config.
 */
export type AudioFile = {
  id: string;
  uiName: string;
  sources: AudioFileSources;
};

type AudioFileSources = {
  left: string;
  right: string;
};
