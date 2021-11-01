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
        if (this.type === "hit") {
          const isValid = this.validateCards();
          if (!isValid) {
            return playErrorAudio();
          } else {
            await this.audio.play();
            console.log(isValid, "参数");
            this.$emit("clickHandler", isValid);
          }
        } else {
          await this.audio.play();
          this.$emit("clickHandler");
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 校验出的牌是否符合规则
    validateCards() {
      // 玩家选中的牌
      const selectedCards = this.filterSelectedCard();
      // 没有选中的牌 返回
      if (selectedCards && selectedCards.length === 0) return false;

      this.player.nowTurnHitCardsList = selectedCards;
      const toBeHitCardType = this.confirmToBeHitType(selectedCards);

      toBeHitCardType && this.dropTheCards(selectedCards);
      return toBeHitCardType;
    },
    // 点击出牌按钮后 校验出的牌是否符合规则 确定没问题后删除手牌上对应的牌
    dropTheCards(toBeDropIndexList) {
      toBeDropIndexList.forEach((el) => {
        const index = this.player.hands.findIndex((el2) => el2.id === el.id);
        this.player.hands.splice(index, 1);
      });
    },
    // 玩家选中的牌
    filterSelectedCard() {
      const tempHitCards = cloneDeep(this.player.hands).filter((el) => {
        return el.isSelected;
      });
      return tempHitCards;
    },
    confirmToBeHitType(hitCards) {
      console.log(
        hitCards,
        "要对付的牌要对付的牌要对付的牌要对付的牌要对付的牌"
      );
      // 单牌
      const cardType = VALIDATE.checkType(hitCards);
      console.log(cardType, "cardType");
      return cardType;
    },
  },
};
</script>

<style>
</style>