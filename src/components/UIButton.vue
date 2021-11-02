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
      againstPlayer: null,
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
    playerList: Array,
  },
  mounted() {
    this.audio = new Audio(AUDIO_MAP[this.type]);
  },
  methods: {
    async clickHandler() {
      try {
        // 如果按钮为【出牌】，玩家出的牌不符合游戏规则，播放错误音效
        if (this.type === "hit") {
          this.playerHitHandler();
        } else {
          await this.audio.play();
          this.$emit("clickHandler");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async playerHitHandler() {
      try {
        this.filterSelectedCard();
        const isFreeHit = this.isFreeHit();
        let isValid  = false;
        if (isFreeHit) {
          isValid = this.validateCardsType();
        } else{
          isValid = this.validateCardsRank();
        }
        if (!isValid) {
          return playErrorAudio();
        } else {
          await this.audio.play();
          this.$emit("clickHandler", isValid);
        }
      } catch (error) {
        console.log(error);
      }
    },
    // 校验出的牌是否符合规则
    validateCardsType() {
      // 玩家选中的牌
      const selectedCards = this.selectedCards;
      // 没有选中的牌 返回
      if (selectedCards && selectedCards.length === 0) return false;

      this.player.nowTurnHitCardsList = selectedCards;
      
      const toBeHitCardType = VALIDATE.checkType(selectedCards);

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
      this.selectedCards = tempHitCards;
    },
    // 其他玩家是否都 要不起
    isFreeHit() {
      // 上一个玩家
      let againstPlayer = this.playerList[this.player.preTurn - 1];
      this.againstPlayer = againstPlayer;
      // 上一个玩家出的牌
      let hitCard = againstPlayer.nowTurnHitCardsList;
      // 如果上一家没有出牌 则去找上上家
      if (hitCard.length === 0) {
        againstPlayer = this.playerList[againstPlayer.preTurn - 1];
        hitCard = againstPlayer.nowTurnHitCardsList;
      }
      return hitCard.length === 0;
    },
    validateCardsRank() {
      // 确定出牌的类型
      const type = this.againstPlayer.cardInfo.cardType;
      const target = type.slice(1); 
      const tempType = type.replace(target, target.toLowerCase())
      const isValid = VALIDATE[`check${tempType}`](this.selectedCards);
      return isValid;
    },
  },
};
</script>

<style>
</style>