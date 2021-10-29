<template>
  <button @click="clickHandler">{{ name }}</button>
</template>

<script>
import { AUDIO_MAP } from "@/constant/audio.js";
export default {
  name: "UIButton",
  data() {
    return {
      audio: null,
    };
  },
  props: {
    name: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "default",
    },
  },
  mounted() {
    this.audio = new Audio(AUDIO_MAP[this.type]);
  },
  methods: {
    async clickHandler() {
      try {
        console.time('click');
        await this.audio.play();
        this.$emit("clickHandler");
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style>
</style>