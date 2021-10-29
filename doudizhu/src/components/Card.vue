<template>
  <div
    class="poker"
    :class="{ isHidden, isSelected: isSelected }"
    :id="pokerInfo.id"
  >
    <div v-if="isHidden" class="back"></div>
    <div
      v-else
      :class="pokerInfo.suit"
      class="front"
      @click="clickPoker"
      :id="pokerInfo.id"
    >
      <div
        class="rank"
        v-if="
          !isScale || pokerInfo.suit !== 'little' || pokerInfo.suit !== 'big'
        "
      >
        {{ pokerInfo.rank }}
      </div>
      <div
        class="suit"
        :id="pokerInfo.id"
        v-if="pokerInfo.suit !== 'little' && pokerInfo.suit !== 'big'"
        v-html="getSymol(pokerInfo.suit, 'little')"
      ></div>
      <div
        class="big-suit"
        v-if="!isScale"
        v-html="getSymol(pokerInfo.suit, 'big')"
        :id="pokerInfo.id"
      ></div>
      <div
        class="big-suit"
        v-if="isScale && pokerInfo.rank === 'JOKER'"
        style="
          font-size: 4vw;
          top: auto;
          justify-content: center;
          align-items: center;
        "
      >
        {{ pokerInfo.suit === "big" ? "🤡" : "👻" }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "poker",
  data() {
    return {};
  },
  props: {
    pokerInfo: {
      type: Object,
      default() {
        return {};
      },
    },
    isHidden: {
      type: Boolean,
      default: true,
    },
    // 是否略缩图
    isScale: {
      type: Boolean,
      default: false,
    },
    selectedCard: null,
    isTopThree: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  methods: {
    getSymol(suit, isBig) {
      if (isBig === "big" && (suit === "big" || suit === "little")) return "";
      if (suit === "big") return "🤡";
      if (suit === "little") return "👻";
      return `&${suit};`;
    },
    clickPoker() {
      this.$emit("update-card", this.pokerInfo);
    },
  },
};
</script>

<style scoped lang="scss">
.poker {
  font-size: 3vw;
  line-height: 3vw;
  font-weight: bold;
  position: absolute;
  width: 11vw;
  height: 14.8vw;
  background: white;
  border-radius: 0.8vw;
  border: 0.05vh solid #666;
  padding-top: 1vw;
  .back {
    width: 100%;
    height: 100%;
    background: url("../assets/fish.png") repeat;
    // background: url('../assets/fish3.png') repeat;
    background-size: 30%;
    background-position: 1vh 2vh;
    border: 0.2vh solid #eebc8b;
    border-radius: 1vh;
  }
  .front {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .rank {
    width: 4vw;
    text-align: center;
    letter-spacing: 0.1vw;
  }
  .spades {
  }
  .hearts {
    color: crimson;
  }
  .diams {
    color: crimson;
  }
  .clubs {
  }
  .suit {
    width: 4vw;
    text-align: center;
    margin-left: -0.1vw;
  }
  .big-suit {
    width: 100%;
    flex: 1;
    font-size: 7vw;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    position: relative;
    top: -2vw;
  }
  .big {
    color: crimson;
    .rank {
      width: 4vw;
      word-break: break-word;
      text-align: center;
      line-height: 1;
      padding: 0 0.1vw;
      font-size: 2.8vw;
    }
  }
  .little {
    .rank {
      width: 4vw;
      word-break: break-word;
      text-align: center;
      line-height: 1;
      padding: 0 0.1vw;
      font-size: 2.8vw;
    }
  }
}
.poker.isHidden {
  padding: 1vh;
}
.poker.isSelected {
  top: -2vw;
}
</style>