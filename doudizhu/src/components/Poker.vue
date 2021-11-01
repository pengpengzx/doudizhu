<template>
  <div class="poker-game">
    <div class="table">
      <!-- 顶部的三张牌 -->
      <div class="top-docker" v-if="isShowTop">
        <Card
          :isHidden="isHiddenThreeCard"
          v-for="(poker, index) in lastThreeCard"
          :pokerInfo="poker"
          :key="poker.id"
          :isScale="true"
          :isTopThree="true"
          :style="{ left: index / 4.5 + 'px', top: index / 4.5 + 'px' }"
        />
      </div>
      <!-- 系统牌组 -->
      <div class="contener" v-if="isShowPoker && !isShowTop">
        <Card
          v-for="(poker, index) in pokers"
          :key="poker.id"
          :style="{ left: index / 4.5 + 'px', top: index / 4.5 + 'px' }"
        />
      </div>
      <div
        class="player-pokers"
        :style="{ width: player1.hands.length * 4 + 7 + 'vw' }"
      >
        <Card
          class="player-card"
          v-for="(poker, index) in player1.hands"
          :key="poker.id"
          :style="{ left: index * 4 + 'vw' }"
          :pokerInfo="poker"
          :isHidden="false"
          :isSelected="poker.isSelected"
          @update-card="clickCardHandler"
        />
      </div>
      <div class="hands-card" v-if="player2.hands.length">
        <div class="back">{{ player2.hands.length }}</div>
      </div>
      <div class="hands-card hands-card-right" v-if="player3.hands.length">
        <div class="back">{{ player3.hands.length }}</div>
      </div>
      <!-- 玩家当前出的牌 -->
      <div class="hited-cards" v-if="isShowHitCards">
        <Card
          :isHidden="false"
          v-for="poker in player1.nowTurnHitCardsList"
          :pokerInfo="poker"
          :key="poker.id"
          :isScale="true"
        />
      </div>
      <!-- player2的牌 -->
      <template v-if="isShowHitCardsPlayer2">
        <div class="hited-cards player2">
          <Card
            :isHidden="false"
            v-for="poker in player2.nowTurnHitCardsList"
            :pokerInfo="poker"
            :key="poker.id"
            :isScale="true"
          />
          <div
            v-if="player2.nowTurnHitCardsList.length === 0"
            style="font-size: 10vw"
          >
            要不起
          </div>
        </div>
      </template>

      <!-- player3的牌 -->
      <template v-if="isShowHitCardsPlayer3">
        <div class="hited-cards player3">
          <Card
            :isHidden="false"
            v-for="poker in player3.nowTurnHitCardsList"
            :pokerInfo="poker"
            :key="poker.id"
            :isScale="true"
          />
          <div
            v-if="player3.nowTurnHitCardsList.length === 0"
            style="font-size: 10vw"
          >
            要不起
          </div>
        </div>
      </template>
    </div>
    <!-- players -->
    <div class="player-list">
      <div class="player">
        <img class="character" src="../assets/angry_banban.png" />
      </div>
      <div class="cup1">
        <img class="character" src="../assets/thief_banban.png" />
      </div>
      <div class="cup2">
        <img class="character" src="../assets/walking_dead_ban.png" />
      </div>
      <div class="table">
        <img class="character" src="../assets/table.png" />
      </div>
    </div>
    <!-- ui btn tips-->
    <div class="ui-wraper btn-group">
      <!-- ui -->
      <div class="ui-tip" v-if="notStart">
        <UIButton
          class="ui-btn pain"
          @clickHandler="isDoubleReward(true)"
          name="名牌开始"
        />
        <UIButton
          class="ui-btn primary"
          @clickHandler="startGame()"
          name="开始游戏"
        />
      </div>
      <div
        class="ui-tip"
        v-if="isShowIfTobeLandlord"
        key="isShowIfTobeLandlord"
      >
        <UIButton
          class="ui-btn primary"
          @clickHandler="askIfTobeLandlord"
          style="width: 11vw"
          name="叫地主"
          type="call"
        />
        <UIButton
          class="ui-btn pain"
          @clickHandler="notLandlord"
          style="width: 11vw"
          name="不叫"
          type="notCall"
        />
      </div>
      <!-- 不出 提示 出牌 -->
      <div class="ui-tip" v-if="isMyHit" key="isMyHit">
        <UIButton
          ref="buchu"
          class="ui-btn pain"
          @clickHandler="pass"
          style="width: 11vw"
          name="不出"
          type="notCall"
        />
        <UIButton
          class="ui-btn pain"
          @clickHandler="hint"
          style="width: 11vw"
          name="提示"
        />

        <UIButton
          class="ui-btn primary"
          @clickHandler="playerHitHandler"
          style="width: 11vw"
          name="出牌"
          type="hit"
          :player="player1"
        />
      </div>
      <div class="ui-tip" v-if="isShowDoubleTip">
        <UIButton
          class="ui-btn"
          @clickHandler="isDoubleReward(true)"
          name="加倍"
        />
        <UIButton
          class="ui-btn"
          @clickHandler="isDoubleReward(false)"
          name="不加倍"
        />
      </div>
      <div></div>
      <!-- 牌池 -->
      <div></div>
    </div>
  </div>
