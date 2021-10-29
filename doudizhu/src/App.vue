<template>
  <div id="app">
    <Poker msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Poker from './components/Poker.vue'

export default {
  name: 'App',
  components: {
    Poker
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  /* font-family: ; */
}
html, body, #app {
  height: 100%;
}
#app {
  background: url('./assets/background.jpg');
  background-size: cover;
  background-position: 0 -34vh;
}
button {
  border: 0;
  outline: none;
  background-color: transparent;
}
</style>
