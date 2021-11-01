<template>
  <button @click="clickHandler">{{ name }}</button>
</template>

<script>
import { AUDIO_MAP } from "@/constant/audio.js";
import cloneDeep from "lodash/cloneDeep.js";
import { playErrorAudio } from "@/utils/bgm.js";
import VALIDATE from "@/utils/validate.js";

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
    player: Object,
  },
  mounted() {
    this.audio = new Audio(AUDIO_MAP[this.type]);
  },
  methods: {
    async clickHandler() {
      try {
        // 如果按钮为【出牌】，玩家出的牌不符合游戏规则，播放错误音效
        if (this.type === "hit" && !this.validateCards()) return playErrorAudio();
        await this.audio.play();
        this.$emit("clickHandler");
      } catch (error) {
        console.log(error);
      }
    },
    // 校验出的牌是否符合规则
    validateCards() {
      const player = this.player;
      let { playerNum } = player;
      console.log(player.hands.length, playerNum, "手牌数量");
      const toBeDropIndexList = [];
      // 玩家选中的牌
      const tempHitCards = cloneDeep(player.hands).filter((el) => {
        if (el.isSelected) {
          toBeDropIndexList.push(el.id);
        }
        return el.isSelected;
      });
      if (tempHitCards && tempHitCards.length === 0) return;

      player.nowTurnHitCardsList = tempHitCards;
      const toBeHitCardType = this.confirmToBeHitType(tempHitCards);
      if (toBeHitCardType) {
        toBeDropIndexList.forEach(el => {
          console.log(el, 'el');
          const index = player.hands.findIndex(el2 => el2.id === el);
          console.log(index, 'index');
          player.hands.splice(index, 1);
        })
      }
      return toBeHitCardType;
    },
    confirmToBeHitType(hitCards) {
      console.log(
        hitCards,
        "要对付的牌要对付的牌要对付的牌要对付的牌要对付的牌"
      );
      // 单牌
      const cardType = VALIDATE.checkType(hitCards);
      console.log(cardType, 'cardType');
      return cardType;
    },
  },
};
</script>

<style>
</style>