</template>

<script>
import { playBGM } from "@/utils/bgm.js";
import { sleep } from "@/utils/sleep.js";
import { computerHitCard } from "@/utils/computer-ai.js";
import { playAudio } from "@/constant/audio.js";
import POKERS from "@/constant/poker.js";
import UIButton from "./UIButton.vue";
import shuffle from "lodash/shuffle.js";
import cloneDeep from "lodash/cloneDeep.js";
import Card from "./Card.vue";
// import VALIDATE from "@/utils/validate.js";
import sortOrder from "@/constant/order.js";
// const tempMapPlayer = {
//   1: "player1",
//   2: "player2",
//   3: "player3",
// };
export default {
  name: "poker",
  data() {
    return {
      pokers: [],
      player1: {
        hands: [],
        isLandlord: false,
        isDouble: false,
        playerNum: 1,
        nowTurnHitCardsList: [],
        nextTurn: 2,
        preTurn: 3,
      },
      player2: {
        hands: [],
        isLandlord: false,
        isDouble: false,
        playerNum: 2,
        nowTurnHitCardsList: [],
        nextTurn: 3,
        preTurn: 1,
      },
      player3: {
        hands: [],
        isLandlord: false,
        isDouble: false,
        playerNum: 3,
        nowTurnHitCardsList: [],
        nextTurn: 1,
        preTurn: 2,
      },
      playerList: [],
      isShowIfTobeLandlord: false,
      isShowDoubleTip: false,
      notStart: true,
      isShowPoker: false,
      isShowTop: false,
      isHiddenThreeCard: true,
      isMyHit: false,
      lastThreeCard: [],
      nowTurnHitCardsList: [], // 当前玩家出的牌
      player2HitCardsList: [], // 当前玩家出的牌
      player3HitCardsList: [], // 当前玩家出的牌
      isShowHitCards: false,
      isShowHitCardsPlayer2: false,
      isShowHitCardsPlayer3: false,
      point: {
        x: 0,
        y: 0,
      },
      selectedCards: [],
      selectedCardsTemp: [],
      hitCards: [],
    };
  },
  props: {
    msg: String,
  },
  components: {
    Card,
    UIButton,
  },
  created() {
    this.playersJoinGame();
    this.shuffle();
  },
  mounted() {
    const tableDom = document.getElementsByClassName("table")[0];
    tableDom.addEventListener("touchstart", this.disableTounch);
  },
  methods: {
    cloneDeep,
    async startGame() {
      playBGM();
      this.notStart = false;
      this.isShowPoker = true;
      await this.deal();
      this.lastThreeCard = cloneDeep(this.pokers);
      this.playerList.forEach((el) => this.sortPoker(el));
      this.sortPoker(this.player1);
      this.bindTouchEvent();
      this.isShowIfTobeLandlord = true;
    },
    bindTouchEvent() {
      const handsDom = document.getElementsByClassName("player-pokers")[0];
      handsDom.addEventListener("touchstart", this.handstouchStart);
      handsDom.addEventListener("touchend", this.handstouchEnd);
      handsDom.addEventListener("touchmove", this.handstouchMove, false);
    },
    // 禁止拖拽
    disableTounch(e) {
      if (e.target.className === "table") {
        e.preventDefault();
      }
    },
    handstouchStart() {
      // console.log(e, "start");
    },
    handstouchMove(e) {
      e.preventDefault();
      e.stopPropagation();
      this.point.x = e.changedTouches[0].clientX;
      this.point.y = e.changedTouches[0].clientY;
      let { x, y } = this.point;
      const touchDom = document.elementFromPoint(x, y);
      if (!touchDom) return;
      // direction

      this.findTrueDom(touchDom);
    },
    findTrueDom(touchDom) {
      const id = touchDom.getAttribute("id");
      if (!id) return false;
      const card = this.player1.hands.find((el) => el.id === id);

      if (this.selectedCardsTemp.indexOf(id) === -1) {
        this.selectedCardsTemp.push(id);
        card.isSelected = !card.isSelected;
      }
    },
    handstouchEnd() {
      if (this.selectedCardsTemp.length === 0) {
        this.selectedCardsTemp = [];
        return;
      }
      this.selectedCards = this.selectedCards.concat(
        cloneDeep(this.selectedCardsTemp)
      );
      this.selectedCardsTemp = [];
    },
    // 玩家加入
    playersJoinGame() {
      this.playerList = [this.player1, this.player2, this.player3];
    },
    sortAllPlayer() {
      this.playerList.forEach((el) => this.sortPoker(el));
    },
    // 洗牌
    shuffle() {
      this.pokers = shuffle(POKERS);
    },
    // 发牌
    async deal() {
      try {
        while (this.pokers.length > 3) {
          for (const player of this.playerList) {
            await this.dealPoker(player);
          }
        }
        this.isShowTop = true;
        // this.printInfo();
      } catch (error) {
        console.log(error);
      }
    },
    // 排序
    sortPoker(player) {
      player.hands.sort((a, b) => {
        const indexA = sortOrder.indexOf(a.sortKey);
        const indexb = sortOrder.indexOf(b.sortKey);
        return indexb - indexA;
      });
    },
    // 发牌
    dealPoker(player) {
      return new Promise((resolve) => {
        setTimeout(() => {
          player.hands.push(this.pokers.shift());
          resolve();
        }, 30);
      });
    },
    printInfo() {
      console.log(this.pokers, "牌池");
      console.log(this.playerList, "玩家列表");
      console.log(this.player1, "player1");
      console.log(this.player2, "player2");
      console.log(this.player3, "player3");
    },
    isDoubleReward(result) {
      this.player1.isDouble = result;
      this.isShowDoubleTip = false;
    },
    // 叫地主
    askIfTobeLandlord() {
      this.repeatFn(3, this.dealThreeCards.bind(this));
      this.isHiddenThreeCard = false;
      this.isShowIfTobeLandlord = false;
      this.sortPoker(this.player1);
      this.isMyHit = true;
    },
    // 最后三张牌给地主
    dealThreeCards() {
      this.player1.hands.push(this.pokers.shift());
    },
    // 不叫
    notLandlord() {
      // 其他斑斑叫地主是否叫地主的逻辑？
      // 如果都不叫地主 重新洗牌发牌
    },
    // 要不起
    pass() {
      this.player1.nowTurnHitCardsList = [];
      this.nextTurn(this.player2);
    },
    // 提示
    hint() {},
    playerHitHandler(params = null) {
      this.player1.cardInfo = params;
      this.afterHitHandler(this.player1);
    },
    // 出牌
    afterHitHandler(player) {
      let { playerNum, nextTurn } = player;
      if (playerNum === 1) {
        this.isMyHit = false;
        this.isShowHitCards = true;
      }

      if (playerNum === 2) {
        this.isShowHitCardsPlayer2 = true;
        if (this.player2HitCardsList.length === 0) {
          playAudio("soft");
        }
      }
      if (playerNum === 3) {
        this.isShowHitCardsPlayer3 = true;
        if (this.player3HitCardsList.length === 0) {
          playAudio("soft");
        }
        this.isShowHitCards = false;
        this.isMyHit = true;
        return;
      }
      const computerInfo = this.playerList[nextTurn - 1];
      this.computerTurn(computerInfo);
    },
    async computerTurn(computer) {
      // 延迟1s 触发电脑
      await sleep(1000);
      const cpuNumber = computer.playerNum;
      if (cpuNumber === 2) this.player2HitCardsList = [];
      if (cpuNumber === 3) this.player3HitCardsList = [];

      const isCPUhited = computerHitCard(computer, this.playerList);
      if (!isCPUhited) {
        playAudio("notCall");
        if (cpuNumber === 2) {
          this.isShowHitCardsPlayer2 = true;
          computer.nowTurnHitCardsList = [];
          return this.computerTurn(this.player3);
        }
        if (computer === 3) {
          this.isShowHitCardsPlayer3 = true;
          computer.nowTurnHitCardsList = [];
          this.player1.nowTurnHitCardsList = [];
          this.isMyHit = true;
          return;
        }
      }
      playAudio("hit");
      this.afterHitHandler(computer);
    },
    dropHandCard(palyer, toBeDropIndexList) {
      palyer.hands.splice(toBeDropIndexList.pop(), 1);
    },
    repeatFn(num, fn, ...params) {
      if (num === 0) return;
      fn.call(null, ...params);
      num--;
      this.repeatFn(num, fn, ...params);
    },
    clickCardHandler(card) {
      card.isSelected = !card.isSelected;
      if (card.isSelected) {
        this.selectedCards.push(card);
      } else {
        console.log(card, "card");
        const index = this.selectedCards.findIndex((el) => el.id === card.id);
        this.selectedCards.splice(index, 1);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.poker-game {
  width: 100%;
  height: 100%;
  padding: 2vh;
  position: relative;
  overflow: hidden;
  .table {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20;
    .hands-card {
      position: absolute;
      left: 20vw;
      top: 40vh;
      width: 9vh;
      height: 12vh;
      padding: 0.6vh;
      background: white;
      border-radius: 1vh;
      border: 0.05vh solid #666;
      z-index: 30;
      font-weight: bold;
      color: #2c6fec;
      font-size: 3.5vw;
      .back {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background: url("../assets/fish.png") repeat;
        background-size: 30%;
        background-position: 1vh 1vh;
        // -webkit-text-stroke: 2px white;
        border: 0.2vh solid #eebc8b;
        border-radius: 1vh;
        text-shadow: white 2px 2px 1;
      }
    }
    .hands-card-right {
      right: 21vw !important;
      left: auto !important;
    }
    .hited-cards {
      position: absolute;
      top: 24vw;
      transform: scale(0.5);
      display: flex;
      .poker {
        position: static;
      }
      &.player2 {
        top: 11vw;
        right: 16vw;
      }
      &.player3 {
        top: 11vw;
        left: 16vw;
      }
    }
    .top-docker {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
      display: flex;
      .poker {
        position: static;
        width: 5vw;
        height: 6vw;
        padding-top: 0;
        &.isHidden {
          padding: 0.5vh;
        }
        .front {
          font-size: 2vw;
        }
        .little,
        .big {
          // font-size: 1;
        }
      }
    }
    .contener {
      width: 20vh;
      height: 31.5vh;
      position: relative;
      & > .card {
      }
    }
    .player-pokers {
      height: 31.5vh;
      position: absolute;
      left: 50%;
      bottom: 0.5vw;
      transform: translate(-50%, 0);
      display: flex;
      .player-card {
        position: absolute;
      }
    }
  }
  .player-list {
    width: 100vw;
    height: 100vh;
    position: absolute;
    left: 0;
    top: 0;
    .player {
      position: absolute;
      left: -4vh;
      top: 63vh;
      z-index: 3;
      .character {
        width: 47vh;
      }
    }
    .cup1 {
      position: absolute;
      left: 14vh;
      top: 16vh;
      z-index: 1;
      .character {
        width: 32vh;
      }
    }
    .cup2 {
      position: absolute;
      right: 14vh;
      top: 16vh;
      z-index: 1;
      .character {
        width: 32vh;
      }
    }
    .table {
      position: absolute;
      left: 0vw;
      top: 39vh;
      z-index: 2;
      img {
        width: 140vw;
      }
    }
  }
  .ui-wraper {
    width: 50vw;
    position: absolute;
    left: 50%;
    top: 58%;
    transform: translate(-50%, -50%);
    z-index: 30;
    .ui-tip {
      display: flex;
      justify-content: space-around;
      align-items: center;
      .ui-btn {
        position: relative;
        top: 0;
        display: inline-block;
        font-size: 2.5vw;
        padding: 0.5vw 1vw;
        border-radius: 50px;
        font-weight: bold;
        border: 0.5vw solid white;
        color: white;
        box-shadow: 0 0.3em #c2bb11, 0 0.6em rgba(0, 0, 0, 0.4);
        &:active {
          top: 0.4em;
          box-shadow: 0 0.12em #c2bb11, 0 0.26em rgba(0, 0, 0, 0.4);
        }
      }
    }
  }
  .btn-group {
    width: 36vw;
  }
  .pain {
    background-color: rgb(100, 150, 244);
  }
  .primary {
    background-color: #e8981c;
    &:active {
    }
  }
}
</style>
