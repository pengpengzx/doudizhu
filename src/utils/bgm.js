
const bgm = new Audio(require("../assets/audio/bg.mp3"));
export function playBGM() {
  // 循环
  bgm.loop = true;
  bgm.play();
  document.addEventListener("WeixinJSBridgeReady", function () {
    bgm.play();
 }, false);
}

// 操作错误
export function playErrorAudio() {
  const errorAudio = new Audio(require("../assets/audio/error.mp3"));
  errorAudio.preload = "auto";
  errorAudio.play();
}
