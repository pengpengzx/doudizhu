
export function playBGM() {
  const bgm = new Audio(require("../assets/audio/bg.mp3"));
  // 循环
  bgm.loop = true;
  bgm.preload = "auto";
  bgm.play();
}

// 操作错误
export function playErrorAudio() {
  const errorAudio = new Audio(require("../assets/audio/error.mp3"));
  errorAudio.preload = "auto";
  errorAudio.play();
}
