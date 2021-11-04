const softSound = loadSound(require("@/assets/audio/soft.wav"));
const hitSound = loadSound(require("@/assets/audio/hit.mp3"));
const angrySound = loadSound(require("@/assets/audio/angry.mp3"));
const bgmSound = loadSound(require("@/assets/audio/bg.mp3"));
const btnSound = loadSound(require("@/assets/audio/btn.mp3"));
const errorSound = loadSound(require("@/assets/audio/error.mp3"));
const nothingSound = loadSound(require("@/assets/audio/nothing.wav"));
const AUDIO_MAP = {
  "default": btnSound,
  "call": angrySound,
  "notCall": softSound,
  "hit": hitSound,
  "start": btnSound,
  "bgm": bgmSound,
  "error": errorSound,
  "nothing": nothingSound,
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export function loadSound(filename) {
  const sound = { volume: 1, audioBuffer: null };

  const ajax = new XMLHttpRequest();
  ajax.open("GET", filename, true);
  ajax.responseType = "arraybuffer";
  ajax.onload = function() {
    audioContext.decodeAudioData(
      ajax.response,
      function(buffer) {
        sound.audioBuffer = buffer;
      },
      function(error) {
        console.log(error);
      }
    );
  };

  ajax.onerror = function() {
  };

  ajax.send();

  return sound;
}
export function playSound(soundType) {
  console.log(soundType, 'soundType');
  const sound = AUDIO_MAP[soundType];
  if (!sound.audioBuffer) return false;

  const source = audioContext.createBufferSource();
  if (!source) return false;

  source.buffer = sound.audioBuffer;
  if (!source.start) source.start = source.noteOn;

  if (!source.start) return false;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = sound.volume;
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);

  source.start(0);

  sound.gainNode = gainNode;
  return true;
}
function stopSound(sound) {
  if (sound.gainNode) sound.gainNode.gain.value = 0;
}
function setSoundVolume(sound, volume) {
  sound.volume = volume;

  if (sound.gainNode) sound.gainNode.gain.value = volume;
}

