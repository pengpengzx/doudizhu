<template>
  <div class="poker-game">
    <div class="table">
      <div class="lord-icon" v-if="!isHiddenThreeCard">👲</div>
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
        :style="{ width: player1.hands.length * 4 + 7 + 'vh' }"
      >
        <Card
          class="player-card"
          v-for="(poker, index) in player1.hands"
          :key="poker.id"
          :style="{ left: index * 4 + 'vh' }"
          :pokerInfo="poker"
          :isHidden="false"
          :isSelected="poker.isSelected"
          @update-card="clickCardHandler"
        />
      </div>
      <div class="hands-card hands-card-right" v-if="player2.hands.length">
        <div class="back">{{ player2.hands.length }}</div>
      </div>
      <div class="hands-card" v-if="player3.hands.length">
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
            style="font-size: 10vh"
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
            style="font-size: 10vh"
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
        <div
          class="worker worker1"
          v-if="!player1.isLord && !isHiddenThreeCard"
        >
          👩‍🌾
        </div>
      </div>
      <div class="cup1">
        <img class="character" src="../assets/thief_banban.png" />
        <div
          class="worker worker3"
          v-if="!player3.isLord && !isHiddenThreeCard"
        >
          👩‍🌾
        </div>
      </div>
      <div class="cup2">
        <img class="character" src="../assets/walking_dead_ban.png" />
        <div
          class="worker worker2"
          v-if="!player2.isLord && !isHiddenThreeCard"
        >
          👩‍🌾
        </div>
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
          type="start"
        />
      </div>
      <div
        class="ui-tip"
        v-if="isShowIfTobeLandlord"
        key="isShowIfTobeLandlord"
      >
        <UIButton
          class="ui-btn primary"
          @clickHandler="askIfTobeLandlord(player1)"
          style="width: 11vh"
          name="叫地主"
          type="call"
        />
        <UIButton
          class="ui-btn pain"
          @clickHandler="notLandlord(player1)"
          style="width: 11vh"
          name="不叫"
          type="notCall"
        />
      </div>
      <!-- 不出 提示 出牌 -->
      <div class="ui-tip" v-if="isMyHit" key="isMyHit">
        <UIButton
          ref="buchu"
          class="ui-btn pain"
          @clickHandler="nextOne"
          style="width: 11vh"
          name="不出"
          type="notCall"
        />
        <UIButton
          class="ui-btn pain"
          @clickHandler="hint"
          style="width: 11vh"
          name="提示"
        />

        <UIButton
          class="ui-btn primary"
          @clickHandler="playerHitHandler"
          style="width: 11vh"
          name="出牌"
          type="hit"
          :player="player1"
          :playerList="playerList"
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
import { sleep } from "@/utils/sleep.js";
import computerHitCard from "@/utils/computer-ai.js";
import POKERS from "@/constant/poker.js";
import UIButton from "./UIButton.vue";
import shuffle from "lodash/shuffle.js";
import cloneDeep from "lodash/cloneDeep.js";
import Card from "./Card.vue";
import sortOrder from "@/constant/order.js";
import { playSound } from "@/constant/audio.js";
import { gsap } from "gsap";
export default {
  name: "poker",
  data() {
    return {
      pokers: [],
      player1: {
        name: "大毛",
        hands: [],
        isLandlord: false,
        isDouble: false,
        playerNum: 1,
        nowTurnHitCardsList: [],
        nextTurn: 2,
        preTurn: 3,
        isLord: false,
      },
      player2: {
        name: "二毛",
        hands: [],
        isLandlord: false,
        isDouble: false,
        playerNum: 2,
        nowTurnHitCardsList: [],
        nextTurn: 3,
        preTurn: 1,
        isLord: false,
      },
      player3: {
        name: "三毛",
        hands: [],
        isLandlord: false,
        isDouble: false,
        playerNum: 3,
        nowTurnHitCardsList: [],
        nextTurn: 1,
        preTurn: 2,
        isLord: false,
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
  watch: {},
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
      this.notStart = false;
      this.isShowPoker = true;
      playSound("shuffle");
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
      this.pokers = shuffle(cloneDeep(POKERS));
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
    isDoubleReward(result) {
      this.player1.isDouble = result;
      this.isShowDoubleTip = false;
    },
    // 叫地主
    askIfTobeLandlord(player) {
      this.repeatFn(3, this.dealThreeCards.bind(this, player));
      this.isHiddenThreeCard = false;
      this.isShowIfTobeLandlord = false;
      setTimeout(async () => {
        this.sortPoker(player);
        player.isLord = true;
        await this.lordAnimate(player);
        if (player.playerNum === 1) {
          this.isMyHit = true;
        } else {
          this.computerTurn(player);
        }
      }, 0);
    },
    lordAnimate(player) {
      return new Promise((resolve) => {
        const tl = gsap.timeline();
        const workers = document.getElementsByClassName("worker");
        const position = {
          x: -260,
          y: 50,
          duration: 1,
          rotationY: 720,
          scale: 0.5,
          ease: "power2.inOut",
        };
        if (player.playerNum === 2) {
          Object.assign(position, {
            x: 200,
            y: -160,
          });
        }
        // if (player.playerNum === 3) {
        //   Object.assign(position, {
        //     x: 100,
        //     y: 100,
        //   });
        // }
        tl.add();
        tl.to(".lord-icon", {
          rotationY: 1080,
          duration: 2,
          onComplete() {
            workers.forEach((worker) => {
              gsap.to(worker, {
                rotationY: -720,
                duration: 2,
                opacity: 1,
                ease: "power2.inOut",
                scale: 0.5,
              });
            });
            resolve();
          },
        });
        tl.to(".lord-icon", position);
      });
    },
    // 最后三张牌给地主
    dealThreeCards(player) {
      player.hands.push(this.pokers.shift());
    },
    // 不叫
    notLandlord(player) {
      // 其他斑斑叫地主是否叫地主的逻辑？
      // 如果都不叫地主 重新洗牌发牌
      const index = player.nextTurn;
      const nextPlayer = this.playerList[index - 1];
      this.askIfTobeLandlord(nextPlayer);
    },
    // 要不起
    nextOne() {
      this.player1.nowTurnHitCardsList = [];
      this.computerTurn(this.player2);
    },
    // 提示
    hint() {},
    playerHitHandler() {
      this.afterHitHandler(this.player1);
    },
    // 出牌
    afterHitHandler(player) {
      let { playerNum, nextTurn } = player;
      if (playerNum === 1) {
        this.isShowHitCards = true;
        this.isMyHit = false;

        if (player.hands.length === 0) {
          // 为什么用nextTick不行而用settimeout,0可以呢
          setTimeout(() => {
            alert(`${player.name}获胜啦！`);
          }, 0);
          this.resetGame();
          return false;
        }
      }

      if (playerNum === 2) {
        this.isShowHitCardsPlayer2 = true;
      }
      if (playerNum === 3) {
        this.isShowHitCardsPlayer3 = true;
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
      const isComputerHited = computerHitCard(computer, this.playerList);

      if (!isComputerHited) {
        await playSound("notCall");
        if (cpuNumber === 2) {
          this.isShowHitCardsPlayer2 = true;
          computer.nowTurnHitCardsList = [];
          return this.computerTurn(this.player3);
        }
        if (cpuNumber === 3) {
          this.isShowHitCardsPlayer3 = true;
          computer.nowTurnHitCardsList = [];
          this.player1.nowTurnHitCardsList = [];
          this.isMyHit = true;
          return;
        }
      } else {
        await playSound("hit");
      }
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
        const index = this.selectedCards.findIndex((el) => el.id === card.id);
        this.selectedCards.splice(index, 1);
      }
    },
    // 重制游戏参数
    resetGame() {
      this.shuffle();
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@media all and (orientation: landscape) {
  /*横屏时代码*/
  .poker-game {
    width: 100%;
    height: 100%;
    padding: 2vh;
    position: relative;
    overflow: hidden;
    .lord-icon {
      font-size: 4em;
    }
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
}

@media all and (orientation: portrait) {
  /*竖屏时代码*/
  .poker-game {
    width: 100%;
    height: 100%;
    padding: 2vw;
    position: relative;
    overflow: hidden;
    .lord-icon {
      position: absolute;
      font-size: 4em;
    }
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
        left: 20vh;
        top: 40vw;
        width: 9vw;
        height: 12vw;
        padding: 0.6vw;
        background: white;
        border-radius: 1vw;
        border: 0.05vw solid #666;
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
          background-position: 1vw 1vw;
          // -webkit-text-stroke: 2px white;
          border: 0.2vw solid #eebc8b;
          border-radius: 1vw;
          text-shadow: white 2px 2px 1;
        }
      }
      .hands-card-right {
        right: 21vh !important;
        left: auto !important;
      }
      .hited-cards {
        position: absolute;
        top: 24vh;
        transform: scale(0.5);
        display: flex;
        .poker {
          position: static;
        }
        &.player2 {
          top: 11vh;
          right: 16vh;
        }
        &.player3 {
          top: 11vh;
          left: 16vh;
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
          width: 5vh;
          height: 6vh;
          padding-top: 0;
          &.isHidden {
            padding: 0.5vw;
          }
          .front {
            font-size: 2vh;
          }
          .little,
          .big {
            // font-size: 1;
          }
        }
      }
      .contener {
        width: 20vw;
        height: 31.5vw;
        position: relative;
        & > .card {
        }
      }
      .player-pokers {
        height: 31.5vw;
        position: absolute;
        left: 50%;
        bottom: 0.5vh;
        transform: translate(-50%, 0);
        display: flex;
        .player-card {
          position: absolute;
        }
      }
    }
    .player-list {
      width: 100vh;
      height: 100vw;
      position: absolute;
      left: 0;
      top: 0;
      .player {
        position: absolute;
        left: -4vw;
        top: 63vw;
        z-index: 3;
        .character {
          width: 47vw;
        }
      }
      .cup1 {
        position: absolute;
        left: 14vw;
        top: 16vw;
        z-index: 1;
        .character {
          width: 32vw;
        }
      }
      .cup2 {
        position: absolute;
        right: 14vw;
        top: 16vw;
        z-index: 1;
        .character {
          width: 32vw;
        }
      }
      .worker {
        position: absolute;
        font-size: 4em;
        opacity: 0;
      }
      .worker1 {
        left: 14vw;
        top: -12vw;
      }
      .worker2 {
        left: 10vw;
        top: -15vw;
      }
      .worker3 {
        left: 8vw;
        top: -15vw;
      }
      .table {
        position: absolute;
        left: 0vw;
        top: 39vw;
        z-index: 2;
        img {
          width: 140vh;
        }
      }
    }
    .ui-wraper {
      width: 50vh;
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
          font-size: 2.5vh;
          padding: 0.5vh 1vh;
          border-radius: 50px;
          font-weight: bold;
          border: 0.5vh solid white;
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
      width: 36vh;
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
}
</style>
