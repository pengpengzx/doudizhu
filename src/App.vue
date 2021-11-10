<template>
  <div id="app">
    <Poker/>
  </div>
</template>

<script>
import Poker from "./components/Poker.vue";
import { loadSound, playSound } from "./constant/audio.js";
let isLoadSound = false;
export default {
  name: "App",
  components: {
    Poker,
  },
  created() {},
  mounted() {
    var detectOrient = function () {
      var width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight,
        $wrapper = document.getElementById("app"),
        style = "";
      if (width >= height) {
        // 横屏
        style += "width:" + width + "px;"; // 注意旋转后的宽高切换
        style += "height:" + height + "px;";
        style += "-webkit-transform: rotate(0); transform: rotate(0);";
        style += "-webkit-transform-origin: 0 0;";
        style += "transform-origin: 0 0;";
      } else {
        // 竖屏
        style += "width:" + height + "px;";
        style += "height:" + width + "px;";
        style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
        // 注意旋转中点的处理
        style +=
          "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
        style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
      }
      $wrapper.style.cssText = style;
    };
    window.onresize = detectOrient;
    detectOrient();

    document.body.addEventListener(
      "click",
      function () {
        if (isLoadSound) return;
        isLoadSound && playSound("nothing");
        isLoadSound = true;
      },
      false
    );
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* font-family: ; */
}
html,
body,
#app {
  height: 100%;
}
#app {
  background: url("./assets/background.jpg");
  background-size: cover;
  background-position: 0 -34vh;
}
button {
  border: 0;
  outline: none;
  background-color: transparent;
}
* {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none; /*系统默认菜单被禁用*/
  -webkit-user-select: none; /*webkit浏览器*/
  -khtml-user-select: none; /*早期浏览器*/
  -moz-user-select: none; /*火狐*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}
input,textarea {
    -webkit-user-select:auto; /*webkit浏览器*/
    margin: 0px;
    padding: 0px;
    outline: none;
}
@media all and (orientation: landscape) {
  /*横屏时代码*/
}

@media all and (orientation: portrait) {
  /*竖屏时代码*/
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    /* font-family: ; */
  }
  html,
  body,
  #app {
    width: 100%;
  }
  #app {
    background: url("./assets/background.jpg");
    background-size: cover;
    background-position: 0 -34vw;
  }
  button {
    border: 0;
    outline: none;
    background-color: transparent;
  }
}
</style>
