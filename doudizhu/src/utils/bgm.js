const bgm = new Audio(require("../assets/audio/bg.mp3"));

export function play() {
  // 循环
  bgm.loop = true;
  bgm.preload = "auto";
  bgm.play();
}
