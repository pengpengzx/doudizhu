const softSound = loadSound(require("@/assets/audio/soft.mp3"));
const hitSound = loadSound(require("@/assets/audio/hit.mp3"));
const angrySound = loadSound(require("@/assets/audio/angry.mp3"));
const bgmSound = loadSound(require("@/assets/audio/bg.mp3"), { loop: true });
const btnSound = loadSound(require("@/assets/audio/btn.mp3"));
const errorSound = loadSound(require("@/assets/audio/error.mp3"));
const nothingSound = loadSound(require("@/assets/audio/nothing.wav"));
const shuffleSound = loadSound(require("@/assets/audio/shuffle.mp3"));

const AUDIO_MAP = {
  "default": btnSound,
  "call": angrySound,
  "notCall": softSound,
  "hit": hitSound,
  "start": btnSound,
  "bgm": bgmSound,
  "error": errorSound,
  "nothing": nothingSound,
  "shuffle": shuffleSound,
};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export const loadAllSound = async () => {
  const isReady = await Promise.all([softSound, hitSound, angrySound, bgmSound, btnSound, errorSound, nothingSound, shuffleSound]);
  console.log(isReady, 'isReady');
  return isReady;
}

export function loadSound(filename, options = null) {
  return new Promise((resolve, reject) => {
    let sound = { volume: 1, audioBuffer: null, loop: false };
    sound = Object.assign(sound, options);
  
    const ajax = new XMLHttpRequest();
    ajax.open("GET", filename, true);
    ajax.responseType = "arraybuffer";
    ajax.onload = function() {
      audioContext.decodeAudioData(
        ajax.response,
        function(buffer) {
          sound.audioBuffer = buffer;
          resolve(sound);
        },
        function(error) {
          console.log(error);
          reject(error)
        }
      );
    };
  
    ajax.onerror = function() {};
    ajax.send();
  })


}
export async function playSound(soundType, isLoop = false) {
  console.log(soundType, "soundType");
  const sound = await AUDIO_MAP[soundType];
  console.log(sound, 'soundsoundsoundsound');
  if (!sound.audioBuffer) return false;

  const source = audioContext.createBufferSource();
  if (!source) return false;

  source.buffer = sound.audioBuffer;
  if (!source.start) source.start = source.noteOn;

  if (!source.start) return false;
  if (isLoop) {
    source.loop = true;
  }
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
