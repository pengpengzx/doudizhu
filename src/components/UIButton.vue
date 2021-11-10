<template>
  <button @click="clickHandler">{{ name }}</button>
</template>

<script>
import cloneDeep from "lodash/cloneDeep.js";
import VALIDATE, { isBigger } from "@/utils/validate.js";
import { playSound } from "@/constant/audio.js";

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
  },
  methods: {
    async clickHandler() {
      try {
        // 如果按钮为【出牌】，玩家出的牌不符合游戏规则，播放错误音效
        if (this.type === "hit") {
          this.playerHitHandler();
        } else {
          if (this.type === "start") playSound('bgm', true);
          await playSound(this.type);
          this.$emit("clickHandler");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async playerHitHandler() {
      try {
        this.filterSelectedCard();
        // 没有选中的牌 返回
        const isValid = this.validateCardsRank();
        console.log(isValid, '玩家出的牌');
        if (!isValid)  {
          return playSound('error');
        }

        // 通过校验后赋值
        this.player.cardInfo = isValid;
        this.player.nowTurnHitCardsList = cloneDeep(this.selectedCards);

        this.dropTheCards(this.selectedCards);
        playSound('hit')
        this.$emit("clickHandler");
      } catch (error) {
        console.log(error);
      }
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

      // 上一个玩家出的牌
      let hitCard = againstPlayer.nowTurnHitCardsList;
      // 如果上一家没有出牌 则去找上上家
      if (hitCard.length === 0) {
        againstPlayer = this.playerList[againstPlayer.preTurn - 1];
        hitCard = againstPlayer.nowTurnHitCardsList;
      }
      this.againstPlayer = againstPlayer;
      return hitCard.length === 0;
    },
    validateCardsRank() {
      let isValid = false;
      // 没有选中的牌
      if (this.selectedCards.length === 0) return isValid;
      // 是否其他2个玩家都是要不起
      const isFreeHit = this.isFreeHit();
      if (isFreeHit) {
        // 其他玩家都要不起
        isValid = VALIDATE.checkType(this.selectedCards);
        return isValid;
      } else {
        // 确定出牌的类型
        const type = this.againstPlayer.cardInfo.cardType;
        const target = type.slice(1);
        const tempType = type.replace(target, target.toLowerCase());
        const tempPlayer = cloneDeep(this.player);
        isValid = VALIDATE[`check${tempType}`](this.selectedCards, tempPlayer);
        if (!isValid) return false;
        tempPlayer.cardInfo = isValid;
        const isBiggerThen = isBigger(tempPlayer, this.againstPlayer);
        return isBiggerThen && isValid;
      }
    },
  },
};
</script>

<style>
</style>