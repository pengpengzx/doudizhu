// ui button audio
export const AUDIO_MAP = {
  "default": require("@/assets/audio/btn.mp3"),
  "call": require("@/assets/audio/angry.mp3"),
  "notCall": require("@/assets/audio/soft.wav"),
  "hit": require("@/assets/audio/hit.mp3"),
  "start": require("@/assets/audio/btn.mp3"),
};

export function playAudio(type) {
    new Audio(AUDIO_MAP[type]).play();
}