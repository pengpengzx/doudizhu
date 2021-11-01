import sortOrder from "@/constant/order.js";
import { playAudio } from "@/constant/audio.js";
let nowTurnPlayer = null;
let againstPlayer = null;
function single () {
  console.log('single');
  const { hands, playerNum } = nowTurnPlayer;
  const cardMap = {};
  const doubleList = [];
  hands.forEach((el) => {
    if (cardMap[el.rank]) {
      cardMap[el.rank].push(el);
    } else {
      cardMap[el.rank] = [el];
    }
  });
  for (const key in cardMap) {
    if (cardMap[key].length === 2) {
      doubleList.push(key);
    }
  }
  doubleList.sort((a, b) => {
    const indexA = sortOrder.indexOf(a);
    const indexB = sortOrder.indexOf(b);
    return indexA - indexB;
  });
  let toBeHit = "";
  for (let index = 0; index < doubleList.length; index++) {
    const element = doubleList[index];
    const a = sortOrder.indexOf(element);
    const b = sortOrder.indexOf(hitCard[0].rank);

    if (a > b) {
      toBeHit = element;
      break;
    }
  }
  console.log(`要出的牌${toBeHit}`, `player${playerNum}`);
  hands.forEach((el) => {
    if (toBeHit && el.rank === toBeHit) {
      el.isSelected = true;
    }
  });
}

function double() {
  console.log('double');
}
export function computerHitCard(player, playerList) {
  nowTurnPlayer = player;
  const { playerNum, preTurn } = nowTurnPlayer;

  // 上一个玩家
  againstPlayer = playerList[nowTurnPlayer.preTurn - 1];
  // 上一个玩家出的牌
  let hitCard = againstPlayer.nowTurnHitCardsList;
  // 如果上一家没有出牌 则去找上上家
  if (hitCard.length === 0) {
    againstPlayer = playerList[againstPlayer.preTurn - 1];
    hitCard = againstPlayer.nowTurnHitCardsList;
  }
  if (hitCard.length === 0) {
    if (preTurn === 1) {
      // 电脑的逻辑，自己随便走
      console.log("电脑的逻辑，自己随便走,剩下两个人都要不起，随便出牌");
      return;
    }
    console.log("2个人都要不起，随便出牌");
    return;
  }
  const type = againstPlayer.cardInfo.cardType;
  console.log(type, 'preTunrPlayerCardInfo');
  // 确定出牌的类型
  // const toBeHitCardType = this.confirmToBeHitType(hitCard);
  
  // console.log(toBeHitCardType, 'toBeHitCardType'); 
  switch (type) {
    case 'SINGLE':
      single();
      break;
    case 'DOUBLE':
      double();
  }
  return false;
  

  // let player = playerNum === 2 ? this.player2 : this.player3;
  if (!toBeHit) {
    playAudio("notCall");
    if (playerNum === 2) {
      this.isShowHitCardsPlayer2 = true;
      nowTurnPlayer.nowTurnHitCardsList = [];
      return this.nextTurn(this.player3, 3);
    } else {
      this.isShowHitCardsPlayer3 = true;
      nowTurnPlayer.nowTurnHitCardsList = [];
      this.player1.nowTurnHitCardsList = [];
      this.isMyHit = true;
      return;
    }
  }
  playAudio("hit");
  this.hit(nowTurnPlayer);
}